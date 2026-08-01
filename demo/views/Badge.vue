<template>
  <div>
    <h2>TFBadge</h2>
    <section class="section">
      <h3 class="section-title">
        Цвета (входные параметры <code>variant</code> и <code>outline</code>)
      </h3>
      <div class="grid-container">
        <TFBadge>Default</TFBadge>
        <TFBadge variant="danger">
          Danger
        </TFBadge>
        <TFBadge variant="success">
          Success
        </TFBadge>
        <TFBadge variant="warning">
          Warning
        </TFBadge>
        <TFBadge variant="info">
          Info
        </TFBadge>
        <TFBadge variant="secondary">
          Secondary
        </TFBadge>
      </div>
      <div class="grid-container">
        <TFBadge outline>
          Default outline
        </TFBadge>
        <TFBadge variant="danger"
                 outline
        >
          Danger outline
        </TFBadge>
        <TFBadge variant="success"
                 outline
        >
          Success outline
        </TFBadge>
        <TFBadge variant="warning"
                 outline
        >
          Warning outline
        </TFBadge>
        <TFBadge variant="info"
                 outline
        >
          Info outline
        </TFBadge>
        <TFBadge variant="secondary"
                 outline
        >
          Secondary outline
        </TFBadge>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Размеры (входной параметр <code>size</code>)
      </h3>
      <div style="display: flex; gap: 10px;align-items: center;">
        <TFBadge size="sm">
          Small badge
        </TFBadge>

        <TFBadge size="md">
          Middle badge
        </TFBadge>

        <TFBadge size="lg">
          Large badge
        </TFBadge>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Входные параметры <code>tooltip</code> и <code>content</code>
      </h3>
      <TFBadge
        tooltip="Badge tooltip"
        variant="success"
        content="Has Tooltip"
      />
      <prism-code>
        {{ `
&lt;TFBadge
  tooltip="Badge tooltip"
  variant="success"
  content="Has Tooltip"
/>
        ` }}
      </prism-code>
    </section>
    <section class="section">
      <h3 class="section-title">
        Входной параметр <code>with-clipboard</code>
      </h3>
      <TFBadge
        tooltip="Copy"
        with-clipboard
        copy-data="Copy Data"
        variant="danger"
        outline
      >
        Badge with clipboard
      </TFBadge>
      <prism-code>
        {{ `
&lt;TFBadge
  tooltip="Copy"
  with-clipboard
  copy-data="Copy Data"
  variant="danger"
  outline
>
  Badge with clipboard
&lt;/TFBadge>
        ` }}
      </prism-code>
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
                <td>content</td>
                <td>String</td>
                <td>Текст в бэйдже</td>
                <td>''</td>
              </tr>
              <tr>
                <td>tooltip</td>
                <td>String</td>
                <td>
                  Текст всплывающей подсказки. Без этого параметра подсказка не
                  будет отображаться
                </td>
                <td>''</td>
              </tr>
              <tr>
                <td>withClipboard</td>
                <td>Boolean</td>
                <td>Добавляет возможность копирования в буфер обмена при клике</td>
                <td>false</td>
              </tr>
              <tr>
                <td>copyData</td>
                <td>String</td>
                <td>Данные для копирования</td>
                <td>''</td>
              </tr>
              <tr>
                <td>variant</td>
                <td>String</td>
                <td>
                  Цветовая схема бэйджа.
                  Один из 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'.
                  Добавляет класс <code>.tf-badge-{variant}</code>
                </td>
                <td>default</td>
              </tr>
              <tr>
                <td>outline</td>
                <td>Boolean</td>
                <td>
                  Оформление бэйджа. Добавляет класс <code>.tf-badge-{variant}-outline</code>
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>size</td>
                <td>String</td>
                <td>Размер бэйджа. Один из трёх вариантов 'sm' | 'md' | 'lg'</td>
                <td>'md'</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Слоты (Slots)
      </h3>
      <div class="grid-container">
        <div class="col-12">
          <table class="tf-table-demo">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>default</td>
                <td>
                  Использовать при необходимости вставить html-контент.
                  Не будет отображаться, если указан входной параметр <code>content</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { TFBadge } from '../../src';


export default {
  name: 'BadgePage',
  components: { TFBadge },

  setup() {
  }
};
</script>
