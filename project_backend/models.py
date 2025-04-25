from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    refresh_token = db.Column(db.String(256), nullable=True)
    mode = db.Column(db.String(256), nullable=True)
    allowed_org = db.Column(JSON, nullable=True)
    allowed_categories = db.Column(JSON, nullable=True)
    full_name = db.Column(db.String(256), nullable=True)
    doc_number = db.Column(db.String(256), nullable=True)
    org = db.Column(db.String(256), nullable=True)
    rights = db.Column(db.Integer)
    randomQuestions = db.Column(JSON, nullable=True)

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
    question_id = db.Column(db.Integer)
    answer_id = db.Column(db.Integer)
    iteration = db.Column(db.Integer)
    mode = db.Column(db.Integer)
    type = db.Column(db.String(256), nullable=True)
    points = db.Column(db.Integer)
    datetime = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # uhuh = db.Column(db.Integer)

class RandomQuestions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org = db.Column(db.String(100), nullable=False)
    category = db.Column(db.Integer)
    question_number = db.Column(db.Integer)
    question_id = db.Column(db.Integer)
    answer_id = db.Column(db.Integer)
    iteration = db.Column(db.Integer)
    type = db.Column(db.String(100), nullable=False)
    points = db.Column(db.Integer)
    datetime = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class LastResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org = db.Column(db.String(100), nullable=False)
    category = db.Column(db.Integer)
    iteration = db.Column(db.Integer)
    mode = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    results_id = db.Column(db.Integer, db.ForeignKey('results.id'))

class Questions(db.Model):
    __bind_key__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    org = db.Column(db.String(50), nullable=False)
    category = db.Column(db.Integer)
    question = db.Column(db.String(300), nullable=False)
    question_number = db.Column(db.Integer)

class Answers(db.Model):
    __bind_key__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))
    org = db.Column(db.String(50), nullable=False)
    points = db.Column(db.Integer)
    answer = db.Column(db.String(300), nullable=False)

class Questions_pt(db.Model):
    __bind_key__ = 'prakt_tem'
    id = db.Column(db.Integer, primary_key=True)
    org = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    category = db.Column(db.Integer)
    ticket = db.Column(db.Integer)
    question = db.Column(db.String(512), nullable=False)
    question_number = db.Column(db.Integer)

class Answers_pt(db.Model):
    __bind_key__ = 'prakt_tem'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions_pt.id'))
    org = db.Column(db.String(50), nullable=False)
    points = db.Column(db.Integer)
    answer = db.Column(db.String(2048), nullable=False)