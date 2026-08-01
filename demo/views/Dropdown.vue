<template>
  <div>
    <section class="section">
      <h2>TFDropdown</h2>
      <div class="grid-container">
        <TFDropdown
          dropdown-menu-classes="tf-dropdown_right"
          switcher-id="dropdown_right"
        >
          <template #switcher>
            <button class="tf-btn tf-btn-md tf-btn-default">
              Dropdown switcher
            </button>
          </template>
          <template #dropdown-header>
            <div class="tf-dropdown-header">
              Header
            </div>
          </template>
          <template #dropdown-body>
            <div class="tf-dropdown-body">
              Align right
            </div>
          </template>
        </TFDropdown>
        <TFDropdown
          :min-width="200"
          dropdown-menu-classes="tf-dropdown_center"
        >
          <template #switcher>
            <button class="tf-btn tf-btn-md tf-btn-default">
              Dropdown switcher align center
            </button>
          </template>
          <template #dropdown-header>
            <div class="tf-dropdown-header">
              Dropdown header
            </div>
          </template>
          <template #dropdown-body>
            <div class="tf-dropdown-body">
              Dropdown align center
            </div>
          </template>
        </TFDropdown>
        <TFDropdown
          :hide-if-click-inside="false"
          dropdown-menu-classes="tf-dropdown_left"
        >
          <template #switcher>
            <button class="tf-btn tf-btn-md tf-btn-default">
              Dropdown switcher align left
            </button>
          </template>
          <template #dropdown-header>
            <div class="tf-dropdown-header">
              Dropdown header
            </div>
          </template>
          <template #dropdown-body>
            <div class="tf-dropdown-body">
              Dropdown align left
            </div>
          </template>
        </TFDropdown>
        <TFDropdown
          opening-animation="flip-in-y"
          :hide-if-click-inside="false"
        >
          <template #switcher>
            <button class="tf-btn tf-btn-md tf-btn-default">
              Switcher animation
            </button>
          </template>
          <template #dropdown-header>
            <div class="tf-dropdown-header">
              Dropdown header
            </div>
          </template>
          <template #dropdown-body>
            <div class="tf-dropdown-body">
              Dropdown  opening animation
            </div>
          </template>
        </TFDropdown>
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
                <td>openingAnimation</td>
                <td>String</td>
                <td>Имя класса, который будет использоваться в анимации появления (Vue transition)</td>
                <td>"dropdown"</td>
              </tr>
              <tr>
                <td>switcherClasses</td>
                <td>String</td>
                <td>класс для стилизации триггера</td>
                <td>""</td>
              </tr>
              <tr>
                <td>dropdownMenuClasses</td>
                <td>String</td>
                <td>класс для стилизации раскрывающейся части</td>
                <td>""</td>
              </tr>
              <tr>
                <td>hideIfClickInside</td>
                <td>Boolean</td>
                <td>
                  Флаг для закрытия при клике на сам выпадающий список
                  (если false, закрываться не будет)
                </td>
                <td>true</td>
              </tr>
              <tr>
                <td>minWidth</td>
                <td>Number|String</td>
                <td>Минимальная ширина</td>
                <td>"auto"</td>
              </tr>
              <tr>
                <td>offsetTop</td>
                <td>Number</td>
                <td>Отступ от переключателя</td>
                <td>10</td>
              </tr>
              <tr>
                <td>dataCy</td>
                <td>String</td>
                <td>Атрибут для тестов cypress</td>
                <td>""</td>
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
                <td>#switcher</td>
                <td>Слот для триггера </td>
              </tr>
              <tr>
                <td>#dropdown-header</td>
                <td>шапка выпадающего списка</td>
              </tr>
              <tr>
                <td>#dropdown-body</td>
                <td>тело выпадающего списка</td>
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
      <p>Анимации появления, позиционирование, выравнивание задаются в css</p>
    </section>
  </div>
</template>
<script lang="ts">
import { TFDropdown } from '../../src';
export default {
  name: 'DropdownPage',
  components: { TFDropdown },
};
</script>

