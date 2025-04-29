from app import app, db
from models import Questions, Answers
import json

with app.app_context():  # Для работы с контекстом приложения
    with open(f'src/tests/first/7famrt.json') as json_file:
        questions = json.load(json_file)
        for key in questions:
            question = Questions(question=key["question"],
                                 org="famrt",
                                 category=7,
                                 question_number=key["question_number"])
            db.session.add(question)
            db.session.commit()
            question_id = Questions.query.filter_by(question_number=key["question_number"], category=7, org="famrt").first().id
            print(key["question_number"])
            right_answer = key["correct_index"]+1
            index = 1
            for answer in key["answers"]:
                        points = 0
                        if(index == right_answer):
                              points = 1
                        answer_ = Answers(question_id=question_id,
                                            org="famrt",
                                            answer=answer,
                                            points=points)
                        db.session.add(answer_)
                        db.session.commit()
                        index += 1
    # question = Questions(question="ghbdn",
    #                     org="favt_ul",
    #                     category=1,)
    # db.session.add(question)
    # db.session.commit()

    print("Данные успешно добавлены!")