<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import routeNameFormat from '@/utils/nameFormatter'

const breadcrumbs = ref()

const getBreadcrumbs = () => {
  return router.currentRoute.value.matched.map((route) => {
    return {
      active: route.path === router.currentRoute.value.fullPath,
      name: route.name,
      path: `${router.options.history.base}${route.path}`,
    }
  })
}

router.afterEach(() => {
  breadcrumbs.value = getBreadcrumbs()
})

onMounted(() => {
  breadcrumbs.value = getBreadcrumbs()
})
</script>

<template>
  <CBreadcrumb class="my-0 custom-breadcrumb" >
    <CIcon icon="cilHouse" size="lg" class="me-2" style="color: #07a7d9" />
    <CBreadcrumbItem
      v-for="item in breadcrumbs"
      :key="item"
      :href="item.active ? '' : item.path"
      :active="item.active"
    >
      {{ routeNameFormat(item.name) || 'Inspexly' }}
    </CBreadcrumbItem>
  </CBreadcrumb>
</template>