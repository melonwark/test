<template>
  <span
    v-tooltip="{
      content: innerTooltipContent,
      triggers: ['hover']
    }"
    v-clipboard:copy="withClipboard ? copyData : undefined"
    v-clipboard:success="withClipboard ? clipboardSuccessHandler : undefined"
    @mouseleave="isTooltipHidden"
    :class="[classes, { 'tf-badge-copy': withClipboard }]"
  >
    <template v-if="formatContent">
      {{ formatContent }}
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </span>
</template>


<script lang="ts">
import { computed, ref } from 'vue';

type TPropsVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type TPropsSize = 'sm' | 'md' | 'lg';

export default {
  name: 'TFBadge',

  props: {
    content: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    withClipboard: {
      type: Boolean,
      default: false
    },
    copyData: {
      type: String,
      default: ''
    },
    variant: {
      type: String as () => TPropsVariant,
      default: 'default'
    },
    outline: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as () => TPropsSize,
      default: 'md'
    },
  },

  setup(props) {
    const innerTooltipContent = ref(props.tooltip);
    const formatContent = computed(() => props.content.split('_').join(' '));

    const classes = computed(() => [
      'rendered',
      'tf-badge',
      `tf-badge-${props.size}`,
      props.outline ? `tf-badge-${props.variant}-outline` : `tf-badge-${props.variant}`,
    ]);

    const clipboardSuccessHandler = (value:string) => {
      innerTooltipContent.value = value ? 'Copied!' : props.tooltip;
    };

    const isTooltipHidden = () => {
      setTimeout(() => {
        innerTooltipContent.value = props.tooltip;
      }, 200);
    };

    return {
      formatContent,
      clipboardSuccessHandler,
      isTooltipHidden,
      innerTooltipContent,
      classes
    };
  }
};
</script>
