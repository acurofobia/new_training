# app.py
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User
from flask_cors import CORS
import json

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)

# Регистрация
class Register(Resource):
    def post(self):
        data = request.get_json()
        print("---------------", data)
        if User.query.filter_by(username=data["username"]).first():
            return {"message": "User already exists"}, 400
        user = User(username=data["username"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}, 201

# Вход
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        if user and user.check_password(data["password"]):
            access_token = create_access_token(identity={"username": user.username})
            return jsonify({"token": access_token})
        return jsonify({"message": "Invalid credentials"}), 401

# Защищенный ресурс
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {"logged_in_as": current_user}, 200

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


api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(ProtectedResource, "/protected")
api.add_resource(GetTest, "/get_test/<string:org>/<string:category>")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0")