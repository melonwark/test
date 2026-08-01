<template>
  <div
    class="relative rendered"
    :class="[{'has-label': hasLabel}, containerClass]"
  >
    <datepicker
      ref="datepickerRef"
      v-model="range"
      :multi-calendars="multiCalendarsOptions"
      :enable-time-picker="false"
      :format="valueType"
      auto-apply
      text-input
      position="left"
      :range="rangeOptions"
      :preset-dates="shortcuts"
      @open="inputActivate"
      @closed="inputDisable"
      @update:model-value="selectDates"
      :data-cy="dataCy"
      :offset="offsetMenu"
      :dark="darkTheme"
    >
      <template
        #input-icon
        v-if="$slots['input-icon']"
      >
        <slot name="input-icon"></slot>
      </template>

      <template #preset-date-range-button="{ label, value, presetDate}">
        <span
          class="dp__btn dp--preset-range"
          :class="{ active: isActiveRange(value) || label === currentRangeName }"
          role="button"
          :tabindex="0"
          :data-cy="setShortcutDataCy(label)"
          @click="presetDate(value)"
          @keyup.enter.prevent="presetDate(value)"
          @keyup.space.prevent="presetDate(value)"
        >
          {{ label }}
        </span>
      </template>
    </datepicker>
    <label
      v-if="hasLabel"
      :class="computedLabelClasses"
    >{{ title }}</label>
    <input
      v-bind="form ? { form } : {}"
      v-if="singleDate"
      type="hidden"
      :name="`${names}`"
      :value="dateFilter(range)"
    >
    <input
      v-bind="form ? { form } : {}"
      v-else
      type="hidden"
      v-for="(val, name) in prepareDates"
      :key="name"
      :name="`${name}`"
      :value="dateFilter(val)"
    >
  </div>
</template>

<script lang="ts">

import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  type PropType, ref
} from 'vue';

import eventBus from '@/utils/eventBus.js';
import VueDatePicker from '@vuepic/vue-datepicker';

const now = new Date();
const nowDayOfWeek = now.getDay();
const nowDay = now.getDate();
const allTimeDateStart = '2010-01-01';
const lessDays = Number(nowDayOfWeek) === 0 ? 6 : nowDayOfWeek - 1;
const weekStart = new Date(new Date(now).setDate(nowDay - lessDays));
const lastWeekStart = new Date(new Date(now).setDate((nowDay - lessDays) - 7));
const lastWeekEnd = new Date(new Date(now).setDate((nowDay - lessDays) - 1));
const otherPeriodStart = new Date(new Date(now).setDate(nowDay - 7));
const lastDayOfPreviousMonth = () => {
  const lastMonthEnd = new Date();
  lastMonthEnd.setDate(1);
  lastMonthEnd.setTime(lastMonthEnd.getTime() - 3600 * 1000 * 24);

  return lastMonthEnd;
};
const firstDayOfPreviousMonth = () => {
  const lastMonthStart = new Date();
  const lastMonthEnd = new Date();
  lastMonthStart.setDate(1);
  lastMonthEnd.setDate(1);
  lastMonthStart.setMonth(lastMonthEnd.getMonth() - 1);

  return lastMonthStart;
};
const getYesterdayRange = ([startDate, endDate]: [Date, Date]) => {
  const startYesterday = new Date(startDate);
  const endYesterday = new Date(endDate);
  startYesterday.setDate(startYesterday.getDate() - 1);
  endYesterday.setDate(endYesterday.getDate() - 1);

  return [startYesterday, endYesterday];
};


export default defineComponent({
  name: 'TFDatePicker',
  components: {
    datepicker: VueDatePicker,
  },
  props: {
    id: {
      type: String,
      required: true
    },
    dates: {
      type: Array as PropType<Date[]|string[]>,
      default: () => [],
      validator: (propValue: (string)[]) => {
        const isValid = propValue.length > 1
          ? new Date(propValue[0]).getTime() <= new Date(propValue[1]).getTime()
          : true;
        if (!isValid) {
          // eslint-disable-next-line max-len
          console.error('[dates/value] prop validator err: start date must be less than or equal to end date');
        }
        return isValid;
      }
    },
    valueType: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    singleDate: {
      type: Boolean,
      default: false
    },
    names: {
      type: Array as PropType<string[]>,
      required: true
    }, // первый элемент дата начала, второй дата окончания для Array
    inputClasses: {
      type: String,
      default: 'input'
    },
    labelClasses: {
      type: String,
      default: 'label'
    },
    containerClass: {
      type: String,
      default: 'form-field'
    },
    hasLabel: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Date range'
    },
    defaultRange: {
      type: Array as PropType<Date[]|string[]>,
      default: () => [otherPeriodStart.toJSON().slice(0, 10), new Date().toJSON().slice(0, 10)]
    },
    dataCy: {
      type: String,
      default: ''
    },
    eventBusClearListener: {
      type: String,
      default: 'clearReportFilters'
    },
    offsetMenu: {
      type: [Number, String],
      default: 10
    },
    darkTheme: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const range = ref<string|Date|string[]|Date[]>([]);
    const otherPeriodName = 'Other Period';
    const currentRangeName = ref('');
    const inputFocus = ref(false);

    onMounted(() => {
      initializeDateRange();

      eventBus.$on(props.eventBusClearListener, () => {
        initializeDateRange();
      });

      giveDate('giveDate');
    });

    onUnmounted(() => {
      eventBus.$off(props.eventBusClearListener);
    });

    const prepareDates = computed(() => {
      if (!range.value) return {};

      const obj: { [key: string]: string | Date } = {};

      if (isRange(range.value)) {
        range.value.forEach((value, i) => value !== undefined && (obj[props.names[i]] = value));
      } else {
        obj[props.names[0]] = range.value;
      }

      return obj;
    });

    const labelActiveClasses = computed(() => (
      !props.singleDate &&
      isRange(range.value) &&
      range.value.length &&
      range.value.some(el => Boolean(el))) || (props.singleDate && range.value));

    const shortcuts = computed(() => {
      if (!props.singleDate) {
        return [
          {
            label: 'Today',
            value: [new Date(), new Date()],
            noTz: true,
            slot: 'preset-date-range-button',
          },
          {
            label: 'Yesterday',
            value: getYesterdayRange([new Date(), new Date()]),
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'Current Week',
            value: [weekStart, new Date()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'Last Week',
            value: [lastWeekStart, lastWeekEnd],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'Current Month',
            value: [new Date(new Date().setDate(1)), new Date()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'Last Month',
            value: [firstDayOfPreviousMonth(), lastDayOfPreviousMonth()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'All Time',
            value: [new Date(allTimeDateStart), new Date()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: 'Till Last Month End',
            value: [new Date(allTimeDateStart), lastDayOfPreviousMonth()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
          {
            label: otherPeriodName,
            value: [otherPeriodStart, new Date()],
            noTz: true,
            slot: 'preset-date-range-button'
          },
        ];
      }
      return [];
    });

    const rangeOptions = computed(() => (!props.singleDate ? { showLastInRange: false } : false));

    const multiCalendarsOptions = computed(() => (!props.singleDate ? { solo: true } : false));

    const computedLabelClasses = computed(() => ({
      [props.labelClasses]: true,
      'active': labelActiveClasses.value || inputFocus.value,
    }));

    const compare = (dates1: Array<Date|string|null>, dates2: Array<Date|string|null>) => {
      if (
        !Array.isArray(dates1) ||
        !Array.isArray(dates2) ||
        dates1.includes(null) ||
        dates2.includes(null)
      ) {
        return false;
      }
      const formatDates = (dates: Array<Date|null>) => {
        return dates.map((el: Date|null) => (
          el instanceof Date ? el.toISOString().slice(0, 10) : el)
        );
      };

      const formattedDates1 = formatDates(dates1.filter((date): date is Date => date !== null));
      const formattedDates2 = formatDates(dates2.filter((date): date is Date => date !== null));

      return formattedDates1.length === formattedDates2.length
        && formattedDates1.every((date, index) => date === formattedDates2[index]);
    };

    const dateFilter = (value: string|Date|string[]|Date[]) => {
      if (value && !(Array.isArray(value))) {
        const date = new Date(value);

        if (!Number.isNaN(Number(date.getTime()))) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');

          return `${year}-${month}-${day}`;
        }
      }

      return '';
    };

    const inputActivate = () => inputFocus.value = true;

    const inputDisable = () => inputFocus.value = false;

    const assignCurrentRangeName = (dates: Array<Date|string>) => {
      currentRangeName.value = shortcuts.value
        .find(el => compare(el.value, dates))?.label ?? otherPeriodName;
    };

    const selectDates = (dates: Array<Date|string>) => {
      if (!props.singleDate && Array.isArray(dates)) {
        assignCurrentRangeName(dates);
      }

      giveDate('input');
    };

    const initializeDateRange = () => {
      const isDatesEmptyOrNull = props.dates.length === 0 || props.dates.some(date => date === null);
      const singleDateValue = new Date().toJSON().slice(0, 10);
      const defaultRangeValue = props.defaultRange;

      if (isDatesEmptyOrNull) {
        range.value = props.singleDate ? singleDateValue : defaultRangeValue;
      } else {
        range.value = props.singleDate ?  props.dates[0] : props.dates;
      }
      if (!props.singleDate && isRange(range.value)) {
        assignCurrentRangeName(range.value);
      }
    };

    const giveDate = (eventName: string) => {
      emit(eventName, props.singleDate ? { [props.names[0]]: range.value } : prepareDates.value);
    };

    const isActiveRange = (presetValue: Date[]) => {
      return !props.singleDate && isRange(range.value) ? compare(range.value, presetValue) : false;
    };

    const setShortcutDataCy = (label: string) => {
      const toSnakeCase = label.toLowerCase().replace(/\s+/g, '_');
      return `range_${toSnakeCase}`;
    };

    const isRange = (value: string | Date | (string | Date)[]): value is (string | Date)[] => {
      return Array.isArray(value);
    };

    return {
      range,
      shortcuts,
      currentRangeName,
      compare,
      isActiveRange,
      prepareDates,
      labelActiveClasses,
      dateFilter,
      inputFocus,
      inputActivate,
      inputDisable,
      selectDates,
      rangeOptions,
      multiCalendarsOptions,
      setShortcutDataCy,
      computedLabelClasses,
      initializeDateRange,
      giveDate
    };
  },
});
</script>

