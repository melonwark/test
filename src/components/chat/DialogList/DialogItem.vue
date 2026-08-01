<template>
  <li
    :data-cy="dataCy"
    :data-test="`dialog_item_${id}`"
    class="tf-dialog-item"
    @click="clickHandler()"
    :id="id"
  >
    <slot name="dialog-list-item-avatar">
    </slot>
    <div class="tf-dialog-item__main">
      <h6
        data-cy="partner_name"
        data-test="partner_name"
        class="tf-dialog-item__title"
      >
        {{ dialogName }}
      </h6>
      <p
        data-cy="last_message"
        data-test="last_message"
        class="tf-dialog-item__message"
      >
        {{ data.last_message ? data.last_message.text : 'No messages' }}
      </p>
    </div>
    <div class="tf-dialog-item__info">
      <counter
        data-cy="unread_message_counter"
        data-test="unread_message_counter"
        class="tf-dialog-item__counter"
        v-if="unreadCount"
        :message-count="unreadCount"
      />
      <div
        data-cy="last_date"
        data-test="last_date"
        class="tf-dialog-item__date"
      >
        {{ data.last_message ? formatDate(data.last_message.created_at) : '' }}
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import eventBus from '@/utils/eventBus.js';
import Counter from '@/components/chat/Counter.vue';

export default defineComponent({
  name: 'TFDialogItem',
  components: { Counter },
  props: {
    dataCy: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      required: true,
    }
  },

  setup(props, { emit }) {
    const unreadCount = ref(0);

    onMounted(() => {
      unreadCount.value = props.data?.unread_messages_count;
      eventBus.$on('chatMessagesRead',
        ({ dialogId, countOfRead }: { dialogId: number; countOfRead: number })  => {
          if (dialogId === props.data.id) {

            unreadCount.value = unreadCount.value >= countOfRead
              ? unreadCount.value - countOfRead
              : 0;
          }
        });
    });

    const formatDate = (dateString: string) => dateString
      .slice(0, 16)
      .replace(/-/g, '.')
      .replace('T', ' ');

    const clickHandler = () => {
      emit('select', props.data);
    };

    const dialogName = computed(
      () => (props.data.creator.role_id !== 3
        ? props.data.recipient.login
        : props.data.creator.login)
    );

    return {
      formatDate,
      clickHandler,
      dialogName,
      unreadCount
    };
  }
});
</script>
