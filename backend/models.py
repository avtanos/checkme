from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    provider_id = Column(Integer, ForeignKey("service_providers.id"), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    provider = relationship("ServiceProvider", back_populates="user", uselist=False)


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)  # cargo, plumber, tow_truck, etc.
    description = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    address = Column(String)
    photo = Column(String)  # URL или путь к фото
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("Message", back_populates="provider")
    user = relationship("User", back_populates="provider", uselist=False)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id"), nullable=False)
    client_name = Column(String, nullable=False)
    client_phone = Column(String, nullable=False)
    client_email = Column(String)
    message_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    provider = relationship("ServiceProvider", back_populates="messages")

