<script setup lang="ts">
import { getCurrentUserApi } from '/@src/repositories/auth.repository'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'My App'
})
const router = useRouter()
const userSessionStore = useUserSession()

const isLogOutLoading = ref(false)

const username = ref('')

onMounted(() => {
  username.value = userSessionStore.user?.username || ''
  // onPageLoad()
})

// const onPageLoad = async () => {
//   const userData = await getCurrentUserApi();
//   username.value = userData.username;
// }


const logout = async () =>{
  isLogOutLoading.value = true
  await userSessionStore.logoutUser()
  isLogOutLoading.value = false

  router.push('/')
}
</script>

<template>
  <div>
    <VCard>
      Hello, {{ username }}
    </VCard>
  </div>
  <VButton @click="logout" color="warning" :loading="isLogOutLoading">Log out</VButton>
</template>
