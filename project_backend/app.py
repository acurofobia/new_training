# app.py
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, get_jti, get_jwt, create_refresh_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, Results, LastResult, Questions, Answers
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

def check_iteration(user_id, org, category):
    last_result = LastResult.query.filter_by(org=org,
                                             category=category,
                                             user_id=user_id).first()
    result = Results.query.filter_by(org=org,
                                     category=category,
                                     user_id=user_id).all()
    if not result: #Первый раз?
        return 1
    if not last_result: #Если сбросили
        iteration = Results.query.filter_by(org=org,
                                            category=category,
                                            user_id=user_id).order_by(Results.iteration.desc()).first().iteration
        return iteration + 1
    return LastResult.query.filter_by(org=org,
                                   category=category,
                                   user_id=user_id).first().iteration

def load_questions(org):
    if (org == 'fda'):
        org_for_json = 'k'
    if (org == 'favt_mos'):
        org_for_json = 'mosk'
    if (org == 'favt_ul'):
        org_for_json = 'ul'
    for i in range(8):
        with open(f'src/tests/first/{i+1}{org_for_json}.json') as json_file:
            category = i+1
            questions = json.load(json_file)
            for key in questions.keys():
                for_slice = 0
                if (org == 'fda' or org == 'favt_ul'):
                    if (int(key) < 10):
                        for_slice = 2
                    elif (int(key) < 100):
                        for_slice = 3
                    elif (int(key) < 1000):
                        for_slice = 4
                question = Questions(question=questions[key]['question'][for_slice: ],
                                     org=org,
                                     category=category,
                                     question_number=key)
                with app.app_context():
                    db.session.add(question)
                    db.session.commit()

def fix_answers(org):
    with app.app_context():
        answers = Answers.query.filter_by(org=org).all()
        for answer in answers:
            id = answer.id
            finded_answer = db.session.get(Answers, id)
            finded_answer.answer = finded_answer.answer[1:]
            db.session.commit()


def load_answers(org):
    with app.app_context():
        if (org == 'fda'):
            org_for_json = 'k'
        if (org == 'favt_mos'):
            org_for_json = 'mosk'
        if (org == 'favt_ul'):
            org_for_json = 'ul'
        for i in range(8):
            with open(f'src/tests/first/{i+1}{org_for_json}.json') as json_file:
                category = i+1
                questions = json.load(json_file)
                for_slice = 3
                for key in questions.keys():
                    question_id = Questions.query.filter_by(org=org, category=category, question_number=key).first().id
                    for answer_key in questions[key]['answers']:
                        if questions[key]['answers'][answer_key]['right']:
                            points = 1
                        else:
                            points = 0
                        answer = Answers(answer=questions[key]['answers'][answer_key]['answer'],
                                         points=points,
                                         org=org,
                                         question_id=question_id)
                        db.session.add(answer)
                        db.session.commit()


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
        # print(get_jwt()['jti'], "JTI!!!!!!!!!!")
        # print(get_jti(user.refresh_token), "JTI FROM !!!!!!!!!!")
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

class GetQuestion(Resource):
    @jwt_required()
    def get(self, org, category, question_number):
        try:
            question = Questions.query.filter_by(org=org, category=category, question_number=question_number).first()
            answers = Answers.query.filter_by(question_id=question.id).all()
            answersSerializable = []
            for answer in answers:
                answersSerializable.append({"id": answer.id, "answer": answer.answer})
            toSend = {"question": question.question, "answers": answersSerializable}
            return toSend, 200
        except:
            return "Question not found", 404

class NumbersOfQuestions(Resource):
    def get(self, org, category):
        questions = Questions.query.filter_by(org=org, category=category).all()
        numbers = []
        for question in questions:
            numbers.append(question.question_number)
        return {"numbers": numbers}

class Result(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        iteration = check_iteration(current_user_id, data["org"], data["category"])
        points = Results.query.filter_by(id=data["answer_id"]).first().points
        results = Results(org=data["org"],
            category=data["category"],
            question_number = data["question_number"],
            answer_number = data["answer_number"],
            answer_id = data["answer_id"],
            iteration = iteration,
            points = points,
            datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_id=user.id)
        db.session.add(results)
        db.session.commit()
        result_id = Results.query.order_by(Results.id.desc()).first().id
        last_result = LastResult.query.filter_by(org=data["org"], 
                                                 category=data["category"],
                                                 user_id=user.id).first()
        if last_result:
            last_result.results_id = result_id
            last_result.iteration = iteration
            db.session.commit()
        else :
            last_result = LastResult(user_id=user.id, 
                                     results_id=result_id, 
                                     org=data["org"],
                                     iteration=iteration,
                                     category=data["category"])
            db.session.add(last_result)
            db.session.commit()
        
        return {"message": "Result added successfully", "points": points}, 200

class Users(Resource):
    @jwt_required()
    def get(self):
        users = User.query.all()
        response = []
        for user in users:
           response.append({"id": user.id, "username": user.username})
        return response, 200

class LastQuestion(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        try:
            last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                    org=org,
                                                    category=category).first().results_id
            return {"last_answered": db.session.get(Results, last_result).question_number}, 200
        except:
            return {"last_answered": 0}, 200
        
class FlushIteration(Resource):
    @jwt_required()
    def post(self, org, category):
        current_user_id = get_jwt_identity()
        last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                 org=org,
                                                 category=category).first()
        if last_result:
            db.session.delete(last_result)
            db.session.commit()
            return "Last result deleted", 200
        else:
            return "Last result not found", 404


api.add_resource(Register, "/api/register")
api.add_resource(Login, "/api/login")
api.add_resource(ProtectedResource, "/api/protected")
api.add_resource(RefreshToken, "/api/refresh")
api.add_resource(Logout, "/api/logout")
api.add_resource(GetTest, "/api/get_test/<string:org>/<string:category>")
api.add_resource(GetQuestion, "/api/get_question/<string:org>/<string:category>/<int:question_number>")
api.add_resource(NumbersOfQuestions, "/api/numbers_of_questions/<string:org>/<string:category>")
api.add_resource(Result, "/api/add_result")
api.add_resource(Users, "/api/get_users")
api.add_resource(LastQuestion, "/api/get_last_question/<string:org>/<string:category>")
api.add_resource(FlushIteration, "/api/flush_iteration/<string:org>/<string:category>")

# with app.app_context():
#         db.drop_all()
#         db.create_all()

if __name__ == "__main__":
    with app.app_context():
        # db.drop_all(bind_key='questions')
        # db.drop_all(bind_key=None)
        db.create_all()
    # load_questions('fda')
    # load_questions('favt_mos')
    # load_questions('favt_ul')
    # load_answers('fda')
    # load_answers('favt_mos')
    # load_answers('favt_ul')
    # fix_answers('fda')
    app.run(debug=True, host="0.0.0.0")