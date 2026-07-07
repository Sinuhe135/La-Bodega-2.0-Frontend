<script setup lang="ts">
import { ref } from 'vue'

export interface AccountElementProps {
  id: number
  name: string
  username: string
  email: string
  password: string
  platform: string
}

defineProps<AccountElementProps>()

const showCheckedTime = 1000

const isPasswordVisible = ref(false)
const isPasswordCopied = ref(false)

function copyPassword(password: string) {
  navigator.clipboard.writeText(password)
  isPasswordCopied.value = true
  setTimeout(() => {
    isPasswordCopied.value = false
  }, showCheckedTime)
}
</script>

<template>
  <VCard>
    <h2 class="account-name">{{ name }}</h2>

    <div id="data-container">
      <div class="data-row" v-if="username"><span>Username: </span><p>{{ username }}</p></div>
      <div class="data-row" v-if="email"><span>Email: </span><p>{{ email }}</p></div>

      <div class="data-row password-row" v-if="password">
        <span>Password: </span>
        <VIconButton
        @click="isPasswordVisible = !isPasswordVisible"
        color="primary"
        outlined
        :icon="isPasswordVisible ? 'material-symbols:visibility-off' : 'material-symbols:visibility'"
        />
        <VIconButton
        @click="copyPassword(password)"
        color="primary"
        outlined
        :icon="isPasswordCopied ? 'material-symbols:check' : 'material-symbols:content-copy-outline'"
        />
        <p>{{ isPasswordVisible ? password : '•'.repeat(password.length) }}</p>
      </div>

      <div class="data-row" v-if="platform"><span>Platform: </span><p>{{ platform }}</p></div>
    </div>
  </VCard>
</template>

<style lang="scss" scoped>
.account-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
#data-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  font-size: 1rem;
  .data-row {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
  }
  .password-row {
    align-items: center;
  }
}
.button{
  height: 1.5rem;
  width: 1.5rem;
}
</style>