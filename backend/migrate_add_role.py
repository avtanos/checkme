"""
Скрипт миграции: добавление полей role и is_active в таблицу users
"""
import sqlite3
import os

def migrate_database():
    db_path = "service_providers.db"
    
    if not os.path.exists(db_path):
        print("База данных не найдена. Она будет создана при следующем запуске приложения.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Проверяем, существует ли колонка role
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'role' not in columns:
            print("Добавляем колонку 'role'...")
            cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'")
            # Обновляем существующие записи
            cursor.execute("UPDATE users SET role = 'user' WHERE role IS NULL")
            print("[OK] Колонка 'role' добавлена")
        else:
            print("Колонка 'role' уже существует")
        
        if 'is_active' not in columns:
            print("Добавляем колонку 'is_active'...")
            cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")
            # Обновляем существующие записи
            cursor.execute("UPDATE users SET is_active = 1 WHERE is_active IS NULL")
            print("[OK] Колонка 'is_active' добавлена")
        else:
            print("Колонка 'is_active' уже существует")
        
        conn.commit()
        print("\n[OK] Миграция успешно завершена!")
        
    except Exception as e:
        print(f"Ошибка при миграции: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
