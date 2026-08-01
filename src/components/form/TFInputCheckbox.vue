<template>
  <div
    class="rendered"
    :class="{
      'tf-checkbox': mode !== 'switcher',
      'tf-switcher': mode === 'switcher'
    }"
  >
    <input
      v-if="sendUnchecked && (!innerValue || innerValue === uncheckedValue)"
      type="hidden"
      :name="name"
      :value="uncheckedValue"
      v-bind="form ? { form } : {}"
    >
    <input
      :data-cy="dataCy"
      :disabled="disabled"
      type="checkbox"
      :id="id"
      :name="name"
      :true-value="checkedValue"
      :false-value="uncheckedValue"
      :value="checkedValue"
      v-model="innerValue"
      @change="onChange"
      v-bind="form ? { form } : {}"
    >
    <label
      class="tf-checkbox-label"
      :for="id"
    >
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, type PropType, ref, watch } from 'vue';
import type { TInputCheckboxValue } from '@/types/components';

export default defineComponent({
  name: 'TFInputCheckbox',
  props: {
    id: { type: String, default: '' },
    name: { type: String, required: true },
    label: { type: String, default: '' },
    uncheckedValue: { type: [Number, Boolean, String], default: false },
    checkedValue: { type: [Number, Boolean, String], default: true },
    disabled: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    callEmitterOnMount: { type: Boolean, default: false },
    mode: { type: String as PropType<'default' | 'switcher'>, default: 'default'},
    sendUnchecked: { type: Boolean, default: true },
    reloadAfterAction: { type: Boolean, default: false },
    dataCy: { type: String, default: '' },
    form: { type: String, default: '' }
  },

  setup(props, { emit }) {
    const innerValue = ref<TInputCheckboxValue>(false);

    onMounted(() => {
      innerValue.value = props.checked ? props.checkedValue : props.uncheckedValue;

      if(props.callEmitterOnMount) {
        onChange();
      }
    });

    watch(() => props.checked, val => {
      innerValue.value = val ? props.checkedValue : props.uncheckedValue;
    });

    const onChange = () => {
      emit('onChange', innerValue.value);
      if (props.reloadAfterAction) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(props.name,  `${innerValue.value}`);
        window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
      }
    };

    return {
      innerValue,
      onChange
    };
  },

});
</script>
