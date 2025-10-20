import { useToast } from 'vue-toastification'

const toast = useToast()

export function toastNotifications() {
  // type: info, error, success, warning
  function showToast(type = "info", msg = 'Action done successfully!', timeout = 4000) {
    switch (type) {
      case 'success':
        toast.success(msg, timeout)
        break;

      case 'error':
        toast.error(msg, timeout)
        break;

      case 'info':
        toast.info(msg, timeout)
        break;
      
      case 'warning':
        toast.warning(msg, timeout)
        break;
    
      default:
        toast.info(msg, timeout)
        break;
    }
  }

  function closeAllToasts() {
    toast.clear()
  }

  return {
    showToast,
    closeAllToasts,
  }
}
