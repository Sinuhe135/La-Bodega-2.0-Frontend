<script setup lang="ts">
import { GetAllCategoriesResponseDto } from '/@src/dtos/category/get_all_categories_response.dto'
import { getAllCategoriesApi } from '/@src/repositories/category.repository'


const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Accounts'
})

const categories = ref<GetAllCategoriesResponseDto[]>()

onMounted(() => {
  onPageLoad()
})

const selectedCategory = ref<number>()

const onPageLoad = async () => {
  try {
    categories.value = await getAllCategoriesApi()
    selectedCategory.value = categories.value[0]?.id
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching categories')
    console.error(errorMsg)
  }
}
</script>

<template>
  
  <div class="accounts-header">
    <div id="category-container">
      <VControl v-if="categories && categories.length > 0" label="Category">
        <VSelect v-model="selectedCategory">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </VSelect>
      </VControl>
      <p v-else-if="categories && categories.length === 0">Please create a category first.</p>
    </div>

    <div id="new-container" v-if="categories && categories.length > 0">
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
      display: flex;
      align-items: center;
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
