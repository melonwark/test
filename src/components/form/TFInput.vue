<template>
  <div
    class="rendered form-field"
    :class="[
      containerClass,
      classes
    ]"
  >
    <div
      v-if="hasActions"
      class="combo-box-item"
    >
      <slot name="actions"></slot>
    </div>
    <input
      :required="required"
      :id="id"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="tf-input"
      :min="min"
      :max="max"
      v-model.trim="innerValue"
      @input.stop="callEmitter"
      :data-cy="dataCy"
      v-bind="form ? { form } : {}"
    >
    <label
      v-if="label"
      class="label"
    >{{ label }}</label>
    <p v-if="hasError && errorFeedback"
       class="invalid-feedback"
    >
      {{ errorFeedback }}
    </p>
  </div>
</template>

<script lang="ts">

import { ref, nextTick, onMounted, computed, onUnmounted, watch } from 'vue';
import eventBus from '@/utils/eventBus.js';

export default {
  name: 'TFInput',
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    required: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
    value: { type: [String, Number], default: '' },
    eventBusEmitter: { type: String, default: '' },
    eventBusClearListener: { type: String, default: 'clearReportFilters' },
    callEmitterOnMount: { type: Boolean, default: false },
    containerClass: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    label: { type: String, default: '' },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    dataCy: { type: String, default: '' },
    hasActions: { type: Boolean, default: false },
    actionsPosition: { type: String, default: 'left' },
    hasError: { type: Boolean, default: false },
    errorFeedback: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    form: { type: String, default: '' }
  },

  setup(props, { emit }) {
    const innerValue = ref<string|number>(props.modelValue || props.value || '')

    onMounted(() => {
      nextTick(() => {
        if (props.callEmitterOnMount) {
          callEmitter();
        }
      });

      eventBus.$on(props.eventBusClearListener, () => {
        innerValue.value = '';
      });
    });

    onUnmounted(() => {
      eventBus.$off(props.eventBusClearListener);
    });

    const classes = computed(() => ({
      'is-invalid': props.hasError,
      'combo-box': props.hasActions,
      [`has-item-${props.actionsPosition}`]: props.hasActions
    }));

    watch(() => props.modelValue, newVal => {
      innerValue.value = newVal;
    });

    watch(() => props.value, newVal => {
      innerValue.value = newVal;
    });

    const callEmitter = () => {
      emit('input', innerValue.value);
      emit('update:modelValue', innerValue.value);

      if (props.eventBusEmitter) {
        eventBus.$emit(props.eventBusEmitter, innerValue.value);
      }
    };

    return {
      innerValue,
      callEmitter,
      classes
    };
  }
};
</script>

