<template>
  <TFModal
    disabled-parent
    ref="createDialogModal"
    @modalClosedEvent="clearFields()"
  >
    <template #modal-title>
      Create new dialog
    </template>

    <template #modal-body>
      <TFMultiselect
        data-cy="receiver_of_dialog"
        ref="partnerSearch"
        searchable
        :autocomplete="`${apiUrl}/autocomplete/users`"
        placeholder="Choose recipient"
        close-on-select
        :max-height="150"
        :options="options"
        hide-selected
        event-bus-emitter="chatCreateDialogRecipientSelected"
        container-class="form-field has-label"
        :value="null"
      />
      <div style="padding-top: 1rem">
        <div class="rendered form-field">
          <textarea
            data-cy="message_input"
            data-test="message_input"
            placeholder="Message Text"
            id="newDialogText"
            rows="5"
            v-model="text"
            class="tf-textarea"
          />
          <label class="label">Message Text</label>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <button
        data-cy="submit_new_dialog"
        data-test="submit_new_dialog"
        :disabled="!partnerId || !text"
        class="tf-btn tf-btn-md tf-btn-default"
        @click="createDialog()"
      >
        Create Dialog
      </button>
    </template>
  </TFModal>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, inject, onMounted, ref } from 'vue';
import eventBus from '@/utils/eventBus.js';
import TFMultiselect from '@/components/form/TFMultiselect.vue';
import TFModal from '@/components/ui/TFModal.vue';

export default defineComponent({
  name: 'TFCreateDialog',
  components: {
    TFModal,
    TFMultiselect
  },

  setup(props, { emit }) {
    const options = ref([]);
    const multiselectKey = ref(0);
    const partnerId = ref<number|undefined>(undefined);
    const text = ref('');
    const createDialogModal = ref<InstanceType<typeof TFModal> | null>(null);
    const partnerSearch = ref<InstanceType<typeof TFMultiselect> | null>(null);
    const apiUrl = inject('apiUrl');


    onMounted(() => {
      eventBus.$on('openCreateDialogModal', () => {
        axios.get(`${apiUrl}/autocomplete/users?q=`).then(res => {
          options.value = res.data;
          createDialogModal.value?.openModal();
        });
      });

      eventBus.$on('chatCreateDialogRecipientSelected', (val: number) => {
        partnerId.value = val;
      });
    });

    const createDialog = () => {
      if (partnerId.value && text.value) {
        axios.post(`${apiUrl}/admin/support/dialogs`,
          {
            partner_id: partnerId.value,
            text: text.value,
          }
        ).then(res => {
          emit('newDialogCreated', res.data.dialog_id);
          createDialogModal.value?.closeModal();
        });
      }
    };

    const clearFields = () => {
      text.value = '';
      partnerSearch.value?.clear();
      partnerId.value = undefined;
    };

    return {
      options,
      multiselectKey,
      text,
      partnerId,
      createDialogModal,
      partnerSearch,
      createDialog,
      clearFields,
      apiUrl
    };
  }
});
</script>
