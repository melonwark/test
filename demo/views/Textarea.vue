<template>
  <div>
    <h2>TFTextarea</h2>

    <section class="section">
      <p>
        <TFTextarea
          label="Textarea label"
          placeholder="Textarea placeholder"
          form="test"
        />
      </p>
      <div>
        <prism-code>
          {{
            `
&lt;TFTextarea
  label="Textarea label"
  placeholder="Textarea placeholder"
>
          `
          }}
        </prism-code>
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
          <TFTextarea />
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
&lt;TFTextarea/>
&lt;TFButton
  variant="warning"
  action-type="reset"
>
  Clear
&lt;/TFButton>
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
          <TFTextarea
            event-bus-emitter="test-eventbus-textarea"
          />
          <div>test-eventbus value: {{ eventBusValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFTextarea
   event-bus-emitter="test-eventbus-textarea"
/>
              `
              }}
            </prism-code>
          </div>
        </div>
        <div class="col-6">
          <h4>Стандартное событие без <b>eventBus</b>:</h4>
          <TFTextarea @input="changeTextarea" />

          <div>event @input: {{ inputEventValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFTextarea
   @input="changeTextarea"
/>
              `
              }}
            </prism-code>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Ошибки валидации форм
      </h3>
      <p>
        Если указан входной параметр <code>has-error</code>, к контейнеру и самому
        селекту будет добавлен класс <code>is-invalid</code>
      </p>
      <div
        class="grid-container"
        style="margin-top: 10px"
      >
        <div class="col-4">
          <TFTextarea
            label="Label"
            has-error
            error-feedback="Error message"
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFTextarea
  label="Label"
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
                <td>id textarea</td>
                <td>''</td>
              </tr>
              <tr>
                <td>name</td>
                <td>String</td>
                <td>Атрибут name инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>required</td>
                <td>Boolean</td>
                <td>required textarea</td>
                <td>false</td>
              </tr>
              <tr>
                <td>value</td>
                <td>String</td>
                <td>value textarea. Связка <code>:value + @input</code> оставлена для обратной
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
                <td>placeholder textarea</td>
                <td>''</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td>disabled textarea</td>
                <td>false</td>
              </tr>
              <tr>
                <td>label</td>
                <td>String</td>
                <td>label textarea</td>
                <td>''</td>
              </tr>
              <tr>
                <td>cols</td>
                <td>Number</td>
                <td>Атрибут cols textarea</td>
                <td>20</td>
              </tr>
              <tr>
                <td>rows</td>
                <td>Number</td>
                <td>Атрибут rows textarea</td>
                <td>2</td>
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
  </div>
</template>

<script lang="ts">

import { TFTextarea, TFButton } from '../../src';
import eventBus from '../../src/utils/eventBus';
import { onMounted, onUnmounted, ref } from 'vue';
export default {
  name: 'TextareaPage',
  components: { TFTextarea, TFButton },
  setup() {
    const inputEventValue = ref('');
    const eventBusValue = ref('');

    const changeTextarea = (data: string) => {
      inputEventValue.value = data;
    };

    onMounted(() => {
      eventBus.$on('test-eventbus-textarea', (data: string) => {
        eventBusValue.value = data;
      });
    });

    onUnmounted(() => {
      eventBus.$off('test-eventbus-textarea');
    });

    return {
      changeTextarea,
      inputEventValue,
      eventBusValue,
    };
  },

};
</script>
