<script setup lang="ts">
import type { User } from '@/types';

defineProps<{
  leaderboard: User[]
}>()
</script>

<template>
  <div class="c-leaderboard">
    <h3 class="mb-2 text-xl font-semibold">Leaderboard</h3>

    <ul class="c-leaderboard">
      <TransitionGroup name="list">
        <li v-for="(user, index) in leaderboard" :key="user.userName"
          class="flex items-center p-2 mb-1 font-semibold border rounded shadow-sm" :class="[
            index === 0 && 'bg-lime-100 text-lime-500 border-lime-200 text-lg',
            index === 1 && 'bg-amber-100 text-amber-500 border-amber-200 text-lg',
            index === 2 && 'bg-orange-100 text-orange-500 border-orange-200 text-lg',
            index > 2 && 'bg-indigo-100 text-lg',
          ]">
          {{ index + 1 }}. {{ user.userName }}
          <span class="px-2 ml-auto text-white bg-red-500 rounded">{{ user.score }}</span>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>
