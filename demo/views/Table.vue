<template>
  <div>
    <h2>TFTable</h2>

    Для запуска демо необходимо выполнить команды <code>node dev-server/generate-db.js</code>
    и <code>node dev-server/server.js</code>.

    <section class="section">
      <h3 class="section-title"></h3>
      <div class="grid-container">
      </div>
      <div class="grid-container">
        <div class="col-12">
          <form name="report"></form>
          <TFTableFull
            :key="tableKey"
            class="mb-5"
            api-url="http://localhost:5174"
            shared-params-url="http://localhost:5173/table"
            :params="params"
            with-total
            :col-classes="{'0/0': {'non-removable':true, 'non-draggable': true}}"
            :columns="columns"
            can-save-to-csv
            :filter-mapping="{'group_1' : 'group_1', 'group_2' : 'group_2', 'group_3' : 'group_3'}"
            csv-url="http://localhost:5174/get-csv"
          >
            <template #additional-buttons>
              <TFButton
                confirm-action
                confirm-message="Are you sure?"
              >
                Additional button
              </TFButton>
            </template>
            <template #toggle-children-icon="props">
              <span>
                {{ props.loading ? '... ' : props.expanded ? '[-]' : '[+]' }}
              </span>
            </template>
            <template #remove-icon-slot>
              <span style="color:red">[-]</span>
            </template>
            <template #sort-icon="props">
              <span
                :class="props.class"
                @click="props.onClick"
              >
              </span>
            </template>
            <template #actions="{row}">
              <button class="tf-table-btn">
                Actions btn
              </button>
            </template>
            <template #profit="props">
              <span style="color:var(--tf-color-ruby-red)">test column</span> - {{ props.row.profit }}
            </template>
            <template #row_slot_row_1="props">
              <span style="color:var(--tf-color-emerald)">test row</span> - {{ props.row[props.column.property] }}
            </template>
            <template #expenses_row_2="props">
              <span style="color:var(--tf-color-sapphire)">test cell</span> - {{ props.row[props.column.property] }}
            </template>
          </TFTableFull>
        </div>
      </div>

      <div class="grid-container">
        <div class="col-12">
          <h2>Входные параметры (Props)</h2>
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
                <td>apiUrl</td>
                <td>String</td>
                <td>URL API для загрузки данных</td>
                <td>Обязательно</td>
              </tr>
              <tr>
                <td>sharedParamsUrl</td>
                <td>String</td>
                <td>URL для вставки в браузерную строку (обычно совпадает с apiUrl)</td>
                <td>Обязательно</td>
              </tr>
              <tr>
                <td>params</td>
                <td>Object</td>
                <td>
                  Параметры запроса API

                  <prism-code>
                    {{
                      `
params:{
  page: 1,
  perPage: 10,
  sortDir: 'desc',
  sortBy: 'id',
  query: {
    groups: ['group_1', 'group_2', 'group_3'],
  },
  groups: ['group_1', 'group_2', 'group_3'],
}
`
                    }}
                  </prism-code>
                  параметры
                  <code>groups</code> необходимы для группировки рядов таблицы
                  (создание дочерних рядов)
                </td>
                <td>Обязательно</td>
              </tr>
              <tr>
                <td>columns</td>
                <td>Array of objects </td>
                <td>
                  Конфигурация столбцов
                  <prism-code>
                    {{ `
[{
  property: 'title',
  title: 'ID',
  nonDraggable: true,
  nonRemovable: true
  tooltip: 'Tooltip',
  direction: null,
  callTempRowsOnSort: true,
}]
                    ` }}
                  </prism-code>
                </td>
                <td>Обязательно</td>
              </tr>
              <tr>
                <td>filterMapping</td>
                <td>Object</td>
                <td>
                  Если не все данные отображаются в дочерних рядах, добавляется
                  ссылка на <code> More entries available</code>, где в качестве
                  query-параметров используется filterMapping. В демо выглядит так:
                  <prism-code>
                    {{ `
:filter-mapping="{'group_1' : 'group_1', 'group_2' : 'group_2', 'group_3' : 'group_3'}"
                  ` }}
                  </prism-code>
                </td>
                <td>{}</td>
              </tr>
              <tr>
                <td>withTotal</td>
                <td>Boolean</td>
                <td>Показывать TotalRow</td>
                <td>false</td>
              </tr>
              <tr>
                <td>colClasses</td>
                <td>Object</td>
                <td>CSS-классы для столбцов</td>
                <td>{}</td>
              </tr>
              <tr>
                <td>isDraggable</td>
                <td>Boolean</td>
                <td>Разрешить перетаскивание столбцов</td>
                <td>true</td>
              </tr>
              <tr>
                <td>isEditable</td>
                <td>Boolean</td>
                <td>
                  Даёт возможность скрывать/показывать столбцы таблицы с
                  сохранением состояния в localStorage
                </td>
                <td>true</td>
              </tr>
              <tr>
                <td>isFixable</td>
                <td>Boolean</td>
                <td>Даёт возможность фиксировать первый столбец и шапку таблицы</td>
                <td>true</td>
              </tr>
              <tr>
                <td>hasPagination</td>
                <td>Boolean</td>
                <td>Включить пагинацию</td>
                <td>true</td>
              </tr>
              <tr>
                <td>hideUrlParams</td>
                <td>Boolean</td>
                <td>
                  Даёт возможность не передавать параметры в адресную сроку
                  (отключает <b>setSharedParams</b>)
                </td>
                <td>false</td>
              </tr>
              <tr>
                <td>tableNamePrefix</td>
                <td>Number | String | Array | Object</td>
                <td>
                  Для именования полей изменённых/удалённых
                  колонок таблицы в localStorage. Используется совместно с
                  <b>isEditable</b>/<b>isDraggable</b>
                </td>
                <td>""</td>
              </tr>
              <tr>
                <td>externalForm</td>
                <td>Object</td>
                <td>Конфигурация для вставки в форму с фильтрами в отчётах</td>
                <td>{ name: 'report', elements: ['sort_by', 'sort_dir'] }</td>
              </tr>
              <tr>
                <td>csvUrl</td>
                <td>String</td>
                <td>URL для экспорта CSV</td>
                <td>""</td>
              </tr>
              <tr>
                <td>canSaveToCsv</td>
                <td>Boolean</td>
                <td>Разрешить сохранение в CSV</td>
                <td>false</td>
              </tr>
              <tr>
                <td>hasPreloader</td>
                <td>Boolean</td>
                <td>Добавить прелоадер</td>
                <td>true</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-container">
        <div class="col-12">
          <h2>Слоты (Slots)</h2>
          <table class="tf-table-demo">
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#no-rows</td>
                <td>Слот на случай отсутствия данных в таблице</td>
              </tr>
              <tr>
                <td>#preloader</td>
                <td>Слот для кастомизации прелоадера</td>
              </tr>
              <tr>
                <td>#additional-buttons</td>
                <td>
                  Слот для дополнительных кнопок/экшенов над шапкой таблицы
                  рядом с кнопками <b>Get CSV</b> и <b>Reset table</b>
                  <prism-code>
                    {{ `
<template #additional-buttons>
  <button class="tf-btn">
    Additional button
  </button>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>#toggle-children-icon</td>
                <td>
                  Слот для кнопки раскрытия субрядов таблицы. Для стилизации так
                  же можно использовать классы <code>tf-table-children-row-icon</code>,
                  <code>tf-table-children-row-icon-expanded</code>,
                  <code>tf-table-children-row-icon-contracted</code>
                  <prism-code>
                    {{ `
<template #toggle-children-icon="props"></template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>#remove-icon-slot</td>
                <td>
                  Слот иконки скрытия столбца. Можно стилизовать с помощью
                  <code>tf-table-remove-column-icon</code>
                  <prism-code>
                    {{ `
<template #remove-icon-slot>
  <span style="color:red">[-]</span>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>#sort-icon</td>
                <td>
                  Слот иконки сортировки.
                  Будет отображаться, если в колонке присутствует поле
                  <b>callTempRowsOnSort: true</b>. Можно стилизовать с помощью
                  <code>tf-table-sort</code>,
                  <code>tf-table-sort-up</code>,
                  <code>tf-table-unsorted</code>
                  <code>tf-table-sort-down</code>
                  <prism-code>
                    {{ `
<template #sort-icon="props">
  <span
    :class="props.class"
    @click="props.onClick"
  >
  </span>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>Колонка actions</td>
                <td>
                  Сама колонка должна присутствовать списке <b>columns</b> и иметь
                  ключевое поле <b>property: actions</b>
                  <prism-code>
                    {{ `
[
  {
    property: 'actions',
    title: 'Actions',
    callTempRowsOnSort: true,
    nonDraggable: true,
    nonRemovable: true
  }
]
                    ` }}
                  </prism-code>
                  <prism-code>
                    {{ `
<template #actions="{row}">
  <button class="tf-table-btn">
    Actions btn
  </button>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>Слот колонки #{column-property}</td>
                <td>
                  Любая колонка имеет слот, имя которого совпадает со значением
                  поля <b>property</b>.
                  <prism-code>
                    {{ `
<template #column-property="props">
   <span>column property slot</span>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>
                  Слот для ряда таблицы #row_slot_{row_id}
                </td>
                <td>
                  Будет отображаться, если в ряду
                  присутствует поле <b>_id</b>. Должно приходить с бэкэнда, либо
                  нужно реализовывать на фронте. Так, если ряд имеет <b>_id: test</b>,
                  то имя слота должно быть #row_slot_test
                  <prism-code>
                    {{ `
<template #row_slot_test="props">
   <span>row slot </span>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
              <tr>
                <td>Слот для ячейки #{column_property}_{row_id}</td>
                <td>
                  Для слота ячейки нужно объединить <b>_id</b> ряда и <b>property</b>
                  столбца например  property: column, _id: row, то слот будет
                  #column_row
                  <prism-code>
                    {{ `
<template #column_row="props">
  <span>cell slot </span>
</template>
                    ` }}
                  </prism-code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-container">
        <div class="col-12">
          <h2>Стили</h2>
          <p>Имена классов должны начинаться с префикса <code>tf-table</code></p>
          <p>
            Вся стилизация выполняется с помощью обычного объекта.
            Он содержит селектор для строки/столбца/ячейки в качестве ключа и Vue-объект,
            содержащий классы. Более поздние стили могут переопределять более ранние.
          </p>

          <p>Ключ — это селектор</p>
          <p>
            Эти селекторы разделяются слэшем (/). Можно использовать селектор строки
            и селектор столбца. Заголовочная строка имеет индекс 0, первая строка данных — 1.
          </p>


          <p>Примеры селекторов:</p>

          <ul>
            <li>'all' — выбрать все строки/столбцы.</li>
            <li>'even' — выбрать все четные строки/столбцы.</li>
            <li>'odd' — выбрать все нечетные строки/столбцы.</li>
            <li>'3' — выбрать строку/столбец с индексом 3.</li>
            <li>'5_7' — выбрать строки/столбцы 5 и 6.</li>
            <li>'0_-1' — выбрать все строки/столбцы, кроме последнего.</li>
            <li>'1_' — выбрать все строки/столбцы, кроме первой.</li>
            <li>'_4' — выбрать строки/столбцы 0,1,2,3.</li>
            <li>'1_4,5_8' — выбрать строки/столбцы 1,2,3,5,6,7.</li>
          </ul>

          <p>
            Значение — это объект классов Vue или вызываемая функция, которая
            генерирует этот объект в зависимости от переданных параметров.
          </p>
          <p>
            Эти параметры зависят от ключа (селектор строк, столбцов или их комбинация для ячеек).
          </p>

          <p>Следует обратить внимание, что '1_3/all' и '1_3/' — это разные вещи:</p>

          <ul>
            <li>'1_3/all' — добавляет классы ко всем ячейкам строк 1 и 2.</li>
            <li>'1_3/' — добавляет классы к тэгу 'tr' строк 1 и 2.</li>
          </ul>

          <p>Примеры: </p>

          <ul>
            <li>
              '0_-1/': { 'test-row': true } — добавит класс test-row для всех строк,
              кроме последней, во всех столбцах.
            </li>
            <li>
              '/1_3,5': { 'test-column': true } — добавит класс test-column для
              столбцов 1,2,5 во всех строках.
            </li>
            <li>
              'even/1': { 'cell': true } — добавит класс cell для столбца 1 во всех четных строках.
            </li>
            <li>
              '1_/3': (row, column) => {...} — вызываемая функция,
              которая возвращает объект классов Vue в зависимости от параметров row и column.
            </li>
          </ul>

          классы добавляются через входной параметр <code>colClasses</code>

          <prism-code>
            {{ `
:col-classes="{'0/0': {'non-removable':true, 'non-draggable': true } }"
          ` }}
          </prism-code>
        </div>

        <div class="col-12">
          <p>По дефолту установлены следующие классы</p>
          <prism-code>
            {{ `
  'all/': {
    'tf-table-row': true,
  },
  'all/all': {
    'tf-table-cell': true,
  },
  'even/': {
    'tf-table-row_even': true,
  },
  'odd/': {
    'tf-table-row_odd': true,
  },
  '0/': {
    'tf-table-header-row': true,
    'tf-table-row_even': false,
    'tf-table-row_odd': false,
    'tf-table-row': false,
  },
  '/0': {
    'tf-table-actions-column': true,
  },
  '0/all': {
    'tf-table-header-cell': true,
  },
  '0_-1/': {
    'tf-table-border-b': true,
  },
  '/0_-1': {
    'tf-table-border-r': true,
  },
          ` }}
          </prism-code>
        </div>

        <div class="col-12">
          <p>Для пагинации классы следующие:</p>
          <prism-code>
            {{ `
.tf-pagination-container

.tf-pagination

.tf-page-link

.tf-page-link:hover

.tf-page-link:focus

.tf-page-link:not(:disabled):not(.disabled)

.tf-page-item:first-child .tf-page-link,
.tf-pagination .tf-page-number:first-child .tf-page-link

.tf-page-item:last-child .tf-page-link,
.tf-pagination .tf-page-number:last-child .tf-page-link

.tf-page-item.active .tf-page-link,
.tf-pagination .active.tf-page-number .tf-page-link

.tf-page-item.disabled .tf-page-link,
.tf-pagination .disabled.tf-page-number .tf-page-link
            ` }}
          </prism-code>
        </div>
      </div>
    </section>
  </div>
</template>

<script  lang="ts">
import { TFTableFull } from '../../src';
import { reactive, ref } from 'vue';
import PrismCode from '../components/Prism.vue';
import TFButton from '@/components/ui/TFButton.vue';

export default {
  name: 'TablePage',
  components: {
    TFButton,
    PrismCode,
    TFTableFull,
  },

  setup() {
    const tableKey = ref(null);

    const params = reactive({
      page: 1,
      perPage: 10,
      sortDir: 'desc',
      sortBy: 'id',
      query: {
        groups: ['group_1', 'group_2', 'group_3'],
      },
      groups: ['group_1', 'group_2', 'group_3'],
    });

    const columns = [
      {
        property: 'title',
        title: 'ID',
        nonDraggable: true,
        nonRemovable: true
      },
      {
        tooltip: 'All unique visitors',
        property: 'income',
        title: 'Income',
      },
      {
        property: 'expenses',
        title: 'Expenses',
        direction: null,
        callTempRowsOnSort: true,
      },

      {
        property: 'profit',
        title: 'Profit',
        direction: true,
        callTempRowsOnSort: true,
      },
      {
        property: 'taxes',
        title: 'Taxes',
        direction: null,
        callTempRowsOnSort: true,
      },
      {
        property: 'sales',
        title: 'Sales',
        direction: null,
        callTempRowsOnSort: true,
      },
      {
        property: 'returns',
        title: 'Returns',
        direction: null,
        callTempRowsOnSort: true,
      },
      {
        property: 'revenue',
        title: 'Revenue',
        direction: null,
        callTempRowsOnSort: true,
      },
      {
        property: 'actions',
        title: 'Actions',
        callTempRowsOnSort: true,
        nonDraggable: true,
        nonRemovable: true
      },

    ];

    return {
      params,
      columns,
      tableKey
    };
  }
};
</script>
