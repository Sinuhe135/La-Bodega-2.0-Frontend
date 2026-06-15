<script setup lang="ts">
import { getAllCategoriesApi } from '/@src/repositories/category.repository'


const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Categories'
})


onMounted(() => {
  onPageLoad()
})

const selectedRole = ref('admin')

const isNewCategoryModalOpen = ref(false)

const onPageLoad = async () => {
  try {
    const categories = await getAllCategoriesApi()
    console.log(categories)
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching categories')
    console.error(errorMsg)
  }
}

const onCategoryCreated = () => {
  onPageLoad()
}
</script>

<template>
  
  <NewCategoryModal
    :open="isNewCategoryModalOpen"
    @close="isNewCategoryModalOpen = false"
    @created="onCategoryCreated"
  />

  <div class="accounts-header">

    <div id="new-container">
      <VIconButton color="primary" icon="material-symbols:add" outlined @click="isNewCategoryModalOpen = true"/>
    </div>

  </div>
</template>

<style lang="scss" scoped>
  .accounts-header {
    display: flex;
    justify-content: flex-end;

    #new-container {
      //flex: 1;

      display: flex;
      justify-content: center;
    }
  }
</style>
