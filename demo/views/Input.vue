<template>
  <div>
    <h2>TFInput</h2>
    <section class="section">
      <div
        class="grid-container"
        style="margin-top: 10px;"
      >
        <div class="col-4">
          <TFInput
            placeholder="Base input placeholder"
            label="Base Input label"
            has-actions
            form="test"
          >
            <template #actions>
              <input type="checkbox">
            </template>
          </TFInput>
        </div>
        <div class="col-12">
          <prism-code>
            {{
              `
&lt;TFInput
  placeholder="Base input placeholder"
  label="Base Input label"
  has-actions
>
  &lt;template #actions>
    &lt;input type="checkbox">
  &lt;/template>
&lt;/TFInput>
              `
            }}
          </prism-code>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Emits
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <p>
            Сейчас компонент может прослушивать одно событие <code>eventBus</code>
            для очистки значений <code>eventBusClearListener</code> (по умолчанию
            <code>clearReportFilters</code>).
          </p>
        </div>
        <div class="col-4">
          <TFInput />
        </div>
        <div class="col-12">
          <TFButton
            variant="warning"
            action-type="reset"
          >
            Clear
          </TFButton>
        </div>

        <div class="col-12">
          <prism-code>
            {{
              `
&lt;TFInput />
&lt;button
  @clic="eventBus.$emit('clearReportFilters')"
>
  Clear
&lt;/button>
            `
            }}
          </prism-code>
        </div>
      </div>

      <div class="grid-container">
        <div class="col-12">
          <p>
            Так же есть возможность отправлять события в <b>eventBus</b> после окончания ввода значения. Для этого необходимо указать <code>eventBusEmitter</code> во
            входных параметрах.
            Если eventBusEmitter не указан, отправляется vue-событие <code>@input</code>
          </p>
        </div>
        <div class="col-6">
          <h4>Событие eventBus: </h4>
          <TFInput
            event-bus-emitter="test-eventbus"
          />
          <div>test-eventbus value: {{ eventBusValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFInput
  event-bus-emitter="test-eventbus"
/>
              `
              }}
            </prism-code>
          </div>
        </div>
        <div class="col-6">
          <h4>Стандартное событие без <b>eventBus</b>:</h4>
          <TFInput @input="dataValue" />

          <div>event @input: {{ inputEventValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFInput
  @input="dataValue"
/>
              `
              }}
            </prism-code>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div
        class="grid-container"
        style="margin-top: 10px"
      >
        <div class="col-4">
          <TFInput
            label="Label"
            has-error
            error-feedback="Error message"
            has-actions
          >
            <template #actions>
              <input type="checkbox">
            </template>
          </TFInput>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFInput
  has-error
  error-feedback="Error message"
/>
              `
          }}
        </prism-code>
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
                <td>''</td>
              </tr>
              <tr>
                <td>name</td>
                <td>String</td>
                <td>Атрибут name инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>type</td>
                <td>String</td>
                <td>'text' | 'number' | 'email' | 'password'</td>
                <td>'text'</td>
              </tr>
              <tr>
                <td>required</td>
                <td>Boolean</td>
                <td>required инпута</td>
                <td>false</td>
              </tr>
              <tr>
                <td>value</td>
                <td>String</td>
                <td>
                  value инпута.
                  Связка <code>:value + @input</code> оставлена для обратной
                  совместимости при использовании @vue/compat и работы с шаблонами blade.php.
                  Лучше пользоваться <code>v-model</code>
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>eventBusEmitter</td>
                <td>String</td>
                <td>Имя события eventBus</td>
                <td>''</td>
              </tr>
              <tr>
                <td>eventBusClearListener</td>
                <td>String</td>
                <td>Слушатель события для очистки value инпута</td>
                <td>clearReportFilters</td>
              </tr>
              <tr>
                <td>callEmitterOnMount</td>
                <td>Boolean</td>
                <td>Вызывать ли emit событие сразу после монтирования компонента</td>
                <td>true</td>
              </tr>
              <tr>
                <td>containerClass</td>
                <td>String</td>
                <td>Классы для контейнера-обёртки</td>
                <td>''</td>
              </tr>
              <tr>
                <td>placeholder</td>
                <td>String</td>
                <td>placeholder инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td>disabled инпута</td>
                <td>false</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td></td>
                <td>false</td>
              </tr>
              <tr>
                <td>label</td>
                <td>String</td>
                <td>label инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>min, max</td>
                <td>Number</td>
                <td>минимальное, максимальное значение инпута с типом number</td>
                <td>undefined</td>
              </tr>
              <tr>
                <td>hasActions</td>
                <td>Boolean</td>
                <td>
                  Позволяет задействовать слот actions для добавления стороннего контента,
                  Добавляет класс <code>combo-box</code> для обёртки
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>actionsPosition</td>
                <td>Одно из 'left' | 'right'</td>
                <td>
                  Добавляет классы <code> has-item-left </code>
                  или <code>has-item-right</code>контейнеру.
                  Используется совместно с <b>hasActions</b>
                </td>
                <td>'left'</td>
              </tr>
              <tr>
                <td>dataCy</td>
                <td>String</td>
                <td>Атрибут для тестов Cypress</td>
                <td>''</td>
              </tr>
              <tr>
                <td>hasError</td>
                <td>Boolean</td>
                <td>
                  Добавляет класс is-invalid к контейнеру
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>errorFeedback</td>
                <td>String</td>
                <td>Описание ошибки, используется совместно с <b>hasError</b></td>
                <td>''</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Styles
      </h3>
      Стили используются дефолтные, для кастомизации следует переопределить см demo/assets/styles/input.css
    </section>
  </div>
</template>

<script lang="ts">

import { TFInput, TFButton } from '../../src';
import eventBus from '../../src/utils/eventBus';
import { onMounted, ref } from 'vue';

export default {
  name: 'InputPage',
  components: {
    TFButton,
    TFInput,
  },

  setup() {
    const inputEventValue = ref(null);
    const eventBusValue = ref(null);

    const dataValue = (data: string) => {
      inputEventValue.value = data;
    };

    onMounted(() => {
      eventBus.$on('test-eventbus', (data: string) => {
        eventBusValue.value = data;
      });
    });

    return {
      dataValue,
      inputEventValue,
      eventBusValue,
    };
  },
};
</script>

