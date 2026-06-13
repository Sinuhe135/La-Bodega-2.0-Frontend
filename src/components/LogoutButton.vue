<script setup lang="ts">
const router = useRouter()
const userSessionStore = useUserSession()

const isLogOutLoading = ref(false)

const logout = async () => {
  isLogOutLoading.value = true
  await userSessionStore.logoutUser()
  isLogOutLoading.value = false

  router.push('/')
}
</script>

<template>
  <VButton @click="logout" color="warning" :loading="isLogOutLoading" icon="material-symbols:logout">
    Log out
  </VButton>
</template>
