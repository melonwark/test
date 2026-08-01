import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TFDropdown from '@/components/ui/TFDropdown.vue';

type TFDropdownProps = {
  openingAnimation?: string;
  switcherClasses?: string;
  dropdownMenuClasses?: string;
  hideIfClickInside?: boolean;
  minWidth?: number;
  offsetTop?: number;
  dataCy?: string;
}

const initialProps = {
  openingAnimation: 'dropdown',
  switcherClasses: 'switcher-class',
  dropdownMenuClasses: 'dropdown-menu-class',
  hideIfClickInside: true,
  offsetTop: 10,
  dataCy: 'dropdown-switcher'
};

describe('DropdownSwitcher.vue', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });
  const mountFactory = async (props: TFDropdownProps) => {
    return mount(TFDropdown, {
      props: {
        ...initialProps,
        ...props,
      },
      slots: {
        switcher: '<button>Toggle</button>',
        'dropdown-header': '<div>Header</div>',
        'dropdown-body': '<div>Body</div>'
      }
    });
  };

  it('should render component with the correct classes and data-cy attribute', async () => {
    const wrapper = await mountFactory({});

    expect(wrapper.find('.tf-dropdown-switcher').classes()).toContain('switcher-class');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(false);
  });

  it('should toggle dropdown visibility when switcher is clicked', async () => {
    const wrapper = await mountFactory({});

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(true);

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(false);
  });

  it('should close dropdown if clicked outside', async () => {
    const wrapper = await mountFactory({});

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(true);

    document.body.click();

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.tf-dropdown').exists()).toBe(false);
  });

  it('should not close dropdown if clicked inside when hideIfClickInside is false', async () => {
    const wrapper = await mountFactory({
      hideIfClickInside: false
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(true);

    await wrapper.find('.tf-dropdown').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.tf-dropdown').exists()).toBe(true);
  });

  it('should close dropdown when Escape key is pressed', async () => {
    const wrapper = await mountFactory({});
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.tf-dropdown').exists()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.tf-dropdown').exists()).toBe(false);
  });

  it('should compute the correct dropdown styles based on minWidth and offsetTop', async () => {
    const wrapper = await mountFactory({
      minWidth: 200,
    });

    await wrapper.find('button').trigger('click');

    const dropdown = wrapper.find('[data-test="dropdown"]');

    expect(dropdown.attributes('style')).toBe('min-width: 200px; top: 10px;');
  });

  it('should compute the correct dropdown styles based on minWidth', async () => {
    const wrapper = await mountFactory({});

    await wrapper.find('button').trigger('click');

    const dropdown = wrapper.find('[data-test="dropdown"]');

    expect(dropdown.attributes('style')).toBe('top: 10px;');
  });

  it('should remove event listeners on beforeUnmount', async () => {
    const wrapper = await mountFactory({});
    const removeEventListenerMock = vi.spyOn(document, 'removeEventListener');

    wrapper.unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('click', expect.any(Function));
    expect(removeEventListenerMock).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
