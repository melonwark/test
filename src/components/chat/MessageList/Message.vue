<template>
  <div
    class="tf-chat-message-container"
    :class="{ unread: !messageData.is_read_by_current_user }"
  >
    <div
      class="tf-chat-message-container__inner"
      :class="{ reverse: (isAuthor && !isPartner) || isAuthor }"
    >
      <div class="tf-chat-message">
        <div class="tf-chat-message__main">
          <slot
            v-if="(isAuthor && !isPartner) || isAuthor"
            name="message-avatar"
          >
          </slot>
          <slot
            v-else
            name="message-avatar-reverse"
          >
          </slot>
          <div
            :data-cy="dataCy"
            class="tf-chat-message__content"
          >
            <div
              data-cy="message_author"
              class="tf-chat-message__author"
            >
              {{ messageData.author_name }}
            </div>
            <div class="tf-chat-message__message">
              <div
                data-cy="delete_msg_btn"
                data-test="delete_msg_btn"
                v-if="authorIsAdmin(messageData.author_role_id) && !isPartner"
                class="tf-chat-message__remove-btn"
                @click="removeMessage(messageData.id)"
              >
                ×
              </div>
              <span class="tf-chat-message__text">
                {{ messageData.text.trim() }}
              </span>
            </div>
          </div>
        </div>
        <div class="tf-chat-message__other">
          <span>{{ formatDate(messageData.created_at) }}</span>
          <span
            v-if="messageData.is_read_by_partner && messageData.current_user_is_author"
            class="tf-message-check tf-chat-message__read"
          >
            <slot name="message-is-read"></slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'TFMessage',

  props: {
    dataCy: {
      type: String,
      default: '',
    },
    messageData: {
      type: Object,
      default: () => ({}),
    }
  },

  setup(props, { emit }) {
    const userRole = inject('userRole');
    const roles = inject<{[key: string]: number}>('roles', {});

    const isPartner = computed(() => [Number(roles.partner), Number(roles.master)]
      .includes(Number(userRole))
    );
    const isAuthor = computed(() => props.messageData.current_user_is_author);

    const formatDate = (dateString: string) => dateString
      .slice(0, 16)
      .replace(/-/g, '.')
      .replace('T', ' ');

    const removeMessage = (id: number) => {
      emit('removeMessage', id);
    };

    const authorIsAdmin = (author_role_id: number) => ![Number(roles.partner), Number(roles.master)]
      .includes(author_role_id);

    return {
      isPartner,
      isAuthor,
      formatDate,
      removeMessage,
      authorIsAdmin,
    };
  },
});
</script>
