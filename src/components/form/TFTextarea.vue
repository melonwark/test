<template>
  <div
    class="rendered form-field"
    :class="[containerClass, {'is-invalid': hasError}]"
  >
    <textarea
      v-bind="form ? { form } : {}"
      :name="name"
      :id="id"
      v-model.trim="innerValue"
      @input.stop="callEmitter"
      :placeholder="placeholder"
      :required="required"
      class="tf-textarea"
      :disabled="disabled"
      :rows="rows"
      :cols="cols"
      :data-cy="dataCy"
    />
    <label
      v-if="label"
      class="label"
    >
      {{ label }}
    </label>
    <p class="invalid-feedback">
      {{ errorFeedback }}
    </p>
  </div>
</template>

<script lang="ts">

import { ref, onMounted, nextTick, onUnmounted, watch, defineComponent } from 'vue';
import eventBus from '@/utils/eventBus.js';

export default defineComponent({
  name: 'TFTextarea',
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
    eventBusEmitter: { type: String, default: '' },
    eventBusClearListener: { type: String, default: 'clearReportFilters' },
    callEmitterOnMount: { type: Boolean, default: true },
    containerClass: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    rows: { type: Number, default: 2 },
    cols: { type: Number, default: 20 },
    dataCy: { type: String, default: '' },
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
      callEmitter
    };
  },
});
</script>
