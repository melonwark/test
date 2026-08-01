import { mount } from '@vue/test-utils';
import TFModal from '@/components/ui/TFModal.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';
import eventBus from '@/utils/eventBus';

type TFModalProps = {
  modalId?: string;
  event?: string;
  modalWidth?: string;
  closingOnlyWithButtons?: boolean;
  modalContainerClasses?: string;
  modalBodyClasses?: string;
  modalFooterClasses?: string;
  modalHeaderClasses?: string;
  modalMaskClasses?: string;
  isOpen?: boolean;
}

const initialProps: TFModalProps = {
  modalId: 'modalId',
  isOpen: true
};

describe('TFModal', () => {
  const mountFactory = async (props: TFModalProps,  options: object) => {
    return mount(TFModal, {
      global: {
        stubs: {
          teleport: true
        }
      },
      props: {
        ...initialProps,
        ...props,
      },
      ...options
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render slots', async () => {
    const wrapper = await mountFactory({}, {
      slots: {
        'modal-title': '<span>Test Modal</span>',
        'modal-body': '<p>Modal Content</p>',
      },
    });

    expect(wrapper.find('.tf-modal-title').text()).toBe('Test Modal');
    expect(wrapper.find('.tf-modal-body').text()).toBe('Modal Content');

    wrapper.unmount();
  });

  it('should be visible when openModal() is called', async () => {
    const wrapper = await mountFactory({ isOpen: false }, {});

    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(false);

    wrapper.vm.openModal();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').isVisible()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    wrapper.unmount();
  });

  it('should be hidden when closeModal() is called', async () => {
    const wrapper = await mountFactory({}, {});

    wrapper.vm.openModal();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').isVisible()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    wrapper.vm.closeModal();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(false);
    expect(document.body.style.overflow).not.toBe('hidden');

    wrapper.unmount();
  });

  it('should close when clicking overlay if closingOnlyWithButtons is false', async () => {
    const wrapper = await mountFactory({
      closingOnlyWithButtons: false
    }, {});

    wrapper.vm.openModal();

    await wrapper.vm.$nextTick();
    await wrapper.find('[data-test="modal-mask"]').trigger('mousedown');

    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(false);

    wrapper.vm.openModal();
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="modal-container"]').trigger('mousedown');


    expect(wrapper.find('[data-test="modal-container"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('should not close when clicking overlay if closingOnlyWithButtons is true', async () => {
    const wrapper = await mountFactory({
      closingOnlyWithButtons: true
    }, {});

    wrapper.vm.openModal();

    await wrapper.find('[data-test="modal-mask"]').trigger('mousedown');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').isVisible()).toBe(true);

    wrapper.unmount();
  });

  it('should not close modal when touchstart inside modal content', async () => {
    const wrapper = await mountFactory({
      closingOnlyWithButtons: false
    }, {});

    wrapper.vm.openModal();

    await wrapper.find('[data-test="modal-mask"]').trigger('touchstart');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('should emit modalOpenedEvent and modalClosedEvent', async () => {
    const wrapper = await mountFactory({}, {});

    wrapper.vm.openModal();
    expect(wrapper.emitted()).toHaveProperty('modalOpenedEvent');

    wrapper.vm.closeModal();
    expect(wrapper.emitted()).toHaveProperty('modalClosedEvent');

    wrapper.unmount();
  });

  it('should not handle event if modalId does not match', async () => {
    const wrapper = await mountFactory({
      modalId: 'modal-1',
      event: 'event-bus-event',
    }, {});

    eventBus.$emit('event-bus-event', { modalId: 'modalId', action: 'openModal' });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(true);

    wrapper.unmount();
  });

  it('should react to eventBus events', async () => {

    const wrapper = await mountFactory({
      event: 'event-bus-event',
      modalId: 'modalId'
    }, {
      slots: {
        'modal-body': '<div>params1 - {{ params.params.data?.key }}</div>',
      },
    });

    eventBus.$emit('event-bus-event', {
      modalId: 'modalId',
      action: 'openModal',
      data: {
        key: 'value',
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.tf-modal-body').html()).toContain('<div>params1 - value</div>');
    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(true);

    eventBus.$emit('event-bus-event', { modalId: 'modalId', action: 'closeModal' });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="modal-mask"]').exists()).toBe(false);

    wrapper.unmount();
  });

});
