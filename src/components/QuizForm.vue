<script setup lang="ts">
import { marked } from 'marked';
import { ref } from 'vue';

import type { Question, QuizResult, User } from '@/types';

defineProps<{
  user: User
  question: Question
  result?: QuizResult
}>()
const emit = defineEmits<{
  answer: [value: boolean]
  next: []
}>()

const isAnswered = ref(false)

function onIncorrect() {
  isAnswered.value = true

  emit('answer', false)
}

function onCorrect() {
  isAnswered.value = true

  emit('answer', true)
}

function onNext() {
  isAnswered.value = false

  emit('next')
}
</script>

<template>
  <div class="c-quiz-form">
    <h2 class="mb-4 text-2xl font-semibold">Welcome, {{ user?.userName }} - Score: {{ user.score }}</h2>

    <div v-if="question" class="mb-4">
      <p class="my-4 text-3xl text-center">{{ question.question }}</p>

      <div v-if="result"
        :class="[result.isCorrect ? 'text-green-500 bg-green-100 border-green-200' : 'text-red-500 bg-red-100']"
        class="flex gap-2 p-2 mb-4 border rounded shadow-sm">
        <span>{{ result.isCorrect ? '✅' : '❌' }}</span>
        <p v-html="marked.parse(result.explanation)"></p>
      </div>

      <div class="flex justify-center my-8">
        <template v-if="!isAnswered">
          <button @click="onIncorrect"
            class="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600">Incorrect</button>
          <button @click="onCorrect"
            class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">Correct</button>
        </template>
        <template v-else>
          <button @click="onNext" class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">Next</button>
        </template>
      </div>
    </div>
  </div>
</template>
