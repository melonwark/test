import { shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TFPagination from '@/components/tables/TFPagination.vue';

type TProps = {
  pagesCount: number,
  pageNumber: number,
}

describe('TFPagination', () => {
  const shallowMountFactory = async (
    props: Partial<TProps> = {},
    options: object
  ) => {
    return shallowMount(TFPagination, {
      props: {
        pagesCount: 1,
        pageNumber: 1,
        ...props,
      },
      ...options,
    });
  };

  it('should correctly renders pagesCount is 1', async () => {
    const wrapper = await shallowMountFactory({}, {});

    expect(wrapper.find('ul.tf-pagination').exists()).toBe(false);
  });

  it('should correctly renders when changing "pagesCount" Prop', async () => {
    const wrapper = await shallowMountFactory({
      pagesCount: 1
    }, {});

    expect(wrapper.find('.tf-pagination-container').exists()).toBe(true);
    expect(wrapper.find('.tf-pagination').exists()).toBe(false);

    await wrapper.setProps({ pagesCount: 2 }).then(() => {
      const items = wrapper.findAll('.tf-page-item');

      expect(wrapper.find('.tf-pagination').exists()).toBe(true);
      expect(items.length > 0).toBe(true);
      expect(items).toHaveLength(4);

      // text
      const prev = items.at(0);
      const first = items.at(1);
      const second = items.at(2);
      const next = items.at(3);

      expect(prev?.find('.tf-page-link').text()).toEqual('«');
      expect(first?.find('.tf-page-link').text()).toEqual('1');
      expect(second?.find('.tf-page-link').text()).toEqual('2');
      expect(next?.find('.tf-page-link').text()).toEqual('»');

      // classes
      items.forEach((li, index) => {
        expect(li.classes()).toContain('tf-page-item');
        const pageLink = li.find('.tf-page-link');
        expect(pageLink).toBeDefined();

        if (index === 0) {
          expect(li.classes()).not.toContain('active');
          expect(li.classes()).toContain('disabled');
        } else if (index === 1) {
          expect(li.classes()).toContain('active');
          expect(li.classes()).not.toContain('disabled');
        } else {
          expect(li.classes()).toContain('cursor-pointer');
          expect(li.classes()).not.toContain('disabled');
        }
      });
    });

    wrapper.unmount();
  });

  it('should correctly update pagination delimiters when the current page changes', async () => {
    const wrapper = await shallowMountFactory({
      pagesCount: 14,
    }, {});

    expect(wrapper.findAll('.tf-page-item')).toHaveLength(7);
    expect(wrapper.findAll('.tf-page-item').map(el => el.text()))
      .toEqual([  '«', '1', '2', '3', '...', '14', '»']);

    wrapper.vm.setPage(8);

    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.tf-page-item').map(el => el.text()))
      .toEqual(['«', '1', '...', '6', '7', '8', '9', '10', '...', '14', '»']);

    wrapper.vm.setPage(14);

    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.tf-page-item').map(el => el.text()))
      .toEqual([  '«', '1', '...', '12', '13', '14', '»']);

    wrapper.unmount();
  });

  it('should "setPreviousPage" decrease "currentPage" when not disabled', async () => {
    const wrapper = await shallowMountFactory(
      {
        pagesCount: 5,
        pageNumber: 3,
      }, {});

    wrapper.vm.setPreviousPage();

    expect(wrapper.vm.currentPage).toBe(2);

    wrapper.unmount();
  });

  it('should "setPreviousPage" do nothing if "prevButtonDisabled" is true', async () => {
    const wrapper = await shallowMountFactory({
      pagesCount: 5,
      pageNumber: 1,
    }, {});

    wrapper.vm.setPreviousPage();

    expect(wrapper.vm.currentPage).toBe(1);

    wrapper.unmount();
  });

  it('should "setNextPage" increase "currentPage" when not disabled', async () => {
    const wrapper = await shallowMountFactory(
      {
        pagesCount: 5,
        pageNumber: 3,
      }, {});

    wrapper.vm.setNextPage();

    expect(wrapper.vm.currentPage).toBe(4);

    wrapper.unmount();
  });

  it('should "setNextPage" do nothing if "nextButtonDisabled" is true', async () => {
    const wrapper = await shallowMountFactory(
      {
        pagesCount: 5,
        pageNumber: 5,
      }, {});

    wrapper.vm.setNextPage();

    expect(wrapper.vm.currentPage).toBe(5);

    wrapper.unmount();
  });
});
