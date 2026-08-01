import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import MessageList from '@/components/chat/MessageList/MessageList.vue';
import MessagesListPreloader from '@/components/chat/MessageList/MessagesListPreloader.vue';
import Message from '@/components/chat/MessageList/Message.vue';
import axios from 'axios';
import { merge } from 'lodash';
import eventBus from '@/utils/eventBus';

const defaultOptions = {
  global: {
    provide: {
      hasAdminDialogList: false,
      userRole: 1,
      apiUrl: 'https://test.com',
      roles: {
        admin: 1,
        super_admin: 2,
        partner: 3,
        manager: 5,
        master: 6
      },
    },
  },
};

const messages = [
  {
    'id': 1,
    'text': 'Test message 1',
    'author_id': 1,
    'author_name': 'Support',
    'author_role_id': 1,
    'current_user_is_author': false,
    'is_read_by_current_user': true,
    'is_read_by_partner': true,
    'created_at': '2025-03-14T13:21:35.281Z'
  },
  {
    'id': 2,
    'text': 'Test message 12',
    'author_id': 2,
    'author_name': 'Support',
    'author_role_id': 2,
    'current_user_is_author': false,
    'is_read_by_current_user': true,
    'is_read_by_partner': true,
    'created_at': '2025-03-14T13:21:35.281Z'
  },
];

describe('TFMessageList', () => {
  const mountFactory = async (options: object) => {
    const mergedOptions = merge(defaultOptions, options);
    return mount(MessageList, {
      props: {
        dataCy: 'dialog',
      },
      ...mergedOptions
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.confirmation = vi.fn(onConfirm => {
      onConfirm();
    });
  });


  it('should mount the component', async () => {
    const wrapper = await mountFactory({});

    expect(wrapper.exists()).toBe(true);
  });

  it('should render preloader when loading is true', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({ data: { data: [], meta: {} } });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        },
      },
    });

    eventBus.$emit('chatGetDialog', 1);

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(MessagesListPreloader).exists()).toBe(true);
  });

  it('should render messages when messageList is not empty', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: messages,
        meta: { 'current_page': 1, 'last_page': 1 }
      }
    });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        },
      },
    });

    await flushPromises();

    expect(wrapper.findComponent(Message).exists()).toBe(true);
  });

  it('should call removeMessage when message emits removeMessage', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: messages,
        meta: { 'current_page': 1, 'last_page': 1 }
      }
    });
    vi.spyOn(axios, 'delete').mockResolvedValue({ status: 'ok' });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        },
      },
    });

    eventBus.$emit('chatGetDialog', 1);

    await flushPromises();

    wrapper.findComponent(Message).vm.$emit('removeMessage', 1);

    await flushPromises();

    expect(wrapper.vm.messageList.length).toBe(1);
  });

  it('messageList should be empty if dialogId is not defined', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        },
      },
    });

    eventBus.$emit('chatGetDialog');

    expect(wrapper.vm.messageList.length).toBe(0);
  });

  it('should update messageList when chatSendMessage event is emitted', async () => {
    const newMessage =   {
      'id': 3,
      'text': 'Test message 3',
      'author_id': 2,
      'author_name': 'Support',
      'author_role_id': 2,
      'current_user_is_author': false,
      'is_read_by_current_user': true,
      'created_at': '2025-03-14T13:21:35.281Z'
    };

    vi.spyOn(axios, 'post').mockResolvedValue({ status: 'ok' });

    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: [...messages, ...[newMessage]],
        meta: { 'current_page': 1, 'last_page': 1 }
      }
    });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true
        },
      },
    });

    eventBus.$emit('chatSendMessage', 'Test message 3');

    await flushPromises();

    expect(wrapper.vm.messageList.length).toBe(3);
  });

  it('should send request to the correct URL when isPartner is true', async () => {
    const newMessage = {
      'id': 3,
      'text': 'Test message 3',
      'author_id': 2,
      'author_name': 'Support',
      'author_role_id': 2,
      'current_user_is_author': false,
      'is_read_by_current_user': true,
      'created_at': '2025-03-14T13:21:35.281Z'
    };

    vi.spyOn(axios, 'post').mockResolvedValue({ status: 'ok' });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true,
          userRole: 3
        },
      },
    });

    eventBus.$emit('chatSendMessage', newMessage);

    expect(axios.post).toHaveBeenCalledWith(
      'https://test.com/support/messages',
      { text: newMessage }
    );

    wrapper.unmount();
  });

  it('should send request to the correct URL when isPartner is false', async () => {
    const newMessage = {
      'id': 3,
      'text': 'Test message 3',
      'author_id': 2,
      'author_name': 'Support',
      'author_role_id': 2,
      'current_user_is_author': false,
      'is_read_by_current_user': true,
      'created_at': '2025-03-14T13:21:35.281Z'
    };

    vi.spyOn(axios, 'post').mockResolvedValue({ status: 'ok' });

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: true,
          userRole: 1
        },
      },
    });

    wrapper.vm.dialogId = 123;

    eventBus.$emit('chatSendMessage', newMessage);

    expect(axios.post).toHaveBeenCalledWith(
      'https://test.com/admin/support/dialogs/123/messages',
      { text: newMessage }
    );
  });

  it('should work out Scroll in MessageListContainer', async () => {

    const newMessage =   {
      'id': 3,
      'text': 'Test message 3',
      'author_id': 2,
      'author_name': 'Support',
      'author_role_id': 2,
      'current_user_is_author': false,
      'is_read_by_current_user': true,
      'is_read_by_partner': true,
      'created_at': '2025-03-14T13:21:35.281Z'
    };

    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: messages,
        meta: { 'current_page': 1, 'last_page': 3 }
      }
    }).mockResolvedValue({
      data: {
        data: [...messages, ...[newMessage]],
        meta: { 'current_page': 2, 'last_page': 3 }
      }
    });

    vi.useFakeTimers();

    const wrapper = await mountFactory({
      global: {
        provide: {
          hasAdminDialogList: false
        },
      }
    });

    await flushPromises();

    const messageListContainer = wrapper.find('[data-test="message_list_container"]').element;
    const messagesContent = wrapper.find('[data-test="messages"]').element;

    Object.defineProperty(messagesContent, 'offsetHeight', {
      value: 800,
      writable: true,
      configurable: true
    });

    Object.defineProperty(messageListContainer, 'offsetHeight', {
      value: 500,
      writable: true,
      configurable: true
    });

    Element.prototype.scrollBy = vi.fn();

    messageListContainer.scrollTop = 0;
    messageListContainer.dispatchEvent(new Event('scroll'));

    vi.runAllTimers();

    Object.defineProperty(messageListContainer, 'scrollHeight', {
      value: 1100,
      writable: true,
      configurable: true
    });

    await flushPromises();

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(messageListContainer.scrollBy).toHaveBeenCalled();
  });
});

