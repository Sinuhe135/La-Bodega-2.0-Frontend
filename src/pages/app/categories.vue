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

    <div id="new-container">
      <VIconButton color="primary" icon="material-symbols:add" outlined/>
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
