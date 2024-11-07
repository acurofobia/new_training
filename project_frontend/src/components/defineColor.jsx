export const defineColor = (question, answer_number) => {
  let green = 0;
  Object.keys(question.answers).map(i => {
    question.answers[i].right ? green = i : null;
  });
  
  return {"red": answer_number, "green": green};
}