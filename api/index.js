import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connect } from 'mongoose'
import { getResult, fetchQuestion } from './services/questionsService.js'
import { User } from './models/user.js'

const app = express()

app.use(cors())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

connect('mongodb://localhost:27017/quiz')

io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('joinQuiz', async ({ quizId, userName }) => {
    socket.join(quizId)
    const user = new User({ userName, score: 0 })
    await user.save()
    const question = await fetchQuestion()

    io.to(quizId).emit('userJoined', { user })
    io.to(quizId).emit('getQuestion', { question })
  })

  socket.on('submitAnswer', async ({ quizId, userName, answer, questionId }) => {
    // Process answer and update score
    const user = await User.findOne({ userName })

    if (user) {
      const result = await getResult(answer, questionId)

      user.score += result.score

      io.to(quizId).emit('getResult', { result })

      await user.save()

      const leaderboard = await User.find().sort({ score: -1 }).limit(10)

      io.to(quizId).emit('updateLeaderboard', leaderboard)
    }
  })

  socket.on('requestQuestion', async ({ quizId }) => {
    const question = await fetchQuestion()

    io.to(quizId).emit('getQuestion', { question })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

server.listen(4000, async () => {
  await User.deleteMany()

  console.log('Server is running on port 4000')
})
