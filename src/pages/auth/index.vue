<script setup lang="ts">
import { loginApi } from '/@src/repositories/auth.repository'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const token = useUserToken()

const username = ref('')
const keyFile = ref<FileList | null>(null)

const errorMessage = ref('')

const handleFileChange = (event: Event) => {
  keyFile.value = (event.target as HTMLInputElement).files
}

const handleLogin = async () => {
  errorMessage.value = ''

  if(username.value === '' || !username.value || !keyFile.value || keyFile.value.length === 0)
  {
    return;
  }

  isLoading.value = true

  try {
    const file = await uploadKey(keyFile.value)
    const hash = await hashKey(file)

    const loginResponse = await loginApi(username.value, hash);
    token.value = loginResponse.jwt;
  } catch (error) {
    errorMessage.value = handleAxiosError(error, 'Login failed. Please check your credentials and try again.')
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

useHead({
  title: 'Login',
})
</script>

<template>
  <div class="auth-wrapper-inner is-single">
    <LandingGrids class="is-contrasted" />
    <div class="auth-nav">
      <div class="left" />
      <div class="center">
        <RouterLink
          to="/"
          class="header-item"
        >
          <!-- Your logo -->
        </RouterLink>
      </div>
      <div class="right">
        <VDarkmodeToggle />
      </div>
    </div>

    <div class="single-form-wrap is-relative">
      <div class="inner-wrap">
        <div class="auth-head">
          <h2>Welcome Back</h2>
          <p>Please enter your username and select your key file</p>
          <RouterLink to="/auth/signup">
            I do not have an account yet
          </RouterLink>
        </div>

        <div class="form-card">
          <form
            method="post"
            novalidate
            @submit.prevent="handleLogin"
          >
            <div class="login-form">
              <VField>
                <VControl icon="lucide:user" :loading="isLoading">
                  <VInput
                    type="text"
                    placeholder="Username"
                    autocomplete="username"
                    v-model="username"
                  />
                </VControl>
              </VField>
              <VField>
                <VControl icon="lucide:lock" :loading="isLoading">
                  <VInput
                    type="file"
                    placeholder="Key file"
                    @change="handleFileChange"
                  />
                </VControl>
              </VField>

              <!-- Submit -->
              <div class="login">
                <VButton
                  :loading="isLoading"
                  type="submit"
                  color="primary"
                  bold
                  fullwidth
                  raised
                >
                  Sign In
                </VButton>
              </div>
            </div>
          </form>
          <p v-if="errorMessage !== ''" class="error-message">
            {{ errorMessage }}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-message{
  color: var(--danger);
  margin-top: 1rem;
  text-align: center;
  }
</style>
