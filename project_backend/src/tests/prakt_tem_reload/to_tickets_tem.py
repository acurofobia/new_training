import json
for category in range(8):
  category += 1
  with open(f'FAVT_UL_tem_{category}k.json') as json_file:
      file = json.load(json_file)
      questions = file["questions"]
      file_to_save = {}
      file_to_save["tickets"] = []
      tickets = file_to_save["tickets"]
      for ticket in range(10):
        ticket += 1
        number_of_question_3 = ticket * 3
        number_of_question_2 = number_of_question_3 - 1
        number_of_question_1 = number_of_question_3 - 2
        questions_to_put = []
        question_to_append_1 = questions[number_of_question_1 - 1]
        question_to_append_1["number"] = 1
        question_to_append_2 = questions[number_of_question_2 - 1]
        question_to_append_2["number"] = 2
        question_to_append_3 = questions[number_of_question_3 - 1]
        question_to_append_3["number"] = 3
        questions_to_put.append(question_to_append_1)
        questions_to_put.append(question_to_append_2)
        questions_to_put.append(question_to_append_3)
        to_append = {"number": ticket, "questions": questions_to_put}
        tickets.append(to_append)
      with open(f"tem{category}.json", mode="w") as write_file:
        json.dump(file_to_save, write_file)

# for category in range(8):
#   category = category + 1
#   with open(f'FAVT_UL_prakt_{category}k.json') as json_file:
#     file = json.load(json_file)
#     questions = file["questions"]
#     file_to_save = {}
#     file_to_save["tickets"] = []
#     tickets = file_to_save["tickets"]
#     ticket = 1

#     for ticket in range(10):
#       ticket += 1
#       number_of_question = 1
#       for question in questions:
#         questions_to_put = []
#         while (number_of_question < 3):
#           questions_to_put.append(question)
#           number_of_question += 1
#         to_append = {"number": ticket, "questions": questions_to_put}
#         tickets.append(to_append)
#     with open(f"{category}.json", mode="w") as write_file:
#       json.dump(file_to_save, write_file)
    