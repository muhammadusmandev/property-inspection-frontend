<script setup>
import avatar from '@/assets/images/avatars/profile.jpg'

const itemsCount = 42
</script>

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
      <CDropdownItem> <CIcon icon="cil-lock-locked" /> Logout </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
