import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TFSidebar from '@/components/nav/TFSidebar.vue';
import eventBus from '@/utils/eventBus';
import type { TMenuItem } from '@/types/components';

import type { ComponentPublicInstance } from 'vue';

type TFSidebarInstance = ComponentPublicInstance<typeof TFSidebar>;

vi.mock('../../../utils/eventBus', () => ({
  default: {
    $on: vi.fn(),
    $once: vi.fn(),
    $off: vi.fn(),
    $emit: vi.fn(),
  },
}));

describe('TFSidebar.vue', () => {
  let wrapper: ReturnType<typeof mount>;
  const mockMenu: TMenuItem[] = [
    {
      title: 'Sidebar',
      regExpForDetermineActivePoint: '^\\/sidebar(?:\\/.*)?',
      href: '/sidebar',
      icon: {
        element: 'span',
        class: 'sidebar-menu-icon',
      },
      child: [
        {
          title: 'Child',
          icon: 'child-icon',
          href: '/sidebar/child',
          regExpForDetermineActivePoint: '^\\/sidebar\\/child(?:\\?|#|\\/|$)',
        },
      ],
    },
  ];

  const mountSidebar = () =>
    mount(TFSidebar, {
      props: {
        menu: mockMenu,
        collapsed: false,
        relatedSelectors: ['.related-selector'],
        relatedSelectorsClasses: 'sidebar-closed',
        clickItemEventBusEmitter: 'sidebarMenuItemClick',
      },
      slots: {
        header: '<div class="header-slot">Header Content</div>',
        footer: '<div class="footer-slot">Footer Content</div>',
      },
    });

  beforeEach(() => {
    // vi.clearAllMocks();
    wrapper = mountSidebar();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render SidebarMenu with provided props and slots', () => {
    const props = wrapper.props() as { menu: TMenuItem[] };
    expect(wrapper.findComponent({ name: 'SidebarMenu' }).exists()).toBe(true);
    expect(wrapper.find('.header-slot').text()).toBe('Header Content');
    expect(wrapper.find('.footer-slot').text()).toBe('Footer Content');
    expect(props.menu).toHaveLength(1);
  });

  it('should subscribe and unsubscribe to eventBus correctly', () => {
    expect(eventBus.$on).toHaveBeenCalledWith(
      'sidebarStateChange',
      expect.any(Function),
    );
    wrapper.unmount();
    expect(eventBus.$off).toHaveBeenCalledWith(
      'sidebarStateChange',
      expect.any(Function),
    );
  });

  it('should subscribe to eventBus and handle state changes on event trigger', async () => {
    const mockEventBusOn = eventBus.$on as ReturnType<typeof vi.fn>;
    expect(mockEventBusOn).toHaveBeenCalledWith(
      'sidebarStateChange',
      expect.any(Function),
    );
    const stateChangeCallback = mockEventBusOn.mock.calls[0][1];

    stateChangeCallback(true);
    const vm = wrapper.vm as TFSidebarInstance;

    await vm.$nextTick();
    expect(vm.innerCollapsed).toBe(true);
  });

  it('should update innerCollapsed state when onToggleCollapse is called', async () => {
    const vm = wrapper.vm as TFSidebarInstance;
    vm.onToggleCollapse(true);

    expect(vm.innerCollapsed).toBe(true);

    vm.onToggleCollapse(false);

    expect(vm.innerCollapsed).toBe(false);
  });

  it('should handle sidebar state changes', () => {
    const vm = wrapper.vm as TFSidebarInstance;
    const mockElement = document.createElement('div');
    mockElement.classList.add('related-selector');
    document.body.appendChild(mockElement);

    vm.handleSidebarState(true);
    expect(vm.innerCollapsed).toBe(true);

    vm.handleSidebarState(false);
    expect(mockElement.classList.contains('sidebar-closed')).toBe(false);

    document.body.removeChild(mockElement);
  });

  it('should emit eventBus event on item click', () => {
    const vm = wrapper.vm as TFSidebarInstance;
    const mockEvent = new MouseEvent('click');
    const mockItem = mockMenu[0];

    vm.onItemClick(mockEvent, mockItem);

    expect(eventBus.$emit).toHaveBeenCalledWith('sidebarMenuItemClick', {
      item: mockItem,
      nativeEvent: mockEvent,
    });
  });

  it('should toggle related selectors classes', () => {
    const vm = wrapper.vm as TFSidebarInstance;
    const mockElement = document.createElement('div');
    mockElement.classList.add('related-selector');
    document.body.appendChild(mockElement);

    vm.toggleRelatedSelectorsClass(true);
    expect(mockElement.classList.contains('sidebar-closed')).toBe(true);

    vm.toggleRelatedSelectorsClass(false);
    expect(mockElement.classList.contains('sidebar-closed')).toBe(false);

    document.body.removeChild(mockElement);
  });

  it('should compute preparedMenu based on props.menu and window.location', () => {
    const vm = wrapper.vm as TFSidebarInstance;
    const preparedMenu = vm.preparedMenu;

    vm.path = '/sidebar/child';

    expect(preparedMenu[0].isActive()).toBe(true);
    expect(preparedMenu[0].child![0].isActive()).toBe(true);

    vm.path = '/sidebar/child2';

    expect(preparedMenu[0].isActive()).toBe(true);
    expect(preparedMenu[0].child![0].isActive()).toBe(false);

    expect(preparedMenu).toEqual([
      {
        ...mockMenu[0],
        isActive: expect.any(Function),
        child: [
          {
            ...mockMenu[0].child![0],
            isActive: expect.any(Function),
          },
        ],
      },
    ]);
  });
});
