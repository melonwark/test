<template>
  <ul
    ref="dialogListContainer"
    data-cy="all_dialogs"
    class="tf-dialog-list"
    :class="{'tf-dialog-list_scrollable': dialogList.length <= 1}"
  >
    <create-dialog
      ref="create_dialog"
      @newDialogCreated="newDialogCreated"
    />
    <li class="tf-dialog-list__header">
      <dialog-search
        @search="searchDialog"
        :value="searchInputValue"
      />
      <button
        data-cy="create_dialog"
        data-test="create_dialog"
        v-tooltip.top="'Create Dialog'"
        @click="openCreateDialogModal()"
        class="tf-dialog-list__create-btn"
      >
        <slot name="create-dialog-btn-icon">
        </slot>
      </button>
    </li>
    <dialog-item
      :data-cy="`dialog_${index}`"
      :data-test="`dialog_${index}`"
      v-for="(dialog, index) in dialogList"
      :key="index"
      :id="`dialog_${dialog.id}`"
      :data="dialog"
      :class="{'active': dialog.id === activeDialogId}"
      @select="selectDialog"
    >
      <template #dialog-list-item-avatar>
        <slot name="dialog-list-item-avatar" />
      </template>
    </dialog-item>
    <li
      v-if="!dialogList.length"
      class="tf-dialog-list__prompt"
    >
      No elements found. Consider changing the search query.
    </li>
    <li
      v-if="dialogList.length === 1"
      class="tf-dialog-list__prompt"
    >
      Clear search field to load all dialogs
    </li>
  </ul>
</template>

<script lang="ts">
import axios from 'axios';
import {
  defineComponent,
  inject,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue';

import eventBus from '@/utils/eventBus.js';
import DialogItem from '@/components/chat/DialogList/DialogItem.vue';
import DialogSearch from '@/components/chat/DialogList/DialogSearch.vue';
import CreateDialog from '@/components/chat/DialogList/CreateDialog.vue';

type TDialog = {
  id: number;
  partner_external_id: string;
}

export default defineComponent({
  props: {
    dataCy: {
      type: String,
      default: ''
    }
  },
  name: 'TFDialogList',
  components: { DialogItem, DialogSearch, CreateDialog },

  setup() {

    const dialogList = ref<TDialog[]>([]);
    const dialogListContainer = ref<HTMLDivElement | null>(null);
    const activeDialogId = ref<number | null>(null);
    const currentPage = ref(1);
    const pageCount = ref(1);
    const searchInputValue = ref('');
    const dialogId = inject('dialogId', '');
    const apiUrl = inject('apiUrl');
    const roles = inject<{ [key: string]: number }>('roles', {});


    onBeforeMount(() => {
      if (dialogId) {
        getDialogById(dialogId);
      } else {
        getDialogList().then(res => {
          dialogList.value = res.data.data;
        });
      }
    });

    onMounted(() => {
      if (dialogListContainer.value) {
        dialogListContainer.value.addEventListener('scroll', loadDialogs);
      }

      window.addEventListener('popstate', handlePopstate);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopstate);
    });

    const handlePopstate = (event: PopStateEvent) => {
      if (!event.state?.ext_id) {
        activateDialog(null);
      }

      if (dialogList.value.findIndex(({ id }) => id === event.state?.dialog_id) >= 0) {
        activateDialog(event.state?.dialog_id);
        scrollToDialog(event.state?.dialog_id);
      } else {
        getDialogById(event.state?.dialog_id);
      }
    };

    const selectDialog = (dialog: TDialog) => {

      activateDialog(dialog.id);
      const path = `/admin/support/${dialog.partner_external_id}`;

      window.history.pushState(
        { dialog_id: dialog.id, ext_id: dialog.partner_external_id },
        '',
        `${path}`
      );
    };

    const getDialogList = async (val?: string) => {
      const res = await axios.get(`${apiUrl}/admin/support/dialogs`,
        {
          params: {
            q: val || null,
            page: currentPage.value
          }
        }
      );

      pageCount.value = res.data.meta.last_page;

      return res;
    };

    const loadDialogs = () => {

      if(dialogListContainer.value) {
        const { scrollHeight, scrollTop, clientHeight } = dialogListContainer.value;

        if (
          scrollHeight - Math.round(scrollTop) === clientHeight
            && currentPage.value < pageCount.value
        ) {
          ++currentPage.value;
          getDialogList().then(res => {
            dialogList.value = [...dialogList.value, ...res.data.data];
          });
        }
      }
    };

    const searchDialog = (val: string) => getDialogList(val).then(res => {
      dialogList.value = res.data.data;
      pageCount.value = res.data.meta.last_page;
      currentPage.value = 1;
      if (!val) {
        window.history.pushState({}, '', '/admin/support/');
        activateDialog(null);
      }
    });

    const newDialogCreated = (id: string|number) => {
      getDialogById(id);
    };

    const openCreateDialogModal = () => {
      eventBus.$emit('openCreateDialogModal');
    };

    const getDialogById = (id: string|number) => {
      if (id) {
        axios.get(`${apiUrl}/admin/support/dialogs/${id}`).then(res => {
          searchInputValue.value = res.data.data.creator.role_id === roles.partner
            ? res.data.data.creator.login
            : res.data.data.recipient.login;
          selectDialog(res.data.data);
          dialogList.value = [res.data.data];

        }).catch(e => e);
      }
    };

    const scrollToDialog = (id: number) => {
      if (id) {
        nextTick(() => {
          const dialog = document.getElementById(`dialog_${id}`);

          if (dialog) {
            dialog.scrollIntoView({ block: 'center', behavior: 'auto' });
          }
        });
      }
    };

    const activateDialog = (id: number | null) => {
      if (id) {
        activeDialogId.value = id;
        eventBus.$emit('chatGetDialog', id);
      } else {
        activeDialogId.value = null;
        eventBus.$emit('chatGetDialog', null);
      }
    };

    return {
      dialogList,
      newDialogCreated,
      searchDialog,
      searchInputValue,
      dialogListContainer,
      openCreateDialogModal,
      activeDialogId,
      selectDialog,
      //for test
      loadDialogs,
      currentPage,
      pageCount,
      getDialogById,
      scrollToDialog
    };
  }
});
</script>
