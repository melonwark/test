import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ChildrenButton from '@/components/tables/ChildrenButton.vue';
import type { TTableSlotFunction } from '@/types/components';
import { h } from 'vue';

type TProps = {
  expanded: boolean,
  loading: boolean,
  iconSlot: TTableSlotFunction
}

const initialProps = {
  expanded: false,
  loading: false,
};

const mountFactory = async (
  props: Partial<TProps> = {},
  options: Record<string, unknown> = {}
) => {
  return mount(ChildrenButton, {
    props: {
      ...initialProps,
      ...props,
    },
    ...options,
  });
};

describe('ChildrenButton', () => {
  it('should render default content if iconSlot is not provided', async () => {
    const wrapper = await mountFactory({} , {});

    expect(wrapper.html()).toContain('tf-table-children-row-icon');
    expect(wrapper.html()).toContain('tf-table-children-row-icon-contracted');
    expect(wrapper.html()).not.toContain('tf-table-children-row-icon-expanded');
    expect(wrapper.html()).not.toContain('tf-table-children-row-icon-loading');

    wrapper.unmount();
  });

  it('should render with expanded class when expanded is true', async () => {
    const wrapper = await mountFactory({
      expanded: true,
    } , {});

    expect(wrapper.html()).toContain('tf-table-children-row-icon-expanded');
    expect(wrapper.html()).not.toContain('tf-table-children-row-icon-contracted');

    wrapper.unmount();
  });

  it('should render with loading class when loading is true', async () => {
    const wrapper = await mountFactory({
      loading: true,
    } , {});

    expect(wrapper.html()).toContain('tf-table-children-row-icon-loading');
    expect(wrapper.html()).not.toContain('tf-table-children-row-icon-expanded');
    expect(wrapper.html()).not.toContain('tf-table-children-row-icon-contracted');

    wrapper.unmount();
  });

  it('should render with iconSlot when expanded is true', async () => {

    const iconSlot = vi.fn(
      ({ expanded }) => h('div', {}, expanded ? '[-]' : '[+]')
    );

    const wrapper = await mountFactory({
      expanded: true,
      loading: false,
      iconSlot,
    }, {});

    expect(iconSlot).toHaveBeenCalledWith({
      expanded: true,
      loading: false,
      class:  {
        'tf-table-children-row-icon': true,
        'tf-table-children-row-icon-contracted': false,
        'tf-table-children-row-icon-expanded': true,
      },
    });

    expect(wrapper.html()).toContain('<div>[-]</div>');

    wrapper.unmount();
  });
});
