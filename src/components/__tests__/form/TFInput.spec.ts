import { flushPromises, mount } from '@vue/test-utils';
import TFInput from '@/components/form/TFInput.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';
import eventBus from '@/utils/eventBus';

describe('TFInput', () => {

  const mountFactory = (props = {}, slots = {}) => {
    return mount(TFInput, {
      props: {
        id: 'test-input',
        name: 'testInput',
        ...props,
      },
      slots,
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should render input with default type "text"', () => {
    const wrapper = mountFactory();
    const input = wrapper.find('input');

    expect(input.attributes('type')).toBe('text');

    wrapper.unmount();
  });

  it('should bind value to v-model', async () => {
    const wrapper = mountFactory({ value: 'initial' });
    const input = wrapper.find('input');

    expect((input.element as HTMLInputElement).value).toBe('initial');

    await input.setValue('updated');

    expect(wrapper.vm.innerValue).toBe('updated');

    wrapper.unmount();
  });

  it('should changed innerValue when props changed', async () => {
    const wrapper = mountFactory();
    const textarea = wrapper.find('input');

    await wrapper.setProps({ value: 'updated' })
    expect(wrapper.vm.innerValue).toBe('updated');

    await wrapper.setProps({ modelValue: 'updatedModelValue' })
    expect(wrapper.vm.innerValue).toBe('updatedModelValue');

    wrapper.unmount();
  });

  it('should emit value on input', async () => {
    const wrapper = mountFactory({ eventBusEmitter: 'inputChange' });
    const input = wrapper.find('input');

    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    await input.setValue('new value');

    expect(eventBus.$emit).toHaveBeenCalledWith('inputChange', 'new value');

    wrapper.unmount();
  });

  it('should emit value on mount if `callEmitterOnMount` is true', async() => {
    const wrapper = mountFactory(
      {
        value: 'emitted',
        callEmitterOnMount: true,
        eventBusEmitter: 'mountedEmit'
      }
    );
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    await flushPromises();

    expect(eventBus.$emit).toHaveBeenCalledWith('mountedEmit', 'emitted');

    wrapper.unmount();
  });

  it('should not emit value on mount if `callEmitterOnMount` is false', async() => {
    const wrapper = mountFactory({ callEmitterOnMount: false, eventBusEmitter: 'mountedEmit' });

    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    await flushPromises();

    expect(eventBus.$emit).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should render label when provided', () => {
    const wrapper = mountFactory({ label: 'TEST Label' });

    expect(wrapper.find('label').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('TEST Label');

    wrapper.unmount();
  });

  it('should show error message when hasError is true', () => {
    const wrapper = mountFactory({
      hasError: true,
      errorFeedback: 'This is an error',
    });

    const error = wrapper.find('.invalid-feedback');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe('This is an error');

    wrapper.unmount();
  });

  it('should render actions slot when hasActions is true', () => {
    const wrapper = mountFactory({ hasActions: true }, {
      actions: '<div class="test-action">Action</div>',
    });

    expect(wrapper.find('.test-action').exists()).toBe(true);
    wrapper.unmount();
  });

  it('should pass attributes to input element', () => {
    const wrapper = mountFactory({
      required: true,
      placeholder: 'Enter text',
      disabled: true,
      min: 1,
      max: 10,
    });

    const input = wrapper.find('input');
    expect(input.attributes()).toMatchObject({
      required: '',
      placeholder: 'Enter text',
      disabled: '',
      min: '1',
      max: '10',
    });

    wrapper.unmount();
  });

  it('should apply custom container class and data-cy attribute', () => {
    const wrapper = mountFactory({
      containerClass: 'custom-class',
      dataCy: 'tf-input',
    });

    expect(wrapper.classes()).toContain('custom-class');
    expect(wrapper.find('[data-cy="tf-input"]').exists()).toBe(true);

    wrapper.unmount();
  });


  it('should clear input when eventBusClearListener is triggered', async () => {
    const wrapper = mountFactory({
      value: 'initial value',
      eventBusClearListener: 'clearInputEvent',
    });

    const input = wrapper.find('input');

    expect((input.element as HTMLInputElement).value).toBe('initial value');

    eventBus.$emit('clearInputEvent');

    await flushPromises();

    expect((input.element as HTMLInputElement).value).toBe('');

    wrapper.unmount();
  });
});
