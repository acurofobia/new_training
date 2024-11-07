export const definePoints = (question, selectedAnswer) => {
  return question.answers[selectedAnswer].right ? 1 : 0
}