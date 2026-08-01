<template>
  <div>
    <h2>TFInputFile</h2>
    <p>
      Использует зависимость
      <a
        target="_blank"
        href="https://floating-vue.starpad.dev/"
      >Floating Vue</a>
    </p>
    <section class="section">
      <h3>Базовое использование</h3>
      <p>Для работы обязателен входной параметр <code>id</code></p>
      <div class="grid-container">
        <div class="col-6">
          <TFInputFile
            id="input-file"
            form="test"
          >
          </TFInputFile>
        </div>
      </div>
      <div class="grid-container">
        <div class="col-6">
          <prism-code>
            {{
              `
&lt;TFInputFile id="input-file"/>
          ` }}
          </prism-code>
        </div>
      </div>
    </section>
    <section class="section">
      <h3>Входной параметр <code>hasPreview</code></h3>
      <p>
        Добавляет превью картинки. Для работы превью так же необходимо подключить
        FloatingVue в файле инициализации vue. Так же добавляет класс
        <code>.has-preview</code> контейнеру
      </p>
      <div class="grid-container">
        <div class="col-6">
          <TFInputFile
            id="input-file-has-preview"
            has-preview
          />
        </div>
      </div>
      <div class="grid-container">
        <div class="col-6">
          <prism-code>
            {{
              `
&lt;TFInputFile
  id="input-file-has-preview"
  has-preview
/>
          ` }}
          </prism-code>
        </div>
      </div>
    </section>
    <section class="section">
      <h3>Остальные входные параметры</h3>
      <p>
        В компоненте так же есть входные параметры <code>disabled</code>,
        <code>name</code> - атрибут для инпута, <code>label</code> - по умолчанию "No file chosen"
      </p>
    </section>
  </div>
</template>

<script lang="ts">

import { TFInputFile } from '../../src';
import PrismCode from '../components/Prism.vue';

export default {
  name: 'InputFilePage',
  components: {
    PrismCode,
    TFInputFile,
  },
};
</script>
