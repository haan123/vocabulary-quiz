<script setup lang="ts">
import { ref } from 'vue';
import io from 'socket.io-client';
import { marked } from 'marked';

type User = {
  userName: string
  score: number
}

type Question = {
  id: number
  question: string
}

type Result = {
  score: number;
  explanation: string;
  isCorrect: boolean;
}

const socket = ref()
const user = ref<User>({} as User)
const quizId = ref('')
const joined = ref(false)
const question = ref<Question>()
const result = ref<Result>()
const isAnswered = ref(false)
const leaderboard = ref([])

function joinQuiz() {
  socket.value = io(import.meta.env.VITE_API_URL);
  socket.value.emit('joinQuiz', { quizId: quizId.value, userName: user.value.userName });
  socket.value.on('userJoined', (data: { user: User }) => {
    console.log(`${data.user.userName} joined the quiz`);

    joined.value = true;
    user.value = data.user
  });

  socket.value.on('getQuestion', (data: { question: Question }) => {
    question.value = data.question
  });

  socket.value.on('getResult', (data: { result: Result }) => {
    result.value = data.result
    user.value.score += result.value.score
  });

  socket.value.on('updateLeaderboard', (data: never[]) => {
    leaderboard.value = data;
  });
}

function submitAnswer({ answer }: { answer: boolean }) {
  socket.value.emit('submitAnswer', { quizId: quizId.value, userName: user.value.userName, answer, questionId: question.value?.id });
}

function onIncorrect() {
  isAnswered.value = true
  submitAnswer({ answer: false })
}

function onCorrect() {
  isAnswered.value = true
  submitAnswer({ answer: true })
}

function onNext() {
  isAnswered.value = false
  result.value = undefined

  socket.value.emit('requestQuestion', { quizId: quizId.value })
}
</script>

<template>
  <main class="p-6 bg-gray-100 min-h-screen">
    <div class="mx-auto max-w-xl">
      <h1 class="text-3xl font-bold mb-4">Real-Time Vocabulary Quiz</h1>
      <div v-if="!joined" class="space-y-4">
        <input v-model="user.userName" placeholder="Enter your userName"
          class="p-2 border border-gray-300 rounded w-full" />
        <input v-model="quizId" placeholder="Enter quiz ID" class="p-2 border border-gray-300 rounded w-full" />
        <button @click="joinQuiz" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Join Quiz</button>
      </div>
      <div v-else>
        <h2 class="text-2xl font-semibold mb-4">Welcome, {{ user?.userName }} - Score: {{ user.score }}</h2>
        <div v-if="question" class="mb-4">
          <p class="my-4 text-3xl text-center">{{ question.question }}</p>

          <div v-if="result"
            :class="[result.isCorrect ? 'text-green-500 bg-green-100 border-green-200' : 'text-red-500 bg-red-100']"
            class="mb-4 p-2 rounded flex gap-2 border shadow-sm">
            <span>{{ result.isCorrect ? '✅' : '❌' }}</span>
            <p v-html="marked.parse(result.explanation)"></p>
          </div>

          <div class="flex justify-center my-8">
            <template v-if="!isAnswered">
              <button @click="onIncorrect"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2">Incorrect</button>
              <button @click="onCorrect"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Correct</button>
            </template>
            <template v-else>
              <button @click="onNext" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Next</button>
            </template>
          </div>
        </div>
        <h3 class="text-xl font-semibold mb-2">Leaderboard</h3>
        <ul>
          <TransitionGroup name="list">
            <li v-for="(user, index) in leaderboard" :key="user.userName"
              class="mb-1 p-2 rounded font-semibold shadow-sm border flex items-center" :class="[
                index === 0 && 'bg-lime-100 text-lime-500 border-lime-200 text-lg',
                index === 1 && 'bg-amber-100 text-amber-500 border-amber-200 text-lg',
                index === 2 && 'bg-orange-100 text-orange-500 border-orange-200 text-lg',
                index > 2 && 'bg-white-100 text-white-500 border-white-200 text-lg',
              ]">
              {{ index + 1 }}. {{ user.userName }}
              <span class="px-2 bg-red-500 text-white rounded ml-auto">{{ user.score }}</span>
            </li>
          </TransitionGroup>
        </ul>
      </div>
    </div>
  </main>
</template>

<style>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
