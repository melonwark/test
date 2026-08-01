<template>
  <div
    ref="switcher"
    class="rendered tf-dropdown-switcher"
    :class="switcherClasses"
    :data-cy="dataCy"
    data-dropdown
    data-test="dropdown-switcher"
    @click="toggleDropdown"
  >
    <slot name="switcher" />
    <transition :name="openingAnimation">
      <div
        v-if="showDropdown"
        ref="dropdown"
        data-test="dropdown"
        class="tf-dropdown"
        :class="[{ open: showDropdown }, dropdownMenuClasses]"
        :style="dropdownStyles"
        @click.stop="handleDropdownClick"
      >
        <slot name="dropdown-header" />
        <slot name="dropdown-body" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  openingAnimation: {
    type: String,
    default: 'dropdown'
  },
  switcherClasses: {
    type: String,
    default: ''
  },
  dropdownMenuClasses: {
    type: String,
    default: ''
  },
  hideIfClickInside: {
    type: Boolean,
    default: true
  },
  minWidth: {
    type: [Number, String],
    default: 'auto'
  },
  offsetTop: {
    type: Number,
    default: 10
  },
  dataCy: {
    type: String,
    default: ''
  },
});

const showDropdown = ref(false);
const switcher = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleDropdownClick = () => {
  showDropdown.value = !props.hideIfClickInside;
};

const clickOutside = (event: Event) => {
  if (!switcher.value || !dropdown.value) return;

  const target = event.target as Node;
  const clickedInside = switcher.value.contains(target) || dropdown.value.contains(target);

  if (!clickedInside) {
    showDropdown.value = false;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showDropdown.value = false;
  }
};

const dropdownStyles = computed(() => ({
  minWidth: props.minWidth !== 'auto' ? `${props.minWidth}px` : undefined,
  top: `${props.offsetTop + (switcher.value?.offsetHeight || 0)}px`,
}));

onMounted(() => {
  document.addEventListener('click', clickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>
