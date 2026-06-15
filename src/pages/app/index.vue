<script setup lang="ts">
import { getAllCategoriesApi } from '/@src/repositories/category.repository'


const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Accounts'
})
const userSessionStore = useUserSession()

const username = ref('')

onMounted(() => {
  username.value = userSessionStore.user?.username || ''
  onPageLoad()
})

const selectedRole = ref('admin')

const onPageLoad = async () => {
  try {
    const categories = await getAllCategoriesApi()
    console.log(categories)
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching categories')
    console.error(errorMsg)
  }
}
</script>

<template>
  
  <div class="accounts-header">
    <div id="category-container">
      <VControl>
        <VSelect v-model="selectedRole">
          <option value="admin">Cuenta de la empresa que esta bien chida</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </VSelect>
      </VControl>
    </div>

    <!-- <div id="search-container">
    <VControl class="search-input">
    <VInput placeholder="Search accounts..." />
    </VControl>
    <VIconButton color="primary" light outlined icon="material-symbols:search"/>
    </div> -->

    <div id="new-container">
      <VIconButton color="primary" icon="material-symbols:add" outlined/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .accounts-header {
    display: flex;
    justify-content: space-between;
    // flex-wrap: wrap-reverse;
    gap: 1rem;

    #category-container {
      // flex: 1;
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
      //flex: 1;

      display: flex;
      justify-content: center;
    }
  }
</style>
