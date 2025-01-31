def load_questions_fazt():
    with open("src/tests/VOPOSY_202411191339.json") as questions_file:
        # with open("src/tests/OTVET_202411191340.json") as answers_file:
        questions = json.load(questions_file)
            # answers = json.load(answers_file)
        for i in questions["VOPOSY"]:
            question = Questions(question=i['TEXTVOP'],
                                    org="fazt",
                                    category=i["CATEGORY"],
                                    question_number=i["NV"])
            with app.app_context():
                db.session.add(question)
                db.session.commit()

def load_answers_fazt():
    with app.app_context():
        with open("src/tests/OTVET_202411191340.json") as answers_file:
            answer = json.load(answers_file)
            for key in answer["OTVET"]:
                try:
                    question_id = Questions.query.filter_by(org="fazt", category=key["CATEGORY"], question_number=key["NV"]).first().id
                    print(f'{key["CATEGORY"]} {key["NV"]} {question_id} {key["CORRECT_ANSWER"]}')
                    with open("debug.txt", "a") as f:
                        f.write(f'{key["CATEGORY"]} {key["NV"]} {question_id} {key["CORRECT_ANSWER"]}\n')
                    answer = Answers(answer=key["TEXTOTV"],
                                    points=key["CORRECT_ANSWER"],
                                    org="fazt",
                                    question_id=question_id)
                
                    db.session.add(answer)
                    db.session.commit()
                except:
                    print(f'error in {key["CATEGORY"]} {key["NV"]}')
                    with open("debug.txt", "a") as f:
                        f.write(f'{key["CATEGORY"]} {key["NV"]} {question_id} {key["CORRECT_ANSWER"]}\n')



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
