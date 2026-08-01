<template>
  <div
    ref="messageListContainer"
    data-test="message_list_container"
    class="tf-message-list-container__inner"
  >
    <div
      ref="messages"
      data-test="messages"
      class="tf-message-list"
      :class="{'has-dialog-list' : hasAdminDialogList}"
    >
      <messages-list-preloader v-if="loading && dialogId" />
      <message
        v-else
        v-for="(message, index) in messageList"
        :data-cy="`messages_${index}`"
        :key="`${message.id}_${index}`"
        :message-data="message"
        @removeMessage="removeMessage"
      >
        <template #message-avatar>
          <slot name="message-avatar" />
        </template>
        <template #message-avatar-reverse>
          <slot name="message-avatar-reverse" />
        </template>
        <template #message-is-read>
          <slot name="message-is-read" />
        </template>
      </message>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import debounce from '@/utils/debounce';
import eventBus from '@/utils/eventBus.js';
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue';
import Message from '@/components/chat/MessageList/Message.vue';
import MessagesListPreloader from '@/components/chat/MessageList/MessagesListPreloader.vue';

type TMessage = {
  author_id: number;
  author_name: string|null;
  author_role_id: number;
  created_at: string;
  current_user_is_author: boolean;
  id: number;
  is_read_by_current_user: boolean;
  is_read_by_partner: boolean;
  text: string;
}

export default defineComponent({
  name: 'TFMessageList',
  components: {
    Message,
    MessagesListPreloader,
  },
  props: {
    dataCy: {
      type: String,
      default: ''
    },
  },

  setup() {
    const messageListContainer = ref<HTMLDivElement | null>(null);
    const messages = ref<HTMLDivElement | null>(null);
    const dialogId = ref<number|undefined>(undefined);
    const pageCount = ref(1);
    const currentPage = ref(1);
    const messageList = ref<TMessage[]>([]);
    const loading = ref(false);

    const hasAdminDialogList = inject('hasAdminDialogList');
    const userRole = inject('userRole');
    const apiUrl = inject('apiUrl');
    const roles = inject<{[key: string]: number}>('roles', {});

    const isPartner = computed(() => [Number(roles.partner), Number(roles.master)]
      .includes(Number(userRole)));

    onMounted(() => {
      if (messageListContainer.value) {
        messageListContainer.value.addEventListener('scroll', debounce(() => {
          loadMessages();
        }, 200));
      }

      if (hasAdminDialogList) {
        eventBus.$on('chatGetDialog', async (id: number) => {
          if (id) {
            loading.value = true;
            currentPage.value = 1;
            dialogId.value = id;
            const res = await getMessages(id);
            messageList.value = res.data.data.reverse();
            loading.value = false;
            scrollToMessage('auto');
          } else {
            messageList.value = [];
          }
        });
      } else {
        getMessages(dialogId.value).then(res => {
          messageList.value = res.data.data.reverse();
          scrollToMessage('auto');
        });
      }

      eventBus.$on('chatSendMessage', async (message: string) => {
        if (message) {
          currentPage.value = 1;

          await axios.post(
            isPartner.value
              ? `${apiUrl}/support/messages`
              : `${apiUrl}/admin/support/dialogs/${dialogId.value}/messages`,
            { text: message }
          );

          const res = await getMessages(dialogId.value);
          messageList.value = res.data.data.reverse();

          if (messageList.value.length) {
            scrollToMessage('smooth');
          }
        }
      });
    });

    watch(messageList, newVal => {
      if (newVal.length) {
        const target = newVal.filter(({ is_read_by_current_user }) => !is_read_by_current_user);
        eventBus.$emit(
          'chatMessagesRead',
          { dialogId: dialogId.value, countOfRead: target.length }
        );
      }
    });

    const removeMessage = (messageId: number) => {
      window.confirmation(
        () => axios.delete(`${apiUrl}/admin/support/dialogs/${dialogId.value}/messages/${messageId}`
        ).then(() => {
          messageList.value = messageList.value.filter(({ id }) => id !== messageId);
        }),
        null,
        'Are you sure you want to delete this message?'
      );
    };

    const getMessages = async (dialogId: number|undefined) => {
      const res = await axios.get(
        dialogId
          ? `${apiUrl}/admin/support/dialogs/${dialogId}/messages`
          : `${apiUrl}/support/messages/`,
        {
          params: {
            page: currentPage.value
          }
        }
      );
      pageCount.value = res.data.meta.last_page;

      return res;
    };

    const scrollToMessage = (behavior: ScrollBehavior) => {
      nextTick(() => {

        if (messages.value?.lastElementChild) {
          messages.value.lastElementChild.scrollIntoView({
            block: 'end',
            behavior: behavior,
          });
        }
      });
    };

    const loadMessages = () => {
      if (messageListContainer.value && messageListContainer.value.scrollTop === 0
        && currentPage.value < pageCount.value
        && messageList.value.length
      ) {
        const initialMessagesContainerHeight = messages.value?.offsetHeight || 0;
        ++currentPage.value;
        getMessages(dialogId.value)
          .then(res => { messageList.value = [...res.data.data.reverse(), ...messageList.value]; })
          .then(() => {
            const containerElement = messageListContainer.value!;
            const containerHeight = containerElement.offsetHeight;
            const contentHeight = messages.value!.offsetHeight;

            if (containerHeight && contentHeight > containerHeight) {
              containerElement.scrollBy(
                0,
                contentHeight - initialMessagesContainerHeight
              );
            }
          });
      }
    };

    onBeforeUnmount(() => {
      if (messageListContainer.value) {
        messageListContainer.value.removeEventListener('scroll', loadMessages);
      }
    });

    return {
      loading,
      dialogId,
      messageList,
      removeMessage,
      messageListContainer,
      messages,
      hasAdminDialogList,

      //for test

      getMessages,
      loadMessages
    };
  },
});
</script>
