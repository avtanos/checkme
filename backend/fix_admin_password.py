"""
Скрипт для исправления пароля админа, чтобы он работал с passlib
"""
from database import SessionLocal
from models import User
from auth import get_password_hash

def fix_admin_password():
    db = SessionLocal()
    
    try:
        admin = db.query(User).filter(User.username == 'admin').first()
        if not admin:
            print("Администратор не найден")
            return
        
        print("Обновляем пароль администратора...")
        # Пересоздаем хеш через passlib
        admin.password_hash = get_password_hash('admin123')
        db.commit()
        print("[OK] Пароль администратора обновлен")
        
    except Exception as e:
        print(f"Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_admin_password()
