from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import engine, Base, get_db
from models import ServiceProvider, Message, User
from schemas import (
    ServiceProviderCreate, ServiceProviderUpdate, ServiceProviderResponse,
    MessageCreate, MessageResponse, UserRegister, UserLogin, Token, UserResponse
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_user, get_user_by_username, get_user_by_email, ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from upload import save_uploaded_file
import json

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Service Provider Map API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Статическая раздача файлов
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def read_root():
    return {"message": "Service Provider Map API"}


@app.get("/api/providers", response_model=List[ServiceProviderResponse])
def get_providers(
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Получить список всех провайдеров услуг"""
    providers = db.query(ServiceProvider).filter(ServiceProvider.is_active == True)
    
    if category:
        providers = providers.filter(ServiceProvider.category == category)
    
    providers = providers.all()
    
    # Фильтрация по радиусу (если указаны координаты)
    if lat and lng and radius:
        filtered_providers = []
        for provider in providers:
            distance = ((provider.latitude - lat) ** 2 + (provider.longitude - lng) ** 2) ** 0.5
            if distance <= radius:
                filtered_providers.append(provider)
        providers = filtered_providers
    
    return providers


@app.get("/api/providers/{provider_id}", response_model=ServiceProviderResponse)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    """Получить информацию о конкретном провайдере"""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@app.post("/api/providers", response_model=ServiceProviderResponse)
def create_provider(provider: ServiceProviderCreate, db: Session = Depends(get_db)):
    """Создать нового провайдера услуг"""
    db_provider = ServiceProvider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider


@app.put("/api/providers/{provider_id}", response_model=ServiceProviderResponse)
async def update_provider(
    provider_id: int,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить информацию о провайдере (только для владельца)"""
    db_provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Проверяем, что пользователь является владельцем провайдера
    if current_user.provider_id != provider_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Обновляем поля (только если они переданы)
    if name is not None:
        db_provider.name = name
    if category is not None:
        db_provider.category = category
    if description is not None:
        db_provider.description = description
    if latitude is not None:
        db_provider.latitude = latitude
    if longitude is not None:
        db_provider.longitude = longitude
    if phone is not None:
        db_provider.phone = phone
    if address is not None:
        db_provider.address = address
    
    # Загружаем новое фото, если есть
    if photo:
        from upload import delete_file
        # Удаляем старое фото
        if db_provider.photo:
            delete_file(db_provider.photo)
        # Сохраняем новое
        db_provider.photo = await save_uploaded_file(photo)
    
    db.commit()
    db.refresh(db_provider)
    return db_provider


@app.delete("/api/providers/{provider_id}")
def delete_provider(provider_id: int, db: Session = Depends(get_db)):
    """Удалить провайдера (мягкое удаление)"""
    db_provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    db_provider.is_active = False
    db.commit()
    return {"message": "Provider deleted successfully"}


@app.get("/api/providers/{provider_id}/messages", response_model=List[MessageResponse])
def get_provider_messages(provider_id: int, db: Session = Depends(get_db)):
    """Получить сообщения для провайдера"""
    messages = db.query(Message).filter(Message.provider_id == provider_id).all()
    return messages


@app.post("/api/providers/{provider_id}/messages", response_model=MessageResponse)
def create_message(
    provider_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """Отправить сообщение провайдеру"""
    db_provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    db_message = Message(
        provider_id=provider_id,
        **message.dict()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@app.get("/api/categories")
def get_categories():
    """Получить список доступных категорий"""
    return {
        "categories": [
            {"value": "cargo", "label": "Грузовые машины"},
            {"value": "plumber", "label": "Сантехники"},
            {"value": "tow_truck", "label": "Эвакуаторы"},
            {"value": "electrician", "label": "Электрики"},
            {"value": "other", "label": "Другое"}
        ]
    }


# Endpoint для загрузки файлов
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Загрузить файл (фото)"""
    try:
        file_url = await save_uploaded_file(file)
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpoints для аутентификации
@app.post("/api/auth/register", response_model=Token)
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    category: str = Form(...),
    description: Optional[str] = Form(None),
    latitude: float = Form(...),
    longitude: float = Form(...),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Регистрация нового провайдера"""
    # Проверяем, существует ли пользователь
    if get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Загружаем фото, если есть
    photo_url = None
    if photo:
        photo_url = await save_uploaded_file(photo)
    
    # Создаем провайдера
    provider_data = {
        "name": name,
        "category": category,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "phone": phone,
        "address": address,
        "photo": photo_url,
    }
    db_provider = ServiceProvider(**provider_data)
    db.add(db_provider)
    db.flush()  # Получаем ID провайдера
    
    # Создаем пользователя
    db_user = User(
        username=username,
        email=email,
        password_hash=get_password_hash(password),
        provider_id=db_provider.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.refresh(db_provider)
    
    # Создаем токен
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": db_user.id,
        "provider_id": db_provider.id
    }


@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Вход в систему"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "provider_id": user.provider_id
    }


@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    return current_user


@app.get("/api/auth/my-provider", response_model=ServiceProviderResponse)
def get_my_provider(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить информацию о провайдере текущего пользователя"""
    if not current_user.provider_id:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == current_user.provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    return provider


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

