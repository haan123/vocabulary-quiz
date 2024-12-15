<script setup lang="ts">
import { reactive } from 'vue';
import type { JoinQuizFormData } from '@/types';

const emit = defineEmits<{
  join: [data: JoinQuizFormData]
}>()

const form = reactive<JoinQuizFormData>({
  userName: '',
  quizId: ''
})

function onJoinQuiz() {
  emit('join', form)
}
</script>

<template>
  <div class="c-join-quiz-form">
    <div class="space-y-4">
      <input v-model="form.userName" placeholder="Enter your userName"
        class="w-full p-2 border border-gray-300 rounded" />
      <input v-model="form.quizId" placeholder="Enter quiz ID" class="w-full p-2 border border-gray-300 rounded" />

      <button @click="onJoinQuiz" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Join Quiz</button>
    </div>
  </div>
</template>
