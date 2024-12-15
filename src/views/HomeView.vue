<script setup lang="ts">
import { ref } from 'vue';
import io from 'socket.io-client';

import type { JoinQuizFormData, Question, QuizResult, User } from '@/types';
import JoinQuizForm from '@/components/JoinQuizForm.vue';
import LeaderBoard from '@/components/LeaderBoard.vue';
import QuizForm from '@/components/QuizForm.vue';

const socket = ref()
const user = ref<User>({} as User)
const userName = ref('')
const quizId = ref('')
const joined = ref(false)
const question = ref<Question>()
const result = ref<QuizResult>()
const leaderboard = ref([])

function joinQuiz(data: JoinQuizFormData) {
  quizId.value = data.quizId
  userName.value = data.userName

  socket.value = io(import.meta.env.VITE_API_URL);
  socket.value.emit('joinQuiz', { quizId: quizId.value, userName: userName.value });
  socket.value.on('userJoined', (data: { user: User }) => {
    if (!joined.value) {
      console.log(`${data.user.userName} joined the quiz`);

      joined.value = true;
      user.value = data.user
    }
  });

  socket.value.on('getQuestion', (data: { question: Question }) => {
    question.value = data.question
  });

  socket.value.on('getResult', (data: { result: QuizResult }) => {
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

function onAnswer(answer: boolean) {
  submitAnswer({ answer })
}

function onNext() {
  result.value = undefined

  socket.value.emit('requestQuestion', { userName: user.value.userName })
}

function onJoinQuiz(data: JoinQuizFormData) {
  joinQuiz(data)
}
</script>

<template>
  <main class="min-h-screen p-6 bg-gray-100">
    <div class="max-w-xl mx-auto">
      <h1 class="mb-4 text-3xl font-bold">Real-Time Vocabulary Quiz</h1>

      <JoinQuizForm v-if="!joined" class="space-y-4" @join="onJoinQuiz" />
      <template v-else>
        <QuizForm v-if="user && question" @answer="onAnswer" @next="onNext" :result="result" :user="user"
          :question="question" />

        <LeaderBoard :leaderboard="leaderboard" />
      </template>
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
