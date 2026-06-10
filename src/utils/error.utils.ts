import { AxiosError } from "axios"

export function handleAxiosError(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.response?.data || error.message)
      if (error.response?.data?.error) {
        return error.response.data.error
      } else {
        return defaultMessage
      }
    } else {
      console.error('Error:', error)
      return defaultMessage
    }
}