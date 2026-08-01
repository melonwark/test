import { flushPromises, mount } from '@vue/test-utils';
import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest';
import axios from 'axios';
import TFModal from '@/components/ui/TFModal.vue';
import CreateDialog from '@/components/chat/DialogList/CreateDialog.vue';
import eventBus from '@/utils/eventBus';

describe('TFCreateDialog', () => {
  const mountFactory = async () => {
    return mount(CreateDialog, {
      global: {
        provide: {
          apiUrl: 'https://test.com',
        }
      }
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should open the modal when "openCreateDialogModal" event is emitted', async () => {

    vi.spyOn(axios, 'get').mockResolvedValueOnce(
      { data: [{ id: 1, name: 'User 1' }] }
    );

    const wrapper = await mountFactory();

    eventBus.$emit('openCreateDialogModal');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.options).toEqual([{ id: 1, name: 'User 1' }]);
    expect(axios.get).toHaveBeenCalledWith('https://test.com/autocomplete/users?q=');
  });

  it('should update partnerId when recipient is selected', async () => {
    const wrapper = await mountFactory();

    eventBus.$emit('chatCreateDialogRecipientSelected', 123);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.partnerId).toBe(123);
  });

  it('should disable the "Create Dialog" button if text or recipient is not selected', async () => {
    const wrapper = await mountFactory();
    const modal = wrapper.findComponent(TFModal);

    modal.vm.openModal();
    await wrapper.vm.$nextTick();

    const button = wrapper.find('[data-test="submit_new_dialog"]');

    expect(button.attributes('disabled')).not.toBeUndefined();

    await flushPromises();

    wrapper.vm.partnerId = 123;
    wrapper.vm.text = 'test';

    await wrapper.vm.$nextTick();

    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('should send request and emit event when creating dialog', async () => {

    vi.spyOn(axios, 'post').mockResolvedValue({ data: { dialog_id: 999 } });
    const wrapper = await mountFactory();

    const modal = wrapper.findComponent(TFModal);
    modal.vm.openModal();
    await flushPromises();

    wrapper.vm.partnerId = 123;
    wrapper.vm.text = 'test message';
    await wrapper.vm.$nextTick();

    const button = wrapper.find('[data-test="submit_new_dialog"]');
    await button.trigger('click');

    expect(axios.post).toHaveBeenCalledWith('https://test.com/admin/support/dialogs', {
      partner_id: 123,
      text: 'test message',
    });
  });

  it('should clear text and reset partnerId when clearFields is called', async () => {
    const wrapper = await mountFactory();

    wrapper.vm.partnerId = 123;
    wrapper.vm.text = 'text';

    wrapper.vm.clearFields();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.partnerId).toBeUndefined();
    expect(wrapper.vm.text).toBe('');
  });

  it('should update `text` when user types in textarea', async () => {
    const wrapper = await mountFactory();


    const modal = wrapper.findComponent(TFModal);
    modal.vm.openModal();
    await flushPromises();

    const textarea = wrapper.find('[data-test="message_input"]');

    await textarea.setValue('new message');

    expect(wrapper.vm.text).toBe('new message');
  });
});
