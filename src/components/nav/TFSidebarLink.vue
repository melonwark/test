<template>
  <a :href="item.link">
    <slot />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TFSidebarLink',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
