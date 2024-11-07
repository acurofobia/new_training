# app.py
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, get_jti, get_jwt, create_refresh_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, Results
from flask_cors import CORS
import json
import datetime

app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config.from_object(Config)
app.config['PROPAGATE_EXCEPTIONS'] = True

db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
# CORS(app)

# Регистрация
class Register(Resource):
    def post(self):
        data = request.get_json()
        if User.query.filter_by(username=data["username"]).first():
            return {"message": "User already exists"}, 400
        new_user = User(username=data["username"])
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 200

# Вход
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        if user and user.check_password(data["password"]):
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            user.refresh_token = refresh_token
            db.session.commit()
            return {
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 200
        return {"message": "Invalid credentials"}, 401

class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        # print(user.refresh_token)
        print(get_jwt()['jti'], "JTI!!!!!!!!!!")
        print(get_jti(user.refresh_token), "JTI FROM !!!!!!!!!!")
        # Проверка, что refresh_token активен
        jti = get_jwt()['jti']
        if get_jti(user.refresh_token) != jti:
            return {"message": "Token has been revoked or invalidated!!!!!!"}, 401

        # Создание нового access_token
        new_access_token = create_access_token(identity=current_user_id)
        return {"access_token": new_access_token}, 200

class Logout(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        # Аннулирование refresh_token
        user.refresh_token = None
        db.session.commit()
        
        return {"message": "Logout successful"}, 200

# Защищенный ресурс
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {"logged_in_as": current_user}, 201

class GetTest(Resource):
    def get(self, org, category):
      if (org == "fda"):
        with open(f'src/tests/first/{category}k.json') as json_file:
          data = json.load(json_file)
      if (org == "favt_mos"):
        with open(f'src/tests/first/{category}mosk.json') as json_file:
          data = json.load(json_file)
      if (org == "favt_ul"):
        with open(f'src/tests/first/{category}ul.json') as json_file:
          data = json.load(json_file)
      return {"data": data}

class Result(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        print(data)
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        results = Results(org=data["org"], 
            category=data["category"], 
            question_number = data["question_number"], 
            answer_number = data["answer_number"],
            points = data["points"], 
            datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_id=user.id)
        db.session.add(results)
        db.session.commit()
        return {"message": "Result added successfully"}, 200



api.add_resource(Register, "/api/register")
api.add_resource(Login, "/api/login")
api.add_resource(ProtectedResource, "/api/protected")
api.add_resource(RefreshToken, "/api/refresh")
api.add_resource(Logout, "/api/logout")
api.add_resource(GetTest, "/api/get_test/<string:org>/<string:category>")
api.add_resource(Result, "/api/add_result")

if __name__ == "__main__":
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run(debug=True, host="0.0.0.0")