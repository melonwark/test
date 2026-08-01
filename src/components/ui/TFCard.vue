<template>
  <div
    :class="['rendered tf-card', {'has-header': $slots.header}]"
  >
    <div
      v-if="$slots.header"
      class="tf-card__header"
    >
      <slot name="header"></slot>
    </div>
    <div
      v-if="$slots.preview"
      class="tf-card__preview"
    >
      <slot name="preview"></slot>
    </div>
    <div class="tf-card__content">
      <slot></slot>
    </div>
    <div
      v-if="$slots.footer"
      class="tf-card__footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TFCard',
};
</script>

