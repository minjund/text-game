import { ref, watch } from 'vue'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // 초기값 로드
  const loadFromStorage = (): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const data = ref<T>(loadFromStorage())

  // 저장 함수
  const save = () => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  // 삭제 함수
  const remove = () => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  // 데이터 변경 감지하여 자동 저장
  watch(
    data,
    () => {
      save()
    },
    { deep: true }
  )

  return {
    data,
    save,
    remove
  }
}
