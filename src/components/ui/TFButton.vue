<template>
  <button
    :data-submit-disabled="disabledSetOfButtons"
    type="button"
    :class="classes"
    :disabled="isDisabled"
    @click="action"
    class="rendered"
    :data-cy="props.dataCy"
  >
    <template v-if="content">
      {{ content }}
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed, defineComponent, watch } from 'vue';
import axios from 'axios';
import eventBus from '@/utils/eventBus';
import isTruthy from '@/utils/isTruthy';

type TPropsType = 'submit' | 'reset' | 'request';
type TPropsVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'plain';
type TPropsSize = 'sm' | 'md' | 'lg';

export default defineComponent({
  name: 'TFButton',
  props: {
    actionType: { type: String as () => TPropsType, default: '' },
    requestOptions: {
      type: Object as () => {
        method: string;
        url: string;
        params?: string | object;
        data?: string | object | FormData;
      },
      default: () => ({ method: '', url: '' })
    },
    requestEmitter: { type: String, default: '' },
    requestSuccessEmitter: { type: String, default: '' },
    requestFailureEmitter: { type: String, default: '' },
    requestFinallyEmitter: { type: String, default: '' },
    defaultClickEmitter: {
      type: Object,
      default: () => ({
        event: '',
        params: {}
      })
    },
    reloadAfterAction: { type: Boolean, default: false },
    reloadAfterActionAndFail: { type: Boolean, default: false },
    confirmAction: { type: Boolean, default: false },
    confirmMessage: { type: String, default: '' },
    formName: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    disabledSetOfButtons: { type: Boolean, default: false },
    disableEventListener: { type: String, default: '' },
    clearEmitter: { type: String, default: 'clearReportFilters' },
    variant: { type: String as () => TPropsVariant, default: 'default' },
    outline: { type: Boolean, default: false },
    size: { type: String as () => TPropsSize, default: 'md' },
    dataCy: { type: String, default: '' },
    content: { type: String, default: '' },
  },

  setup(props, { emit }) {
    const isDisabledBtn = ref(props.disabled);

    const isDisabled = computed(() => isDisabledBtn.value);

    const classes = computed(() => [
      'tf-btn',
      `tf-btn-${props.size}`,
      props.outline ? `tf-btn-${props.variant}-outline` : `tf-btn-${props.variant}`,
    ]);

    onMounted(() => {
      eventBus.$on(props.disableEventListener, (val: unknown) => {
        isDisabledBtn.value = !isTruthy(val);
      });
      document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      eventBus.$off(props.disableEventListener);
      document.removeEventListener('keydown', handleKeyDown);
    });

    watch(() => props.disabled, val => {
      isDisabledBtn.value = val;
    });

    const handleKeyDown = (e: KeyboardEvent) => {

      if (props.actionType !== 'submit' || !props.formName) return;
      if (e.key !== 'Enter') return;

      const target = e.target as HTMLElement;

      const isInput= target.tagName === 'INPUT';

      if (!isInput || isDisabled.value) return;

      const formEl = target.closest('form');

      if (formEl && formEl.getAttribute('name') === props.formName) {
        e.preventDefault();
        action();
      }
    };

    const callAction = async () => {
      switch (props.actionType) {
        case 'request':
          await request();
          break;
        case 'reset':
          reset();
          break;
        default:
          defaultClick();
      }
    };

    const defaultClick = () => {
      if (props.defaultClickEmitter.event) {
        eventBus.$emit(props.defaultClickEmitter.event, props.defaultClickEmitter.params);
      }
      emit('click-action');
    };

    const formSubmit = () => {
      isDisabledBtn.value = true;
      if (props.disabledSetOfButtons) setButtonsDisabled(true);

      const form = document.querySelector<HTMLFormElement>(`form[name="${props.formName}"]`);

      if (!form) return;


      if (!form.checkValidity()) {
        form.reportValidity();
        isDisabledBtn.value = false;
        return;
      }

      if (props.confirmAction) {
        window.confirmation(() =>
          form?.submit(),
        () => { isDisabledBtn.value = false; },
        props.confirmMessage
        );
      } else {
        form?.submit();
      }
    };

    const reset = () => {
      eventBus.$emit(props.clearEmitter);
      const form = document.querySelector<HTMLFormElement>(`form[name="${props.formName}"]`);
      form?.reset();
    };

    const request = async () => {
      if (props.requestEmitter) {
        eventBus.$emit(props.requestEmitter);
      }

      isDisabledBtn.value = true;
      if (props.disabledSetOfButtons) setButtonsDisabled(true);

      try {
        const res = await axios(props.requestOptions);

        if (props.requestSuccessEmitter) {
          eventBus.$emit(props.requestSuccessEmitter, res);
        }

        if (props.reloadAfterAction || props.reloadAfterActionAndFail) {
          setTimeout(() => window.location.reload(), 500);
        }
      } catch (error) {
        if (props.requestFailureEmitter) {
          eventBus.$emit(props.requestFailureEmitter, error);
        }

        if (props.reloadAfterActionAndFail) {
          setTimeout(() => window.location.reload(), 1000);
        }
      } finally {
        if (props.requestFinallyEmitter) {
          eventBus.$emit(props.requestFinallyEmitter);
        }
        isDisabledBtn.value = false;

        if (props.disabledSetOfButtons) setButtonsDisabled(false);
      }
    };

    const action = async () => {
      if (props.actionType === 'submit') {
        formSubmit();
      } else {
        await handleNonSubmitAction();
      }
    };

    const handleNonSubmitAction = async () => {
      if (props.confirmAction) {
        window.confirmation(() => callAction(), null, props.confirmMessage);
      } else {
        await callAction();
      }
    };

    const setButtonsDisabled = (state: boolean) => {
      document.querySelectorAll('[data-submit-disabled="true"]').forEach(el => {
        (el as HTMLButtonElement).disabled = state;
      });
    };

    return {
      props,
      isDisabled,
      isDisabledBtn,
      classes,
      action,
    };
  }
});
</script>
