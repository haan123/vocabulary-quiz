export type JoinQuizFormData = {
  userName: string
  quizId: string
}

export type User = {
  userName: string
  score: number
}

export type Question = {
  id: number
  question: string
}

export type QuizResult = {
  score: number
  explanation: string
  isCorrect: boolean
}
