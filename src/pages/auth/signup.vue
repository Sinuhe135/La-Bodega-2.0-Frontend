<script setup lang="ts">
import { signupApi } from '/@src/repositories/auth.repository'
import { encrypt, decrypt } from '/@src/utils/encryption'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const token = useUserToken()

const handleSignup = async () => {
  await encryptionTest()
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
}

const signup = async () => {
  try {
    const loginResponse = await signupApi('', '');
    token.value = loginResponse.jwt;
  } catch (error) {
    console.error('Signup failed:', error)
    return
  }
  
  if (typeof route?.query?.redirect === 'string') {
    router.push(route.query.redirect)
  }
  else {
    router.push('/app')
  }
}

useHead({
  title: 'Signup',
})
</script>

<template>
  <div class="auth-wrapper-inner is-single">
    <LandingGrids class="is-contrasted" />
    <!--Fake navigation-->
    <div class="auth-nav">
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
    </div>

    <!--Single Centered Form-->
    <div class="single-form-wrap is-relative">
      <div class="inner-wrap">
        <!--Form Title-->
        <div class="auth-head">
          <h2>Join Us Now.</h2>
          <p>Start by creating your account</p>
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
                <VControl icon="lucide:user">
                  <VInput
                    type="text"
                    placeholder="Name"
                    autocomplete="name"
                  />
                </VControl>
              </VField>
              <!-- Input -->
              <VField>
                <VControl icon="lucide:mail">
                  <VInput
                    type="text"
                    placeholder="Email Address"
                    autocomplete="email"
                  />
                </VControl>
              </VField>
              <!-- Input -->
              <VField>
                <VControl icon="lucide:lock">
                  <VInput
                    type="password"
                    placeholder="Password"
                    autocomplete="new-password"
                  />
                </VControl>
              </VField>
              <!-- Input -->
              <VField>
                <VControl icon="lucide:lock">
                  <VInput
                    type="password"
                    placeholder="Repeat Password"
                  />
                </VControl>
              </VField>

              <VField>
                <VControl class="setting-item">
                  <VCheckbox
                    label="Receive promotional offers"
                    color="primary"
                    paddingless
                  />
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
