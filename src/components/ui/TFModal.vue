<template>
  <Teleport
    :defer="defer"
    :disabled="disabledParent"
    :to="parent"
  >
    <transition
      appear
      name="modal"
    >
      <div
        ref="maskRef"
        data-test="modal-mask"
        v-if="showModal"
        class="tf-modal-mask"
        :class="modalMaskClasses"
        :id="modalId"
        @mousedown="handleClickOutside"
        @touchstart="handleClickOutside"
      >
        <div
          ref="containerRef"
          data-test="modal-container"
          class="tf-modal-container"
          :style="{ 'max-width': modalWidth }"
        >
          <div
            data-test="modal"
            class="tf-modal"
            :class="modalContainerClasses"
          >
            <div
              data-test="modal-header"
              class="tf-modal-header"
              :class="modalHeaderClasses"
            >
              <slot
                data-test="modal-header-content"
                name="modal-header-content"
                :params="eventParams"
              >
                <h4
                  data-test="modal-title"
                  class="tf-modal-title"
                >
                  <slot
                    name="modal-title"
                    :params="eventParams"
                  />
                </h4>
              </slot>
              <button
                data-test="modal-close"
                type="button"
                v-if="!closingOnlyWithButtons"
                @click="closeModal"
                aria-hidden="true"
                class="tf-modal-close"
              >
                <slot
                  data-test="modal-close-icon"
                  name="modal-close-icon"
                  :params="eventParams"
                >
                  ×
                </slot>
              </button>
            </div>
            <div
              class="tf-modal-body"
              :class="modalBodyClasses"
            >
              <slot
                name="modal-body"
                :params="eventParams"
              />
            </div>
            <div
              class="tf-modal-footer"
              :class="modalFooterClasses"
            >
              <slot
                name="modal-footer"
                :params="eventParams"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts">

import eventBus from '@/utils/eventBus.js';
import { onMounted, onUnmounted, ref } from 'vue';

type TParams = {
  modalId: string | number;
  action?: string
}
export default {
  name: 'TFModal',
  props: {
    modalId: {
      type: String,
      default: 'modal'
    },
    event: {
      type: String,
      default: ''
    },
    modalWidth: {
      type: String,
      default: '500px'
    },
    closingOnlyWithButtons: {
      type: Boolean,
      default: false
    },
    modalContainerClasses: {
      type: String,
      default: ''
    },
    modalBodyClasses: {
      type: String,
      default: ''
    },
    modalFooterClasses: {
      type: String,
      default: ''
    },
    modalHeaderClasses: {
      type: String,
      default: ''
    },
    modalMaskClasses: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    parent: {
      type: String,
      default: 'body'
    },
    defer: {
      type: Boolean,
      default: false
    },
    disabledParent: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showModal = ref(props.isOpen);
    const eventParams = ref({});
    const maskRef = ref<HTMLElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);

    const handleEventBus = (params: TParams) => {
      if (params.modalId !== props.modalId) return;
      eventParams.value = params;

      switch (params.action) {

        case 'openModal':
          openModal();
          break;

        case 'closeModal':
          closeModal();
          break;
      }
    };

    const toggleBodyScroll = (disable: boolean) => {
      if (disable) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight =
          `${window.innerWidth - document.documentElement.clientWidth}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };

    const openModal = () => {
      showModal.value = true;
      toggleBodyScroll(true);
      emit('modalOpenedEvent');
    };

    const closeModal = () => {
      showModal.value = false;
      toggleBodyScroll(false);
      emit('modalClosedEvent');
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (props.closingOnlyWithButtons) return;

      const target = e.target as HTMLElement;

      if (target === maskRef.value || target === containerRef.value) {
        closeModal();
      }
    };

    onMounted(() => {
      eventBus.$on(props.event, handleEventBus);
    });

    onUnmounted(() => {
      eventBus.$off(props.event, handleEventBus);
    });

    return {
      maskRef,
      containerRef,
      showModal,
      handleClickOutside,
      closeModal,
      openModal,
      eventParams,
    };
  }
};
</script>
