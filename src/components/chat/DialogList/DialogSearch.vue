<template>
  <div class="tf-dialog-search">
    <input
      data-cy="search_field"
      data-test="search_field"
      type="text"
      placeholder="Search"
      class="tf-dialog-search__input"
      v-model="innerValue"
      @input="search"
    >
    <button
      data-cy="clear_search"
      data-test="clear_search"
      v-if="innerValue.length"
      type="button"
      class="tf-dialog-search__clear-btn"
      @click="clear"
    >
      <slot name="clear-search-input">
        ×
      </slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

const minLimit = 3;
export default defineComponent({
  name: 'DialogSearch',
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const innerValue = ref(props.value);

    watch(() => props.value, newVal => {
      innerValue.value = newVal;
    });

    const clear = () => {
      innerValue.value = '';
      emit('search', '');
    };

    const search = () => {
      if (innerValue.value.length >= minLimit || innerValue.value.length === 0) {
        emit('search', innerValue.value);
      }
    };

    return {
      innerValue,
      search,
      clear
    };
  },
});
</script>
