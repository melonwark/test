import { flushPromises, mount } from '@vue/test-utils';
import TFTextarea from '@/components/form/TFTextarea.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';
import eventBus from '@/utils/eventBus';

describe('TFTextarea', () => {
  const mountFactory = (props = {}) => {
    return mount(TFTextarea, {
      props: {
        id: 'test-textarea',
        name: 'testTextarea',
        ...props,
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should render textarea with default rows and cols', () => {
    const wrapper = mountFactory();
    const textarea = wrapper.find('textarea');

    expect(textarea.attributes('rows')).toBe('2');
    expect(textarea.attributes('cols')).toBe('20');

    wrapper.unmount();
  });

  it('should bind value to v-model', async () => {
    const wrapper = mountFactory({ value: 'initial' });
    const textarea = wrapper.find('textarea');

    expect((textarea.element as HTMLTextAreaElement).value).toBe('initial');

    await textarea.setValue('updated');
    expect(wrapper.vm.innerValue).toBe('updated');

    wrapper.unmount();
  });

  it('should changed innerValue when props changed', async () => {
    const wrapper = mountFactory();
    const textarea = wrapper.find('textarea');

    await wrapper.setProps({ value: 'updated' })
    expect(wrapper.vm.innerValue).toBe('updated');

    await wrapper.setProps({ modelValue: 'updatedModelValue' })
    expect(wrapper.vm.innerValue).toBe('updatedModelValue');

    wrapper.unmount();
  });

  it('should emit input and eventBus event on input', async () => {
    const wrapper = mountFactory({ eventBusEmitter: 'textareaInput' });
    const textarea = wrapper.find('textarea');

    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    await textarea.setValue('new value');

    expect(eventBus.$emit).toHaveBeenCalledWith('textareaInput', 'new value');

    wrapper.unmount();
  });

  it('should emit value on mount if `callEmitterOnMount` is true', async () => {
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');
    const wrapper = mountFactory({
      value: 'mounted value',
      eventBusEmitter: 'mountEmit',
      callEmitterOnMount: true,
    });

    await flushPromises();

    expect(eventBus.$emit).toHaveBeenCalledWith('mountEmit', 'mounted value');

    wrapper.unmount();
  });

  it('should not emit value on mount if `callEmitterOnMount` is false', async () => {
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');
    const wrapper = mountFactory({
      value: 'some value',
      eventBusEmitter: 'mountEmit',
      callEmitterOnMount: false,
    });

    await flushPromises();

    expect(eventBus.$emit).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should render label when provided', () => {
    const wrapper = mountFactory({ label: 'Textarea Label' });

    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Textarea Label');

    wrapper.unmount();
  });

  it('should show error message when hasError is true', () => {
    const wrapper = mountFactory({
      hasError: true,
      errorFeedback: 'Textarea error',
    });

    const error = wrapper.find('.invalid-feedback');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe('Textarea error');

    wrapper.unmount();
  });

  it('should apply container class and data-cy attribute', () => {
    const wrapper = mountFactory({
      containerClass: 'custom-textarea-container',
      dataCy: 'tf-textarea',
    });

    expect(wrapper.classes()).toContain('custom-textarea-container');
    expect(wrapper.find('[data-cy="tf-textarea"]').exists()).toBe(true);

    wrapper.unmount();
  });

  it('should pass attributes to textarea', () => {
    const wrapper = mountFactory({
      required: true,
      placeholder: 'Enter text...',
      disabled: true,
      rows: 5,
      cols: 40,
    });

    const textarea = wrapper.find('textarea');
    expect(textarea.attributes()).toMatchObject({
      required: '',
      placeholder: 'Enter text...',
      disabled: '',
      rows: '5',
      cols: '40',
    });

    wrapper.unmount();
  });

  it('should clear textarea when eventBusClearListener is triggered', async () => {
    const wrapper = mountFactory({
      value: 'to be cleared',
      eventBusClearListener: 'clearTextareaEvent',
    });

    const textarea = wrapper.find('textarea');

    expect((textarea.element as HTMLTextAreaElement).value).toBe('to be cleared');

    eventBus.$emit('clearTextareaEvent');

    await flushPromises();

    expect((textarea.element as HTMLTextAreaElement).value).toBe('');

    wrapper.unmount();
  });
});
