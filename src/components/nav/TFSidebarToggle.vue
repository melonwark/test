<template>
  <button
    type="button"
    class="hamburger hamburger--elastic"
    :class="{ 'is-active': !innerCollapsed }"
    @click="clickHandler"
    :data-cy="dataCy"
  >
    <span class="hamburger-box">
      <span class="hamburger-inner" />
    </span>
  </button>
</template>

<script lang="ts">

import eventBus from '@/utils/eventBus.js';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';

export default {
  name: 'TFSidebarToggle',
  props: {
    collapsed: {
      type: Boolean,
      default: true,
    },
    sidebarStateCookieName: {
      type: String,
      default: 'sidebar_menu_closed',
    },
    eventBusEmitter: {
      type: String,
      default: 'sidebarStateChange',
    },
    dataCy: {
      type: String,
    },
  },

  setup(props) {
    const innerCollapsed = ref(props.collapsed);
    const { cookies } = useCookies();
    const clickHandler = () => {
      innerCollapsed.value = !innerCollapsed.value;
      cookies.set(
        props.sidebarStateCookieName,
        `${innerCollapsed.value}`,
        '30d',
      );
      eventBus.$emit(props.eventBusEmitter, innerCollapsed.value);
    };

    return {
      clickHandler,
      innerCollapsed,
    };
  },
};
</script>
