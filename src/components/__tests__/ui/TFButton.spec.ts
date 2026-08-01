import { flushPromises, mount } from '@vue/test-utils';
import TFButton from '@/components/ui/TFButton.vue';
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import eventBus from '@/utils/eventBus';
import axios from 'axios';


type TFButtonProps = {
  actionType?: 'submit' | 'reset' | 'request';
  requestOptions?: {
    method: string;
    url: string;
    params?: string | object;
    data?: string | object | FormData;
  };
  requestEmitter?: string;
  requestSuccessEmitter?: string;
  requestFailureEmitter?: string;
  requestFinallyEmitter?: string;
  defaultClickEmitter?: {
    event: string,
    params?: {
      [key: string]: string|boolean|number|object
    },
  };
  reloadAfterAction?: boolean;
  reloadAfterActionAndFail?: boolean;
  confirmAction?: boolean;
  confirmMessage?: string;
  formName?: string;
  disabled?: boolean;
  disabledSetOfButtons?: boolean;
  disableEventListener?: string;
  clearEmitter?: string;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  outline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  dataCy?: string;
  content?: string;
};

vi.mock('axios');

const initialProps: TFButtonProps = {
  disabled: false,
};

const createForm = (focus = true) => {
  const form = document.createElement('form');
  form.setAttribute('name', 'test_form');

  const input = document.createElement('input');

  form.appendChild(input);
  document.body.appendChild(form);

  if (focus) {
    input.focus();
  }

  return {
    form,
    input,
    removeForm: () => document.body.removeChild(form),
  };
};


describe('TFButton', () => {
  const mountFactory = async (props: Partial<TFButtonProps>, slots?: {}) => {
    return mount(TFButton, {
      props: {
        ...initialProps,
        ...props,
      },
      slots: slots,
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    window.confirmation = vi.fn();
  });

  it('should render content if "content" prop is provided', async () => {
    const wrapper = await mountFactory({ content: 'hello world' });

    expect(wrapper.text()).toBe('hello world');
  });

  it('should render default slot content if "content" is empty', async () => {
    const wrapper = await mountFactory(
      { content: '' },
      {
        default: 'Default Slot'
      }
    );

    expect(wrapper.text()).toBe('Default Slot');
  });

  it('should render button with correct class based on variant', async () => {
    const wrapper = await mountFactory({
      variant: 'danger'
    });
    expect(wrapper.classes()).toContain('tf-btn-danger');
    wrapper.unmount();
  });

  it('should include size class when size is provided', async () => {
    const wrapper = await mountFactory({
      size: 'sm'
    });

    expect(wrapper.classes()).toContain('tf-btn-sm');
    wrapper.unmount();
  });

  it('should use outline class when outline is true', async () => {
    const wrapper = await mountFactory({
      outline: true
    });

    expect(wrapper.classes()).toContain('tf-btn-default-outline');

    wrapper.unmount();
  });

  it('should be disabled when `disabled` prop is true', async () => {
    const wrapper = await mountFactory({ disabled: true });
    expect(wrapper.attributes('disabled')).toBeDefined();
    wrapper.unmount();
  });

  it('should change disabled when `disabled` prop is changed', async () => {
    const wrapper = await mountFactory({ disabled: true });
    expect(wrapper.attributes('disabled')).toBeDefined();

    await wrapper.setProps({ disabled: false });

    expect(wrapper.attributes('disabled')).toBeUndefined();
    wrapper.unmount();
  });

  it('should be disabled when emit disableEventListener called', async () => {

    const testValues = [
      [{ nestedKey: 'value' }, true],
      ['some string', true],
      [[123, 'some string', { key: 'value' }], true],
      [123, true],
      [null, false],
      [false, false],
      ['', false],
      [[], false],
      [{}, false]
    ];

    const wrapper = await mountFactory({
      disableEventListener: 'disableEvent'
    });

    for (const [key, expectedValue] of testValues) {
      eventBus.$emit('disableEvent', key);

      await wrapper.vm.$nextTick();

      if (expectedValue) {
        expect(wrapper.attributes('disabled')).toBeUndefined();
      } else {
        expect(wrapper.attributes('disabled')).toBeDefined();
      }
    }

    wrapper.unmount();
  });

  it('should emit click event when button is clicked', async () => {
    const wrapper = await mountFactory({
      defaultClickEmitter: {
        event: 'event_bus_click',
        params: {
          key: 'value',
        }
      }
    });
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');


    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(eventBus.$emit).toHaveBeenCalledWith('event_bus_click', { 'key': 'value' });
    wrapper.unmount();
  });

  it('should call `formSubmit` method on Enter key when inside valid form', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'test_form',
    });

    const { form, input, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event);

    await flushPromises();

    expect(form.submit).toHaveBeenCalled();

    wrapper.unmount();

    removeForm();
  });

  it('should not call `formSubmit` method if actionType is not submit', async () => {
    const wrapper = await mountFactory({
      actionType: 'reset',
      formName: 'test_form',
    });

    const { form, input, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event);

    await flushPromises();

    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();

    removeForm();
  });

  it('should not call `formSubmit` method if formName is missing', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: '',
    });

    const { form, input, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event);

    await flushPromises();

    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();

    removeForm();
  });

  it('should not call `formSubmit` method if key is not Enter', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'formName',
    });

    const { form, input, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    input.dispatchEvent(event);

    await flushPromises();

    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();

    removeForm();
  });

  it('should not call `formSubmit` if target is not editable', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'formName',
    });

    const form = document.createElement('form');

    form.setAttribute('name', 'test_form');
    document.body.appendChild(form);

    const div = document.createElement('div');
    form.appendChild(div);
    div.focus();

    document.body.appendChild(form);

    form.submit = vi.fn();

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    div.dispatchEvent(event);

    await flushPromises();
    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();
    document.body.removeChild(form);
  });

  it('should not call `formSubmit` if button is disabled', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'test_form',
      disabled: true,
    });

    const { form, input, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event);

    await flushPromises();

    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();

    removeForm();
  });

  it('should show confirmation dialog if `confirmAction` is true when actionType is `submit`', async () => {
    const confirmSpy = vi.spyOn(window, 'confirmation');
    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'test_form',
      confirmAction: true,
      confirmMessage: 'Test message'
    });

    const { form, removeForm } = createForm();

    form.checkValidity = () => true;
    await wrapper.trigger('click');

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.toSatisfy(val => val === null || typeof val === 'function'),
      'Test message'
    );

    wrapper.unmount();

    removeForm();
  });

  it('should call `reset` method when actionType is `reset`', async () => {

    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({
      actionType: 'reset',
      clearEmitter: 'clearForm',
      formName: 'test_form_reset'
    });

    const form = document.createElement('form');
    form.setAttribute('name', 'test_form_reset');
    document.body.appendChild(form);

    const resetMock = vi.fn();
    form.reset = resetMock;

    await wrapper.trigger('click');

    expect(eventBus.$emit).toHaveBeenCalledWith('clearForm');
    expect(resetMock).toHaveBeenCalled();

    wrapper.unmount();
    document.body.removeChild(form);
  });

  it('should call `request` method when actionType is `request`', async () => {
    const wrapper = await mountFactory({
      actionType: 'request',
      requestOptions: { method: 'get', url: '/api' },
      disabledSetOfButtons: true,
    });

    vi.mocked(axios).mockResolvedValue({});

    await wrapper.trigger('click');

    expect(wrapper.attributes('data-submit-disabled')).toBe('true');
    expect(axios).toHaveBeenCalledWith({ method: 'get', url: '/api' });

    wrapper.unmount();
  });

  it('should not submit form if it is invalid', async () => {
    const wrapper = await mountFactory(
      {
        actionType: 'submit',
        formName: 'formName'
      }
    );

    const form = document.createElement('form');
    form.setAttribute('name', 'formName');
    document.body.appendChild(form);

    form.submit = vi.fn();
    form.checkValidity = vi.fn().mockReturnValue(false);

    await wrapper.trigger('click');

    expect(form.submit).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('should call `request` and emit success event on success', async () => {
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({
      actionType: 'request',
      requestEmitter: 'requestEvent',
      requestSuccessEmitter: 'requestSuccessEvent',
      requestFinallyEmitter: 'requestFinallyEmitter',
      requestOptions: { method: 'GET', url: '/api' },
    });

    vi.mocked(axios).mockResolvedValue({ ok : true });

    await wrapper.trigger('click');

    expect(eventBus.$emit).toHaveBeenCalledWith('requestEvent');

    await flushPromises();

    expect(eventBus.$emit).toHaveBeenCalledWith('requestSuccessEvent', { ok : true });
    expect(eventBus.$emit).toHaveBeenCalledWith('requestFinallyEmitter');

    wrapper.unmount();
  });

  it('should emit failure event on request error', async () => {
    vi.spyOn(eventBus, '$emit').mockResolvedValue('');

    const wrapper = await mountFactory({
      actionType: 'request',
      requestEmitter: 'requestEvent',
      requestFailureEmitter: 'requestFailureEvent',
      requestFinallyEmitter: 'requestFinallyEmitter',
      requestOptions: { method: 'GET', url: '/api' },
    });

    vi.mocked(axios).mockRejectedValue(new Error('Request failed'));

    await wrapper.trigger('click');

    expect(eventBus.$emit).toHaveBeenCalledWith('requestFailureEvent', expect.any(Error));
    expect(eventBus.$emit).toHaveBeenCalledWith('requestFinallyEmitter');

    wrapper.unmount();
  });

  it('should reload page if `reloadAfterAction` is true', async () => {
    window.location = {
      ...window.location,
    };

    window.location.reload = vi.fn();

    vi.mocked(axios).mockResolvedValue({ ok : true });

    vi.useFakeTimers();


    const wrapper = await mountFactory({
      reloadAfterAction: true,
      actionType: 'request',
      requestOptions: { method: 'GET', url: '/api' },
    });

    await wrapper.trigger('click');

    vi.runAllTimers();

    expect(window.location.reload).toBeCalled();

    wrapper.unmount();
  });

  it('should reload page if `reloadAfterActionAndFail` is true', async () => {
    window.location = {
      ...window.location,
    };

    window.location.reload = vi.fn();

    vi.mocked(axios).mockRejectedValue(new Error('Request failed'));

    vi.useFakeTimers();

    const wrapper = await mountFactory({
      reloadAfterActionAndFail: true,
      actionType: 'request',
      requestOptions: { method: 'GET', url: '/api' },
    });

    await wrapper.trigger('click');

    vi.runAllTimers();

    expect(window.location.reload).toBeCalled();

    wrapper.unmount();
  });

  it('should show confirmation dialog if `confirmAction` is true', async () => {
    const confirmSpy = vi.spyOn(window, 'confirmation');
    const wrapper = await mountFactory({
      confirmAction: true,
      confirmMessage: 'Test message'
    });

    await wrapper.trigger('click');


    expect(confirmSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.toSatisfy(val => val === null || typeof val === 'function'),
      'Test message'
    );

    wrapper.unmount();
  });

  it('should call `callAction` when button is clicked and confirmation passes', async () => {

    vi.spyOn(window, 'confirmation').mockImplementation(onOk => {
      onOk();
    });

    const wrapper = await mountFactory({
      confirmAction: true
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();

    wrapper.unmount();
  });

  it('should be not disabled when button is clicked and confirmation does not pass', async () => {

    vi.spyOn(window, 'confirmation').mockImplementation(
      (onOk: (() => void) | null, onCancel: (() => void) | null) => {
        if (onCancel) onCancel();
      });

    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'test_form',
      confirmAction: true,
      confirmMessage: 'Test message'
    });

    const { form, removeForm } = createForm();

    form.submit = vi.fn();

    form.checkValidity = () => true;

    await wrapper.trigger('click');

    expect(form.submit).not.toHaveBeenCalled();
    wrapper.unmount();

    removeForm();
  });

  it('should not call `formSubmit` method when button is clicked and confirmation and confirmation passes', async () => {

    vi.spyOn(window, 'confirmation').mockImplementation(onOk => {
      onOk();
    });

    const wrapper = await mountFactory({
      actionType: 'submit',
      formName: 'test_form',
      confirmAction: true,
      confirmMessage: 'Test message'
    });

    const { form, removeForm } = createForm();

    form.submit = vi.fn();
    form.checkValidity = () => true;

    await wrapper.trigger('click');

    expect(form.submit).toHaveBeenCalled();
    wrapper.unmount();

    removeForm();
  });

  it('should call `formSubmit` and disable other buttons if `disabledSetOfButtons` is true', async () => {
    const wrapper = await mountFactory({
      actionType: 'submit',
      disabledSetOfButtons: true,
    });

    const button = document.createElement('button');
    button.setAttribute('data-submit-disabled', 'true');
    document.body.appendChild(button);

    await wrapper.trigger('click');

    expect(button.disabled).toBe(true);
    wrapper.unmount();
  });
});
