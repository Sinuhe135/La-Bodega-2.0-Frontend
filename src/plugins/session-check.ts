import { definePlugin } from '/@src/utils/plugins'
import { getCurrentUserApi } from '/@src/repositories/auth.repository'

export default definePlugin(async ({ router, pinia }) => {
  const userSession = useUserSession(pinia)
  const token = useUserToken()

  if (token.value && !userSession.user) {
    try {
      const currentUser = await getCurrentUserApi(token.value)
      userSession.setUser(currentUser)
    }
    catch (err) {
      token.value = undefined
    }
  }

  router.beforeEach((to) => {
    const token = useUserToken()
    if (to.meta.requiresAuth && !token.value) {
      return {
        name: '/auth',
        query: { redirect: to.fullPath },
      }
    }
  })
})
