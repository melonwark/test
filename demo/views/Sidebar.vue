<template>
  <div>
    <h2>TFSidebar</h2>
    <p>
      Обёртка над сторонним компонентом
      <a
        target="_blank"
        href="https://yaminncco.github.io/vue-sidebar-menu"
      >
        vue-sidebar-menu
      </a>
    </p>
    <p>
      Помимо настроек стандартного компонента, имеет дополнительные входные
      параметры
    </p>
    <ul>
      <li>
        Для корректной работы в конфиге меню в каждом элементе должно
        присутствовать поле  <code>regExpForDetermineActivePoint: string | RegExp</code>
        (см. <code>demo/constans/sidebar-menu.js</code>)
      </li>
      <li>
        <b>eventBusListener</b> - слушатель событий eventBus (строка,
        значение по умолчанию <code>'sidebarStateChange'</code>
      </li>
      <li>
        <b>relatedSelectors</b> - массив css-селекторов у которых должны изменяться
        классы в зависимости от состояния сайдбара
      </li>
      <li>
        <b>relatedSelectorsClasses</b>
        - имена классов, которые будут применяться (по умолчанию <code>'sidebar-closed'</code>)
      </li>
      <li>
        <b>clickItemEventBusEmitter</b> - отправка события в <code>eventBus</code>,
        если нужно отловить клик по элементу меню сайдбара
      </li>
      <li>
        <b>hasCustomLinkComponent</b> - по умолчание <code>false</code>. Нужен,
        если используется <b>Vue Router</b>
      </li>
    </ul>
    <h2>TFSidebarLink</h2>
    <p>
      Кастомный компонент ссылки, нужен в шаблонах <code>blade.php</code>,
      должен быть зарегистрирован глобально.
      При регистрации имя компонента должно совпадать с входным параметром
      <b>linkComponentName</b> компонента <b>TFSidebar</b>
      (по умолчанию <code>'custom-link'</code>)
    </p>
    <div>
      <p>Пример использования:</p>
      <prism-code>
        {{
          `
const app = createApp(App);
  const customLink = {
  name: 'CustomLink',
  props: ['item'],
  render() {
    return h('a', this.$slots.default());
  }
};
app.component('custom-link', customLink);
`
        }}
      </prism-code>
    </div>
    <h2>TFSidebarToggle</h2>
    <p>
      Компонент-триггер для TFSidebar, если есть необходимость в изменении
      состояния сайдбара не стандартным способом.
      Входные параметры:
    </p>
    <ul>
      <li>
        <b>collapsed</b> - <code>Number|Boolean</code>, отвечает за начальную
        отрисовку (открыт/закрыт) в шаблонах <code>blade.php</code>. Допустимые
        значения <code>true/false</code>. По умолчанию <code>true</code>
      </li>
      <li>
        <b>sidebarStateCookieName</b> - имя создаваемой куки, где хранится
        состояние сайдбара. Требуется в шаблонах  <code>blade.php</code>.
        Значение по умолчанию - <code>sidebar_menu_closed</code>
      </li>
      <li>
        <b>eventBusEmitter</b> - имя события <code>eventBus</code> для
        прослушивания в шаблонах <code>blade.php</code>. Используется в <b>TFSidebar</b>.
        Значение по умолчанию - <code>sidebarStateChange</code>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

import PrismCode from '../components/Prism.vue';

export default {
  name: 'SidebarPage',
  components: { PrismCode }
};
</script>
