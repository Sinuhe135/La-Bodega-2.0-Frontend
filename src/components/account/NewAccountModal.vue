<script setup lang="ts">
import { createAccountApi } from '/@src/repositories/account.repository'

export interface NewAccountModalEmits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<{
  open: boolean
  categoryId: number
}>()

const emit = defineEmits<NewAccountModalEmits>()

const cryptKey = useUserCryptKey()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const platform = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  name.value = ''
  username.value = ''
  email.value = ''
  password.value = ''
  platform.value = ''
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
    if(!cryptKey.value) {
      throw new Error('Cryptographic key is not available')
    }

    const [encryptedEmail, encryptedPassword, encryptedPlatform, encryptedUsername] = await Promise.all([
      encrypt(email.value, cryptKey.value),
      encrypt(password.value, cryptKey.value),
      encrypt(platform.value, cryptKey.value),
      encrypt(username.value, cryptKey.value),
    ])

    await createAccountApi(
      props.categoryId,
      name.value,
      encryptedEmail,
      encryptedPassword,
      encryptedPlatform,
      encryptedUsername,
    )
    resetForm()
    emit('created')
    emit('close')
  } catch (error) {
    errorMessage.value = handleAxiosError(error, 'Error creating account')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VModal
    title="New account"
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
          <VControl :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="name"
              type="text"
              placeholder="Account name"
              autocomplete="off"
            />
          </VControl>
        </VField>
        <VField label="Username">
          <VControl :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="username"
              type="text"
              placeholder="Username"
              autocomplete="off"
            />
          </VControl>
        </VField>
        <VField label="Email">
          <VControl :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="email"
              type="email"
              placeholder="Email"
              autocomplete="off"
            />
          </VControl>
        </VField>
        <VField label="Password">
          <VControl :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="off"
            />
          </VControl>
        </VField>
        <VField label="Platform">
          <VControl :loading="isLoading" :has-error="errorMessage !== ''">
            <VInput
              v-model="platform"
              type="text"
              placeholder="Platform"
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
