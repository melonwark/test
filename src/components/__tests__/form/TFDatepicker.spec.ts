import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TFDatepicker from '@/components/form/TFDatepicker.vue';
import eventBus from '@/utils/eventBus';

const randomDate = (start: Date, end: Date) => new Date(start.getTime()
  + Math.random() * (end.getTime() - start.getTime())).getTime();
const allTimeDateStart = new Date(2010, 1, 1);
const randomRange = [
  randomDate(allTimeDateStart, new Date()),
  randomDate(allTimeDateStart, new Date())
].sort((a, b) => a - b)
  .map(el => new Date(el).toJSON().slice(0, 10));

const eventBusOnClearName = 'clear';


describe('TFDatepicker', () => {

  type TFDatepickerProps = InstanceType<typeof TFDatepicker>['$props'];

  const mountFactory = async (propsData: Partial<TFDatepickerProps> = {}) => {
    const defaultProps: TFDatepickerProps = {
      id: 'datepicker',
      dates: [],
      valueType: 'yyyy-MM-dd',
      singleDate: false,
      names: ['defaultName'],
      inputClasses: '',
      labelClasses: '',
      containerClass: '',
      hasLabel: true,
      title: '',
      dataCy: '',
      eventBusClearListener: ''
    };

    return mount(TFDatepicker, {
      props: {
        ...defaultProps,
        ...propsData,
      },
      attachTo: document.body
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component correctly', async () => {
    const wrapper = await mountFactory({ names: ['date1'] });

    expect(wrapper.find('input').exists()).toBe(true);

    wrapper.unmount();
  });

  it('should correctly fill inputs for single date prop', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1'],
        dates: ['2023-02-01'],
        singleDate: true,
      }
    );

    const inputHidden = wrapper.find('input[type="hidden"]')
      .element as HTMLInputElement;
    const pickerInput = wrapper.find('input')
      .element as HTMLInputElement;

    expect(pickerInput.value).toEqual('2023-02-01');
    expect(inputHidden.value).toEqual('2023-02-01');
    expect(inputHidden.name).toEqual('date1');

    wrapper.unmount();
  });

  it('should correctly assign a single date value to the object', async () => {
    const wrapper = await mountFactory({
      names: ['date1'],
      dates: ['2023-02-01'],
      singleDate: true,
    });

    const datepicker = wrapper.vm;

    datepicker.range = '2023-02-01';

    expect(datepicker.prepareDates).toEqual({ date1: '2023-02-01' });

    wrapper.unmount();
  });

  it('should correctly fill inputs for multiple range', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1', 'date2'],
        dates: ['2024-12-12', '2024-12-19']
      }
    );
    const hiddenInputCollection = wrapper.findAll('input[type="hidden"]');
    const pickerInput = wrapper.find('input')
      .element as HTMLInputElement;
    expect(pickerInput.value).toEqual('2024-12-12 - 2024-12-19');

    expect((hiddenInputCollection.at(0)?.element as HTMLInputElement).value).toBe('2024-12-12');
    expect((hiddenInputCollection.at(1)?.element as HTMLInputElement).value).toBe('2024-12-19');

    expect(hiddenInputCollection.at(0)?.attributes().name).toBe('date1');
    expect(hiddenInputCollection.at(1)?.attributes().name).toBe('date2');

    wrapper.unmount();
  });

  it('should always have an active element in the shortcut bar', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1', 'date2'],
      }
    );
    const shortcutsDatesList: { label: string; value: Date[]; noTz: boolean; slot: string; }[] = [];
    wrapper.vm.shortcuts.forEach(el => shortcutsDatesList.push(el));

    const randomIndex = Math.floor(Math.random() * (shortcutsDatesList.length - 1));
    const randomShortcutsDatesListItemDates = shortcutsDatesList[randomIndex].value
      .map(el => el.toJSON().slice(0, 10));
    const randomShortcut = wrapper.vm.shortcuts[randomIndex];

    await wrapper.setProps({ dates: randomShortcutsDatesListItemDates });
    wrapper.vm.initializeDateRange();

    const datepicker = wrapper.findComponent({ ref: 'datepickerRef' });
    const datepickerInput = wrapper.find('[data-test-id="dp-input"]');

    datepicker.vm.clearValue();
    await datepickerInput.trigger('click');

    await wrapper.vm.$nextTick();

    const activeElements = wrapper.findAll('.dp--preset-range.active');
    const activeElement = activeElements
      .find(el => el.text() === randomShortcut.label);
    expect(activeElement).toBeTruthy();

    //set active rage when select dates from popup

    wrapper.vm.selectDates(randomRange);
    expect(wrapper.find('.dp--preset-range.active')).toBeTruthy();

    wrapper.unmount();
  });

  it('should call presetDate with correct value on space key press', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1', 'date2'],
        dates: ['2024-12-12', '2024-12-19']
      }
    );

    const datepickerInput = wrapper.find('[data-test-id="dp-input"]');

    await datepickerInput.trigger('click');

    const shortcut = wrapper.find('.dp--preset-range');

    await shortcut.trigger('keyup.space');

    const prepareRange = Array.isArray(wrapper.vm.range)
      ?  wrapper.vm.range.map(el => (new Date(el).toJSON().slice(0, 10)))
      :  ['2024-12-12', '2024-12-19'];

    expect(prepareRange).not.toEqual(['2024-12-12', '2024-12-19']);

    wrapper.unmount();
  });

  it('Should switch disabled attribute on input when inputDisable/inputActivate is called', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1'],
        singleDate: true
      }
    );
    const label = wrapper.find('label');
    wrapper.vm.inputDisable();
    wrapper.vm.range = '';

    await flushPromises();

    expect(wrapper.vm.inputFocus).toBe(false);
    expect(label.classes()).not.toContain('active');

    wrapper.vm.inputActivate();
    wrapper.vm.range = '2024-12-20';

    await flushPromises();

    expect(wrapper.vm.inputFocus).toBe(true);
    expect(label.classes()).toContain('active');

    wrapper.unmount();
  });


  it('should call custom emit event', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1'],
        dates: ['2023-02-01']
      }
    );
    wrapper.vm.giveDate('testEmitEvent');
    expect(wrapper.emitted().testEmitEvent).toBeTruthy();

    expect(wrapper.emitted().testEmitEvent[0]).toEqual([{ date1: '2023-02-01' }]);

    wrapper.unmount();
  });

  it('should reset dates to the default value when listening to the eventBus event', async () => {
    const wrapper = await mountFactory(
      {
        names: ['date1', 'date2'],
        dates: [],
        defaultRange: ['2023-02-01', '2023-02-02'],
        eventBusClearListener: eventBusOnClearName
      }
    );
    const hiddenInputCollection = wrapper.findAll('input[type="hidden"]');
    const defaultRange = wrapper.props().defaultRange;

    eventBus.$emit('clear');

    await flushPromises();

    if (defaultRange) {
      expect((hiddenInputCollection.at(0)?.element as HTMLInputElement).value)
        .toBe(defaultRange[0]);
      expect((hiddenInputCollection.at(1)?.element as HTMLInputElement).value)
        .toBe(defaultRange[1]);
    }

    wrapper.unmount();
  });

  it('should reset date range to "dates" prop values when "clear" event is emitted', async () => {

    const wrapper = await mountFactory({
      names: ['date1', 'date2'],
      dates: ['2023-02-01', '2023-02-02'],
      eventBusClearListener: eventBusOnClearName,
    });

    const datepicker = wrapper.findComponent({ ref: 'datepickerRef' });
    const datepickerInput = wrapper.find('[data-test-id="dp-input"]');

    (datepickerInput.element as HTMLInputElement).value = randomRange.join(' - ');

    await datepickerInput.trigger('input');
    await datepicker.vm.selectDate(randomRange);

    const hiddenInputCollection = wrapper.findAll('input[type="hidden"]');
    expect((hiddenInputCollection.at(0)?.element as HTMLInputElement).value).toBe(randomRange[0]);
    expect((hiddenInputCollection.at(1)?.element as HTMLInputElement).value).toBe(randomRange[1]);

    eventBus.$emit('clear');

    await flushPromises();

    const defaultDates = wrapper.props().dates;

    if (defaultDates) {
      expect((hiddenInputCollection
        .at(0)?.element as HTMLInputElement).value).toBe(defaultDates[0]);
      expect((hiddenInputCollection
        .at(1)?.element as HTMLInputElement).value).toBe(defaultDates[1]);
    }

    wrapper.unmount();
  });




  it('should work if an invalid date range is specified', async () => {
    const consoleMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const wrapper = await mountFactory(
      {
        names: ['date1', 'date2'],
        dates: ['2023-02-10', '2023-02-02']
      }
    );

    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock.mock.calls[0][0])
      .toContain('' +
        '[dates/value] prop validator err: start date must be less than or equal to end date'
      );

    consoleMock.mockReset();

    wrapper.unmount();
  });

  it('should return a boolean depending on whether the date range matches the shortcuts in the compare method', async () => {
    const wrapper = await mountFactory({ names: ['date1', 'date2'] });
    const randomIndex = Math.floor(Math.random() * (wrapper.vm.shortcuts.length - 1));
    const randomShortcut = wrapper.vm.shortcuts[randomIndex];

    const rangeSet = [
      {
        range: randomShortcut.value,
        truthExpression: true
      },
      {
        range: ['2023-02-05', '2023-02-17'],
        truthExpression: false
      },
      {
        range: ['2023-02-05', null],
        truthExpression: false
      },
    ];

    rangeSet.forEach(item => {
      expect(wrapper.vm.compare(randomShortcut.value, item.range)).toBe(item.truthExpression);
    });

    wrapper.unmount();
  });

});
