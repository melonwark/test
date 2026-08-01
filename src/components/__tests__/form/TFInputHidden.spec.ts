import { mount } from '@vue/test-utils';
import TFInputHidden from '@/components/form/TFInputHidden.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';
import eventBus from '@/utils/eventBus';
import { valueValidator } from '@/components/form/TFInputHidden.vue';


describe('TFInputHidden', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders single input when value is a primitive', () => {
    const wrapper = mount(TFInputHidden, {
      props: {
        name: 'test-input',
        value: 'singleValue'
      }
    });

    const inputs = wrapper.findAll('input[type="hidden"]');
    expect(inputs.length).toBe(1);
    expect(inputs[0].attributes('name')).toBe('test-input');
    expect((inputs[0].element as HTMLInputElement).value).toBe('singleValue');
  });

  it('renders multiple inputs when value is an array', () => {
    const wrapper = mount(TFInputHidden, {
      props: {
        name: 'array-input',
        value: ['one', 2, 'three']
      }
    });

    const inputs = wrapper.findAll('input[type="hidden"]');
    expect(inputs.length).toBe(3);
    inputs.forEach((input, index) => {
      expect(input.attributes('name')).toBe('array-input[]');
      expect((input.element as HTMLInputElement).value)
        .toBe(String(['one', 2, 'three'][index]));
    });
  });

  it('updates value via eventBus', async () => {
    const wrapper = mount(TFInputHidden, {
      props: {
        name: 'event-input',
        value: 'initial',
        eventBusListener: 'updateHiddenValue'
      }
    });

    eventBus.$emit('updateHiddenValue', 'newValue');
    await wrapper.vm.$nextTick();

    const input = wrapper.find('input[type="hidden"]');
    expect((input.element as HTMLInputElement).value).toBe('newValue');
  });

  it('does not render if value is invalid', () => {
    expect(valueValidator({})).toBe(false);
    expect(valueValidator([{}, 'valid'])).toBe(false);
  });
});
