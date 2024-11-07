from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    refresh_token = db.Column(db.String(256), nullable=True)

    # def __repr__(self):
    #     return f"<user {self.id}>"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Results(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org = db.Column(db.String(100), nullable=False)
    category = db.Column(db.Integer)
    question_number = db.Column(db.Integer)
    answer_number = db.Column(db.Integer)
    points = db.Column(db.Integer)
    datetime = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))