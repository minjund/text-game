import { ref } from 'vue'

export interface Notification {
  message: string
  type: 'success' | 'error' | 'info'
}

export const useNotification = () => {
  const notification = ref<Notification | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  return {
    notification,
    showNotification
  }
}
