<script>
  import { defineComponent, h, computed } from 'vue';

  const spinnerSizes = {
    small: ['15px', '2'],
    medium: ['30px', '4'],
    large: ['45px', '6'],
    xlarge: ['60px', '8'],
  };

  const ButtonSpinner = defineComponent({
    name: 'ButtonSpinner',
    props: {
      size: { type: String, default: 'small' },
      color: { type: String, default: '#ffffff' },
      bgColor: {type: String, default: '#bebebe'},
      speed: { type: Number, default: 0.5 },
    },
    setup(props) {
      const style = computed(() => ({
        width: spinnerSizes[props.size][0],
        height: spinnerSizes[props.size][0],
        border: `${spinnerSizes[props.size][1]}px solid ${props.bgColor}`,
        borderTopColor: props.color,
        animationDuration: `${props.speed}s`,
      }));

      return () => h('span', { class: 'button-spinner', style: style.value });
    },
  });

  // Todo: Need to add global spinner yet
  export { ButtonSpinner };
</script>

<style>
  .button-spinner{
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
