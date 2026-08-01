<template>
  <div>
    <section class="section">
      <h2>TFMultiselect</h2>
      <p>
        Обёртка над сторонним компонентом
        <a
          target="_blank"
          href="https://vue-multiselect.js.org/"
        >vue-multiselect</a>. Имеет зависимость
        <a
          target="_blank"
          href="https://www.npmjs.com/package/vue-draggable-next"
        >
          vue-draggable-next
        </a>
      </p>
      <p>
        Для работы с формами в шаблонах blade.php в компоненте создаются скрытые инпуты
        с набором выбранных данных селекта. Для корректной работы необходимо указывать
        входной параметр <code>name</code>. Инпуты будут иметь вид:
      </p>
      <div>
        <prism-code>
          {{
            `
&lt;input  type="hidden" name="propName[]" value="value">
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Single select array options
      </h3>
      <p>
        Если список опций - это массив с примитивами, необходимо указать входной параметр
        <code>option-type="notObject"</code>. (по умолчанию <b>'Object'</b>,
        используется, если опции - массив с объектами)
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayStringOptions"
            option-type="notObject"
            :searchable="false"
            :hide-selected="false"
            :value="'item2'"
            form="test"
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayStringOptions"
  option-type="notObject"
  :hide-selected="false"
  :value="'item2'"
  :searchable="false"
/>
const arrayStringOptions = ['item1', 'item2', 'item3'];
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Single select array of objects
      </h3>
      <p>
        При использовании массива объектов в качестве списка опций, необходимо
        указать входные параметры <code>label-name</code> (по умолчанию <b>name</b>)
        и <code>track-by</code> (по умолчанию <b>id</b>). Где label-name - поле,
        которое будет отображено в списке опций, track-by - поле, по которому
        будет осуществляться выборка.
      </p>
      <p>
        Входной параметр <code>:value</code> отвечает за отображение выбранных
        элементов во время рендера компонента. Значение должно совпадать со значением
        ключа, указанного в track-by. В примере значение <code>3</code> означает,
        что будет выбран элемент<code> { id: 3, value: 'Item3' }</code>
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :hide-selected="false"
            :value="3"
            label-name="value"
            :searchable="false"
          />
        </div>
      </div>

      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :hide-selected="false"
  :value="3"
  label-name="value"
  :searchable="false"
/>

const arrayOfObjectOptions = [
  {
    id: 1,
    value: 'Item1'
  },
  {
    id: 2,
    value: 'Item2'
  },
  {
    id: 3,
    value: 'Item3'
  }
];
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Multiple
      </h3>
      <p>
        Для использования множественного выбора должен быть указан входной
        параметр <code>multiple</code>. Параметр <code>:value</code> должен
        содержать массив строк или целых чисел по ключу <b>track-by</b>, либо массив "целых"
        объектов, например <code>:value="[{id: 2, value: 'Item2'}]"</code>
        Так же, если value массив с примитивами, допустимо присутствие null, при
        этом список опций должен быть массивом с объектами с содержать null
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptionsWithNull"
            :value="['1', 3, null]"
            label-name="value"
            :searchable="false"
            multiple
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptionsWithNull"
  :value="['1', 3, null]"
  label-name="value"
  :searchable="false"
  multiple
/>

const arrayOfObjectOptionsWithNull = [
  {
    id: 1,
    value: 'Item1'
  },
  {
    id: 2,
    value: 'Item2'
  },
  {
    id: 3,
    value: 'Item3'
  },
  {
    id: null,
    value: 'ItemNull'
  }
];
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Searchable
      </h3>
      <p>
        Для поиска по списку <code>options</code> используются два стандартных
        параметра <code>searchable</code> (по умолчанию <b>false</b>) и
        <code>:internal-search</code> (по умолчанию <b>false</b>).
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[{id: 1, value: 'Item1'}]"
            label-name="value"
            :searchable="true"
            :internal-search="true"
            multiple
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[{id: 1, value: 'Item1'}]"
  label-name="value"
  :searchable="true"
  :internal-search="true"
  multiple
/>
          `
          }}
        </prism-code>
      </div>
      <p>
        Для поиска по API используются входные параметры <code>autocomplete</code>
        - url запроса, <code>autocomplete-query-key</code> - ключ query-параметра
        (по умолчанию q). Так же присутствует параметр <code>search-on-mounted</code>,
        для запроса к API, на случай, если есть предустановленное значение value, но
        список options пуст
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="[]"
            :value="[1, 11, 30]"
            label-name="title"
            hide-selected
            :searchable="true"
            autocomplete="https://jsonplaceholder.typicode.com/posts"
            autocomplete-query-key="title_like"
            search-on-mounted
            multiple
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="[]"
  :value="[1, 12, 30]"
  label-name="title"
  hide-selected
  :searchable="true"
  autocomplete="https://jsonplaceholder.typicode.com/posts"
  autocomplete-query-key="title_like"
  search-on-mounted
  multiple
/>
          `
          }}
        </prism-code>
      </div>
      <p>
        Для поиска также возможно использовать строку с данными из буфера обмена,
        которая может быть разделена определенным символом или комбинацией
        символов. Для этого нужно добавить входной параметр
        <code>insert-group-clipboard</code>. Допустимые разделители
        <code>|</code>, <code>,</code>, <code>;</code>, <code>пробел</code>.
        Например, если вставить <b>item1 item2| item3, item4; item5</b>,
        то в query-параметрах запроса будет <b>item1,item2,item3,item4,item5</b>.
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="[]"
            label-name="title"
            hide-selected
            :searchable="true"
            insert-group-clipboard
            autocomplete="https://jsonplaceholder.typicode.com/posts"
            autocomplete-query-key="title_like"
            multiple
          />
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="[]"
  label-name="title"
  hide-selected
  :searchable="true"
  insert-group-clipboard
  autocomplete="https://jsonplaceholder.typicode.com/posts"
  autocomplete-query-key="title_like"
  multiple
/>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Draggable
      </h3>
      <p>
        В multiple есть возможность перетаскивать тэги выбранных опций. Это требуется
        в некоторых отчётах. Для этого нужно добавить входной параметр
        <code>isDraggable</code>
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[1, 2, 3]"
            label-name="value"
            hide-selected
            multiple
            is-draggable
          >
          </TFMultiselect>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1, 2, 3]"
  label-name="value"
  hide-selected
  multiple
  is-draggable
/>
          `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Additional actions
      </h3>
      <p>
        Компонент так же имеет слот <code>#actions</code>, на случай необходимости
        прикрепить дополнительные элементы типа кнопки, иконки или чекбокса. Для
        этого надо добавить входной параметр <code>has-actions</code> и разместить
        в шаблоне слота нужный элемент. Для стилизации можно использовать классы
        <code>combo-box</code> для обёртки и <code>combo-box-item</code> для слота.
        Кроме того можно разместить элементы справа или слева от селекта,
        используя входной параметр <code>actions-position</code> <b>left/right</b>
      </p>
      <div class="grid-container">
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[1, 2, 3]"
            label-name="value"
            :hide-selected="false"
            :searchable="false"
            multiple
            actions-position="left"
            has-actions
          >
            <template #actions>
              <input type="checkbox">
            </template>
          </TFMultiselect>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1, 2, 3]"
  label-name="value"
  :hide-selected="false"
  :searchable="false"
  multiple
  has-actions
  actions-position="left"
>
  &lt;template #actions>
    &lt;input type="checkbox">
  &lt;/template>
&lt;/TFMultiselect>
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
            <code>clearReportFilters</code>). Если указан входной параметр
            <code>required</code>, то в <code>:value</code> будет вставлен первый
            элемент из списка опций;
          </p>
        </div>
        <div class="col-4">
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[1, 2, 3]"
            label-name="value"
            :hide-selected="false"
            multiple
            event-bus-clear-listener="clear-select"
          />
          <button @click="emitEventBus">
            Clear
          </button>
        </div>

        <div class="col-12">
          <prism-code>
            {{
              `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1, 2, 3]"
  label-name="value"
  :hide-selected="false"
  multiple
  event-bus-clear-listener="clear-select"
/>
&lt;button @click="emitEventBus">
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
            Так же есть возможность отправлять события в <b>eventBus</b> при выборе
            опций из списка. Для этого необходимо указать <code>eventBusEmitter</code> во
            входных параметрах (так же по умолчанию установлен
            <code>:callEmitterOnMount="true"</code>, для отправки события сразу после рендера).
            Если eventBusEmitter не указан, отправляется vue-событие <code>@input</code>
          </p>
        </div>
        <div class="col-4">
          <h4>Событие eventBus: </h4>
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[1]"
            label-name="value"
            :hide-selected="false"
            event-bus-emitter="test-eventbus"
            multiple
          />
          <div>test-eventbus value: {{ eventBusValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1]"
  label-name="value"
  :hide-selected="false"
  event-bus-emitter="test-eventbus"
  multiple
/>
              `
              }}
            </prism-code>
          </div>
        </div>
        <div class="col-4">
          <h4>Событие eventBus c <b>:call-emitter-on-mount="false"</b>:</h4>
          <TFMultiselect
            :options="arrayOfObjectOptions"
            :value="[1]"
            label-name="value"
            :hide-selected="false"
            event-bus-emitter="test-eventbus-without-mount-emit"
            :call-emitter-on-mount="false"
            multiple
          />
          <div>test-eventbus value without mount emit: {{ eventBusValueWithoutMountEmit }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1]"
  label-name="value"
  :hide-selected="false"
  event-bus-emitter="test-eventbus-without-mount-emit"
  :call-emitter-on-mount="false"
  multiple
/>
              `
              }}
            </prism-code>
          </div>
        </div>
        <div class="col-4">
          <h4>Стандартное событие без <b>eventBus</b>:</h4>
          <TFMultiselect
            :options="arrayOfObjectOptions"
            label-name="value"
            :hide-selected="false"
            :call-emitter-on-mount="false"
            multiple
            @input="selectOnChange"
          />
          <div>event @input: {{ inputEventValue }}</div>
          <div>
            <prism-code>
              {{
                `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  label-name="value"
  :hide-selected="false"
  :call-emitter-on-mount="false"
  multiple
  @input="selectOnChange"
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
        Входной параметр id
      </h3>
      <p>
        Если указан, элементу с классом <b>"multiselect"</b>, будет добавлен
        атрибут <b>aria-owns="listbox-{id}"</b>
        (так же есть возможность добавить data-cy при помощи входного параметра <code>data-сy</code>),
        списку опций <b>id="listbox-{id}"</b>, каждой опции <b>id="{id}-{index}"</b>.
        На данный момент используется при тестировании в cypress проекта playattack.
      </p>
      <p>В примере добавлен <code>id="test-id"</code></p>
      <div
        class="grid-container"
        style="margin-top: 10px"
      >
        <div class="col-4">
          <TFMultiselect
            id="test-id"
            :options="arrayOfObjectOptions"
            :value="[1]"
            label-name="value"
            :hide-selected="false"
            multiple
          />
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
          <TFMultiselect

            :options="arrayOfObjectOptions"
            :value="[1]"
            label-name="value"
            :hide-selected="false"
            :searchable="false"
            multiple
            has-actions
            has-error
            placeholder="Label"
            container-class="form-field"
          >
            <template #actions>
              <input type="checkbox">
            </template>
          </TFMultiselect>
        </div>
      </div>
      <div>
        <prism-code>
          {{
            `
&lt;TFMultiselect
  :options="arrayOfObjectOptions"
  :value="[1]"
  label-name="value"
  :hide-selected="false"
  :searchable="false"
  multiple
  has-actions
  has-error
  placeholder="Label"
  container-class="form-field"
>
  &lt;template #actions>
    &lt;input type="checkbox">
  &lt;/template>
&lt;/TFMultiselect>
              `
          }}
        </prism-code>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">
        Styles
      </h3>
      Стили используются дефолтные из
      <a href="https://github.com/shentao/vue-multiselect/blob/master/src/Multiselect.vue#L409">
        репозитория
      </a>, для кастомизации следует переопределить см demo/assets/styles/Multiselect.css
    </section>
  </div>
</template>

<script lang="ts">

import { TFMultiselect } from '../../src';
import eventBus from '../../src/utils/eventBus';
import type { TMultiselectValue } from '../../src/types/components';
import { onMounted, onUnmounted, ref } from 'vue';
export default {
  name: 'MultiselectPage',
  components: {
    TFMultiselect
  },

  setup() {
    const arrayStringOptions = [
      'item1', 'item2', 'item3',
    ];

    const arrayOfObjectOptions = [
      {
        id: 1,
        value: 'Item1'
      },
      {
        id: 2,
        value: 'Item2'
      },
      {
        id: 3,
        value: 'Item3'
      },
    ];

    const arrayOfObjectOptionsWithNull = [
      {
        id: 1,
        value: 'Item1'
      },
      {
        id: 2,
        value: 'Item2'
      },
      {
        id: 3,
        value: 'Item3'
      },
      {
        id: null,
        value: 'ItemNull'
      }
    ];

    const eventBusValue = ref(null);

    const eventBusValueWithoutMountEmit = ref(null);

    const inputEventValue = ref(null);

    onMounted(() => {
      eventBus.$on('test-eventbus', (data: TMultiselectValue) => {
        eventBusValue.value = data;
      });
      eventBus.$on('test-eventbus-without-mount-emit', (data: TMultiselectValue) => {
        eventBusValueWithoutMountEmit.value = data;
      });
    });

    onUnmounted(() => {
      eventBus.$off('test-eventbus')
      eventBus.$off('test-eventbus-without-mount-emit')
    })

    const selectOnChange = (data: TMultiselectValue) => {
      inputEventValue.value = data;
    };

    const emitEventBus = () => {
      eventBus.$emit('clear-select');
    };

    return {
      arrayStringOptions,
      arrayOfObjectOptions,
      arrayOfObjectOptionsWithNull,
      eventBusValue,
      eventBusValueWithoutMountEmit,
      inputEventValue,
      selectOnChange,
      emitEventBus
    };
  },
};
</script>
