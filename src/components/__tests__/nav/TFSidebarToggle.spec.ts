import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TFSidebarToggle from '../../nav/TFSidebarToggle.vue';
import { useCookies } from 'vue3-cookies';
import eventBus from '../../../utils/eventBus.js';

vi.mock('../../../utils/eventBus', () => ({
  default: {
    $on: vi.fn(),
    $once: vi.fn(),
    $off: vi.fn(),
    $emit: vi.fn(),
  },
}));

describe('TFSidebarToggle', () => {
  it('should render the button and have the correct initial class', () => {
    const wrapper = mount(TFSidebarToggle, {
      props: {
        collapsed: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain('hamburger--elastic');
    expect(button.classes()).not.toContain('is-active');
  });

  it('should toggle the "is-active" class when clicked', async () => {
    const wrapper = mount(TFSidebarToggle, {
      props: {
        collapsed: true,
      },
    });

    const button = wrapper.find('button');

    expect(button.classes()).not.toContain('is-active');

    await button.trigger('click');

    expect(button.classes()).toContain('is-active');
  });

  it('should call the clickHandler and update the cookie when clicked', async () => {
    const wrapper = mount(TFSidebarToggle, {
      props: {
        collapsed: true,
      },
    });

    const button = wrapper.find('button');

    await button.trigger('click');

    expect(eventBus.$emit).toHaveBeenCalledWith('sidebarStateChange', false);
    expect(useCookies().cookies.get('sidebar_menu_closed')).toBe('false');
  });
});
