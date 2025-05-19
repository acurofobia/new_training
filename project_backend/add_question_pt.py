from app import app, db
from models import Questions_pt, Answers_pt
import json

category = 1
org = "fda"
type = "prakt"

with app.app_context():  # Для работы с контекстом приложения
    with open(f'src/tests/second/FDA_prakt_1k.json') as json_file:
        questions = json.load(json_file)
        for key in questions["questions"]:
            question = Questions_pt(question=key["question"],
                                 org=org,
                                 category=category,
                                 type=type,
                                 question_number=key["number"])
            db.session.add(question)
            db.session.commit()
            question_id = Questions_pt.query.filter_by(question_number=key["number"], category=category, org=org).first().id
            print(key["number"])
            for answer in key["options"]:                        
                        answer_ = Answers_pt(question_id=question_id,
                                            org=org,
                                            answer=answer["answer"],
                                            points=answer["points"]
                                            )
                        db.session.add(answer_)
                        db.session.commit()
    # question = Questions(question="ghbdn",
    #                     org="favt_ul",
    #                     category=1,)
    # db.session.add(question)
    # db.session.commit()

    print("Данные успешно добавлены!")