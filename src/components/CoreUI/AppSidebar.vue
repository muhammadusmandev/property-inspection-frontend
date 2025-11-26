<script setup>
  import { RouterLink } from 'vue-router'
  import { AppSidebarNav } from '@/components/CoreUI/AppSidebarNav.js'
  import { useSidebarStore } from '@/stores/CoreUI/sidebar.js'
  import appLogo from '@/assets/images/Inspexly_logo.jpg'
  import appSygnet from '@/assets/images/Inspexly_sygnet_logo.jpg'

  const sidebar = useSidebarStore()
</script>

<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="border-bottom app-header">
      <RouterLink custom to="/inspector/dashboard" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <CImage :src="appLogo" alt="Inspexly Logo" class="sidebar-brand-full app-logo" fluid />
          <CImage :src="appSygnet" alt="Inspexly Logo" class="sidebar-brand-narrow app-sygnet" fluid />
        </CSidebarBrand>
      </RouterLink>
      <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>

<style scoped>
  .app-logo {
    max-width: 145px;
  }

  .app-sygnet {
    height: 35px;
  }
</style>