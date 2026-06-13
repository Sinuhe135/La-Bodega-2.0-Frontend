<script setup lang="ts">

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Accounts'
})
const userSessionStore = useUserSession()

const username = ref('')

onMounted(() => {
  username.value = userSessionStore.user?.username || ''
  // onPageLoad()
})

// const onPageLoad = async () => {
//   const userData = await getCurrentUserApi();
//   username.value = userData.username;
// }
</script>

<template>
  <div>
    <VCard>
      Hello, {{ username }}
    </VCard>
  </div>
</template>
