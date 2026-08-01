import { flushPromises, shallowMount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TFChat from '@/components/chat/TFChat.vue';
import MessageList from '@/components/chat/MessageList/MessageList.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import DialogList from '@/components/chat/DialogList/DialogList.vue';

type TFChatProps = {
  hasAdminDialogList: boolean,
  roles: { [key: string] : number },
  dialogId: string | number,
  userRole: string,
  apiUrl: string
}

const defaultProps = {
  hasAdminDialogList: false,
  roles: {
    admin: 1,
    super_admin: 2,
    partner: 3,
    manager: 5,
    master: 6
  },
  dialogId: '123',
  userRole: 'admin',
  apiUrl: 'https://api.example.com',
};

describe('TFChat.vue', () => {
  const shallowMountFactory = async (props: Partial<TFChatProps> = {}, options: object) => {
    return shallowMount(TFChat, {
      props: {
        ...defaultProps,
        ...props,
      },
      ...options
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without errors', async () => {
    const wrapper = await shallowMountFactory({},{});

    expect(wrapper.exists()).toBe(true);
  });

  it('should provide necessary values', async () => {
    const wrapper = await shallowMountFactory({},{});
    const windowHeight = window.innerHeight;
    const chatHeight = windowHeight - 21;

    expect(wrapper.vm.chatHeight).toBe(chatHeight);
  });

  it('should render DialogList when hasAdminDialogList is true', async () => {
    const wrapper = await shallowMountFactory({ hasAdminDialogList: true },{});

    expect(wrapper.findComponent(DialogList).exists()).toBe(true);
  });

  it('should not render DialogList when hasAdminDialogList is false', async () => {
    const wrapper = await shallowMountFactory({},{});

    expect(wrapper.findComponent(DialogList).exists()).toBe(false);
  });

  it('should contain MessageList and ChatInput components', async () => {
    const wrapper = await shallowMountFactory({},{});

    expect(wrapper.findComponent(MessageList).exists()).toBe(true);
    expect(wrapper.findComponent(ChatInput).exists()).toBe(true);
  });

  it('should set chat height correctly on mount', async () => {
    const wrapper = await shallowMountFactory({}, {});
    await flushPromises();

    expect(wrapper.vm.chatHeight).toBeGreaterThan(0);
  });

  it('should not set chat height if chatContainer is not available', async () => {
    const wrapper = await shallowMountFactory({}, {});

    wrapper.vm.chatContainer = null;

    wrapper.vm.setHeight();
    const previousHeight = wrapper.vm.chatHeight;

    expect(wrapper.vm.chatHeight).toBe(previousHeight);
  });

  it('should set chat height correctly if chatContainer is available', async () => {
    const wrapper = await shallowMountFactory({}, {});

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true
    });

    wrapper.vm.setHeight();

    const expectedHeight = 800 - 20 - 1;

    expect(wrapper.vm.chatHeight).toBe(expectedHeight);
  });

  it('should update chat height on window resize', async () => {
    const wrapper = await shallowMountFactory({}, {});

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true
    });

    wrapper.vm.setHeight();

    const initialHeight = wrapper.vm.chatHeight;

    Object.defineProperty(window, 'innerHeight', {
      value: 750,
      writable: true,
      configurable: true
    });
    window.dispatchEvent(new Event('resize'));

    expect(wrapper.vm.chatHeight).toBeLessThan(initialHeight);
  });

  it('should use window.screen.height if window.innerHeight is not available', async () => {
    const wrapper = await shallowMountFactory({}, {});

    Object.defineProperty(window, 'innerHeight', {
      value: undefined,
      writable: true,
      configurable: true
    });

    Object.defineProperty(window.screen, 'height', {
      value: 900,
      writable: true,
    });

    wrapper.vm.setHeight();

    const expectedHeight = 900 - 20 - 1;

    expect(wrapper.vm.chatHeight).toBe(expectedHeight);
  });

  it('should remove resize event listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const wrapper = await shallowMountFactory({}, {});
    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should receive slots content without checking rendering', async () => {
    const wrapper = await shallowMountFactory({
      hasAdminDialogList: true,
    },
    {
      slots: {
        'create-dialog-btn-icon': '<button class="test-btn">+</button>',
        'dialog-list-item-avatar': '<img class="test-avatar" src="avatar.jpg" />',
        'message-avatar': '<div class="custom-avatar">avatar</div>',
        'message-avatar-reverse': '<div class="custom-avatar">avatar reverse</div>',
        'send-msg-btn-icon': '<span class="send-icon">send</span>',
        'message-is-read': '<span class="send-icon">is read</span>',
      }
    });

    expect(wrapper.vm.$slots['create-dialog-btn-icon']).toBeDefined();
    expect(wrapper.vm.$slots['dialog-list-item-avatar']).toBeDefined();
    expect(wrapper.vm.$slots['message-avatar']).toBeDefined();
    expect(wrapper.vm.$slots['message-avatar-reverse']).toBeDefined();
    expect(wrapper.vm.$slots['send-msg-btn-icon']).toBeDefined();
    expect(wrapper.vm.$slots['message-is-read']).toBeDefined();
  });
});
