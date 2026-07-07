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
    <div class="data-row"><span>Name: </span><p>{{ name }}</p></div>
    <div class="data-row" v-if="username"><span>Username: </span><p>{{ username }}</p></div>
    <div class="data-row" v-if="email"><span>Email: </span><p>{{ email }}</p></div>
    <div class="data-row" v-if="password"><span>Password: </span><p>{{ password }}</p></div>
    <div class="data-row" v-if="platform"><span>Platform: </span><p>{{ platform }}</p></div>
  </VCard>
</template>

<style lang="scss" scoped>
.data-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}
</style>