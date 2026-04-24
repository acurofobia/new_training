from app import app, db
from models import Questions, Answers, Questions_pt, Answers_pt
import requests

# === API endpoints ===
API_QUESTIONS = "http://127.0.0.1:8000/api/v1/questions_add/put_questions/"
API_ANSWERS = "http://127.0.0.1:8000/api/v1/questions_add/put_answers/"

def send_questions():
    org = input("Введите org: ").strip()
    category = int(input("Введите category (число): ").strip())
    qtype = input("Введите question_type: ").strip()
    qsubtype = input("Введите question_subtype: ").strip()

    with app.app_context():
        # теперь берем вопросы только указанного org и category
        questions = Questions.query.filter_by(org=org, category=category).order_by(Questions.question_number).all()

        if not questions:
            print(f"⚠️ Нет вопросов для org={org}, category={category}")
            return

        for q in questions:
            q_payload = {
                "org": org,
                "category": category,
                "question_type": qtype,
                "question_subtype": qsubtype,
                "question_number": q.question_number,
                "question": q.question
            }

            try:
                resp = requests.post(API_QUESTIONS, json=q_payload)
                resp.raise_for_status()
            except requests.RequestException as e:
                print(f"❌ Ошибка при отправке вопроса id={q.id}: {e}")
                print(f"Ответ сервера: {resp.text if 'resp' in locals() else 'нет'}")
                return

            q_api = resp.json()
            new_qid = q_api["id"]
            print(f"✅ Вопрос {q.id} (category={category}) → новый id {new_qid}")

            answers = Answers.query.filter_by(question_id=q.id).all()
            for i, a in enumerate(answers, start=1):
                a_payload = {
                    "question_id": new_qid,
                    "answer_number": i,
                    "answer": a.answer,
                    "points": a.points
                }
                try:
                    resp = requests.post(API_ANSWERS, json=a_payload)
                    resp.raise_for_status()
                except requests.RequestException as e:
                    print(f"❌ Ошибка при отправке ответа id={a.id}: {e}")
                    print(f"Ответ сервера: {resp.text if 'resp' in locals() else 'нет'}")
                    return

                print(f"   ↳ Ответ {i} (id={a.id}) отправлен")

        print("🎉 Все вопросы и ответы успешно отправлены.")


def send_questions_pt():
    org = input("Введите org: ").strip()
    category = int(input("Введите category (число): ").strip())
    pt_type = input("Введите type (prakt/tem): ").strip()
    qtype = input("Введите question_type: ").strip()
    qsubtype = input("Введите question_subtype: ").strip()

    with app.app_context():
        questions = Questions_pt.query.filter_by(org=org, category=category, type=pt_type).order_by(Questions_pt.question_number).all()

        if not questions:
            print(f"⚠️ Нет вопросов для org={org}, category={category}, type={pt_type}")
            return

        for q in questions:
            q_payload = {
                "org": org,
                "category": category,
                "question_type": qtype,
                "question_subtype": qsubtype,
                "question_number": q.question_number,
                "question": q.question
            }

            try:
                resp = requests.post(API_QUESTIONS, json=q_payload)
                resp.raise_for_status()
            except requests.RequestException as e:
                print(f"❌ Ошибка при отправке вопроса id={q.id}: {e}")
                print(f"Ответ сервера: {resp.text if 'resp' in locals() else 'нет'}")
                return

            q_api = resp.json()
            new_qid = q_api["id"]
            print(f"✅ Вопрос {q.id} (type={pt_type}, category={category}) → новый id {new_qid}")

            answers = Answers_pt.query.filter_by(question_id=q.id).all()
            for i, a in enumerate(answers, start=1):
                a_payload = {
                    "question_id": new_qid,
                    "answer_number": i,
                    "answer": a.answer,
                    "points": a.points
                }
                try:
                    resp = requests.post(API_ANSWERS, json=a_payload)
                    resp.raise_for_status()
                except requests.RequestException as e:
                    print(f"❌ Ошибка при отправке ответа id={a.id}: {e}")
                    print(f"Ответ сервера: {resp.text if 'resp' in locals() else 'нет'}")
                    return

                print(f"   ↳ Ответ {i} (id={a.id}) отправлен")

        print("🎉 Все вопросы и ответы успешно отправлены.")


def main():
    print("Выберите режим:")
    print("  1 - questions.db (тестовые вопросы)")
    print("  2 - prakt_tem.db (практические/тематические)")
    choice = input("Введите 1 или 2: ").strip()

    if choice == "1":
        send_questions()
    elif choice == "2":
        send_questions_pt()
    else:
        print("Неверный выбор.")


if __name__ == "__main__":
    main()
