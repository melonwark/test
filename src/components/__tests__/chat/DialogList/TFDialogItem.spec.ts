import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DialogItem from '@/components/chat/DialogList/DialogItem.vue';
import Counter from '@/components/chat/Counter.vue';
import eventBus from '@/utils/eventBus';

type TDialogItemProps = {
  id: string;
  data: {
    id: number;
    recipient: {
      login: string;
    };
    creator: {
      login: string;
      role_id: number;
    },
    last_message: { [key:string]: string } | null,
    unread_messages_count: number;
  }
};

const initialProps = {
  id: '1',
  data: {
    id: 1,
    recipient: { login: 'recipient1' },
    creator: { login: 'creator1', role_id: 2 },
    last_message: {
      text: 'Hello!',
      created_at: '2025-01-01T12:00:00',
    },
    unread_messages_count: 3
  }
};
describe('TFDialogItem.vue', () => {


  const mountFactory = async (props: Partial<TDialogItemProps>) => {
    return mount(DialogItem, {
      props: {
        ...initialProps,
        ...props
      },
    });
  };


  it('should display the dialog name correctly', async () => {

    const wrapper = await mountFactory({});

    const dialogName = wrapper.find('[data-test="partner_name"]');
    expect(dialogName.text()).toBe('recipient1');
  });

  it('should display "No messages" if there is no last message', async() => {
    const wrapper = await mountFactory({
      data: { ...initialProps.data, last_message: null },
      id: '1'
    });

    const lastMessage = wrapper.find('[data-test="last_message"]');

    expect(lastMessage.text()).toBe('No messages');
  });

  it('should display the last message if it exists', async () => {
    const wrapper = await mountFactory({});

    const lastMessage = wrapper.find('[data-test="last_message"]');

    expect(lastMessage.text()).toBe('Hello!');
  });

  it('should display the correct unread message count', async () => {
    const wrapper = await mountFactory({});

    const unreadCounter = wrapper.findComponent(Counter);

    expect(unreadCounter.exists()).toBe(true);
    expect(unreadCounter.props('messageCount')).toBe(3);
  });

  it('should format the last message date correctly', async () => {
    const wrapper = await mountFactory({});

    const lastDate = wrapper.find('[data-test="last_date"]');
    expect(lastDate.text()).toBe('2025.01.01 12:00');
  });

  it('should emit the "select" event with correct data when clicked', async () => {
    const wrapper = await mountFactory({});

    await wrapper.find('[data-test="dialog_item_1"]').trigger('click');

    expect(wrapper.emitted().select).toBeTruthy();
    expect(wrapper.emitted().select[0]).toEqual([initialProps.data]);
  });

  it('should decrease unreadCount when chatMessagesRead event is received', async () => {
    const wrapper = await mountFactory({});

    eventBus.$emit('chatMessagesRead', { dialogId: 1, countOfRead: 1 });


    await wrapper.vm.$nextTick();
    expect(wrapper.vm.unreadCount).toBe(2);
  });

  it('should set unreadCount to 0 if countOfRead is greater than unreadCount', async () => {
    const wrapper = await mountFactory({});

    eventBus.$emit('chatMessagesRead', { dialogId: 1, countOfRead: 10 });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.unreadCount).toBe(0);
  });

  it('should not change unreadCount if event is for another dialog', async () => {
    const wrapper = await mountFactory({});

    eventBus.$emit('chatMessagesRead', { dialogId: 999, countOfRead: 3 });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.unreadCount).toBe(3);
  });
});
