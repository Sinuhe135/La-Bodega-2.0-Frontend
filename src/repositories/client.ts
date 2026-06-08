import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// apiClient.interceptors.request.use((config) => {
//   const token = useUserToken()
//   if (token.value) {
//     config.headers.Authorization = `Bearer ${token.value}`
//   }
//   return config
// })

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // clear session and redirect to /auth
//     }
//     return Promise.reject(error)
//   }
// )