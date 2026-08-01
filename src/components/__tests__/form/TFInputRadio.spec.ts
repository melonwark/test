import { mount, flushPromises } from '@vue/test-utils';
import TFInputRadio from '@/components/form/TFInputRadio.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('TFInputRadio', () => {
  const mountFactory = (props = {}) => {
    return mount(TFInputRadio, {
      props: {
        id: 'radio-option',
        value: 'option1',
        ...props,
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should render input of type radio', () => {
    const wrapper = mountFactory();
    const input = wrapper.find('input[type="radio"]');

    expect(input.exists()).toBe(true);

    wrapper.unmount();
  });

  it('should bind value to v-model', async () => {
    const wrapper = mountFactory({ value: 'testValue' });
    const input = wrapper.find('input[type="radio"]');

    expect((input.element as HTMLInputElement).value).toBe('testValue');

    wrapper.unmount();
  });

  it('should emit onChange event when changed', async () => {
    const wrapper = mountFactory();
    const input = wrapper.find('input[type="radio"]');

    await input.trigger('change');

    expect(wrapper.emitted('onChange')).toBeTruthy();
    expect(wrapper.emitted('onChange')![0]).toEqual(['option1']);

    wrapper.unmount();
  });

  it('should emit onChange on mount if callEmitterOnMount is true', async () => {
    const wrapper = mount(TFInputRadio, {
      props: {
        id: 'radio-mount',
        value: 'mountedValue',
        callEmitterOnMount: true,
      },
    });

    await flushPromises();

    expect(wrapper.emitted('onChange')).toBeTruthy();
    expect(wrapper.emitted('onChange')![0]).toEqual(['mountedValue']);

    wrapper.unmount();
  });

  it('should not emit onChange on mount if callEmitterOnMount is false', async () => {
    const wrapper = mountFactory({ callEmitterOnMount: false });

    await flushPromises();

    expect(wrapper.emitted('onChange')).toBeFalsy();

    wrapper.unmount();
  });

  it('should apply "checked" attribute when checked is true', () => {
    const wrapper = mountFactory({ checked: true });
    const input = wrapper.find('input');

    expect(input.element.checked).toBe(true);

    wrapper.unmount();
  });

  it('should apply "disabled" attribute when disabled is true', () => {
    const wrapper = mountFactory({ disabled: true });
    const input = wrapper.find('input');

    expect(input.attributes()).toHaveProperty('disabled', '');

    wrapper.unmount();
  });

  it('should render label with correct text and for attribute', () => {
    const wrapper = mountFactory({ label: 'Radio Label', id: 'radio-id' });
    const label = wrapper.find('label');

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Radio Label');
    expect(label.attributes('for')).toBe('radio-id');

    wrapper.unmount();
  });

  it('should apply data-cy attribute when provided', () => {
    const wrapper = mountFactory({ dataCy: 'radio-cy' });
    const input = wrapper.find('input');

    expect(input.attributes('data-cy')).toBe('radio-cy');

    wrapper.unmount();
  });
});
