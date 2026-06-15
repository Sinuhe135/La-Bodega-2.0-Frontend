<script setup lang="ts">

const props = defineProps<{
  onlyIcon?: boolean
}>()

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
  <VIconButton @click="logout" color="warning" outlined :loading="isLogOutLoading" icon="material-symbols:logout" v-if="props.onlyIcon" />
  <VButton @click="logout" color="warning" :loading="isLogOutLoading" icon="material-symbols:logout" v-else>
    Log out
  </VButton>
</template>
