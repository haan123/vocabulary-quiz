import fs from 'fs'
import { getRandomItems } from '../utils.js'

export function fetchQuestions() {
  const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'))

  return questions
}

export async function fetchQuestion() {
  const questions = await fetchQuestions()
  const [question] = getRandomItems(questions, 1)

  return {
    id: question.id,
    question: question.question,
  }
}

export async function fetchQuestionById(id) {
  const questions = await fetchQuestions()

  return questions.find((question) => question.id === id)
}

export async function getResult(answer, questionId) {
  const question = await fetchQuestionById(questionId)
  const isCorrect = question && question.answer === answer
  let score = isCorrect ? 1 : 0

  return {
    score,
    isCorrect,
    explanation: question.explanation,
  }
}
