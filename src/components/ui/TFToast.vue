<template>
  <notifications
    data-test="notification"
    :group="group"
    :position="position"
    :animation-name="animationName"
    :width="width"
    :duration="duration"
    :speed="speed"
    :classes="[classes, 'tf-toast']"
    :pause-on-hover="pauseOnHover"
    :close-on-click="closeOnClick"
    :max="max"
    :reverse="reverse"
    :ignore-duplicates="ignoreDuplicates"
    :dangerously-set-inner-html="dangerouslySetInnerHtml"
    @destroy="destroy"
  />
</template>

<script lang="ts">

import {  useNotification, Notifications } from '@kyvg/vue3-notification';
import { computed, onMounted, type PropType } from 'vue';
const { notify } = useNotification();

type TPropsToastType = 'success' | 'error' | 'info' | 'warn';
export default {
  name: 'TFToast',
  components: { Notifications },
  props: {
    toastType: {
      type: String as () => TPropsToastType,
      default: 'success'
    },
    text: {
      type: [String, Object] as PropType<string | {[key:string]: string[]}>,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top right'
    },
    group: {
      type: String,
      default: ''
    },
    animationName: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: '350'
    },
    duration: {
      type: Number,
      default: 3000
    },
    speed: {
      type: Number,
      default: 500
    },
    max: {
      type: Number,
      default: 10
    },
    reverse: {
      type: Boolean,
      default: false
    },
    pauseOnHover: {
      type: Boolean,
      default: false
    },
    ignoreDuplicates: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: false
    },
    dangerouslySetInnerHtml: {
      type: Boolean,
      default: false
    },
    isForm: {
      type: Boolean,
      default: false
    },
  },

  setup(props, { emit }) {
    onMounted(() => {
      if (props.isForm) {
        const prepareText = computed(() => {
          return typeof props.text === 'string'
            ? props.text
            : Object.values(props.text)
              .flat()
              .join('<br/>');
        });

        notify({
          group: props.group,
          type: props.toastType,
          text: prepareText.value,
          title: props.title,
        });
      }
    });

    const destroy = () => {
      emit('destroy');
    };

    return {
      destroy
    };
  },
};
</script>
