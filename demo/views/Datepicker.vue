<template>
  <div>
    <h2>TFDatepicker</h2>
    <p>
      Обёртка над сторонним компонентом
      <a
        target="_blank"
        href="https://vue3datepicker.com/"
      >Vue Datepicker</a>.
    </p>

    <section class="section">
      <h3 class="section-title">
        Основные входные параметры
      </h3>
      <p>
        Для работы с формами в шаблонах blade.php в компоненте создаются скрытые инпуты
        с набором выбранных данных пикера. Для корректной работы необходимо указывать
        входной параметр <code>names</code> - <b>всегда массив строк</b>.
        Второй входной параметр <code>dates</code> - <b>всегда массив строк или массив new Date()</b>
        Инпуты будут иметь вид:
      </p>
      <div>
        <prism-code>
          {{
            `
&lt;input type="hidden" name="date_from" value="2024-12-01">
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Singe Date
      </h3>
      <p>Необходимо указать входной параметр <code>single-date</code></p>
      <div class="grid-container">
        <div class="col-4">
          <TFDatePicker
            id="example"
            single-date
            title="Single Date"
            :names="['date_from']"
            :dates="[ '2024-12-01']"
            form="test"
          >
          </TFDatePicker>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFDatePicker
  id="example"
  single-date
  title="Single Date"
  :names="['date_from']"
  :dates="[ '2024-12-01']"
/>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Date Range
      </h3>
      <div class="grid-container">
        <div class="col-4">
          <TFDatePicker
            id="example"
            :names="['date_from', 'date_to']"
            :dates="['2024-12-12', '2024-12-19']"
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFDatePicker
  id="example"
  :names="['date_from', 'date_to']"
  :dates="['2024-12-12', '2024-12-19']"
/>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Icon Slot
      </h3>
      <div class="grid-container">
        <div class="col-4">
          <TFDatePicker
            id="example"
            :names="['date_from', 'date_to']"
            :dates="['2024-12-16', '2024-12-20']"
          >
            <template #input-icon>
              <TFIcon
                img-class="datepicker-icon-class"
                src="demo/assets/images/calendar-icon.svg"
              />
            </template>
          </TFDatePicker>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFDatePicker
  id="example"
  :names="['date_from', 'date_to']"
  :dates="['2024-12-16', '2024-12-20']"
>
  &lt;template #input-icon>
    &lt;TFIcon
      img-class="datepicker-icon-class"
      src="demo/assets/images/calendar-icon.svg"
    />
  &lt;/template>
&lt;/TFDatePicker>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Events
      </h3>
      <p>
        Компонент прослушивает событие eventBus для сброса дат до предустановленных,
        через входной параметр <code>eventBusClearListener</code>
        (по умолчанию <b>clearReportFilters</b>). Для одиночного календаря дата
        сбрасывается до даты, указанной в <code>dates</code> или до текущей в
        формате строки 'YYYY-MM-DD'. Для мульти-календаря до дак указанных в
        <code>dates</code> или до ['текущая дата минус семь дней', 'текущая дата']
        в формате массива строк ['YYYY-MM-DD', 'YYYY-MM-DD']. Для мульти-календаря
        можно установить через проп <code>defaultRange</code> (по умолчанию
        ['текущая дата минус семь дней', 'текущая дата']
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFDatePicker
            id="example"
            :dates="['2024-12-19']"
            :names="['date_to']"
            single-date
          >
          </TFDatePicker>

          <button @click="clear">
            clear
          </button>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFDatePicker
  id="example"
  :dates="['2024-12-19']"
  :names="['date_to']"
  single-date
>
&lt;/TFDatePicker>
&lt;button @click="clear">
  clear
&lt;/button>

const clear = () => {
  eventBus.$emit('clearReportFilters');
};
          `
          }}
        </prism-code>
      </div>

      <p>При выборе дат есть <b>emit</b> <code>input</code> c </p> датами
      вида <code>{ "[props.names]": "YYYY-MM-DDT00:00:00.000Z" }</code>

      <div class="grid-container">
        <div class="col-4">
          <TFDatePicker
            id="example"
            :names="['date_from', 'date_to']"
            :dates="['2024-12-16', '2024-12-20']"
            @input="datesSelected"
          >
          </TFDatePicker>

          <div>Emit dates: {{ emitDates }}</div>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFDatePicker
  id="example"
  :names="['date_from', 'date_to']"
  :dates="['2024-12-16', '2024-12-20']"
  @input="datesSelected"
>
&lt;/TFDatePicker>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Styles
      </h3>
      Стили используются дефолтные из
      <a href="https://github.com/Vuepic/vue-datepicker/blob/main/src/VueDatePicker/style/main.scss">
        репозитория
      </a>, для кастомизации следует переопределить см demo/assets/styles/datepicker.css
    </section>
  </div>
</template>


<script lang="ts">

import PrismCode from '../components/Prism.vue';
import { TFDatePicker } from '../../src';
import { TFIcon } from '../../src';
import eventBus from '../../src/utils/eventBus';
import { ref } from 'vue';

export default {
  name: 'DatepickerPage',
  components: { TFIcon, TFDatePicker, PrismCode },
  setup() {

    const emitDates = ref(null);

    const clear = () => {
      eventBus.$emit('clearReportFilters');
    };

    const datesSelected = (dates: string[]) => {
      emitDates.value = dates;
    };

    return {
      clear,
      datesSelected,
      emitDates
    };
  }
};
</script>
