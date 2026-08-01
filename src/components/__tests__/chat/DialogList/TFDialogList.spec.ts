import { flushPromises, mount } from '@vue/test-utils';
import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest';
import DialogList from '@/components/chat/DialogList/DialogList.vue';
import DialogItem from '@/components/chat/DialogList/DialogItem.vue';
import axios from 'axios';
import { merge, cloneDeep } from 'lodash';
import eventBus from '@/utils/eventBus';

const defaultOptions = {
  global: {
    provide: {
      apiUrl: 'https://test.com',
      roles: {
        admin: 1,
        super_admin: 2,
        partner: 3,
        manager: 5,
        master: 6
      }
    }
  },
};

const setDialogList = (dialogsCount = 10) => {
  const dialogsItems = [];

  for (let i = 1; i <= dialogsCount; i++) {
    const creator = {
      id: 18000 + i,
      external_id: `pa${18000 + i}`,
      login: `user${i}`,
      email: `user${i}@example.com`,
      name: null,
      role_id: 2,
      role: 'Super admin',
      status_id: 0,
      status: 'Active'
    };

    const recipient = {
      id: 15000 + i,
      external_id: `pa${15000 + i}`,
      login: `partner${i}`,
      email: `partner${i}@example.com`,
      name: '',
      role_id: 3,
      role: 'Partner',
      status_id: 2,
      status: 'Blocked'
    };

    dialogsItems.push({
      id: 1000 + i,
      partner_external_id: recipient.external_id,
      created_at: new Date().toISOString(),
      unread_messages_count: 10,
      creator,
      recipient,
      last_message: {
        id: 52000 + i,
        text: `Last message ${i}`,
        author_id: creator.id,
        author_name: null,
        author_role_id: creator.role_id,
        current_user_is_author: false,
        created_at: new Date().toISOString()
      }
    });
  }

  return dialogsItems;
};

describe('TFDialogList', () => {
  const mountFactory = async (options: object) => {
    const mergedOptions = merge(cloneDeep(defaultOptions), options);
    return mount(DialogList, {
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

  it('should render dialog list correctly', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: setDialogList(1),
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    await flushPromises();

    const dialogItems = wrapper.findAllComponents(DialogItem);

    expect(dialogItems).toHaveLength(1);

    wrapper.unmount();
  });

  it('should render dialog list correctly when dialogId is defined', async () => {
    const dialogList = setDialogList(1);
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList[0],
        meta: { last_page: 1 },
      }
    });
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const wrapper = await mountFactory({
      global: {
        provide: {
          dialogId: 1001
        }
      },
    });

    await flushPromises();

    const dialogItems = wrapper.findAllComponents(DialogItem);

    expect(dialogItems).toHaveLength(1);
    expect(pushStateSpy).toHaveBeenCalledWith(
      { dialog_id: dialogList[0].id, ext_id: dialogList[0].partner_external_id },
      '',
      `/admin/support/${dialogList[0].partner_external_id}`
    );

    pushStateSpy.mockRestore();

    wrapper.unmount();
  });

  it('should trigger searchDialog when search input changes', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
        }
      }
    });

    const wrapper = await mountFactory({});

    const searchInput = wrapper.find('[data-test="search_field"]');
    await searchInput.setValue('search11');

    expect(axios.get).toHaveBeenCalledWith('https://test.com/admin/support/dialogs', {
      params: {
        q: 'search11',
        page: 1
      }
    });

    expect(wrapper.vm.dialogList).toEqual([]);
    expect(wrapper.vm.pageCount).toBe(1);
    expect(wrapper.vm.currentPage).toBe(1);

    wrapper.unmount();
  });

  it('should fill searchDialog input when role not partner', async () => {
    const dialogList = setDialogList(1);
    dialogList[0].creator.role_id = 3;

    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList[0],
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    wrapper.vm.getDialogById(1001);

    await flushPromises();

    expect(wrapper.vm.searchInputValue).toBe('user1');

  });

  it('should fill searchDialog input when role is partner', async () => {

    const dialogList = setDialogList(1);

    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList[0],
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    wrapper.vm.getDialogById(1001);

    await flushPromises();

    expect(wrapper.vm.searchInputValue).toBe('partner1');

  });

  it('should trigger window history when search input is empty', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
        }
      }
    });

    const wrapper = await mountFactory({});

    const searchInput = wrapper.find('[data-test="search_field"]');
    await searchInput.setValue('');

    expect(axios.get).toHaveBeenCalledWith('https://test.com/admin/support/dialogs', {
      params: {
        q: null,
        page: 1
      }
    });

    expect(window.location.pathname).toBe('/admin/support/');

    wrapper.unmount();
  });

  it('should sent request when NewDialogCreated called', async () => {
    const dialogList = setDialogList(1);
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList[0],
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({
      global: {
        provide: {
          dialogId: 10000
        }
      },
    });

    wrapper.vm.newDialogCreated(1001);

    expect(axios.get).toHaveBeenCalledWith('https://test.com/admin/support/dialogs/10000');
  });

  it('should trigger Modal when new dialog is created', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: setDialogList(1),
        meta: { last_page: 1 },
      }
    });
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({});
    const createDialogBtn = wrapper.find('[data-test="create_dialog"]');

    await createDialogBtn.trigger('click');

    await wrapper.vm.$nextTick();

    expect(eventBus.$emit).toHaveBeenCalledWith('openCreateDialogModal');

    wrapper.unmount();
  });

  it('should select dialog when a dialog item is clicked', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: setDialogList(1),
        meta: { last_page: 1 },
      }
    });

    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({});

    await flushPromises();

    await wrapper.find('[data-test="dialog_0"]').trigger('click');

    expect(wrapper.vm.activeDialogId).toBe(1001);
    expect(eventBus.$emit).toHaveBeenCalledWith('chatGetDialog', 1001);

    wrapper.unmount();
  });

  it('should window change history state when selected', async () => {
    const dialogList = setDialogList(1);
    const dialog = dialogList[0];
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: dialogList,
        meta: { last_page: 1 },
      }
    });
    const wrapper = await mountFactory({});

    wrapper.vm.selectDialog(dialog);

    expect(pushStateSpy).toHaveBeenCalledWith(
      { dialog_id: dialog.id, ext_id: dialog.partner_external_id },
      '',
      `/admin/support/${dialog.partner_external_id}`
    );

    pushStateSpy.mockRestore();

    wrapper.unmount();
  });

  it('should add tf-dialog-list_scrollable class when dialogList.length <= 1', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: setDialogList(3),
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    expect(wrapper.classes()).toContain('tf-dialog-list_scrollable');

    wrapper.unmount();
  });

  it('should display prompt when no dialogs are found', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: [],
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    const prompt = wrapper.find('.tf-dialog-list__prompt');

    expect(prompt.text()).toBe('No elements found. Consider changing the search query.');

    wrapper.unmount();
  });

  it('should display prompt when only one dialog is found', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: setDialogList(1),
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    await flushPromises();

    const prompt = wrapper.find('.tf-dialog-list__prompt');

    expect(prompt.text()).toBe('Clear search field to load all dialogs');

    wrapper.unmount();
  });

  it('should add scroll event listener to dialogListContainer', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: setDialogList(1),
        meta: { last_page: 1 },
      }
    });

    const wrapper = await mountFactory({});

    await flushPromises();

    const dialogListContainer = wrapper.find({ ref: 'dialogListContainer' }).element;

    dialogListContainer.dispatchEvent(new Event('scroll'));

    expect(axios.get).toHaveBeenCalledWith('https://test.com/admin/support/dialogs', {
      params: {
        q: null,
        page: 1
      }
    });
  });

  it('should call activateDialog and scrollToDialog if dialog_id exists in dialogList', async () => {
    const dialogList = setDialogList(1);
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: dialogList,
        meta: { last_page: 1 },
      }
    });
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({});

    await flushPromises();

    window.history.replaceState(
      { dialog_id: dialogList[0].id, ext_id: dialogList[0].partner_external_id },
      `https://test.com/admin/support/${dialogList[0].partner_external_id}`
    );

    await wrapper.vm.$nextTick();

    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));

    expect(eventBus.$emit).toHaveBeenCalledWith('chatGetDialog', 1001);
  });

  it('should call getDialogById if dialog_id is not in dialogList', async () => {
    const dialogList = setDialogList(1);

    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: dialogList,
        meta: { last_page: 1 },
      }
    });
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({});

    await flushPromises();

    window.history.replaceState(
      { dialog_id: dialogList[0].id },
      'https://test.com/admin/support'
    );

    await wrapper.vm.$nextTick();

    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));

    expect(eventBus.$emit).toHaveBeenCalledWith('chatGetDialog', null);
  });

  it('should call activateDialog with null if dialog_id is not in dialogList', async () => {
    const dialogList = setDialogList(1);

    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        data: dialogList,
        meta: { last_page: 1 },
      }
    });
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({});

    await flushPromises();

    window.history.replaceState(
      { dialog_id: 12 },
      'https://test.com/admin/support'
    );

    await wrapper.vm.$nextTick();

    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));

    expect(eventBus.$emit).toHaveBeenCalledWith('chatGetDialog',  null);
  });

  it('should load more dialogs when scrolled to the bottom', async () => {
    const dialogList = setDialogList(10);

    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList,
        meta: { current_page: 1, last_page: 2 },
      }
    });

    const wrapper = await mountFactory({});

    wrapper.vm.dialogList = dialogList;

    await flushPromises();

    const dialogListContainer = wrapper.find({ ref: 'dialogListContainer' }).element;

    Object.defineProperty(dialogListContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true
    });

    Object.defineProperty(dialogListContainer, 'scrollTop', {
      value: 400,
      writable: true,
      configurable: true
    });

    Object.defineProperty(dialogListContainer, 'clientHeight', {
      value: 100,
      writable: true,
      configurable: true
    });

    dialogListContainer.dispatchEvent(new Event('scroll'));

    wrapper.vm.loadDialogs();

    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith('https://test.com/admin/support/dialogs', {
      params: {
        q: null,
        page: 1
      }
    });

    expect(wrapper.vm.dialogList.length).toBeGreaterThan(10);
    expect(dialogList[0].id).toBe(1001);
    expect(wrapper.vm.currentPage).toBe(2);
  });

  it('should scroll to the element when calling scrollToDialog', async () => {
    const dialogList = setDialogList(10);

    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: dialogList,
        meta: { current_page: 1, last_page: 2 },
      }
    });

    const wrapper = await mountFactory({});

    await flushPromises();

    const dialogEl = document.createElement('div');
    dialogEl.id = 'dialog_1009';
    document.body.appendChild(dialogEl);

    dialogEl.scrollIntoView = vi.fn();

    wrapper.vm.scrollToDialog(1009);

    await wrapper.vm.$nextTick();

    expect(dialogEl.scrollIntoView).toHaveBeenCalled();
  });
});
