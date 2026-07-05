<script setup lang="ts">
import AccountElement from '/@src/components/account/AccountElement.vue'
import { GetAllAccountsResponseDto } from '/@src/dtos/account/get_all_accounts_response.dto'
import { GetAllCategoriesResponseDto } from '/@src/dtos/category/get_all_categories_response.dto'
import { getAllAccountsByCategoryApi } from '/@src/repositories/account.repository'
import { getAllCategoriesApi } from '/@src/repositories/category.repository'
import { PaginatedResult } from '/@src/types/pagination'


const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Accounts'
})

const isNewAccountyModalOpen = ref(false)

const categories = ref<GetAllCategoriesResponseDto[]>()
const accounts = ref<PaginatedResult<GetAllAccountsResponseDto>>()

onMounted(() => {
  onPageLoad()
})

const selectedCategory = ref<number>()

const onPageLoad = async () => {
  await getCategories()
  selectedCategory.value = categories.value && categories.value.length > 0 ? categories.value[0].id : undefined
  if(selectedCategory.value){
    getAccounts(selectedCategory.value)
  }
}

const getCategories = async () => {
  try {
    categories.value = await getAllCategoriesApi()
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching categories')
    console.error(errorMsg)
  }
}

const getAccounts = async (categoryId: number) => {
  try {
    accounts.value = await getAllAccountsByCategoryApi(categoryId, 10, 1)
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching accounts')
    console.error(errorMsg)
  }
}

const onCategorySelected = async () => {
  if (!selectedCategory.value) return

  accounts.value = undefined
  await getAccounts(selectedCategory.value)
}

const onAccountCreated = () => {
  if (!selectedCategory.value) return

  getAccounts(selectedCategory.value)
}

</script>

<template>

  <NewAccountModal
    v-if="selectedCategory"
    :open="isNewAccountyModalOpen"
    :category-id="selectedCategory"
    @close="isNewAccountyModalOpen = false"
    @created="onAccountCreated"
  />
  
  <div class="accounts-header">
    <div id="category-container">
      <VControl v-if="categories && categories.length > 0" label="Category">
        <VSelect v-model="selectedCategory" @change="onCategorySelected">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </VSelect>
      </VControl>
      <p v-else-if="categories && categories.length === 0">Please create a category first.</p>
    </div>

    <div id="new-container" v-if="categories && categories.length > 0">
      <VIconButton color="primary" icon="material-symbols:add" outlined @click="isNewAccountyModalOpen = true"/>
    </div>
  </div>

  <div id="account-list">
    <AccountElement
      v-for="account in accounts?.data"
      :key="account.id"
      :id="account.id"
      :name="account.name"
      :username="account.username"
      :email="account.email"
      :password="account.password"
      :platform="account.platform"
    />
  </div>
</template>

<style lang="scss" scoped>
  .accounts-header {
    display: flex;
    justify-content: space-between;
    // flex-wrap: wrap-reverse;
    gap: 1rem;

    margin-bottom: 2rem;

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

  #account-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
