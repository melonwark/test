<template>
  <div>
    <h2>TFInputRadio</h2>

    <section class="section">
      <div>
        <TFInputRadio
          id="radio_button"
          name="radio_button_name"
          value="radio_button_value"
          label="Radio Button Label"
          checked
        >
        </TFInputRadio>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFInputRadio
  id="radio_button"
  name="radio_button_name"
  value="radio_button_value"
  label="Radio Button Label"
  checked
/>
          `
          }}
        </prism-code>
      </div>
    </section>


    <section class="section">
      <h3 class="section-title">
        Входной параметр form (добавление данных из внешнего компонента в форму)
      </h3>
      <p>
        В этом примере в фому будет добавлено поле
        <code>radio_button_name: radio_button_value</code>
      </p>
      <div>
        <TFInputRadio
          id="radio_button"
          form="test_send_form"
          name="radio_button_name"
          value="radio_button_value"
          label="Radio Button value"
          checked
        >
        </TFInputRadio>
        <form id="test_send_form"
              class="grid-container"
        >
          <div class="col-4">
            <input
              class="tf-input"
              type="text"
              name="test_input"
              value="test_input_value"
            >
          </div>
          <div class="col-12">
            <button
              class="tf-btn tf-btn-default tf-btn-md"
              type="submit"
            >
              Send Form
            </button>
          </div>
        </form>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;div>
  &lt;TFInputRadio
    id="radio_button"
    form="test_send_form"
    name="radio_button_name"
    value="radio_button_value"
    label="Radio Button value"
    checked
  >
  &lt;/TFInputRadio>
  &lt;form id="test_send_form"
        class="grid-container"
  >
    &lt;div class="col-4">
      &lt;input
        class="tf-input"
        type="text"
        name="test_input"
        value="test_input_value"
      >
    &lt;/div>
    &lt;div class="col-12">
      &lt;button
        class="tf-btn tf-btn-default tf-btn-md"
        type="submit"
      >
        Send Form
      &lt;/button>
    &lt;/div>
  &lt;/form>
&lt;/div>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        События
      </h3>
      <p>Компонент имеет один emit <code>@onChange</code> </p>
      <div class="grid-container">
        <div class="col-3">
          <TFInputRadio
            id="radio_button_emit_1"
            name="radio_button_emit_name"
            value="radio_button_emit_value_1"
            label="Radio Button Label Emit 1"
            @onChange="changeRadio"
          >
          </TFInputRadio>
        </div>
        <div class="col-3">
          <TFInputRadio
            id="radio_button_emit_2"
            name="radio_button_emit_name"
            value="radio_button_emit_value_2"
            label="Radio Button Label Emit 2"
            @onChange="changeRadio"
            checked
            call-emitter-on-mount
          >
          </TFInputRadio>
        </div>
        <div class="col-12">
          Radio emit data: {{ emitValue }}
          <prism-code>
            {{
              `
&lt;TFInputRadio
  id="radio_button_emit_1"
  name="radio_button_emit_name"
  value="radio_button_emit_value_1"
  label="Radio Button Label Emit 1"
  @onChange="changeRadio"
/>
&lt;TFInputRadio
  id="radio_button_emit_2"
  name="radio_button_emit_name"
  value="radio_button_emit_value_2"
  label="Radio Button Label Emit 2"
  @onChange="changeRadio"
  checked
  call-emitter-on-mount
/>
&lt;div>Radio emit data: { emitValue }&lt;div/>
          `
            }}
          </prism-code>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Входные параметры (Props)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <table class="tf-table-demo">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>По умолчанию</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>id</td>
                <td>String</td>
                <td>id инпута</td>
                <td>Обязателен</td>
              </tr>
              <tr>
                <td>name</td>
                <td>String</td>
                <td>Атрибут name инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>value</td>
                <td>String</td>
                <td>value инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>callEmitterOnMount</td>
                <td>Boolean</td>
                <td>Вызывать ли emit событие сразу после монтирования компонента</td>
                <td>true</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td>disabled инпута</td>
                <td>false</td>
              </tr>
              <tr>
                <td>label</td>
                <td>String</td>
                <td>label инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>dataCy</td>
                <td>String</td>
                <td>Атрибут для тестов Cypress</td>
                <td>''</td>
              </tr>
              <tr>
                <td>checked</td>
                <td>Boolean</td>
                <td>Выбран</td>
                <td>false</td>
              </tr>
              <tr>
                <td>form</td>
                <td>String</td>
                <td>
                  атрибут где указывается id формы. Это нужно, если компонент
                  находится вне формы (например в модальном окне) но его значение должно попасть в
                  formData формы
                </td>
                <td>Не добавляется, если не указан</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Стили
      </h3>
      <p>
        Компонент имеет классы <code>.tf-radio</code> для контейнера
        и <code>.tf-radio-label</code> для лэйбла
      </p>
    </section>
  </div>
</template>

<script lang="ts">

import { TFInputRadio } from '../../src';
import { ref } from 'vue';

export default {
  name: 'InputRadioPage',
  components: { TFInputRadio },

  setup() {
    const emitValue = ref('');
    const changeRadio = (val: string) => {
      emitValue.value = val;
    };
    return {
      changeRadio,
      emitValue
    };
  }
};
</script>
