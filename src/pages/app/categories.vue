<script setup lang="ts">
import { GetAllCategoriesResponseDto } from '/@src/dtos/category/get_all_categories_response.dto'
import { getAllCategoriesApi } from '/@src/repositories/category.repository'


const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Categories'
})

const isNewCategoryModalOpen = ref(false)

const categories = ref<GetAllCategoriesResponseDto[]>([])

onMounted(() => {
  onPageLoad()
})


const onPageLoad = async () => {
  try {
    categories.value = await getAllCategoriesApi()
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching categories')
    console.error(errorMsg)
  }
}

const onCategoryCreated = () => {
//   categories.value = []
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

  <div class ="categories-list">
    <CategoryElement
      v-for="category in categories"
      :key="category.id"
      :id="category.id"
      :category-name="category.name"
    />
  </div>
</template>

<style lang="scss" scoped>
  .accounts-header {
    display: flex;
    justify-content: flex-end;

    margin-bottom: 2rem;

    #new-container {
      //flex: 1;

      display: flex;
      justify-content: center;
    }
  }

  .categories-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
