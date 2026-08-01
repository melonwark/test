<template>
  <div>
    <h2>TFButton</h2>
    <section class="section">
      <h3 class="section-title">
        Цвета (входные параметры <code>variant</code> и <code>outline</code>)
      </h3>
      <div class="grid-container">
        <TFButton
          class="col-2"
        >
          Default
        </TFButton>
        <TFButton
          class="col-2"
          outline
        >
          Default outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="danger"
        >
          Danger
        </TFButton>
        <TFButton
          class="col-2"
          variant="danger"
          outline
        >
          Danger outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="success"
        >
          Success
        </TFButton>
        <TFButton
          class="col-2"
          variant="success"
          outline
        >
          Success outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="warning"
        >
          Warning
        </TFButton>
        <TFButton
          class="col-2"
          variant="warning"
          outline
        >
          Warning outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="info"
        >
          Info
        </TFButton>
        <TFButton
          class="col-2"
          variant="info"
          outline
        >
          Info outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="secondary"
        >
          Secondary
        </TFButton>
        <TFButton
          class="col-2"
          variant="secondary"
          outline
        >
          Secondary outline
        </TFButton>
        <TFButton
          class="col-2"
          variant="light"
        >
          Light Variant
        </TFButton>
        <TFButton
          class="col-2"
          variant="plain"
        >
          Plain Variant
        </TFButton>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Размеры (входной параметр <code>size</code>)
      </h3>
      <div style="display: flex; gap: 10px;align-items: center;">
        <TFButton size="sm">
          Small btn
        </TFButton>

        <TFButton size="md">
          Middle btn
        </TFButton>

        <TFButton size="lg">
          Large btn
        </TFButton>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Дефолтный клик
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <TFButton @click="defaultClickHandler">
            Default Click
          </TFButton>
        </div>
        <div class="col-12">
          Events: {{ defaultClickEvent }}
        </div>
        <div>
          <prism-code>
            {{
              `
&lt;TFButton @click="defaultClickHandler">
  Default Click
&lt;/TFButton>` }}
          </prism-code>
        </div>
      </div>
      <div class="grid-container">
        <div class="col-12">
          <h3 class="section-title">
            Дефолтный клик c вызовом EventBus
          </h3>
        </div>
        <div class="col-12">
          <TFButton
            :default-click-emitter="{
              event: 'defaultClickEventBusEmit',
              params: {
                key: 'value',
                key1: 'value1'
              }
            }"
          >
            Default click event bus emit
          </TFButton>
        </div>
        <div class="col-12">
          EventBus Events: {{ defaultClickEventBusEmit }}
        </div>
        <div>
          <prism-code>
            {{
              `
&lt;TFButton
  :default-click-emitter="{
      event: 'defaultClickEventBusEmit',
      params: {
        key: 'value',
        key1: 'value1'
      }
    }"
>
  Default click event bus emit
&lt;/TFButton>
          ` }}
          </prism-code>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Отправка fetch
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <TFButton
            data-cy="send-request-button"
            action-type="request"
            :request-options="{
              method: 'POST',
              url: 'https://jsonplaceholder.typicode.com/todos',
              data: { key1: 'foo', key2: 'bar' },
            }"
            request-emitter="upsertBtnRequest"
            request-success-emitter="upsertBtnSuccess"
            request-finally-emitter="upsertBtnFinally"
          >
            Send Request
          </TFButton>
        </div>
        <div class="col-12">
          Events:
          <ol v-html="requestEvents">
          </ol>
        </div>
        <div>
          <prism-code>
            {{
              `
&lt;TFButton
  action-type="request"
  :request-options="{
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: { key1: 'foo', key2: 'bar' },
  }"
  request-emitter="upsertBtnRequest"
  request-success-emitter="upsertBtnSuccess"
  request-finally-emitter="upsertBtnFinally"
>
  Send Request
&lt;/TFButton>
` }}
          </prism-code>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Отправка формы
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <form
            id="test-submit_form"
            class="grid-container"
            name="test-submit_form"
            method="post"
            action="http://localhost:5174/form#test-submit_form"
          >
            <div class="col-4">
              <input
                data-cy="form-input"
                class="tf-input"
                type="text"
                name="key1"
                :value="sendFormData.key1"
                required
                placeholder="Change field"
              >
            </div>
            <div class="col-4">
              <textarea
                data-cy="form-textarea"
                class="tf-input"
                type="text"
                name="key2"
                :value="sendFormData.key2"
                required
                placeholder="Change field"
              ></textarea>
            </div>
          </form>
          <p style="margin-bottom: 1rem; color: var(--tf-color-emerald)">
            <b>{{ isSendFormSuccess }}</b>
          </p>
          <TFButton
            data-cy="submit-form-button"
            action-type="submit"
            form-name="test-submit_form"
          >
            Submit Form
          </TFButton>
        </div>
        <div>
          <prism-code>
            {{
              `
&lt;form
  id="test-submit_form"
  class="grid-container"
  name="test-submit_form"
  method="post"
  action="http://localhost:5174/form#test-submit_form"
>
  &lt;div class="col-4">
    &lt;input
      class="tf-input"
      type="text"
      name="key1"
      :value="sendFormData.key1"
      required
    >
  &lt;/div>
  &lt;div class="col-4">
    &lt;textarea
      class="tf-input"
      type="text"
      name="key2"
      :value="sendFormData.key1"
      required
    />
  &lt;/div>
&lt;/form>

&lt;TFButton
  action-type="submit"
  form-name="test-submit_form"
>
  Submit Form
&lt;/TFButton>
` }}
          </prism-code>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Очистка форм/фильтров
      </h3>

      <div>
        <form
          class="grid-container"
          name="reset_form"
        >
          <div class="col-3">
            <div class="form-field">
              <input
                data-cy="form-field-1"
                class="tf-input"
                type="text"
                name="key1"
                value=""
                required
                placeholder="Field 1"
              >
            </div>
          </div>
          <div class="col-3">
            <div class="form-field">
              <input
                data-cy="form-field-2"
                class="tf-input"
                type="text"
                name="key2"
                value=""
                required
                placeholder="Field 2"
              >
            </div>
          </div>
          <div class="col-3">
            <TFMultiselect
              data-cy="multiselect-field"
              :options="[ 'item1', 'item2', 'item3']"
              option-type="notObject"
              :searchable="false"
              :hide-selected="false"
              :value="'item2'"
            />
          </div>
        </form>

        <TFButton
          data-cy="clear-form-button"
          action-type="reset"
          form-name="reset_form"
        >
          Clear Form
        </TFButton>
      </div>
      <div>
        <prism-code>
          {{ `
&lt;TFButton
  action-type="reset"
  form-name="reset_form"
>
  Clear Form
&lt;/TFButton>
            ` }}
        </prism-code>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Подтверждение действия (confirm)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <TFButton
            data-cy="confirm-button"
            confirm-action
            confirm-message="Are you sure?"
          >
            Confirm Action
          </TFButton>
          <div>
            <prism-code>
              {{ `
&lt;TFButton
  confirm-action
  confirm-message="Are you sure?"
>
  Confirm Action
&lt;/TFButton>
                ` }}
            </prism-code>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">
        Блокировка набора кнопок
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <TFButton
            v-for="el in [1,2,3]"
            :key="el"
            data-cy="block-button"
            style="margin-right: 10px"
            action-type="request"
            :request-options="{
              method: 'POST',
              url: 'https://jsonplaceholder.typicode.com/todos',
              data: { key1: 'foo', key2: 'bar' },
            }"
            disabled-set-of-buttons
          >
            Button-{{ el }}
          </TFButton>
        </div>
        <div>
          <prism-code>
            {{ `
&lt;TFButton
  v-for="el in [1,2,3]"
  :key="el"
  style="margin-right: 10px"
  action-type="request"
  :request-options="{
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: { key1: 'foo', key2: 'bar' },
  }"
  disabled-set-of-buttons
>
  Button
&lt;/TFButton>
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
                <td>actionType</td>
                <td>String</td>
                <td>
                  Один из трёх вариантов 'submit' | 'reset' | 'request'.
                  Если не указан - будет вызываться событие <code>@click-action</code>.
                  Это событие необходимо для корректной работы confirm
                  Стандартный @click так же будет работать.
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>requestOptions</td>
                <td>Object</td>
                <td>
                  { method: string; url: string; params?: string | object; data?: string | object | FormData; }.
                  Необходим, если actionType - request
                </td>
                <td>Объект с пустыми значениями</td>
              </tr>
              <tr>
                <td>requestEmitter</td>
                <td>String</td>
                <td>
                  Имя события eventBus, вызывается при отправке fetch запроса
                  Используется с actionType - request
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>requestSuccessEmitter</td>
                <td>String</td>
                <td>
                  Имя события eventBus, вызывается при успешной отправке fetch
                  Используется с actionType - request
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>requestFailureEmitter</td>
                <td>String</td>
                <td>
                  Имя события eventBus, вызывается при неудачной отправке fetch
                  Используется с actionType - request
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>requestFinallyEmitter</td>
                <td>String</td>
                <td>
                  Имя события eventBus, вызывается после отправки fetch
                  Используется с actionType - request
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>defaultClickEmitter</td>
                <td>Object</td>
                <td>
                  Имя события eventBus, c параметрами
                </td>
                <td>{ event: '', params: {} }</td>
              </tr>
              <tr>
                <td>reloadAfterAction/reloadAfterActionAndFail</td>
                <td>Boolean</td>
                <td>
                  Перезагрузить страницу после выполнения fetch.
                  Используется с actionType - request
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>formName</td>
                <td>String</td>
                <td>
                  Имя формы (name="foo"). Необходим при actionType - submit.
                  По этому атрибуту ищется форма на странице
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td>Блокировка кнопок</td>
                <td>false</td>
              </tr>
              <tr>
                <td>disabledSetOfButtons</td>
                <td>Boolean</td>
                <td>Блокировка набора кнопок</td>
                <td>false</td>
              </tr>
              <tr>
                <td>clearEmitter</td>
                <td>String</td>
                <td>
                  Имя события eventBus, вызывается для сброса элементов форм, фильтров.
                  Используется с actionType - reset
                </td>
                <td>clearReportFilters</td>
              </tr>
              <tr>
                <td>variant</td>
                <td>String</td>
                <td>
                  Цветовая схема кнопки.
                  Один из 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'plain'.
                  Добавляет класс <code>.tf-btn-{variant}</code>
                </td>
                <td>default</td>
              </tr>
              <tr>
                <td>outline</td>
                <td>Boolean</td>
                <td>Оформление кнопки. Добавляет класс <code>.tf-btn-{variant}-outline</code></td>
                <td>false</td>
              </tr>
              <tr>
                <td>size</td>
                <td>String</td>
                <td>Размер кнопки. Один из трёх вариантов 'sm' | 'md' | 'lg'</td>
                <td>'md'</td>
              </tr>
              <tr>
                <td>dataCy</td>
                <td>String</td>
                <td>Атрибут [data-cy], для cypress</td>
                <td>""</td>
              </tr>
              <tr>
                <td>confirmAction</td>
                <td>Boolean</td>
                <td>Вызывать окно подтверждения перед действием</td>
                <td>false</td>
              </tr>
              <tr>
                <td>confirmMessage</td>
                <td>String</td>
                <td>Текст уведомления</td>
                <td>""</td>
              </tr>
              <tr>
                <td>Content</td>
                <td>String</td>
                <td>Содержимое кнопки. Если указан, дефолтный слот будет не доступен</td>
                <td>""</td>
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
      <div class="grid-container">
        <div class="col-12">
          Стилизация должна добавляться в проекте. У компонента так же присутствует
          класс <code>.render</code>. Используется в компонентах blade для добавления
          прелоадера
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { TFButton, TFMultiselect } from '../../src';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import eventBus from '../../src/utils/eventBus';
import { useRoute } from 'vue-router';

export default {
  name: 'ButtonPage',
  components: { TFMultiselect, TFButton },

  setup() {
    const defaultClickEvent = ref('');
    const defaultClickEventBusEmit = ref('');
    const requestEvents = ref('');

    const route = useRoute();
    const sendFormData = route.query;
    const sendFormHash = route.hash;

    const isSendFormSuccess = computed(() =>
      sendFormHash === '#test-submit_form' ? 'The form is successfully sent' : ''
    );

    onMounted(() => {
      eventBus.$on('upsertBtnRequest', () => {
        requestEvents.value = '<li>The request is sent, the button is blocked</li>';
      });
      eventBus.$on('upsertBtnSuccess', res => {
        requestEvents.value = requestEvents.value
          + `<li>The answer was received - ${JSON.stringify(res.data)}</li>`;
      });
      eventBus.$on('upsertBtnFinally', () => {
        requestEvents.value = requestEvents.value + '<li>Request completed</li>';
      });
      eventBus.$on('defaultClickEventBusEmit', params => {
        defaultClickEventBusEmit.value = params;
      });
    });

    onUnmounted(() => {
      eventBus.$off('upsertBtnRequest');
      eventBus.$off('upsertBtnSuccess');
      eventBus.$off('upsertBtnFinally');
      eventBus.$off('defaultClickEventBusEmit');
    });

    const defaultClickHandler = () => {
      defaultClickEvent.value = 'Button Clicked';
    };

    return {
      requestEvents,
      defaultClickEvent,
      defaultClickHandler,
      sendFormData,
      isSendFormSuccess,
      defaultClickEventBusEmit
    };
  },
};
</script>

