import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DialogSearch from '@/components/chat/DialogList/DialogSearch.vue';

describe('DialogSearch.vue', () => {
  const mountFactory = async (props = {}) => {
    return mount(DialogSearch, {
      props: {
        ...{ value: '' },
        ...props
      }
    });
  };

  it('should initialize with an empty value', async () => {
    const wrapper = await mountFactory();
    expect(wrapper.vm.innerValue).toBe('');
  });

  it('should update innerValue when prop value changes', async () => {
    const wrapper = await mountFactory({ value: 'test' });

    expect(wrapper.vm.innerValue).toBe('test');
  });

  it('should emit search event when input length is 3 or more', async () => {
    const wrapper = await mountFactory();

    const input = wrapper.find('[data-test="search_field"]');

    await input.setValue('abc');
    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search[0]).toEqual(['abc']);
  });

  it('should not emit search event when input length is less than 3', async () => {
    const wrapper = await mountFactory();

    const input = wrapper.find('[data-test="search_field"]');

    await input.setValue('ab');
    expect(wrapper.emitted().search).toBeFalsy();
  });

  it('should emit search event when input is cleared', async () => {
    const wrapper = await mountFactory();

    const input = wrapper.find('[data-test="search_field"]');

    await input.setValue('abc');
    await input.setValue('');

    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search.pop()).toEqual(['']);
  });

  it('should show clear button when input is not empty', async () => {

    const wrapper = await mountFactory();

    expect(wrapper.find('[data-test="clear_search"]').exists()).toBe(false);

    wrapper.vm.innerValue = 'test';

    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="clear_search"]').exists()).toBe(true);
  });

  it('should clear input and emit search event when clear button is clicked', async () => {
    const wrapper = await mountFactory();

    wrapper.vm.innerValue = 'test';

    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('[data-test="clear_search"]');

    await clearButton.trigger('click');

    expect(wrapper.vm.innerValue).toBe('');
    expect(wrapper.emitted().search).toBeTruthy();
    expect(wrapper.emitted().search.pop()).toEqual(['']);
  });
});
