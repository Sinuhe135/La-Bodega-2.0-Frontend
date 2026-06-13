import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CurrentUserResponseDto } from '../dtos/auth/current_user_response.dto'

export type UserData = Record<string, any>

export const useUserSession = defineStore('userSession', () => {
  const user = ref<CurrentUserResponseDto>()

  const isLoggedIn = computed(() => user.value !== undefined)

  function setUser(newUser: CurrentUserResponseDto) {
    user.value = newUser
  }

  function setToken(token: string) {
    const userToken = useUserToken()
    userToken.value = token
  }

  function setCryptKey(cryptKey: Uint8Array<ArrayBuffer>) {
    const userCryptKey = useUserCryptKey()
    userCryptKey.value = cryptKey
  }

  async function logoutUser() {
    const token = useUserToken()
    const cryptKey = useUserCryptKey()
    token.value = undefined
    cryptKey.value = undefined
    user.value = undefined
  }

  return {
    user,
    isLoggedIn,
    logoutUser,
    setUser,
    setToken,
    setCryptKey,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
