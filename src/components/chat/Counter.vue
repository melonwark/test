<template>
  <div>
    {{ messageCount }}
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TFCounter',
  props: {
    messageCount: {
      type: [String, Number],
      default: 0
    }
  },
});
</script>
