import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Message from '@/components/chat/MessageList/Message.vue';
import { merge } from 'lodash';


const defaultOptions = {
  global: {
    provide: {
      userRole: 1,
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

type TFMessageProps = {
  messageData: {
    [key: string]: string|boolean|number
  }
}

describe('TFMessage', () => {

  const mountFactory = async (props: TFMessageProps, options: object) => {
    const mergedOptions = merge(defaultOptions, options);
    return mount(Message, {
      props: {
        dataCy: 'message',
        ...props
      },
      ...mergedOptions
    });
  };

  it('should apply the "unread" class if the message is unread', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': false,
        'is_read_by_current_user': false,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.classes()).toContain('unread');
  });

  it('should not apply the "unread" class if the message is read', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.classes()).not.toContain('unread');
  });

  it('should apply "reverse" class if the user is the author and not a partner', async () => {

    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': true,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.find('.tf-chat-message-container__inner').classes()).toContain('reverse');
  });


  it('should not apply "reverse" class if the user is not the author', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.find('.tf-chat-message-container__inner').classes()).not.toContain('reverse');
  });

  it('should render the delete button if the author is an admin and the user is not a partner', async () => {

    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.find('[data-test="delete_msg_btn"]').exists()).toBe(true);
  });

  it('should not render the delete button if the author is not an admin', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 3,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.find('[data-test="delete_msg_btn"]').exists()).toBe(false);
  });

  it('should correctly format the date', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 3,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    expect(wrapper.find('.tf-chat-message__other span').text()).toBe('2025.03.14 13:21');
  });

  it('should emit removeMessage when the delete button is clicked', async () => {
    const wrapper = await mountFactory({
      messageData: {
        'id': 1,
        'text': 'Test message 1',
        'author_id': 1,
        'author_name': 'Support',
        'author_role_id': 1,
        'current_user_is_author': false,
        'is_read_by_current_user': true,
        'is_read_by_partner': true,
        'created_at': '2025-03-14T13:21:35.281Z'
      }
    }, {});

    await wrapper.find('[data-test="delete_msg_btn"]').trigger('click');

    expect(wrapper.emitted().removeMessage[0]).toEqual([1]);
  });
});
