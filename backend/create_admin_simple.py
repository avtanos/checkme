"""
Простой скрипт для создания супер-администратора
"""
from database import SessionLocal, engine, Base
from models import User
from auth import get_user_by_username, get_user_by_email
from passlib.context import CryptContext

# Используем тот же контекст, что и в auth.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        username = "admin"
        email = "admin@checkme.kg"
        password = "admin123"
        
        # Проверяем, существует ли уже супер-администратор
        existing_admin = db.query(User).filter(User.role == "super_admin").first()
        if existing_admin:
            print(f"Супер-администратор уже существует: {existing_admin.username}")
            db.close()
            return
        
        # Проверяем, существует ли пользователь
        if get_user_by_username(db, username):
            print(f"Пользователь с username '{username}' уже существует")
            db.close()
            return
        
        if get_user_by_email(db, email):
            print(f"Пользователь с email '{email}' уже существует")
            db.close()
            return
        
        print(f"Создаем супер-администратора: {username}")
        # Используем тот же метод хеширования, что и в auth.py
        # Ограничиваем длину пароля для bcrypt (максимум 72 байта)
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            password = password[:72]
        password_hash = pwd_context.hash(password)
        
        superadmin = User(
            username=username,
            email=email,
            password_hash=password_hash,
            role="super_admin",
            is_active=True
        )
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        
        print(f"[OK] Супер-администратор успешно создан!")
        print(f"  Username: {superadmin.username}")
        print(f"  Email: {superadmin.email}")
        print(f"  Role: {superadmin.role}")
        print(f"  Password: {password}")
        
    except Exception as e:
        print(f"Ошибка при создании супер-администратора: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
