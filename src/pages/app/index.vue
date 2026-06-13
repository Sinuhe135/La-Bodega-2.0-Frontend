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

const selectedRole = ref('admin')

// const onPageLoad = async () => {
//   const userData = await getCurrentUserApi();
//   username.value = userData.username;
// }
</script>

<template>
  <VCard class="accounts-header">

      <div id="category-container">
        <VControl>
          <VSelect v-model="selectedRole">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </VSelect>
        </VControl>
      </div>

      <div id="search-container">
        <VControl class="search-input">
          <VInput placeholder="Search accounts..." />
        </VControl>
        <VIconButton color="primary" light outlined icon="material-symbols:search"/>
      </div>

      <div id="new-container">
        <VButton color="primary">New Account</VButton>
      </div>
    </VCard>
</template>

<style lang="scss" scoped>
  .accounts-header {
    display: flex;
    gap: 1rem;

    #category-container {
      flex: 1;
    }

    #search-container {
      flex: 2;

      display: flex;
      gap: 0.3rem;

      .search-input {
        flex: 1;
      }
    }

    #new-container {
      flex: 1;

      display: flex;
      justify-content: center;
    }
  }
</style>
