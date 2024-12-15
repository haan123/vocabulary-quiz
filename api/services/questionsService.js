import fs from 'fs'

function getRandomItems(arr, numItems) {
  // Create a copy of the array to avoid modifying the original array
  const arrayCopy = [...arr]
  const randomItems = []

  // Ensure numItems does not exceed the length of the array
  const itemsToSelect = Math.min(numItems, arrayCopy.length)

  for (let i = 0; i < itemsToSelect; i++) {
    // Get a random index
    const randomIndex = Math.floor(Math.random() * arrayCopy.length)
    // Remove the item at the random index and add it to the randomItems array
    randomItems.push(arrayCopy.splice(randomIndex, 1)[0])
  }

  return randomItems
}

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
