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
const accountsData = ref<PaginatedResult<GetAllAccountsResponseDto>>()
const accountsDecrypted = ref<GetAllAccountsResponseDto[]>()

onMounted(() => {
  onPageLoad()
})

const selectedCategory = ref<number>()
const currentPage = ref<number>(1)
const itemsPerPage = 10

const onPageLoad = async () => {
  await getCategories()
  selectedCategory.value = categories.value && categories.value.length > 0 ? categories.value[0].id : undefined
  if(selectedCategory.value){
    await getAccounts(selectedCategory.value)
    await decryptAccounts()
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
    accountsData.value = await getAllAccountsByCategoryApi(categoryId, itemsPerPage, currentPage.value)
  } catch (error) {
    const errorMsg = handleAxiosError(error, 'Error fetching accounts')
    console.error(errorMsg)
  }
}

const decryptAccounts = async () => {
  if (!accountsData.value || !accountsData.value.data) return

  const cryptKey = useUserCryptKey().value
  if (!cryptKey) {
    console.error('Cryptographic key is not available')
    return
  }

  accountsDecrypted.value = await Promise.all(
    accountsData.value.data.map(async (account) => {
      let decryptedEmail = ''
      try {
        // hacer estos a la vez también
        decryptedEmail = await decrypt(account.email, cryptKey)
      } catch (error) {
        decryptedEmail = 'Decryption failed'
      }
      let decryptedPassword = ''
      try {
        decryptedPassword = await decrypt(account.password, cryptKey)
      } catch (error) {
        decryptedPassword = 'Decryption failed'
      }

      let decryptedPlatform = ''
      try {
        decryptedPlatform = await decrypt(account.platform, cryptKey)
      } catch (error) {
        decryptedPlatform = 'Decryption failed'
      }

      let decryptedUsername = ''
      try {
        decryptedUsername = await decrypt(account.username, cryptKey)
      } catch (error) {
        decryptedUsername = 'Decryption failed'
      }

      return {
        ...account,
        email: decryptedEmail,
        password: decryptedPassword,
        platform: decryptedPlatform,
        username: decryptedUsername,
      }
    })
  )
}

const onCategorySelected = async () => {
  if (!selectedCategory.value) return

  accountsData.value = undefined
  accountsDecrypted.value = undefined
  await getAccounts(selectedCategory.value)
  await decryptAccounts()
}

const onAccountCreated = async () => {
  if (!selectedCategory.value) return

  await getAccounts(selectedCategory.value)
  await decryptAccounts()
}

const onPageChanged = async (newPage: number) => {
  console.log('Page changed to:', newPage)
  currentPage.value = newPage

  if (!selectedCategory.value) return
  accountsData.value = undefined
  accountsDecrypted.value = undefined
  await getAccounts(selectedCategory.value)
  await decryptAccounts()
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
      v-for="account in accountsDecrypted"
      :key="account.id"
      :id="account.id"
      :name="account.name"
      :username="account.username"
      :email="account.email"
      :password="account.password"
      :platform="account.platform"
    />
  </div>

  <VFlexPagination
    v-if="accountsData && accountsData.data"
    :total-items="accountsData.totalItems"
    :item-per-page="accountsData.limit"
    :current-page="accountsData.page"
    :no-router="true"
    @update:current-page="onPageChanged"
  />

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
