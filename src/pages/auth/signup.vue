<script setup lang="ts">
import { AxiosError } from 'axios'
import { getCurrentUserApi, signupApi } from '/@src/repositories/auth.repository'
import { encrypt, decrypt } from '/@src/utils/encryption'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const token = useUserToken()
const userSession = useUserSession()

const username = ref('')
const errorMessage = ref('')

const showKeyModal = ref(false)

const handleSignup = async () => {
  errorMessage.value = ''
  
  if(username.value === '' || !username.value)
  {
    return;
  }

  showKeyModal.value = true
  
}

const handleIUnderstand = async () => {
  showKeyModal.value = false
  await signup()
}

const signup = async ()=>{
  isLoading.value = true

  try {
    const secretKey = generateKey()
    const hash = await hashKey(secretKey)
    console.log('Secret Key:', secretKey)
    console.log('Hashed Key (Base64):', hash)

    const loginResponse = await signupApi(username.value, hash);

    downloadKey(secretKey, `${username.value}.key`)
    token.value = loginResponse.jwt;

    const currentUser = await getCurrentUserApi(token.value);
    userSession.setUser(currentUser);
  } catch (error) {
    errorMessage.value = handleAxiosError(error, 'Signup failed. Please try again.')
    isLoading.value = false;
    return
  }

  isLoading.value = false;
  
  if (typeof route?.query?.redirect === 'string') {
    router.push(route.query.redirect)
  }
  else {
    router.push('/app')
  }
}

/*
apply changes to the db schema
implement the database call with file download
*/

const encryptionTest = async () => {
  const original = 'Hello from La Bodega!'

  const secretKey = generateKey()
  console.log('Secret Key:', secretKey)

  const hash = await hashKey(secretKey)
  console.log('Hashed Key (Base64):', hash)

  const encrypted = await encrypt(original, secretKey)
  console.log('Encrypted:', encrypted)

  const decrypted = await decrypt(encrypted, secretKey)
  console.log('Decrypted:', decrypted)
  console.log('Match:', original === decrypted)

  downloadKey(secretKey, 'test.key')
}

useHead({
  title: 'Signup',
})
</script>

<template>
  <VModal
    title="Save your key"
    :open="showKeyModal"
    noclose
    actions="center"
    @close="showKeyModal = false"
  >
    <template #content>
      <p>A key will be downloaded to your device</p>
      <br/>
      <p>The key is used to access to your account and your data</p>
      <br/>
      <p>If you lose your key, it cannot be recovered</p>
    </template>
    <template #cancel />
    <template #action>
      <VButton
        color="primary"
        bold
        raised
        @click="handleIUnderstand"
      >
        I understand
      </VButton>
    </template>
  </VModal>

  <div class="auth-wrapper-inner is-single">
    <LandingGrids class="is-contrasted" />
    <!--Fake navigation-->
    <!-- <div class="auth-nav">
      <div class="left" />
      <div class="center">
        <RouterLink
          to="/"
          class="header-item"
        >
          My App
        </RouterLink>
      </div>
      <div class="right">
        <VDarkmodeToggle />
      </div>
    </div> -->

    <!--Single Centered Form-->
    <div class="single-form-wrap is-relative">
      <div class="inner-wrap">
        <!--Form Title-->
        <div class="auth-head">
          <h2>Use La Bodega now</h2>
          <p>Enter a username to get started.</p>
          <RouterLink to="/auth">
            I already have an account
          </RouterLink>
        </div>


        <!--Form-->
        <div class="form-card">
          <form
            method="post"
            novalidate
            @submit.prevent="handleSignup"
          >
            <div class="login-form">
              <!-- Input -->
              <VField>
                <VControl icon="lucide:user" :loading="isLoading" :has-error="errorMessage !== ''">
                  <VInput
                    type="text"
                    placeholder="Name"
                    autocomplete="name"
                    v-model="username"
                  />
                  <p class="error-mesasge">{{ errorMessage }}</p> 
                </VControl>
              </VField>

              <!-- Submit -->
              <div class="login">
                <VButton
                  color="primary"
                  type="submit"
                  bold
                  fullwidth
                  raised
                  :loading="isLoading"
                >
                  Sign Up
                </VButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .error-mesasge {
    color: var(--danger);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style>
