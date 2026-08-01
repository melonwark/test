import { flushPromises, mount } from '@vue/test-utils';
import TFInputCheckbox from '@/components/form/TFInputCheckbox.vue';
import { describe, it, expect } from 'vitest';
import { defineComponent, ref } from 'vue';

describe('TFInputCheckbox', () => {
  const mountFactory = (props = {}) => {
    return mount(TFInputCheckbox, {
      props: {
        id: 'checkbox_id',
        name: 'checkbox_name',
        label: 'Test Checkbox',
        checkedValue: 'checked_value',
        uncheckedValue: 'unchecked_value',
        ...props,
      },
    });
  };

  it('should render label correctly', () => {
    const wrapper = mountFactory();
    expect(wrapper.find('label').text()).toBe('Test Checkbox');
  });

  it('should emit onChange when checkbox is toggled', async () => {
    const wrapper = mountFactory({ checked: false });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    expect(wrapper.emitted('onChange')).toBeTruthy();
    expect(wrapper.emitted('onChange')).toStrictEqual([['checked_value']]);
  });

  it('should reload page with query-params when checkbox is changed', async () => {
    const wrapper = mountFactory({
      reloadAfterAction: true,
      name: 'checkbox_query_name'
    });
    const url = 'http://test-checkbox-query';
    window = Object.create(window);

    Object.defineProperty(window, 'location', {
      value: {
        href: url,
        pathname: 'test-checkbox-query'
      },
      writable: true
    });

    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    expect(window.location.href).toContain('checkbox_query_name=checked_value');
  });

  it('should update innerValue when checked prop changes', async () => {
    const wrapper = mountFactory({
      checked: false,
      checkedValue: 'checked_value',
      uncheckedValue: 'unchecked_value',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.innerValue).toBe('unchecked_value');

    await wrapper.setProps({ checked: true });
    expect(wrapper.vm.innerValue).toBe('checked_value');

    await wrapper.setProps({ checked: false });
    expect(wrapper.vm.innerValue).toBe('unchecked_value');
  });

  it('should render hidden input when checkbox is unchecked', () => {
    const wrapper = mountFactory({ checked: false });
    const hiddenInput = wrapper.find('input[type="hidden"]');
    expect(hiddenInput.exists()).toBe(true);
    expect(hiddenInput.attributes('value')).toBe('unchecked_value');
  });

  it('should not render hidden input when checkbox is checked', async () => {
    const wrapper = mountFactory({ checked: true });

    await wrapper.vm.$nextTick();

    const hiddenInput = wrapper.find('input[type="hidden"]');
    expect(hiddenInput.exists()).toBe(false);
  });

  it('should apply "tf-switcher" class when mode is "switcher"', () => {
    const wrapper = mountFactory({ mode: 'switcher' });

    const rootDiv = wrapper.find('.rendered');
    expect(rootDiv.classes()).toContain('tf-switcher');
    expect(rootDiv.classes()).not.toContain('tf-checkbox');
  });

  it('should apply default "tf-checkbox" class when mode is not set', () => {
    const wrapper = mountFactory();

    const rootDiv = wrapper.find('.rendered');
    expect(rootDiv.classes()).toContain('tf-checkbox');
    expect(rootDiv.classes()).not.toContain('tf-switcher');
  });

  it('should apply "disabled" attribute when disabled is true', () => {
    const wrapper = mountFactory({ disabled: true });
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.attributes('disabled')).toBeDefined();
  });

  it('should set correct value attribute for checkbox input', () => {
    const wrapper = mountFactory();
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.attributes('value')).toBe('checked_value');
  });

  it('should emit value on mount if `callEmitterOnMount` is true', async() => {
    const wrapper = mountFactory(
      {
        checkedValue: 'checked_value_emitted',
        uncheckedValue: 'unchecked_value_emitted',
        callEmitterOnMount: true,
        checked: true
      }
    );

    await flushPromises();
    expect(wrapper.emitted('onChange')).toStrictEqual([['checked_value_emitted']]);
  });

  it('should not emit value on mount if `callEmitterOnMount` is false', async() => {
    const wrapper = mountFactory(
      {
        callEmitterOnMount: false,
      }
    );

    await flushPromises();

    expect(wrapper.emitted('onChange')).toBeUndefined();
  });
});

describe('TFInputCheckbox form integration', () => {
  const mountWithForm = (props = {}) => {
    return mount(defineComponent({
      components: { TFInputCheckbox },
      setup() {
        const formRef = ref<HTMLFormElement | null>(null);
        const formData = ref<Record<string, FormDataEntryValue>>({});

        const onSubmit = (e: Event) => {
          e.preventDefault();
          if (formRef.value) {
            const data = new FormData(formRef.value);
            formData.value = Object.fromEntries(data.entries());
          }
        };

        return { formRef, formData, onSubmit };
      },
      template: `
        <form @submit="onSubmit" ref="formRef">
          <TFInputCheckbox
            name="checkbox_name"
            :checked-value="'check'"
            :unchecked-value="'uncheck'"
            v-bind="props"
          />
          <button type="submit">Submit</button>
        </form>
      `,
      props: {
        props: {
          type: Object,
          default: () => ({})
        }
      }
    }), {
      props: {
        props
      }
    });
  };

  it('should include checked value in FormData when checkbox is checked', async () => {
    const wrapper = mountWithForm({ checked: true });

    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');

    expect(wrapper.vm.formData).toEqual({
      checkbox_name: 'check',
    });
  });

  it('should include unchecked value in FormData when checkbox is unchecked', async () => {
    const wrapper = mountWithForm({ checked: false });

    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');

    expect(wrapper.vm.formData).toEqual({
      checkbox_name: 'uncheck',
    });
  });

  it('should not include unchecked value in FormData if `sendUnchecked` is false', async () => {
    const wrapper = mountWithForm({ sendUnchecked: false });

    await wrapper.find('form').trigger('submit');

    expect(wrapper.vm.formData).toEqual({});
  });
});
