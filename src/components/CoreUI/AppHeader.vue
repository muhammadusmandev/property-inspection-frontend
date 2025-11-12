<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler @click="sidebar.toggleVisible()" style="margin-inline-start: -14px">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex ms-4">
        <CNavItem>
          <CNavLink href="#" class="btn px-4 self-bg-primary self-color-tertiary fs-8" @click="showNewReportModal = true"><CIcon icon="cil-description" /> Create New Report </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav class="ms-auto">
        <CNavItem>
          <CNavLink href="#">
            <CIcon icon="cil-bell" size="lg" />
          </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
  </CHeader>
  <CreateReport v-model:visibility="showNewReportModal" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useColorModes } from '@coreui/vue'
  import AppHeaderDropdownAccnt from '@/components/CoreUI/AppHeaderDropdownAccnt.vue'
  import CreateReport from '@/components/Modals/CreateReport.vue'
  import { useSidebarStore } from '@/stores/CoreUI/sidebar.js'

  const headerClassNames = ref('p-0')
  const showNewReportModal = ref(false)
  const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
  const sidebar = useSidebarStore()

  onMounted(() => {
    document.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > 0) {
        headerClassNames.value = 'p-0 shadow-sm'
      } else {
        headerClassNames.value = 'p-0'
      }
    })
  })
</script>