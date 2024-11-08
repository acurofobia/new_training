# config.py
import os
import time
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'r64yfh5tg'  # Замените на более сложный ключ
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=2)  # Пример: 15 минут для access token
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)