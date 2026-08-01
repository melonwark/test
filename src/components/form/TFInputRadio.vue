<template>
  <div class="rendered tf-radio">
    <input
      v-bind="form ? { form } : {}"
      :disabled="disabled"
      :id="id"
      type="radio"
      :name="name"
      v-model="innerValue"
      :value="value"
      @change="onChange"
      :checked="checked"
      :data-cy="dataCy"
    >
    <label
      class="tf-radio-label"
      :for="id"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">

import { onMounted, ref } from 'vue';

export default {
  name: 'TFInputRadio',
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    callEmitterOnMount: {
      type: Boolean, default: false
    },
    dataCy: {
      type: String,
      default: ''
    },
    form: {
      type: String,
      default: '',
    }
  },
  setup(props, { emit }) {
    const innerValue = ref(props.value);

    onMounted(() => {
      if(props.callEmitterOnMount) {
        onChange();
      }
    });

    const onChange = () => {
      emit('onChange', innerValue.value);
    };

    return {
      onChange,
      innerValue
    };
  }
};
</script>
