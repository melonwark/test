<template>
  <div>
    <h2>TFToast</h2>
    <section class="section">
      <p>
        Обёртка над сторонним компонентом
        <a
          target="_blank"
          href="https://github.com/kyvg/vue3-notification"
        >vue3-notification</a>.
      </p>
      <h3 class="section-title">
        Базовое использование в компонентах Vue
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <TFToast
            classes="test"
            group="call_toast"
            position="bottom right"
            animation-name="v-fade-bottom"
            :duration="1000"
            :speed="300"
          ></TFToast>
          <TFButton @click="callToast">
            Call Toast
          </TFButton>
        </div>

        <div class="col-12">
          <prism-code>
            {{
              `
&lt;TFToast
  group="call_toast"
  position="bottom right"
  animation-name="v-fade-bottom"
  :duration="1000"
  :speed="300"
/>
&lt;TFButton @click="callToast">
  Call Toast
&lt;/TFButton>

import { useNotification } from '@cadolabs/traffic-ui-kit';

const { notify } = useNotification();

const callToast = () => {
  notify({
    group: 'call_toast',
    title: 'Toast title',
    text: 'Toast message',
    type: 'info',
  });
};

          `
            }}
          </prism-code>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Использование с axios в шаблонах blade.php
      </h3>
      <p>Необходимо вставить компонент в основной layout (например app.blade.php)</p>
      <div class="grid-container">
        <div class="col-12">
          <prism-code>
            {{
              `
&lt;tf-toast
  group="axios_toast"
  position="top right"
  animation-name="v-fade-top"
  :duration="1000"
  :speed="300"
/>

&lt;TFButton
  variant="success"
  action-type="request"
  :request-options="{
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: { message: 'Request Success Message' },
  }"
>
  Send Request Success
&lt;/TFButton>
          `
            }}
          </prism-code>
        </div>
      </div>
      <p>
        Так же необходимо добавить перехватчики запросов
        (в данном случае <code> axios interceptors</code>). См.
        <code>/demo/interceptor.js</code>, <code>/demo.main.js</code>.
      </p>
      <div class="grid-container">
        <TFToast
          group="axios_toast"
          position="top right"
          animation-name="v-fade-top"
          :duration="1000"
          :speed="300"
          dangerously-set-inner-html
        />
        <TFButton
          variant="success"
          action-type="request"
          :request-options="{
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/todos',
            data: { message: 'Request Success Message' },
          }"
        >
          Send Request Success
        </TFButton>
        <TFButton
          variant="danger"
          action-type="request"
          :request-options="{
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/todos',
            data: {
              error: {
                field1: ['text1', 'text2']
              }
            },
          }"
        >
          Send Request Error
        </TFButton>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Использование с формами в шаблонах blade.php
      </h3>
      <p>
        Необходимо вставить компонент в основной layout.
        В примере кода используется Laravel <code>session</code> и <code>$errors</code>.
        При этом в контроллерах должно быть что-то вроде
        <prism-code>
          {{
            `
public function exampleMethod(data): RedirectResponse
{
  return redirect(route('routeName'))->with('message', 'Successfully updated!');
}
            `
          }}
        </prism-code>
      </p>
      <div class="grid-container">
        <div class="col-12">
          <prism-code>
            {{
              `
&lt;tf-toast
  :is-form="(session()->has('message') || $errors->any()) ? 'true' : 'false'"
  group="toast"
  toast-type="session()->has('message') ? 'success' : ($errors->any() ? 'error' : '')"
  title="session()->has('message') ? 'Success' : ($errors->any() ? 'Error' : '')"
  text="session()->get('message') ?? $errors->first()"
  position="top right"
  animation-name="v-fade-top"
/>

&lt;tf-button
  action-type="submit"
  form-name="test_form_toast"
>
  Submit Form
&lt;/tf-button>
          `
            }}
          </prism-code>
        </div>
      </div>
      <div class="col-12">
        <TFToast
          :is-form="isSendFormSuccess"
          group="axios_form"
          position="top right"
          title="Success"
          text="Send Form Toast"
          animation-name="v-fade-top"
          :duration="1000"
          :speed="300"
          @destroy="clearRoute"
        />
        <form
          id="test_form_toast"
          class="grid-container"
          name="test_form_toast"
          method="post"
          action="http://localhost:5174/form_toast#test_form_toast"
        >
          <div class="col-4">
            <input
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
              class="tf-input"
              type="text"
              name="key2"
              :value="sendFormData.key2"
              required
              placeholder="Change field"
            />
          </div>
        </form>
        <TFButton
          action-type="submit"
          form-name="test_form_toast"
        >
          Submit Form
        </TFButton>
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
                <td>toastType</td>
                <td>String</td>
                <td>Один из четырёх вариантов 'success' | 'error' | 'info' | 'warn'</td>
                <td>success</td>
              </tr>
              <tr>
                <td>text</td>
                <td>String | Object ({[key:string]: string[]})</td>
                <td>
                  Если Object структура должна быть следующей
                  { key: ['val1', 'val2', 'val3'], key2: ['val4', 'val5'] }].
                  Это соответствует коллекции ['key' => [ 'val1' ]] для laravel
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>title</td>
                <td>String</td>
                <td>Заголовок уведомления</td>
                <td>''</td>
              </tr>
              <tr>
                <td>classes</td>
                <td>String</td>
                <td>
                  Классы для стилизации, добавляются к дефолтному классу
                  <code>.vue-notification</code>
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>position</td>
                <td>String</td>
                <td>Позиция отображения</td>
                <td>'top right'</td>
              </tr>
              <tr>
                <td>group</td>
                <td>String</td>
                <td>
                  Имя группы нотификаций. Например, чтобы отличать нотификации
                  для форм от fetch запросов
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>animationName</td>
                <td>String</td>
                <td>
                  Префикс класса для vue-анимации.
                  Например v-fade-bottom преобразуется в v-fade-bottom-enter-active и тд
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>width</td>
                <td>String, Number</td>
                <td>ширина уведомления</td>
                <td>300</td>
              </tr>
              <tr>
                <td>duration</td>
                <td>Number</td>
                <td>Время отображения (ms)</td>
                <td>3000</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>Number</td>
                <td>Время отображения/скрытия (ms)</td>
                <td>500</td>
              </tr>
              <tr>
                <td>max</td>
                <td>Number</td>
                <td>Максимальное кол-во отображаемых уведомлений</td>
                <td>10</td>
              </tr>
              <tr>
                <td>reverse</td>
                <td>Boolean</td>
                <td>Отображать в обратном порядке</td>
                <td>false</td>
              </tr>
              <tr>
                <td>pauseOnHover</td>
                <td>Boolean</td>
                <td>Отображать пока курсор наведён на уведомление</td>
                <td>false</td>
              </tr>
              <tr>
                <td>ignoreDuplicates</td>
                <td>Boolean</td>
                <td>Не отображать дубликаты</td>
                <td>true</td>
              </tr>
              <tr>
                <td>closeOnClick</td>
                <td>Boolean</td>
                <td>Скрывать при клике</td>
                <td>false</td>
              </tr>
              <tr>
                <td>dangerouslySetInnerHtml</td>
                <td>Boolean</td>
                <td>
                  Используется при необходимости добавления в сообщение html.
                  На данный момент используется для отображения входного параметра
                  <code>text</code> c типом {[key:string]: string[]}
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>isForm</td>
                <td>Boolean</td>
                <td>Для отображения уведомлений форм</td>
                <td>false</td>
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
      <p>По умолчанию</p>
      <div class="grid-container">
        <div class="col-12">
          <prism-code>
            {{
              `
.vue-notification-template {
  .notification-title {}
  .notification-content {}
  &.success {}
  &.info {}
  &.error {}
}
         `
            }}
          </prism-code>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { TFButton, TFToast } from '../../src';
import { useNotification } from '@kyvg/vue3-notification';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import interceptor from '../interceptor';

const { notify } = useNotification();
export default {
  name: 'ButtonPage',
  components: { TFButton, TFToast },

  setup() {
    const route = useRoute();
    const sendFormData = route.query;
    const sendFormHash = route.hash;
    interceptor();
    const isSendFormSuccess = computed(() =>
      sendFormHash === '#test_form_toast'
    );

    const callToast = () => {
      notify({
        group: 'call_toast',
        title: 'Toast title',
        text: 'Toast message',
        type: 'info',
      });
    };

    const clearRoute = () => {
      window.history.replaceState(null, '', window.location.pathname);
    };

    return {
      callToast,
      isSendFormSuccess,
      sendFormData,
      clearRoute
    };
  }
};

</script>
