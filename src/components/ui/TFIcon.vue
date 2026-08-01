<template>
  <img
    v-if="src"
    :src="src"
    class="rendered"
    :class="imgClass"
    alt=""
  />
  <i
    v-else-if="icon"
    class="icon"
    aria-hidden="true"
  >
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TFIcon',
  props: {
    src: {
      type: String,
      default: null,
    },
    imgClass: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: null,
    }
  },
});
</script>

