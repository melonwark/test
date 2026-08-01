<script lang="ts">
import { computed, defineComponent, h } from 'vue';

export default defineComponent({
  name: 'TFTableChildrenButton',

  props: {
    expanded: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    iconSlot: {
      type: Function,
      default: null,
    },
  },

  setup (props, { attrs }) {
    const classes = computed(() => {
      const classes = {
        'tf-table-children-row-icon': true,
      };

      if (props.loading) {
        return Object.assign(
          classes,
          {
            'tf-table-children-row-icon-loading': true,
          }
        );
      }

      return Object.assign(
        classes,
        {
          'tf-table-children-row-icon-contracted': !props.expanded,
          'tf-table-children-row-icon-expanded': props.expanded,
        }
      );
    });

    return () => {
      if (props.iconSlot) {
        return h(
          'span',

          props.iconSlot({
            onClick: attrs.onClick,
            class: classes.value,
            expanded: props.expanded,
            loading: props.loading,
          })
        );
      }

      return h(
        'span',
        {
          onClick: attrs.onClick,
          class: classes.value,
        }
      );
    };
  },
});
</script>
