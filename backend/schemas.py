from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ServiceProviderBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None


class ServiceProviderCreate(ServiceProviderBase):
    pass


class ServiceProviderUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    is_active: Optional[bool] = None


class ServiceProviderResponse(ServiceProviderBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: Optional[EmailStr] = None
    message_text: str


class MessageResponse(BaseModel):
    id: int
    provider_id: int
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    message_text: str
    created_at: datetime

    class Config:
        from_attributes = True


# Схемы для аутентификации
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    # Данные провайдера
    name: str
    category: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    phone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    provider_id: Optional[int] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    provider_id: Optional[int] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    provider_id: Optional[int] = None


class CategoryCreate(BaseModel):
    value: str
    label: str


class CategoryResponse(BaseModel):
    value: str
    label: str

    class Config:
        from_attributes = True

