<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="authStore?.user?.gender === 'female' ? femaleAvatar : maleAvatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-3">
      <CDropdownItem class="py-2 pt-0 fs-8"> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem class="py-2 fs-8"> <CIcon icon="cil-dollar" /> Payments </CDropdownItem>
      <CDropdownItem class="py-2 fs-8"> <CIcon icon="cil-settings" /> Settings </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem> 
        <CButton class="px-4 self-bg-primary self-color-tertiary fs-8" @click="handleLogoutUser" :disabled="btnLoading">
          <CIcon icon="cil-lock-locked" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Logging Out...' : 'Logout' }} 
        </CButton>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import femaleAvatar from '@/assets/images/avatars/female.png'
  import maleAvatar from '@/assets/images/avatars/male.png'
  import { logoutUser } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()
  const { showToast } = toastNotifications()
  const { loading: btnLoading, data, execute } = useApi(logoutUser, false)

  async function handleLogoutUser() {
    // logout api here also revoke token
    const response = await execute()

    if(response.success === true){
      authStore.logout()
      showToast('success', 'Logout successfully!')
      router.push({ name: 'realtor.login' })
    } else{
      // handle any case if concerned error data
    }
  }
</script>

<style scoped>
  .dropdown-item:focus, 
  .dropdown-item:hover{
    background: transparent !important;
  }
</style>
