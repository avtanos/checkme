"""
Скрипт для очистки и пересоздания тестовых данных
"""
import os
from database import SessionLocal, engine, Base
from models import ServiceProvider, Message, User

def reset_data():
    # Закрываем все соединения
    engine.dispose()
    
    # Удаляем базу данных физически
    db_path = "service_providers.db"
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print("Старая база данных удалена.")
        except Exception as e:
            print(f"Ошибка при удалении базы данных: {e}")
    
    # Создаем таблицы заново
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Таблицы пересозданы.")
    
    db = SessionLocal()
    
    try:
        # Удаляем все сообщения
        db.query(Message).delete()
        # Удаляем всех пользователей
        db.query(User).delete()
        # Удаляем всех провайдеров
        db.query(ServiceProvider).delete()
        db.commit()
        print("Старые данные удалены.")
    except Exception as e:
        print(f"Ошибка при удалении данных: {e}")
        db.rollback()
    finally:
        db.close()
    
    # Импортируем функцию создания тестовых данных
    from init_data import init_test_data
    
    # Создаем новые данные
    init_test_data()

if __name__ == "__main__":
    reset_data()

