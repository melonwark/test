<template>
  <div
    ref="chatContainer"
    :style="{ height: chatHeight + 'px' }"
    id="chat"
    class="tf-chat"
    :class="{'has-dialog-list' : hasAdminDialogList}"
  >
    <dialog-list
      ref="dialogList"
      v-if="hasAdminDialogList"
    >
      <template #create-dialog-btn-icon>
        <slot name="create-dialog-btn-icon" />
      </template>
      <template #dialog-list-item-avatar>
        <slot name="dialog-list-item-avatar" />
      </template>
    </dialog-list>
    <div class="tf-message-list-container">
      <message-list>
        <template #message-avatar>
          <slot name="message-avatar" />
        </template>
        <template #message-avatar-reverse>
          <slot name="message-avatar-reverse" />
        </template>
        <template #message-is-read>
          <slot name="message-is-read" />
        </template>
      </message-list>
      <chat-input
        :class="{'has-dialog-list' : hasAdminDialogList}"
      >
        <template #send-msg-btn-icon>
          <slot name="send-msg-btn-icon" />
        </template>
      </chat-input>
    </div>
  </div>
</template>

<script lang="ts">

import { onMounted, ref, provide, defineComponent, onUnmounted, type PropType } from 'vue';
import MessageList from '@/components/chat/MessageList/MessageList.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import DialogList from '@/components/chat/DialogList/DialogList.vue';

export default defineComponent({
  name: 'TFChat',
  components: {
    DialogList,
    MessageList,
    ChatInput,
  },

  props: {
    hasAdminDialogList: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Object as PropType<{[key: string]: number}>,
      required: true,
    },
    dialogId: {
      type: [String, Number],
      default: undefined,
    },
    userRole: {
      type: [String, Number],
      default: undefined
    },
    apiUrl: {
      type: String,
      required: true,
    }
  },

  setup(props) {
    const chatHeight = ref(0);
    const chatContainer = ref<HTMLDivElement | null>(null);

    // PROPS
    provide('dialogId', props.dialogId);
    provide('chatHeight', chatHeight);
    provide('userRole', props.userRole);
    provide('hasAdminDialogList', props.hasAdminDialogList);
    provide('apiUrl', props.apiUrl);
    provide('roles', props.roles);

    const setHeight = () => {
      if (!chatContainer.value) return;

      const height = (window.innerHeight || window.screen.height) - 1;
      chatHeight.value = height - chatContainer.value.getBoundingClientRect().top - 20;
    };

    onMounted(() => {
      setHeight();
      window.addEventListener('resize', setHeight);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', setHeight);
    });

    return {
      chatContainer,
      chatHeight,
      // for tests
      setHeight
    };
  }
});
</script>
