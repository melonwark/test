import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TFMultiselect from '@/components/form/TFMultiselect.vue';
import type { TMultiselectValue } from '@/types/components';
import axios from 'axios';
import eventBus from '@/utils/eventBus';
import { h } from 'vue';

const eventBusOnClearName = 'clear';
vi.mock('../../../utils/eventBus', () => ({
  default: {
    $on: vi.fn((event, callback) => {
      if (event === eventBusOnClearName) {
        callback();
      }
    }),
    $once: vi.fn(),
    $off: vi.fn(),
    $emit: vi.fn(),
  },
}));

describe('TFMultiselect.vue', () => {
  type TFMultiselectProps = {
    id?: string;
    name?: string;
    labelName?: string;
    options?: (string | number | object)[];
    value?: TMultiselectValue | TMultiselectValue[];
    optionType?: string;
    multiple?: boolean;
    searchable?: true;
    autocomplete?: string;
    insertGroupClipboard?: boolean;
    autocompleteQueryKey?: string;
    searchOnMounted?: boolean;
    isDraggable?: boolean;
    eventBusEmitter?: string;
    eventBusClearListener?: string;
    hasError?: boolean;
    errorFeedback?: string;
    hasActions?: boolean;
  };

  const mountFactory = async (propsData: TFMultiselectProps) => {
    return mount(TFMultiselect, {
      props: {
        ...propsData,
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Check correctness innerValue formation', () => {
    // eslint-disable-next-line max-len
    it('should set innerValue to the first element of :options when :required prop is provided', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: undefined,
          optionType: 'notObject',
          required: true,
        },
      });

      expect(wrapper.vm.innerValue).toBe('item1');

      wrapper.unmount();
    });
    // eslint-disable-next-line max-len
    it('should correctly handle multiple values when :options contains nullable values and literal object type is used', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: [
            { key: 'key1', value: 'value1' },
            { key: null, value: 'NULL' },
            { key: 'key3', value: 'value3' },
          ],
          labelName: 'value',
          trackBy: 'key',
          multiple: true,
          value: ['key3', null],
        },
      });

      expect(wrapper.vm.innerValue).toStrictEqual([
        { key: 'key3', value: 'value3' },
        { key: null, value: 'NULL' },
      ]);

      wrapper.unmount();
    });
    // eslint-disable-next-line max-len
    it('should set innerValue to the selected primitive value when optionType is "notObject"', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: 'item2',
          optionType: 'notObject',
        },
      });

      expect(wrapper.vm.innerValue).toBe('item2');

      wrapper.unmount();
    });

    it('should handle single selection with literal object value type', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: [
            { id: 'id1', name: 'name1' },
            { id: 'id2', name: 'name2' },
            { id: 'id3', name: 'name3' },
          ],
          value: 'id2',
        },
      });

      expect(wrapper.vm.innerValue).toStrictEqual({ id: 'id2', name: 'name2' });

      wrapper.unmount();
    });

    it('should handle multiple selection with primitive value type', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: ['item3', 'item2'],
          multiple: true,
          optionType: 'notObject',
        },
      });

      expect(wrapper.vm.innerValue).toStrictEqual(['item3', 'item2']);

      wrapper.unmount();
    });

    it('should handle multiple selection with literal object value type', () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: [
            { id: 'id1', name: 'name1' },
            { id: 'id2', name: 'name2' },
            { id: 'id3', name: 'name3' },
          ],
          multiple: true,
          value: [
            { id: 'id1', name: 'name1' },
            { id: 'id2', name: 'name2' },
          ],
        },
      });

      expect(wrapper.vm.innerValue).toStrictEqual([
        { id: 'id1', name: 'name1' },
        { id: 'id2', name: 'name2' },
      ]);

      wrapper.unmount();
    });
  });

  describe('Correct render hidden inputs', () => {
    it('should add element value to DOM for single selection', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
      });

      const inputElement = wrapper.find('input[name="select"]')
        .element as HTMLInputElement;
      expect(inputElement.value).toBe('');
      expect(inputElement.value).toBeFalsy();
      expect(inputElement).toBeTruthy();

      wrapper.unmount();
    });
    it('should ensure single element value equals :value prop and is of type string', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        options: [1, 2, 'String'],
        value: 2,
        optionType: 'Array',
      });

      expect(wrapper.vm.innerValue).toBe(2);
      const inputElement = wrapper.find('input[name="select"]')
        .element as HTMLInputElement;

      expect(inputElement.value).toBe('2');

      await wrapper.setProps({ value: 'String' });

      expect(inputElement.value).toBe('String');

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should set single select element value to an empty string when :value prop is null', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        options: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          { id: 'id3', name: 'name3' },
        ],
        multiple: false,
        value: null,
      });
      const inputElement = wrapper.find('input[name="select"]')
        .element as HTMLInputElement;

      expect(inputElement.value).toBe('');

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should ensure multiple select elements list is empty when :value prop is missing', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        optionType: 'Array',
        multiple: true,
      });
      const inputElements = wrapper.findAll('input[name="select"]');
      expect(inputElements).toHaveLength(0);

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should set multiple select elements values equal to :value prop and have attr `name="multiple-select[]"`', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'multiple-select',
        multiple: true,
        options: [1, 2, 'string'],
        value: [1, 'string'],
        optionType: 'Array',
      });
      const inputHiddenList = wrapper.findAll('input[type="hidden"]');

      inputHiddenList.forEach(item => {
        expect(item.attributes('name')).toBe('multiple-select[]');
      });

      const firstInput = inputHiddenList.at(0);
      const secondInput = inputHiddenList.at(1);

      if (firstInput && secondInput) {
        expect((firstInput.element as HTMLInputElement).value).toBe('1');
        expect((secondInput.element as HTMLInputElement).value).toBe('string');
      } else {
        throw new Error('Expected hidden input elements not found');
      }

      wrapper.unmount();
    });

    it('Multiple: elements should not be added to the DOM when :value prop is null', async () => {
      const wrapper = await mountFactory({
        multiple: true,
        options: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          { id: 'id3', name: 'name3' },
        ],
        value: null,
      });
      const inputHiddenList = wrapper.findAll('input[type="hidden"]');

      expect(inputHiddenList).toHaveLength(0);

      wrapper.unmount();
    });
  });

  describe('Check props validators', () => {
    it('should output an error to the console if :options prop has falsy values', () => {
      const consoleMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      shallowMount(TFMultiselect, {
        propsData: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          options: [1, 'string', undefined],
        },
      });

      expect(consoleMock).toHaveBeenCalled();
      expect(consoleMock.mock.calls[0][0]).toContain(
        '[:options] prop validator err: array contains invalid types',
      );
      consoleMock.mockReset();
    });
  });

  describe('Check watchers', () => {
    it('should reflect changes in innerValue field when :value prop changes', async () => {
      const wrapper = await mountFactory({
        name: 'select',
        options: [1, 2, 3],
        multiple: false,
        value: 1,
      });

      await wrapper.setProps({ value: 2 });
      expect(wrapper.vm.innerValue).toBe(2);

      wrapper.unmount();
    });

    it('should reflect changes in selectOptions field when :options prop changes', async () => {
      const wrapper = await mountFactory({
        name: 'select',
        options: [1, 2, 3],
        multiple: false,
        value: 1,
      });

      await wrapper.setProps({ options: [1, 2, 3, 4] });

      expect(wrapper.vm.selectOptions).toStrictEqual([1, 2, 3, 4]);

      wrapper.unmount();
    });
  });

  describe('Check Search', () => {
    const mockOptionsList = {
      data: [
        { id: 'id1', name: 'name1' },
        { id: 'id2', name: 'name2' },
        { id: 'id3', name: 'name3' },
      ],
    };

    vi.spyOn(axios, 'get').mockResolvedValue(mockOptionsList);

    // eslint-disable-next-line max-len
    it('should call the deactivate method when search-input is clicked and :searchable prop is true and ', async () => {
      const wrapper = await mountFactory({
        options: ['item1', 'item2', 'item3'],
        name: 'searchable-select',
        value: [],
        multiple: true,
        optionType: 'notObject',
        searchable: true,
      });
      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });
      const selectDeactivateSpy = vi.spyOn(selectComponent.vm, 'deactivate');
      const searchInput = wrapper.find('.multiselect__input');

      await searchInput.trigger('click');

      expect(selectDeactivateSpy).toBeCalled();

      wrapper.unmount();
    });

    it('should execute a request to the API if the autocomplete prop is specified', async () => {

      vi.spyOn(axios, 'get').mockResolvedValue( { data: [] } );

      vi.useFakeTimers();

      const wrapper = await mountFactory({
        multiple: true,
        options: [],
        searchable: true,
        autocomplete: '/api/options',
      });
      const input = wrapper.find('.multiselect__input');

      await input.setValue('name1');

      vi.runAllTimers();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/options', {
        params: { q: 'name1' },
      });

      wrapper.unmount();
    });

    it('should use the query parameters specified in the autocomplete-query-key prop', async () => {

      vi.spyOn(axios, 'get').mockResolvedValue( { data: [] } );

      vi.useFakeTimers();

      const wrapper = await mountFactory({
        multiple: true,
        options: [],
        searchable: true,
        autocomplete: '/api/options',
        autocompleteQueryKey: 'example_query',
      });
      const input = wrapper.find('.multiselect__input');

      await input.setValue('name1');

      vi.runAllTimers();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/options', {
        params: { example_query: 'name1' },
      });

      wrapper.unmount();
    });

    it(`value of the "innerValue" field must be merged with the data when pasted from the clipboard
      when :insertGroupClipboard prop is true`, async () => {
      vi.useFakeTimers();

      vi.spyOn(axios, 'get').mockResolvedValue( { data: [
        { id: 'id3', name: 'name3' }]
      } );

      const wrapper = await mountFactory({
        multiple: true,
        options: [
          { id: 'id4', name: 'name4' },
          { id: 'id2', name: 'name2' },
        ],
        value: ['id4'],
        searchable: true,
        autocomplete: '/api/options',
        insertGroupClipboard: true,
      });
      const input = wrapper.find('.multiselect__input');

      await input.setValue('name3|name5');

      vi.runAllTimers();

      await flushPromises();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/options', {
        params: { q: 'name3,name5' },
      });

      expect(wrapper.vm.innerValue).toStrictEqual([
        { id: 'id4', name: 'name4' },
        { id: 'id3', name: 'name3' },
      ]);

      wrapper.unmount();
    });

    it('should call the API request if the searchOnMounted input parameter is true', async () => {
      /* https://github.com/vuejs/test-utils/issues/775 */

      vi.spyOn(axios, 'get').mockResolvedValue( { data: [] } );

      vi.useFakeTimers();

      const wrapper = await mountFactory({
        options: [],
        value: ['id4'],
        optionType: 'notObject',
        searchOnMounted: true,
        searchable: true,
        autocomplete: '/api/options',
      });

      vi.runAllTimers();

      await flushPromises();

      expect(axios.get).toHaveBeenCalled();

      wrapper.unmount();
    });
  });

  describe('Check :draggable prop', () => {
    it('Correct render draggable', async () => {
      const wrapper = await mountFactory({
        multiple: true,
        options: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
        ],
        value: ['id2'],
        isDraggable: true,
      });

      expect(wrapper.find('.draggable-wrapper').exists()).toBe(true);

      wrapper.unmount();
    });

    it('should remove the clicked tag from innerValue', async () => {
      const wrapper = await mountFactory({
        multiple: true,
        options: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          { id: 'id3', name: 'name3' },
        ],
        value: ['id2', 'id3', 'id1'],
        isDraggable: true,
      });

      const removableTag = wrapper.findAll('.multiselect__tag-remove-btn');
      await removableTag[1].trigger('click');

      const innerValue = wrapper.vm.innerValue;
      if (Array.isArray(innerValue)) {
        expect(innerValue.length).toBe(2);
        expect(innerValue).toStrictEqual(
          [{ id: 'id2', name: 'name2' } , { id: 'id1', name: 'name1' }]
        );
      } else {
        console.error('innerValue is not an array:', innerValue);
      }
    });

    // eslint-disable-next-line max-len
    it('search input should be focused/unfocused when mouseleave event called and :searchable prop changed', async () => {
      const wrapper = mount(TFMultiselect, {
        propsData: {
          multiple: true,
          options: [
            { id: 'id1', name: 'name1' },
            { id: 'id2', name: 'name2' },
          ],
          value: ['id2'],
          isDraggable: true,
        },
        attachTo: document.body,
      });

      const tagsWrapper = wrapper.find('.multiselect__tags > div');
      const multiselectElement = wrapper.find('.multiselect');
      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });
      selectComponent.vm.activate();

      // when :searchable prop is true
      await wrapper.setProps({ searchable: true }).then(() => {
        tagsWrapper.trigger('mouseleave');

        expect(wrapper.find('.multiselect__input').exists()).toBe(true);
        expect(wrapper.find('.multiselect__input').element).toBe(
          document.activeElement,
        );
      });

      // when :searchable prop is false
      await wrapper.setProps({ searchable: false }).then(async () => {
        await tagsWrapper.trigger('mouseleave');
        await flushPromises();
        expect(multiselectElement.element).toBe(document.activeElement);
      });

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('search input should be focused/unfocused when mousedown event called and :searchable prop changed', async () => {
      // const draggableFocusSpy = jest.spyOn(Multiselect.methods, 'draggableFocus');
      const wrapper = mount(TFMultiselect, {
        propsData: {
          multiple: true,
          options: [
            { id: 'id1', name: 'name1' },
            { id: 'id2', name: 'name2' },
          ],
          value: ['id2'],
          isDraggable: true,
          searchable: false,
        },
        attachTo: document.body,
      });
      const draggableWrapper = wrapper.find('.draggable-wrapper');
      const multiselectElement = wrapper.find('.multiselect');
      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });

      selectComponent.vm.activate();

      expect(wrapper.vm.isOpen).toBe(true);

      // when :searchable prop is true
      await wrapper.setProps({ searchable: true }).then(() => {
        draggableWrapper.trigger('mousedown');

        expect(wrapper.find('.multiselect__input').exists()).toBe(true);
        expect(wrapper.find('.multiselect__input').element).not.toBe(
          document.activeElement,
        );
      });

      // when :searchable prop is false
      await wrapper.setProps({ searchable: false }).then(() => {
        draggableWrapper.trigger('mousedown');

        expect(multiselectElement.element).not.toBe(document.activeElement);
      });

      wrapper.unmount();
    });
  });

  describe('Check additional', () => {

    // eslint-disable-next-line max-len
    it('should assign an empty array to the innerValue field when calling the clear method for multiple', async () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: ['item2', 'item3'],
          optionType: 'notObject',
          multiple: true,
          required: false,
        },
      });

      wrapper.vm.clear();
      expect(wrapper.vm.innerValue).toStrictEqual([]);

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should assign an null to the innerValue field when calling the clear method for single', async () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: 'item1',
          optionType: 'notObject',
        },
      });

      wrapper.vm.clear();
      expect(wrapper.vm.innerValue).toBeNull();

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should assign the first element from the list of options to the InnerValue field when calling the clear method, and prop required is true', async () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: ['item3'],
          optionType: 'notObject',
          required: true,
        },
      });

      wrapper.vm.clear();
      expect(wrapper.vm.innerValue).toBe('item1');

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should change window history when selecting an element from the options list if prop :reloadPageOnSelect is true', async () => {
      window.location = {
        ...window.location,
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      };

      window.history.pushState = vi.fn();
      window.location.reload = vi.fn();

      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        options: ['item1', 'item2', 'item3'],
        value: ['item1'],
        optionType: 'notObject',
      });

      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });

      selectComponent.vm.select('item2');

      await wrapper.setProps({ reloadPageOnSelect: true }).then(() => {
        selectComponent.vm.select('item3');
        const url = `${window.location.href}?select=${wrapper.vm.innerValue}`;

        expect(window.history.pushState).toBeCalledWith({}, '', url);
        expect(window.location.reload).toBeCalled();
      });

      await wrapper
        .setProps({ reloadPageOnSelect: true, multiple: true, value: ['item1'] })
        .then(() => {
          selectComponent.vm.select('item3');
          const url = `${window.location.href}?select=item1%2Citem3%2C`;

          expect(window.history.pushState).toBeCalledWith({}, '', url);
        });

      wrapper.unmount();
    });

    it('should call a custom event when the callEmitter method is called', async () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: 'item2',
          optionType: 'notObject'
        },
      });

      wrapper.vm.callEmitter();

      expect(wrapper.emitted().input[0]).toEqual(['item2']);

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('should fire the "eventBus" event when callEmitter is called and eventBusEmitter prop is specified', async () => {
      const wrapper = shallowMount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: 'item2',
          optionType: 'notObject',
          eventBusEmitter: 'some-event'
        },
      });

      wrapper.vm.callEmitter();

      expect(eventBus.$emit).toHaveBeenCalledWith('some-event', 'item2');

      wrapper.unmount();
    });

    // eslint-disable-next-line max-len
    it('Should call default toggle method when the wrapper\'s toggleOptionsList method is invoked.', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        options: ['item1', 'item2', 'item3'],
        value: ['item1'],
        optionType: 'notObject',
      });
      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });
      const toggleSpy = vi.spyOn(selectComponent.vm, 'toggle');
      wrapper.vm.toggleOptionsList();

      expect(toggleSpy).toBeCalled();

      wrapper.unmount();
    });

    it('should call default removeLastElement method when removeLastTag is called', async () => {
      const wrapper = await mountFactory({
        id: 'MultiselectId',
        name: 'select',
        options: ['item1', 'item2', 'item3'],
        value: ['item1'],
        optionType: 'notObject',
      });
      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });
      const selectRemoveLastElementSpy = vi.spyOn(selectComponent.vm, 'removeLastElement');

      wrapper.vm.removeLastTag();

      expect(selectRemoveLastElementSpy).toBeCalled();

      wrapper.unmount();
    });

    it('should call default deactivate method when deactivate method is called', async () => {
      const wrapper = await mountFactory({
        options: ['item1', 'item2', 'item3'],
        multiple: true,
        optionType: 'notObject',
        value: []
      });

      const selectComponent = wrapper.findComponent({ ref: 'selectRef' });
      const selectDeactivateSpy = vi.spyOn(selectComponent.vm, 'deactivate');

      wrapper.vm.deactivate();

      await flushPromises();

      expect(selectDeactivateSpy).toBeCalled();

      wrapper.unmount();
    });

    it('should listen for the clear event when clearReportFilters is called', async () => {
      const wrapper = await mountFactory({
        options: ['item1', 'item2', 'item3'],
        value: 'item2',
        optionType: 'notObject',
        eventBusClearListener: eventBusOnClearName
      });

      eventBus.$emit('clear');
      //  await wrapper.vm.$nextTick();
      expect(eventBus.$emit).toHaveBeenCalledWith(eventBusOnClearName);
      expect(wrapper.vm.innerValue).toBeNull();

      wrapper.unmount();
    });

    it('should render text with an error if prop hasError is true', async () => {
      const wrapper = await mountFactory({
        options: ['item1', 'item2', 'item3'],
        value: 'item2',
        optionType: 'notObject',
        hasError: true,
        errorFeedback: 'Test error feedback!'
      });

      const errorElement = wrapper.find('.error-feedback.invalid-feedback');
      expect(errorElement.exists()).toBe(true);
      expect(errorElement.text()).toBe('Test error feedback!');

      wrapper.unmount();
    });

    it('should the actions slot be rendered if the hasActions prop is true', () => {
      const wrapper =  mount(TFMultiselect, {
        propsData: {
          options: ['item1', 'item2', 'item3'],
          value: 'item2',
          optionType: 'notObject',
          hasActions: true
        },
        slots: {
          actions: h('div', {}, 'Actions Slot')
        }
      });

      const slotElement = wrapper.find('.combo-box-item');
      expect(slotElement.exists()).toBe(true);
      expect(slotElement.text()).toBe('Actions Slot');

      wrapper.unmount();
    });

  });

});
