# app.py
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, get_jti, get_jwt, create_refresh_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, Results, LastResult, Questions, Answers, Questions_pt, Answers_pt
from flask_cors import CORS
from random import shuffle
import json
import datetime
import random
# from flask_migrate import Migrate


app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config.from_object(Config)
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_VERIFY_SUB'] = False
app.config['DEBUG'] = True
# migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
# CORS(app)

def check_iteration(user_id, org, category, mode):
    last_result = LastResult.query.filter_by(org=org,
                                             category=category,
                                             user_id=user_id,
                                             mode=mode).first()
    result = Results.query.filter_by(org=org,
                                     category=category,
                                     user_id=user_id,
                                     mode=mode).all()
    if not result: #Первый раз?
        return 1
    if not last_result: #Если сбросили
        iteration = Results.query.filter_by(org=org,
                                            category=category,
                                            user_id=user_id,
                                            mode=mode).order_by(Results.iteration.desc()).first().iteration
        return iteration + 1
    return LastResult.query.filter_by(org=org,
                                   category=category,
                                   user_id=user_id,
                                   mode=mode).first().iteration

# Регистрация
class Register(Resource):
    def post(self):
        data = request.get_json()
        if User.query.filter_by(username=data["username"]).first():
            return {"message": "User already exists"}, 400
        if (data["rights"] == 1):
            allowed_org = ["fda", "fazt", "favt_ul", "favt_mos"]
            allowed_categories = ["1", "2", "3", "4", "5", "6", "7", "8"]
        else:
            allowed_org = data["allowed_org"]
            allowed_categories = data["allowed_categories"]
        new_user = User(username=data["username"],
                        full_name=data["full_name"],
                        org=data["org"],
                        allowed_org=allowed_org,
                        allowed_categories=allowed_categories,
                        rights=data["rights"],
                        doc_number=data["doc_number"])
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 200
    
class ChangeUser(Resource):
    @jwt_required()
    def patch(self):
        data = request.get_json()
        user = User.query.get(data["id"])
        for key, value in data.items():
            if (getattr(user, key, None) != value and key != "password"):
                setattr(user, key, value)
            if (key == "password" and value != ""):
                user.set_password(value)
                user.refresh_token = ""
        db.session.commit()
        return {"message": "User changed successfully"}, 200

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

class GetQuestion(Resource):
    @jwt_required()
    def get(self, org, category, question_number):
        try:
            question = Questions.query.filter_by(org=org, category=category, question_number=question_number).first()
            answers = Answers.query.filter_by(question_id=question.id).all()
            answersSerializable = []
            for answer in answers:
                answersSerializable.append({"id": answer.id, "answer": answer.answer})
            toSend = {"question": question.question, "question_id":question.id, "answers": answersSerializable}
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
    
class NumbersOfQuestionsPT(Resource):
    def get(self, org, category):
        praktQuestions = Questions_pt.query.filter_by(org=org, category=category, type="prakt").all()
        temQuestions = Questions_pt.query.filter_by(org=org, category=category, type="tem").all()
        praktNumbers = []
        temNumbers = []
        for question in praktQuestions:
            praktNumbers.append(question.question_number)
        for question in temQuestions:
            temNumbers.append(question.question_number)
        return {"praktNumbers": praktNumbers, "temNumbers": temNumbers}

class Result(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        iteration = check_iteration(current_user_id, data["org"], data["category"], mode=1)
        points = Answers.query.filter_by(id=data["answer_id"]).first().points
        right_answer = Answers.query.filter_by(question_id=data["question_id"], points=1).first().id
        if (data["mode"] == "all_questions"):
            return {"message": "Result not added cuz of mode", "right_answer": right_answer}, 200
        results = Results(org=data["org"],
            category=data["category"],
            question_number = data["question_number"],
            question_id = data["question_id"],
            answer_id = data["answer_id"],
            mode=1,
            iteration = iteration,
            points = points,
            datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_id=user.id)
        db.session.add(results)
        db.session.commit()
        result_id = Results.query.order_by(Results.id.desc()).first().id
        last_result = LastResult.query.filter_by(org=data["org"], 
                                                 category=data["category"],
                                                 user_id=user.id,
                                                 mode=1).first()
        if last_result:
            last_result.results_id = result_id
            last_result.iteration = iteration
            db.session.commit()
        else :
            last_result = LastResult(user_id=user.id, 
                                     results_id=result_id, 
                                     org=data["org"],
                                     mode=1,
                                     iteration=iteration,
                                     category=data["category"])
            db.session.add(last_result)
            db.session.commit()
        
        return {"message": "Result added successfully", "right_answer": right_answer}, 200

class ResultPT(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        type = Questions_pt.query.filter_by(id=data["question_id"]).first().type
        iteration = check_iteration(current_user_id, data["org"], data["category"], mode=2)
        points = Answers_pt.query.filter_by(id=data["answer_id"]).first().points
        if (type == "prakt"):
            max_points = 20
        else:
            max_points = 10
        right_answer = Answers_pt.query.filter_by(question_id=data["question_id"], points=max_points).first().id
        if (data["mode"] == 2):
            return {"message": "Result not added cuz of mode", "right_answer": right_answer}, 200
        semi_right_answer = Answers_pt.query.filter_by(question_id=data["question_id"], points=max_points/2).first().id
        results = Results(org=data["org"], #Дописать type?
            category=data["category"],
            question_number = data["question_number"],
            question_id = data["question_id"],
            answer_id = data["answer_id"],
            mode=2,
            iteration = iteration,
            points = points,
            datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_id=user.id)
        db.session.add(results)
        db.session.commit()
        result_id = Results.query.order_by(Results.id.desc()).first().id
        last_result = LastResult.query.filter_by(org=data["org"], 
                                                 category=data["category"],
                                                 user_id=user.id,
                                                 mode=2).first()
        if last_result:
            last_result.results_id = result_id
            last_result.iteration = iteration
            db.session.commit()
        else :
            last_result = LastResult(user_id=user.id, 
                                     results_id=result_id, 
                                     org=data["org"],
                                     mode=2,
                                     iteration=iteration,
                                     category=data["category"])
            db.session.add(last_result)
            db.session.commit()
        
        return {"message": "Result added successfully", "right_answer": right_answer, "semi_right_answer": semi_right_answer}, 200
    
class ResultRandom(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        iteration = check_iteration(current_user_id, data["org"], data["category"], mode=data["mode"])
        if (data["type"] == "test"):
            points = Answers.query.filter_by(id=data["answer_id"]).first().points
        else:
            points = Answers_pt.query.filter_by(id=data["answer_id"]).first().points
        results = Results(org=data["org"],
            category=data["category"],
            question_number = data["question_number"],
            question_id = data["question_id"],
            answer_id = data["answer_id"],
            type = data["type"],
            mode=data["mode"],
            iteration = iteration,
            points = points,
            datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_id=user.id)
        db.session.add(results)
        db.session.commit()
        result_id = Results.query.order_by(Results.id.desc()).first().id
        last_result = LastResult.query.filter_by(org=data["org"], 
                                                 category=data["category"],
                                                 user_id=user.id,
                                                 mode=data["mode"]).first()
        if last_result:
            last_result.results_id = result_id
            last_result.iteration = iteration
            db.session.commit()
        else :
            last_result = LastResult(user_id=user.id, 
                                     results_id=result_id, 
                                     org=data["org"],
                                     mode=data["mode"],
                                     iteration=iteration,
                                     category=data["category"])
            db.session.add(last_result)
            db.session.commit()
        
        return {"message": "Result added successfully"}, 200

class GetQuestionPT(Resource):
    @jwt_required()
    def get(self, org, category, question_number, type):
        try:
            question = Questions_pt.query.filter_by(org=org, category=category, question_number=question_number, type=type).first()
            answers = Answers_pt.query.filter_by(question_id=question.id).all()
            answersSerializable = []
            for answer in answers:
                answersSerializable.append({"id": answer.id, "answer": answer.answer})
            shuffle(answersSerializable)
            toSend = {"question": question.question, "question_id":question.id, "answers": answersSerializable}
            return toSend, 200
        except:
            return "Question not found", 404

class Users(Resource):
    @jwt_required()
    def get(self):
        users = User.query.all()
        response = []
        for user in users:
           response.append({"id": user.id, 
                            "username": user.username,
                            "allowed_org": user.allowed_org,
                            "allowed_categories": user.allowed_categories,
                            "full_name": user.full_name,
                            "doc_number": user.doc_number,
                            "org": user.org,
                            "rights": user.rights
                            })
        return response, 200


class LastQuestion(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        try:
            last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                    org=org,
                                                    category=category,
                                                    mode=1).first().results_id
            return {"last_answered": db.session.get(Results, last_result).question_number}, 200
        except:
            return {"last_answered": 0}, 202
        

class LastQuestionPT(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        try:
            last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                    org=org,
                                                    category=category, 
                                                    mode=2).first().results_id
            question_id = db.session.get(Results, last_result).question_id
            return {"last_answered": db.session.get(Results, last_result).question_number, "type": db.session.get(Questions_pt, question_id).type}, 200
        except:
            return {"last_answered": 0, "type": "prakt"}, 202
        
class FlushIteration(Resource):
    @jwt_required()
    def post(self, org, category):
        current_user_id = get_jwt_identity()

        last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                 org=org,
                                                 category=category,
                                                 mode=1
                                                 ).first()
        if last_result:
            db.session.delete(last_result)
            db.session.commit()
            return "Last result deleted", 200
        else:
            return "Last result not found", 404

class FlushIterationPT(Resource):
    @jwt_required()
    def post(self, org, category):
        current_user_id = get_jwt_identity()

        last_result = LastResult.query.filter_by(user_id=current_user_id,
                                                 org=org,
                                                 category=category, mode=2
                                                 ).first()
        if last_result:
            db.session.delete(last_result)
            db.session.commit()
            return "Last result deleted", 200
        else:
            return "Last result not found", 404

def getIteration(org, category, current_user_id):
    with app.app_context():
        last_iteration = Results.query.filter_by(org=org, category=category, user_id=current_user_id, mode=1).order_by(Results.iteration.desc()).first().iteration
        return last_iteration

def getIterationPT(org, category, current_user_id):
    with app.app_context():
        last_iteration = Results.query.filter_by(org=org, category=category, user_id=current_user_id, mode=2).order_by(Results.iteration.desc()).first().iteration
        return last_iteration

class TestSummary(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        current_iteration = getIteration(org, category, current_user_id)
        amountOfQuestions = len(NumbersOfQuestions.get(self, org, category)["numbers"])
        answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, mode=1).all()
        overallPoints = 0
        for answer in answers:
            overallPoints += answer.points
        return {"amountOfQuestions": amountOfQuestions, "overallPoints": overallPoints}, 200

class TestSummaryPT(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        current_iteration = getIterationPT(org, category, current_user_id)
        amountOfPraktQuestions = len(NumbersOfQuestionsPT.get(self, org, category)["praktNumbers"])
        amountOfTemQuestions = len(NumbersOfQuestionsPT.get(self, org, category)["temNumbers"])
        answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, mode=2).all()
        overallPoints = 0
        for answer in answers:
            overallPoints += answer.points
        return {"amountOfPraktQuestions": amountOfPraktQuestions, 
                "amountOfTemQuestions": amountOfTemQuestions,
                "overallPoints": overallPoints}, 200
    
class WrongAnswers(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        # user = User.query.get(current_user_id)
        # current_iteration = user.current_iteration
        current_iteration = getIteration(org, category, current_user_id)
        wrong_answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, points=0, mode=1).all()
        numbers = []
        for answer in wrong_answers:
            numbers.append(answer.question_number)
        return {"numbers": numbers}, 200

def checkTypeOfQuestion(question_id):
    with app.app_context():
        return db.session.get(Questions_pt, question_id).type

class WrongAnswersPT(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        current_iteration = getIterationPT(org, category, current_user_id)
        prakt_numbers = []
        tem_numbers = []
        wrong_answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, points=0, mode=2).all()
        for wrong_answer in wrong_answers:
            question_id = wrong_answer.question_id
            type = checkTypeOfQuestion(question_id)
            if (type == "prakt"):
                prakt_numbers.append(wrong_answer.question_number)
            if (type == "tem"):
                tem_numbers.append(wrong_answer.question_number)
        wrong_answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, points=5, mode=2).all()
        for wrong_answer in wrong_answers:
            question_id = wrong_answer.question_id
            type = checkTypeOfQuestion(question_id)
            if (type == "prakt"):
                prakt_numbers.append(wrong_answer.question_number)
            if (type == "tem"):
                tem_numbers.append(wrong_answer.question_number)
        wrong_answers = Results.query.filter_by(org=org, category=category, user_id=current_user_id, iteration=current_iteration, points=10, mode=2).all()
        for wrong_answer in wrong_answers:
            question_id = wrong_answer.question_id
            type = checkTypeOfQuestion(question_id)
            if (type == "prakt"):
                prakt_numbers.append(wrong_answer.question_number)
        return {"prakt_numbers": sorted(prakt_numbers), "tem_numbers": sorted(tem_numbers)}, 200

class UserInfo(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user_info = User.query.get(current_user_id)
        return {"username": user_info.username,
                "full_name": user_info.full_name,
                "org": user_info.org,
                "rights": user_info.rights,
                "allowed_org": user_info.allowed_org,
                "allowed_categories": user_info.allowed_categories}, 200

class GenerateQuestions(Resource):
    @jwt_required()
    def get(self, org, category):
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        
        amountOfTestQuestions = len(NumbersOfQuestions.get(self, org, category)["numbers"])
        amountOfPraktQuestions = len(NumbersOfQuestionsPT.get(self, org, category)["praktNumbers"])
        amountOfTemQuestions = len(NumbersOfQuestionsPT.get(self, org, category)["temNumbers"])
        randomTestQuestions = ", ".join(map(str, random_sorted_list(1, amountOfTestQuestions, 50)))
        randomPraktQuestions = ", ".join(map(str, random_sorted_list(1, amountOfPraktQuestions, 2)))
        randomTemQuestions = ", ".join(map(str, random_sorted_list(1, amountOfTemQuestions, 3)))
        user.randomQuestions = {"randomTestQuestions": randomTestQuestions, "randomPraktQuestions": randomPraktQuestions, "randomTemQuestions": randomTemQuestions}
        db.session.commit()
        return {"randomTestQuestions": randomTestQuestions, "randomPraktQuestions": randomPraktQuestions, "randomTemQuestions": randomTemQuestions}, 200



def random_sorted_list(start, end, length):
    """Создает случайный список уникальных чисел в заданном диапазоне, а затем сортирует его."""
    if length > (end - start + 1):
        raise ValueError("Длина списка не может превышать диапазон чисел")

    numbers = list(range(start, end + 1))  # Создаём последовательность чисел
    random.shuffle(numbers)  # Перемешиваем
    return sorted(numbers[:length])  # Берём первые length элементов и сортируем


def load_questions():
    with app.app_context():
        for i in range(8):
            with open(f'src/tests/prakt_tem_reload/FAVT_UL_tem_{i+1}k.json') as json_file:
                category = i+1
                questions = json.load(json_file)
                questions = questions["questions"]
                for key in questions:
                    question = Questions_pt(question=key["question"],
                                        org="favt_ul",
                                        category=category,
                                        type=key["type"],
                                        question_number=key["number"])
                    
                    db.session.add(question)
                    db.session.commit()
                    question_id = Questions_pt.query.filter_by(question_number=key["number"], category=category, type=key["type"]).first().id
                    for answer in key["options"]:
                        answer_ = Answers_pt(question_id=question_id,
                                            org="favt_ul",
                                            answer=answer["answer"],
                                            points=answer["points"])
                        db.session.add(answer_)
                        db.session.commit()
                

def copy_for_fazt():
    with app.app_context():
        numbersPrakt = [1,2,3,4,5,7,8,9,11,12,13,14,15]
        numbersTem = [1,2,4,5,6,7,8,10,11,12,13,14,15,16]
        number = 1
        for category in [1,2,3,4,5,6,7,8]:
            number = 1
            for key in numbersTem:
                finded_question = Questions_pt.query.filter_by(question_number=key, category=1, type="tem").first()
                question = Questions_pt(question=finded_question.question,
                                        org="fazt",
                                        category=category,
                                        type="tem",
                                        question_number=number)
                db.session.add(question)
                db.session.commit()
                question_id = Questions_pt.query.filter_by(org="fazt", question_number=number, category=category, type="tem").first().id
                for answer in Answers_pt.query.filter_by(question_id=finded_question.id).all():
                    answer_ = Answers_pt(question_id=question_id,
                                        org="fazt",
                                        answer=answer.answer,
                                        points=answer.points)
                    db.session.add(answer_)
                    db.session.commit()
                number += 1
        for category in [1,2,3,4,5,6,7,8]:
            number = 1
            for key in numbersPrakt:
                finded_question = Questions_pt.query.filter_by(question_number=key, category=1, type="prakt").first()
                question = Questions_pt(question=finded_question.question,
                                        org="fazt",
                                        category=category,
                                        type="prakt",
                                        question_number=number)
                db.session.add(question)
                db.session.commit()
                question_id = Questions_pt.query.filter_by(org="fazt", question_number=number, category=category, type="prakt").first().id
                for answer in Answers_pt.query.filter_by(question_id=finded_question.id).all():
                    answer_ = Answers_pt(question_id=question_id,
                                        org="fazt",
                                        answer=answer.answer,
                                        points=answer.points)
                    db.session.add(answer_)
                    db.session.commit()
                number += 1



api.add_resource(Register, "/api/register")
api.add_resource(ChangeUser, "/api/change")
api.add_resource(Login, "/api/login")
api.add_resource(ProtectedResource, "/api/protected")
api.add_resource(RefreshToken, "/api/refresh")
api.add_resource(UserInfo, "/api/user_info")
api.add_resource(Logout, "/api/logout")
api.add_resource(GetQuestion, "/api/get_question/<string:org>/<string:category>/<string:question_number>")
api.add_resource(GetQuestionPT, "/api/get_question_pt/<string:org>/<string:category>/<string:question_number>/<string:type>")
api.add_resource(NumbersOfQuestions, "/api/numbers_of_questions/<string:org>/<string:category>")
api.add_resource(NumbersOfQuestionsPT, "/api/numbers_of_questions_pt/<string:org>/<string:category>")
api.add_resource(WrongAnswers, "/api/wrong_answers/<string:org>/<string:category>")
api.add_resource(WrongAnswersPT, "/api/wrong_answers_pt/<string:org>/<string:category>")
api.add_resource(Result, "/api/add_result")
api.add_resource(ResultPT, "/api/add_result_pt")
api.add_resource(Users, "/api/get_users")
api.add_resource(LastQuestion, "/api/get_last_question/<string:org>/<string:category>")
api.add_resource(LastQuestionPT, "/api/get_last_question_pt/<string:org>/<string:category>")
api.add_resource(FlushIteration, "/api/flush_iteration/<string:org>/<string:category>")
api.add_resource(FlushIterationPT, "/api/flush_iteration_pt/<string:org>/<string:category>")
api.add_resource(TestSummary, "/api/test_summary/<string:org>/<string:category>")
api.add_resource(TestSummaryPT, "/api/test_summary_pt/<string:org>/<string:category>")
api.add_resource(GenerateQuestions, "/api/generate/<string:org>/<string:category>")

with app.app_context():
        # db.drop_all()
        db.create_all()
        # if not User.query.filter_by(username="admin").first():
        #     new_user = User(username="admin",
        #                     full_name="admin admin admin",
        #                     org="ZT",
        #                     allowed_org=["fda", "fazt", "favt_ul", "favt_mos"],
        #                     allowed_categories=["1", "2", "3", "4", "5", "6", "7", "8"],
        #                     rights=1)
        #     new_user.set_password("admin1")
        #     db.session.add(new_user)
        #     db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        # db.drop_all(bind_key='questions')
        # db.drop_all(bind_key='prakt_tem')
        # db.drop_all(bind_key=None)
        
        db.create_all()
        # if not User.query.filter_by(username="admin").first():
        #     new_user = User(username="admin",
        #                     full_name="admin admin admin",
        #                     org="ZT",
        #                     allowed_org=["fda", "fazt", "favt_ul", "favt_mos"],
        #                     allowed_categories=["1", "2", "3", "4", "5", "6", "7", "8"],
        #                     rights=1)
        #     new_user.set_password("admin1")
        #     db.session.add(new_user)
        #     db.session.commit()
    # load_questions_fazt()
    # load_answers_fazt()
    # load_questions()
    # copy_for_fazt()
    # load_questions('favt_mos')
    # load_questions('favt_ul')
    # load_answers('fda')
    # load_answers('favt_mos')
    # load_answers('favt_ul')
    # fix_answers('fda')
    app.run(debug=True, host="0.0.0.0")
    # app.run(host="0.0.0.0")