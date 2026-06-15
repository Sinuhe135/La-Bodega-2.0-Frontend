<script setup lang="ts">
import { createCategoryApi } from '/@src/repositories/category.repository'

export interface NewCategoryModalEmits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<NewCategoryModalEmits>()

const name = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  name.value = ''
  errorMessage.value = ''
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const handleCreate = async () => {
  errorMessage.value = ''

  if (!name.value) {
    return
  }

  isLoading.value = true

  try {
    await createCategoryApi(name.value)
    resetForm()
    emit('created')
    emit('close')
  } catch (error) {
    errorMessage.value = handleAxiosError(error, 'Error creating category')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VModal
    title="New category"
    :open="props.open"
    actions="right"
    @close="handleClose"
  >
    <template #content>
      <form
        method="post"
        novalidate
        @submit.prevent="handleCreate"
      >
        <VField label="Name">
          <VControl icon="lucide:tag" :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="name"
              type="text"
              placeholder="Category name"
              autocomplete="off"
            />
          </VControl>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton
        color="primary"
        bold
        raised
        :loading="isLoading"
        @click="handleCreate"
      >
        Create
      </VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
  .error-message {
    color: var(--danger);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style>
