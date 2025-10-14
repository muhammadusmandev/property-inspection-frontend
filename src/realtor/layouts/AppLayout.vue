<template>
  <div id="appContainer">
    <FullPageSpinnerLoader ref="loader" spinnerSize="medium" spinnerBgColor="#202020" spinnerColor="#ffffff" />
    <router-view />
  </div>
</template>

<script>
  import { ref, onMounted, defineComponent } from 'vue';
  import { FullPageSpinnerLoader } from '@/components/General/Loader.vue';

  export default defineComponent({
    components: { FullPageSpinnerLoader },
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
  @use '@/styles/common/panel'
</style>