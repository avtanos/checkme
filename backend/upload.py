import os
import shutil
from fastapi import UploadFile, HTTPException
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

async def save_uploaded_file(file: UploadFile) -> str:
    """Сохраняет загруженный файл и возвращает URL"""
    if not file:
        return None
    
    # Проверяем расширение
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Недопустимый формат файла")
    
    # Генерируем уникальное имя файла
    import uuid
    file_name = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / file_name
    
    # Сохраняем файл и проверяем размер
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Файл слишком большой (макс. 5MB)")
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Возвращаем относительный URL
    return f"/uploads/{file_name}"

def delete_file(file_url: str):
    """Удаляет файл по URL"""
    if file_url and file_url.startswith("/uploads/"):
        file_path = UPLOAD_DIR / Path(file_url).name
        if file_path.exists():
            file_path.unlink()

