<template>
  <SidebarMenu
    class="rendered"
    ref="sidebar"
    :width="width"
    :width-collapsed="widthCollapsed"
    :menu="preparedMenu"
    :collapsed="innerCollapsed"
    :hide-toggle="hideToggle"
    :show-one-child="showOneChild"
    :show-child="showChild"
    :data-cy="dataCy"
    :relative="relative"
    @update:collapsed="onToggleCollapse"
    @item-click="onItemClick"
    v-bind="computedLinkComponentName"
  >
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
    <template #toggle-icon>
      <slot
        name="toggle-icon"
        :is-open="innerCollapsed"
      />
    </template>
    <template #dropdown-icon="{ isOpen }">
      <slot
        name="dropdown-icon"
        :is-open="isOpen"
      />
    </template>
  </SidebarMenu>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  type PropType,
  ref,
  watchEffect,
} from 'vue';
import { SidebarMenu } from 'vue-sidebar-menu';
import TFSidebarLink from '@/components/nav/TFSidebarLink.vue';
import eventBus from '@/utils/eventBus';
import type { TMenuItem } from '@/types/components';

export default defineComponent({
  name: 'TFSidebar',
  components: { SidebarMenu },
  props: {
    menu: {
      type: Array as PropType<TMenuItem[]>,
      default: () => [],
    },
    collapsed: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '290px',
    },
    widthCollapsed: {
      type: String,
      default: '65px',
    },
    showOneChild: {
      type: [Boolean, String],
      default: false,
    },
    showChild: {
      type: Boolean,
      default: false,
    },
    relative: {
      type: Boolean,
      default: false,
    },
    hideToggle: {
      type: Boolean,
      default: false,
    },
    disableHover: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: 'sidebar',
    },
    // The name of the custom link component (must be registered globally and define item as a prop)
    linkComponentName: {
      type: String,
      default: 'custom-link',
    },
    hasCustomLinkComponent: {
      type: Boolean,
      default: true,
    },
    relatedSelectors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    relatedSelectorsClasses: {
      type: String,
      default: 'sidebar-closed',
    },
    eventBusListener: {
      type: String,
      default: 'sidebarStateChange',
    },
    clickItemEventBusEmitter: {
      type: String,
    },
  },

  setup(props) {
    const innerCollapsed = ref(props.collapsed);

    const path = ref(location.pathname + location.search + location.hash);

    const setActiveItem = (item: TMenuItem): boolean => {
      return !!path.value.match(
        item.regExpForDetermineActivePoint as string | RegExp,
      )?.[0];
    };

    const preparedMenu = computed(() =>
      props.menu.map(
        (menuItem): TMenuItem => ({
          ...menuItem,
          ...(props.hasCustomLinkComponent ? { isActive: () => setActiveItem(menuItem) } : {}),
          child: menuItem.child?.map(
            (childItem): TMenuItem => ({
              ...childItem,
              ...(props.hasCustomLinkComponent ? { isActive: () => setActiveItem(childItem) } : {}),
            }),
          ),
        }),
      ),
    );

    const computedLinkComponentName = computed(() => {
      return props.hasCustomLinkComponent ? { linkComponentName: props.linkComponentName } : {};
    });

    watchEffect(() => {
      path.value = location.pathname + location.search + location.hash;
    });

    onMounted(() => {
      eventBus.$on(props.eventBusListener, (state: boolean) => {
        handleSidebarState(state);
      });
    });

    onUnmounted(() => {
      eventBus?.$off(props.eventBusListener, handleSidebarState);
    });

    const handleSidebarState = (state: boolean) => {
      innerCollapsed.value = state;
      if (props.relatedSelectors.length) {
        toggleRelatedSelectorsClass(state);
      }
    };

    const toggleRelatedSelectorsClass = (state: boolean) => {
      props.relatedSelectors
        .map(el => document.querySelector(el))
        .filter((selector): selector is Element => selector !== null)
        .forEach((selector: Element) => {
          selector.classList.toggle('sidebar-closed', state);
        });
    };

    const onToggleCollapse = (newCollapsed: boolean) => {
      innerCollapsed.value = newCollapsed;
    };

    const onItemClick = (event: MouseEvent, item: TMenuItem) => {
      if (props.clickItemEventBusEmitter !== undefined) {
        eventBus.$emit(props.clickItemEventBusEmitter, {
          item: item,
          nativeEvent: event,
        });
      }
    };

    return {
      TFSidebarLink,
      preparedMenu,
      innerCollapsed,
      onToggleCollapse,
      onItemClick,
      handleSidebarState,
      toggleRelatedSelectorsClass,
      computedLinkComponentName,
      path,
    };
  },
});
</script>
