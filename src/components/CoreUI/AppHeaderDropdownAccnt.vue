<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Settings
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-dollar" /> Payments </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem> 
        <CButton class="px-4 self-bg-primary self-color-tertiary fs-6" @click="handleLogoutUser">
          <CIcon icon="cil-lock-locked" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Processing...' : 'Logout' }} 
        </CButton>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import avatar from '@/assets/images/avatars/profile.jpg'
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
