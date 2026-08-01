import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ChatInput from '@/components/chat/ChatInput.vue';
import eventBus from '@/utils/eventBus.js';
import { nextTick } from 'vue';

describe('TFChatInput.vue', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountFactory = async (options: object) => {
    return mount(ChatInput, {
      props: {},
      ...options
    });
  };

  it('should be visible when hasAdminDialogList is false', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });

    expect(wrapper.isVisible()).toBe(true);
  });

  it('should not be visible when hasAdminDialogList is true', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        }
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.isVisible()).toBe(false);

    wrapper.unmount();
  });

  it('should update inputValue when typing in textarea', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });
    const textarea = wrapper.find('[data-test="message_text"]');
    await textarea.setValue('Test message');

    expect(wrapper.vm.inputValue).toBe('Test message');

    wrapper.unmount();
  });

  it('should emit chatSendMessage event when send button is clicked', async () => {
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });

    const sendButton = wrapper.find('[data-test="send_message"]');
    const textarea = wrapper.find('[data-test="message_text"]');

    await textarea.setValue('Test message');
    await sendButton.trigger('click');

    expect(eventBus.$emit).toHaveBeenCalledWith('chatSendMessage', 'Test message');

    wrapper.unmount();
  });

  it('should focus the textarea and clear inputValue after sendMessage', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });

    const sendButton = wrapper.find('[data-test="send_message"]');
    const textarea = wrapper.find('[data-test="message_text"]');
    const focusSpy = vi.spyOn(textarea.element as unknown as HTMLElement, 'focus');

    await textarea.setValue('Test message');
    await sendButton.trigger('click');
    await nextTick();

    expect(focusSpy).toHaveBeenCalled();
    expect(wrapper.vm.inputValue).toBe('');

    wrapper.unmount();
  });

  it('should append new line when Shift+Enter is pressed', async () => {

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });

    const textarea = wrapper.find('[data-test="message_text"]');

    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true });

    expect(wrapper.vm.inputValue).toBe('\n');

    wrapper.unmount();
  });

  it('should react to chatGetDialog event and reset inputValue', async () => {

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        }
      }
    });

    eventBus.$emit('chatGetDialog', 123);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.visible).toBe(true);
    expect(wrapper.vm.inputValue).toBe('');

    wrapper.unmount();
  });

  it('should react to chatGetDialog event and visible', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        }
      }
    });

    eventBus.$emit('chatGetDialog');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.visible).toBe(false);

    wrapper.unmount();
  });
});
