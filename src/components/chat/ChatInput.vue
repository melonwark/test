<template>
  <div
    v-if="visible"
    class="tf-chat-input"
  >
    <div
      class="tf-chat-input__inner"
    >
      <textarea
        data-cy="message_text"
        data-test="message_text"
        ref="textareaRef"
        placeholder="Write your message!"
        class="tf-chat-input__textarea"
        v-model.trim="inputValue"
        :disabled="disabled"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.shift.enter.prevent="handleShiftEnter"
      />
      <div class="tf-chat-input__btn-container">
        <button
          data-cy="send_message"
          data-test="send_message"
          type="button"
          class="tf-chat-input__btn"
          :disabled="disabled"
          @click="sendMessage"
        >
          <slot name="send-msg-btn-icon">
          </slot>
        </button>
      </div>
    </div>
    <div class="tf-chat-input__prompt">
      Press Shift+Enter to create a new line
    </div>
  </div>
</template>

<script lang="ts">
import { inject, ref, onMounted, defineComponent, useTemplateRef } from 'vue';
import eventBus from '@/utils/eventBus.js';
export default defineComponent({
  name: 'TFChatInput',

  setup() {
    const hasAdminDialogList = inject('hasAdminDialogList');
    const inputValue = ref('');
    const visible = ref(!hasAdminDialogList);
    const disabled = ref(false);
    const textareaRef = useTemplateRef<HTMLTextAreaElement | null>('textareaRef');

    onMounted(() => {
      eventBus.$on('chatGetDialog', (id: number) => {
        visible.value = !!id;
        inputValue.value = '';
      });
    });

    const sendMessage = () => {
      if(inputValue.value) {
        eventBus.$emit('chatSendMessage', inputValue.value);
        textareaRef.value?.focus();
        inputValue.value = '';
      }
    };

    const handleShiftEnter = () => {
      inputValue.value += '\n';
    };

    return {
      inputValue,
      disabled,
      sendMessage,
      visible,
      handleShiftEnter,
      textareaRef
    };
  }
});
</script>
