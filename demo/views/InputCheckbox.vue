<template>
  <div>
    <h2>TFInputCheckbox</h2>
    <section class="section">
      <h3 class="section-title">
        Входной параметр <code>mode</code>
      </h3>
      <p>Принимает два значения <b>default</b>/<b>switcher</b>.</p>
      <p>
        В зависимости от значения контейнеру добавляется класс
        <code>.tf-checkbox</code> / <code>.tf-switcher</code>
      </p>

      <TFInputCheckbox
        style="margin-bottom: 10px"
        name="checkbox_name"
        id="checkbox_id"
        label="Default mode label"
        form="test"
        checked
      />

      <TFInputCheckbox
        style="margin-bottom: 10px"
        name="switcher_name"
        id="switcher_id"
        label="Switcher mode label"
        mode="switcher"
      />

      <p>
        <code>name</code>, <code>id</code>, <code>label</code>, <code>checked</code> - основные атрибуты
        для работы. <b>name</b> - для корректной отправки в форме (если чекбокс не выбран,
        отправится значение из скрытого инпута, с атрибутом name, указанном
        во входном параметре. <b>label</b> - для отображения лэйбла и <b>id</b> - для
        связки лэйбла и чекбокса, <b>checked</b> - для выбора при монтировании
      </p>
      <div class="grid-container">
        <div class="col-4">
          <prism-code>
            {{
              `
&lt;TFInputCheckbox
  name="checkbox_name"
  id="checkbox_id"
  label="label"
  checked
/>
&lt;TFInputCheckbox
  name="switcher_name"
  id="switcher_id"
  label="Switcher mode label"
  mode="switcher"
/>
          ` }}
          </prism-code>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Входной параметр <code>reloadAfterAction</code>
      </h3>
      <p>
        Позволяет перезагрузить страницу с добавлением query-параметра после действий с чекбоксом
      </p>
      <p>В данном примере страница перезагрузится с параметром <code>?switcher_query_name=checked-query_value/unchecked-query_value</code></p>
      <TFInputCheckbox
        style="margin-bottom: 10px"
        name="switcher_query_name"
        id="switcher_query_id"
        checked-value="checked-query_value"
        unchecked-value="unchecked-query_value"
        :checked="queryParamsSwitcherChecked"
        label="Switcher with reload after action"
        mode="switcher"
        reload-after-action
      />

      <prism-code>
        {{
          `
&lt;TFInputCheckbox
    name="switcher_query_name"
    id="switcher_query_id"
    checked-value="checked-query_value"
    unchecked-value="unchecked-query_value"
    :checked="queryParamsSwitcherChecked"
    label="Switcher with reload after action"
    mode="switcher"
    reload-after-action
/>
          ` }}
      </prism-code>
    </section>

    <section class="section">
      <h3 class="section-title">
        Входные параметры <code>checkedValue</code> и <code>uncheckedValue</code>
      </h3>
      <p>
        По умолчанию выбран/не выбран имеет значения true/false, но так же моет быть
        строкой или числом
      </p>
      <div class="grid-container">
        <div class="col-4">
          <h4>Значения по умолчанию:</h4>
          <TFInputCheckbox
            name="default-value-checkbox_name"
            id="default-value-checkbox_id"
            label="Default value"
            @onChange="changeDefaultValue"
          />
          <div>default value: {{ defaultValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFInputCheckbox
  name="default-value-checkbox_name"
  id="default-value-checkbox_id"
  label="Default value"
  @onChange="changeDefaultValue"
/>
          ` }}
            </prism-code>
          </div>
        </div>
        <div class="col-4">
          <h4>Строковые значения:</h4>
          <TFInputCheckbox
            name="string-value-checkbox_name"
            id="string-value-checkbox_id"
            label="String value"
            checked-value="checked_value"
            unchecked-value="unchecked_value"
            @onChange="changeStringValue"
          />
          <div>string value: {{ stringValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFInputCheckbox
  name="string-value-checkbox_name"
  id="string-value-checkbox_id"
  label="String value"
  checked-value="checked_value"
  unchecked-value="unchecked_value"
  @onChange="changeStringValue"
/>
          ` }}
            </prism-code>
          </div>
        </div>
        <div class="col-4">
          <h4>Числовые значения:</h4>
          <TFInputCheckbox
            name="number-value-checkbox_name"
            id="number-value-checkbox_id"
            label="Number value"
            :checked-value="1"
            :unchecked-value="0"
            @onChange="changeNumberValue"
          />
          <div>number value: {{ numberValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFInputCheckbox
  name="number-value-checkbox_name"
  id="number-value-checkbox_id"
  label="Number value"
  :checked-value="1"
  :unchecked-value="0"
  @onChange="changeNumberValue"
/>
          ` }}
            </prism-code>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Отправка формы
      </h3>
      <p>В примере можно увидеть, что будет отправляться в форме</p>
      <form name="checkbox_form"
            class="grid-container"
      >
        <div class="col-2">
          <TFInputCheckbox
            name="checkbox_name_boolean"
            id="checkbox_id_boolean"
            label="Boolean value"
          />
        </div>
        <div class="col-2">
          <TFInputCheckbox
            name="checkbox_name_string"
            id="checkbox_id_string"
            label="String value"
            checked-value="checked_value"
            unchecked-value="unchecked_value"
          />
        </div>
        <div class="col-2">
          <TFInputCheckbox
            name="checkbox_name_number"
            id="checkbox_id_number1"
            label="Number value"
            :checked-value="1"
            :unchecked-value="0"
          />
        </div>
        <div class="col-2">
          <TFInputCheckbox
            name="checkbox_name_arr[]"
            id="checkbox_id_0"
            label="Test with send-unchecked prop 1"
            checked-value="1"
            unchecked-value="0"
            :send-unchecked="false"
          />
        </div>
        <div class="col-2">
          <TFInputCheckbox
            name="checkbox_name_arr[]"
            id="checkbox_id_1"
            label="Test with send-unchecked prop 2"
            :checked-value="3"
            :unchecked-value="0"
            :send-unchecked="false"
          />
        </div>
        <div class="col-2">
          <button
            class="tf-btn tf-btn-default tf-btn-md"
            type="submit"
            @click="submit"
          >
            Submit
          </button>
        </div>
        <div class="col-2">
          Form Data:
        </div>
        <div class="col-12">
          <p
            v-for="(value, key) in formData"
            :key="key"
          >
            <span style="color: var(--tf-color-emerald)">{{ key }}</span>:
            <span style="color: var(--tf-color-ruby-red)">{{ value }}</span>
          </p>
        </div>
      </form>
      <prism-code>
        {{
          `
&lt;TFInputCheckbox
  name="checkbox_name_boolean"
  id="checkbox_id_boolean"
  label="Boolean value"
/>
&lt;TFInputCheckbox
  name="checkbox_name_string"
  id="checkbox_id_string"
  label="String value"
  checked-value="checked_value"
  unchecked-value="unchecked_value"
/>
&lt;TFInputCheckbox
  name="checkbox_name_number"
  id="checkbox_id_number1"
  label="Number value"
  :checked-value="1"
  :unchecked-value="0"
/>
&lt;TFInputCheckbox
  name="checkbox_name_arr[]"
  id="checkbox_id_0"
  label="Test with send-unchecked prop 1"
  checked-value="1"
  unchecked-value="0"
  :send-unchecked="false"
/>
&lt;TFInputCheckbox
  name="checkbox_name_arr[]"
  id="checkbox_id_1"
  label="Test with send-unchecked prop 2"
  :checked-value="3"
  :unchecked-value="0"
  :send-unchecked="false"
/>
          ` }}
      </prism-code>
    </section>
    <section class="section">
      <h3 class="section-title">
        Входной параметр <code>disabled</code>
      </h3>

      <TFInputCheckbox
        style="margin-bottom: 10px"
        name="checkbox_name_disabled"
        id="checkbox_id_disabled"
        label="Disabled"
        disabled
      />

      <div class="grid-container">
        <div class="col-4">
          <prism-code>
            {{
              `
&lt;TFInputCheckbox
  name="checkbox_name_disabled"
  id="checkbox_id_disabled"
  label="Disabled"
  disabled
/>
          ` }}
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
                <td>Атрибут id инпута</td>
                <td></td>
              </tr>
              <tr>
                <td>name</td>
                <td>String</td>
                <td>Атрибут name инпута</td>
                <td>Обязателен</td>
              </tr>
              <tr>
                <td>label</td>
                <td>String</td>
                <td>Лэйбл</td>
                <td>''</td>
              </tr>
              <tr>
                <td>checkedValue</td>
                <td>Number, Boolean, String</td>
                <td>Значение выбранного для отправки</td>
                <td>true</td>
              </tr>
              <tr>
                <td>uncheckedValue</td>
                <td>Number, Boolean, String</td>
                <td>Значение не выбранного для отправки</td>
                <td>false</td>
              </tr>

              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td>Атрибут disabled инпута</td>
                <td>false</td>
              </tr>
              <tr>
                <td>checked</td>
                <td>Boolean</td>
                <td>При изменении для отправки выбирается  checkedValue/uncheckedValue </td>
                <td>false</td>
              </tr>
              <tr>
                <td>callEmitterOnMount</td>
                <td>Boolean</td>
                <td>Вызывает onChange событие при монтировании, если указан </td>
                <td>false</td>
              </tr>
              <tr>
                <td>mode</td>
                <td>String</td>
                <td>
                  Одно из  'default' | 'switcher'.
                  Визуальное представление.
                  Добавляет класс  <code>.tf-checkbox</code> / <code>.tf-switcher</code>
                </td>
                <td>default</td>
              </tr>
              <tr>
                <td>sendUnchecked</td>
                <td>Boolean</td>
                <td>
                  Используется, кода в форме необходимо отправить массив значений.
                  В таком случае входной параметр <code>name</code> должен
                  заканчиваться <code>[]</code>.
                  В этом примере, если чекбокс с <b>id="checkbox_id_1"</b> не будет выбран,
                  в форме отправится  <code>checkbox_name_arr[]: 1</code>, если выбран -
                  <code>checkbox_name_arr[]: 1, checkbox_name_arr[]: 2</code>
                  <prism-code>
                    {{
                      `
&lt;TFInputCheckbox
  name="checkbox_name_arr[]"
  id="checkbox_id_0"
  label="String value"
  checked-value="1"
  unchecked-value="0"
/>

&lt;TFInputCheckbox
  name="checkbox_name_arr[]"
  id="checkbox_id_1"
  label="Number value"
  :checked-value="3"
  :unchecked-value="0"
  :send-unchecked="false"
/>
                  `
                    }}
                  </prism-code>
                </td>
                <td>true</td>
              </tr>
              <tr>
                <td>reloadAfterAction</td>
                <td>Boolean</td>
                <td>
                  Даёт возможность перезагрузки страницы
                  с query-параметром ?{props.name}={props.checkedValue/uncheckedValue}
                </td>
                <td>false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        События
      </h3>
      <p>Компонент имеет один emit <code>@onChange</code> </p>
    </section>
    <section class="section">
      <h3 class="section-title">
        Стили
      </h3>
      <p>
        Компонент имеет классы <code>.tf-checkbox</code> для контейнера
        и <code>.tf-checkbox-label</code> для лэйбла
      </p>
    </section>
  </div>
</template>

<script lang="ts">

import { TFInputCheckbox } from '../../src';
import PrismCode from '../components/Prism.vue';
import { computed, ref } from 'vue';
export default {
  name: 'InputCheckboxPage',
  components: {
    PrismCode,
    TFInputCheckbox,
  },

  setup() {
    const defaultValue = ref(false);
    const stringValue = ref('unchecked_value');
    const numberValue = ref(0);
    const formData = ref({});

    const changeDefaultValue = (val: boolean) => {
      defaultValue.value = val;
    };
    const changeStringValue = (val: string) => {
      stringValue.value = val;
    };
    const changeNumberValue = (val: number) => {
      numberValue.value = val;
    };

    const queryParamsSwitcherChecked = computed(() => {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.has('switcher_query_name',  'checked-query_value');
    });

    const submit = (e: Event) => {
      e.preventDefault();
      formData.value = {};
      const form = document.forms['checkbox_form'];
      const formDataInner = new FormData(form);

      formDataInner.forEach((value, key) => {
        if (formData.value[key]) {
          formData.value[key] = [].concat(formData.value[key], value);
        } else {
          formData.value[key] = value;
        }
      });
    };

    return {
      changeDefaultValue,
      changeStringValue,
      changeNumberValue,
      defaultValue,
      stringValue,
      numberValue,
      submit,
      formData,
      queryParamsSwitcherChecked
    };
  },
};
</script>
