<template>
  <pre class="language-javascript">
    <code>
      <slot />
    </code>
  </pre>
</template>
<script lang="ts">

import * as Prism from 'prismjs';
import { onMounted } from 'vue';

export default {
  name: 'PrismCode',
  setup() {

    onMounted(() => {
      Prism.highlightAll();
    });

  }
};
</script>
