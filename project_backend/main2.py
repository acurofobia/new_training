from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = 'supersecretkey'
db = SQLAlchemy(app)
api = Api(app)
jwt = JWTManager(app)

CORS(app)
app.app_context().push()

# Модель пользователя
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Эндпоинт для регистрации
class Register(Resource):
    def post(self):
        data = request.json
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"message": "Пользователь уже существует"}), 409

        user = User(username=data['username'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Пользователь успешно зарегистрирован"})

# Эндпоинт для входа
class Login(Resource):
    def post(self):
        data = request.json
        user = User.query.filter_by(username=data['username']).first()

        if user and user.check_password(data['password']):
            # Генерация JWT-токена
            access_token = create_access_token(identity=user.username)
            return jsonify({"token": access_token})
        
        return jsonify({"message": "Неверный логин или пароль"}), 401

# Эндпоинт для защищенного ресурса
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return jsonify({"message": f"Hello, {current_user}!"})

# Добавляем ресурсы
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(ProtectedResource, '/protected')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
