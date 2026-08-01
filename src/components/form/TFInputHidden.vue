<template>
  <div v-if="Array.isArray(innerValue)">
    <input
      v-bind="form ? { form } : {}"
      v-for="(item, index) in innerValue"
      :key="index"
      :value="item"
      :name="`${name}[]`"
      type="hidden"
    >
  </div>
  <input
    v-else
    v-bind="form ? { form } : {}"
    :value="innerValue"
    :name="name"
    type="hidden"
  >
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, type PropType, ref } from 'vue';

import eventBus from '@/utils/eventBus.js';
import type { TInputHiddenValue } from '@/types/components';

export const valueValidator = (val: unknown): val is TInputHiddenValue => {
  const isPrimitive = (v: unknown) =>
    typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

  if (isPrimitive(val)) return true;

  if (Array.isArray(val)) {
    return val.every(item => typeof item === 'string' || typeof item === 'number');
  }

  return false;
};

export default defineComponent({
  name: 'TFInputHidden',
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Boolean, Number, Array] as PropType<TInputHiddenValue>,
      default: '',
      validator: valueValidator
    },
    eventBusListener: {
      type: String,
      default: ''
    },
    form: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const innerValue = ref(props.value);

    onMounted(() => {
      eventBus.$on(props.eventBusListener, (value: TInputHiddenValue ) => {
        innerValue.value = value;
      });
    });

    onUnmounted(() => { eventBus.$off(props.eventBusListener);});

    return {
      innerValue
    };
  },
});
</script>
