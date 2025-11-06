import { ref } from 'vue'
import { defineStore } from 'pinia'
import { toastNotifications } from '@/composables/toastNotifications'
import { useSubscriptionStore } from '@/stores/subscription'

export const useAuthStore = defineStore('auth', () => {
    const subscriptionStore = useSubscriptionStore()
    const user = ref(null)
    const checkAuth = ref(false)
    const token = ref(null)
    const token_expiry = ref(null)

    function setUserData(userData) {
        user.value = userData
        checkAuth.value = true
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function setToken(_token, _expiry) {
        token.value = _token
        token_expiry.value = _expiry
        localStorage.setItem('token', _token)
        localStorage.setItem('token_expiry', _expiry)
    }

    function logout() {
        user.value = null
        token.value = null
        checkAuth.value = false
        token_expiry.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('token_expiry')

        subscriptionStore.clearSubscription()
    }

    function clearUserData() {
      user.value = null
    }

    function restoreAuthData() {
      const _token = localStorage.getItem('token')
      const _tokenExpiry = localStorage.getItem('token_expiry')
      const userData = localStorage.getItem('user')

      if (_token && userData) {
        token.value = _token
        token_expiry.value = _tokenExpiry
        user.value = JSON.parse(userData)
        checkAuth.value = true
      }
    }

    function checkTokenExpiry() {
      const currentTime = new Date().getTime()
      if(token_expiry.value){
        const expiryTime = new Date(token_expiry.value).getTime()
        const { showToast } = toastNotifications()

        if (currentTime >= expiryTime) {
          logout()
          showToast('info', 'Your session expired please login again.')
        }
      }
    }

    return { user, token, token_expiry, checkAuth, setToken, setUserData, logout, clearUserData, restoreAuthData, checkTokenExpiry}
  },
)