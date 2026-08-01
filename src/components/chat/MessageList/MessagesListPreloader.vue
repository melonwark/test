<template>
  <div
    ref="preloadSkeleton"
    class="tf-chat-messages-preloader item-visible"
  >
    <div
      v-for="item in skeletonItemsCount"
      :key="item"
      data-test="preloader-item"
    >
      <div class="tf-chat-messages-preloader__items">
        <div class="tf-chat-messages-preloader__small-text" />
        <div class="tf-chat-messages-preloader__content">
          <div class="tf-chat-messages-preloader__avatar" />
          <div class="tf-chat-messages-preloader__message" />
        </div>
        <div class="tf-chat-messages-preloader__large-text" />
      </div>
      <div class="tf-chat-messages-preloader__items">
        <div class="tf-chat-messages-preloader__small-text tf-chat-messages-preloader__small-text--right" />
        <div class="tf-chat-messages-preloader__content">
          <div class="tf-chat-messages-preloader__message" />
          <div class="tf-chat-messages-preloader__avatar tf-chat-messages-preloader__avatar--right" />
        </div>
        <div class="tf-chat-messages-preloader__large-text tf-chat-messages-preloader__large-text--right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, inject, type Ref, ref } from 'vue';

export default defineComponent({
  name: 'TFMessagesListPreloader',

  setup() {
    const preloadSkeletonCount = ref(1);
    const skeletonItemHeightDefault = ref(248);
    const chatHeight = inject<Ref<number>>('chatHeight', ref(0));
    const preloadSkeleton = ref<HTMLDivElement | null>(null);

    const skeletonItemsCount = computed(() =>
      Math.ceil(chatHeight.value / skeletonItemHeightDefault.value)
    );

    return {
      preloadSkeleton,
      skeletonItemsCount,
      preloadSkeletonCount,
    };

  }
});
</script>
