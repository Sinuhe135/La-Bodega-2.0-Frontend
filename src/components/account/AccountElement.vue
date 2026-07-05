<script setup lang="ts">
export interface AccountElementProps {
  id: number
  name: string
  username: string
  email: string
  password: string
  platform: string
}

defineProps<AccountElementProps>()
</script>

<template>
  <VCard>
    <p>{{ name }}</p>
    <p>{{ username }}</p>
    <p>{{ email }}</p>
    <p>{{ password }}</p>
    <p>{{ platform }}</p>
  </VCard>
</template>
