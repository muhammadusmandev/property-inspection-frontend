<template>
  <div id="appContainer">
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4 mb-4" lg>
          <CContainer class="breadcrumb-container">
            <AppBreadcrumb />
          </CContainer>
          <div class="body-card p-5">
            <FullPageSpinnerLoader ref="loader" spinnerSize="medium" spinnerBgColor="#202020" spinnerColor="#ffffff" />
            <router-view />
          </div>
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, defineComponent } from 'vue'
  import { CContainer } from '@coreui/vue'
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue'
  import AppHeader from '@/components/CoreUI/AppHeader.vue'
  import AppFooter from '@/components/CoreUI/AppFooter.vue'
  import AppSidebar from '@/components/CoreUI/AppSidebar.vue'
  import AppBreadcrumb from '@/components/CoreUI/AppBreadcrumb.vue'

  export default defineComponent({
    components: { FullPageSpinnerLoader, AppHeader, AppFooter, AppSidebar, AppBreadcrumb, CContainer },
    setup() {
      const loader = ref(null);

      onMounted(() => {
        if (document.readyState === 'complete') {
          loader.value?.hideLoader();
        } else {
          window.addEventListener('load', () => {
            loader.value?.hideLoader();
          });
        }
      });

      return { loader };
    }
  });
</script>

<style lang="scss">
  // Common panel styling
  @use '@/styles/common/panel';
  @use '@coreui/coreui/dist/css/coreui.min.css';

  .breadcrumb-container{
    padding-top: 2.2rem !important;
    padding-bottom: 2.2rem !important;
  }
</style>