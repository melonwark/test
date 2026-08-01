<template>
  <div>
    <h2>TFInputHidden</h2>
    <p>Используется в формах шаблонов blade.php</p>
    <p>
      В данном примере при отправке формы в  будут выведены данные с
      ключём  input_hidden_name[]
    </p>
    <section class="section">
      <TFInputHidden
        name="input_hidden_name"
        :value="['1', 2, 3]"
        form="test"
      />

      <div class="grid-container">
        <div class="col-12">
          <form
            id="test-submit_form"
            class="grid-container"
            name="test-submit_form"
            method="post"
            action="http://localhost:5174/form_hidden_input#test-submit_form_hidden_input"
          >
            <div class="col-4">
              <input
                class="tf-input"
                type="text"
                name="key1"
                :value="sendFormData.key1"
                placeholder="Change field"
              >
            </div>
            <TFInputHidden
              name="input_hidden_name"
              :value="['1', 2, 3]"
            />
          </form>
          <p style="margin-bottom: 1rem; color: var(--tf-color-emerald)">
            <b>{{ isSendFormSuccess }}</b>
          </p>
          <TFButton
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
  action="http://localhost:5174/form_hidden_input#test-submit_form_hidden_input"
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
&lt;TFInputHidden
   name="input_hidden_name"
   :value="['1', 2, 3]"
/>
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
                <td>name</td>
                <td>String</td>
                <td>Атрибут name инпута</td>
                <td>Обязателен</td>
              </tr>
              <tr>
                <td>value</td>
                <td>String|Boolean|Number|Array of String|Number</td>
                <td>Атрибут value инпута</td>
                <td>''</td>
              </tr>
              <tr>
                <td>eventBusListener</td>
                <td>String</td>
                <td>Имя события eventBus. Присваивает данные атрибуту value</td>
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

import { TFButton, TFInputHidden } from '../../src';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'InputHiddenPage',
  components: { TFButton, TFInputHidden },

  setup() {

    const route = useRoute();
    const sendFormData = route.query;
    const sendFormHash = route.hash;

    const isSendFormSuccess = computed(() =>
      sendFormHash === '#test-submit_form_hidden_input'
        ? `The form is successfully sent Data: ${JSON.stringify(sendFormData)}`
        : ''
    );

    return {
      isSendFormSuccess,
      sendFormData
    };
  }
};
</script>
