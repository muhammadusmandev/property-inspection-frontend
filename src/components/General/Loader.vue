<script>
  import { defineComponent, h, computed, ref } from 'vue';

  const FullPageSpinnerLoader = defineComponent({
    name: 'FullPageSpinnerLoader',
    props: {
      spinnerSize: { type: String, default: 'small' },
      spinnerColor: { type: String, default: 'hsla(0, 0%, 94%, 0.93)' },
      spinnerBgColor: {type: String, default: '#bebebe'},
      spinnerSpeed: { type: Number, default: 0.5 },
    },
    setup(props, { expose }) {
      const isVisible = ref(true);

      const spinnerSizes = {
          small: ['15px', '2'],
          medium: ['30px', '4'],
          large: ['45px', '6'],
          xlarge: ['60px', '8'],
      };

      const overlayStyle = computed(() => ({
        backgroundColor: '#0097d5d9',
        display: isVisible.value ? 'flex' : 'none',
      }));

      const spinnerStyle = computed(() => ({
        width: spinnerSizes[props.spinnerSize][0],
        height: spinnerSizes[props.spinnerSize][0],
        border: `${spinnerSizes[props.spinnerSize][1]}px solid ${props.spinnerBgColor}`,
        borderTopColor: props.spinnerColor,
        animationDuration: `${props.spinnerSpeed}s`,
      }));

      function showLoader() {
        isVisible.value = true;
      }

      function hideLoader() {
        isVisible.value = false;
      }

      expose({ showLoader, hideLoader });

      return () => h('div', { class: 'loader-overlay', style: overlayStyle.value }, [ 
                        h('span', { class: 'loader-spinner', style: spinnerStyle.value }) 
                    ]);
    },
  });
  
  export { FullPageSpinnerLoader };
</script>

<style>
  .loader-overlay {
    position: fixed;
    inset: 0;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loader-spinner {
    display: inline-block;
    border-radius: 50%;
    animation-name: rotate;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>
