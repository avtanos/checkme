"""
Скрипт для создания супер-администратора
"""
from database import SessionLocal, engine, Base
from models import User
from auth import get_password_hash, get_user_by_username, get_user_by_email

def create_superadmin():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Проверяем, существует ли уже супер-администратор
        existing_admin = db.query(User).filter(User.role == "super_admin").first()
        if existing_admin:
            print(f"Супер-администратор уже существует: {existing_admin.username}")
            response = input("Создать еще одного? (y/n): ")
            if response.lower() != 'y':
                db.close()
                return
        
        import sys
        
        print("Создание супер-администратора...")
        
        # Проверяем аргументы командной строки
        if len(sys.argv) >= 4:
            username = sys.argv[1]
            email = sys.argv[2]
            password = sys.argv[3]
        elif len(sys.argv) >= 2:
            username = sys.argv[1]
            email = input("Введите email (или нажмите Enter для 'admin@checkme.kg'): ").strip() or "admin@checkme.kg"
            password = input("Введите пароль: ").strip()
        else:
            username = input("Введите username (или нажмите Enter для 'admin'): ").strip() or "admin"
            email = input("Введите email (или нажмите Enter для 'admin@checkme.kg'): ").strip() or "admin@checkme.kg"
            password = input("Введите пароль: ").strip()
        
        if not password:
            print("Ошибка: пароль не может быть пустым")
            print("Использование: python create_superadmin.py [username] [email] [password]")
            db.close()
            return
        
        # Проверяем, существует ли пользователь
        if get_user_by_username(db, username):
            print(f"Ошибка: пользователь с username '{username}' уже существует")
            db.close()
            return
        
        if get_user_by_email(db, email):
            print(f"Ошибка: пользователь с email '{email}' уже существует")
            db.close()
            return
        
        # Создаем супер-администратора
        # Ограничиваем длину пароля для bcrypt (максимум 72 байта)
        if len(password.encode('utf-8')) > 72:
            password = password[:72]
        
        print(f"Создаем пользователя: {username}, email: {email}")
        password_hash = get_password_hash(password)
        
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
        
        print(f"\n✓ Супер-администратор успешно создан!")
        print(f"  Username: {superadmin.username}")
        print(f"  Email: {superadmin.email}")
        print(f"  Role: {superadmin.role}")
        
    except Exception as e:
        print(f"Ошибка при создании супер-администратора: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()
