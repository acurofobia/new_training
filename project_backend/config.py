# config.py
import os
import time
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'
    SQLALCHEMY_BINDS = {
        'questions': 'sqlite:///questions.db',
        'prakt_tem': 'sqlite:///prakt_tem.db'
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'r64yfh5tg'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=10)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)