<template>
  <div class="tf-table-container rendered">
    <div class="tf-table-outer-actions-container">
      <div
        class="tf-table-deleted-columns"
      >
        <div
          v-if="isEditable && showDeletedBadges"
          class="tf-table-deleted-columns-inner"
        >
          <span
            v-for="(element, idx) in Object.fromEntries(deletedColumns)"
            :key="idx"
            class="tf-table-deleted-column"
            :id="'column_' + idx"
            @click="addColumn(String(idx))"
            data-cy="deleted_column_label"
          >
            {{ element }}
          </span>
        </div>
      </div>
      <div class="tf-table-inner-actions">
        <slot name="additional-buttons" />
        <button
          v-if="canSaveToCsv"
          class="tf-table-btn tf-table-btn-csv"
          @click="saveStatToCsv"
        >
          Get CSV
        </button>
        <button
          v-if="isEditable || isDraggable"
          class="tf-table-btn tf-table-btn-reset"
          data-cy="reset_button"
          @click="resetTable"
        >
          Reset table
        </button>
      </div>
    </div>
    <div
      ref="scrollAnchorForTable"
      class="tf-table-scroll-anchor"
    />
    <div v-if="hasPreloader && loading"
         class="tf-table-preloader"
    >
      <slot name="preloader">
        <div
          class="item item-1"
        />
        <div
          class="item item-2"
        />
      </slot>
    </div>
    <div
      v-else
      class="tf-table-outer-container"
      :style="{ maxHeight: calcTableMaxHeight }"
    >
      <TFTable
        :key="tableKey"
        ref="table"
        :columns="headerCells"
        :rows="rows"
        :call-children="callChildren"
        :total-row="totalRow"
        :call-temp-rows="callTempRows"
        :classes="classes"
        :is-draggable="isDraggable"
        :is-editable="isEditable"
        :is-fixable="isFixable"
        @updateColumnOrder="saveColumnOrder($event, true)"
        @removeColumn="removeColumn"
        data-cy="table_block"
      >
        <template #no-rows="{}">
          <slot name="no-rows-slot">
            <p
              class="text-center"
              data-cy="no_data_text"
            >
              {{ emptyText }}
            </p>
          </slot>
        </template>
        <template
          #remove-icon
          v-if="$slots['remove-icon-slot']"
        >
          <slot name="remove-icon-slot"></slot>
        </template>
        <template
          #fixative-btn
        >
          <div
            @click="toggleStickyElements()"
            class="tf-table-fix-btn"
            :class="
              stickyElements
                ? 'tf-table-fix-btn-fixed'
                : 'tf-table-fix-btn-unfixed'
            "
          >
            <div
              class="tf-table-fix-btn-content"
              data-cy="fix_button"
            >
              <slot name="fixative-btn-slot"></slot>
            </div>
          </div>
        </template>
        <template
          #sort-icon="props"
          v-if="$slots['sort-icon']"
        >
          <slot :props="props"
                name="sort-icon"
          >
          </slot>
        </template>
        <template #loading>
          <p
            class="tf-table-loading"
            data-cy="loading_text"
          >
            <slot name="loading-slot">
              Loading...
            </slot>
          </p>
        </template>
        <template
          #toggle-children-icon="props"
          v-if="$slots['toggle-children-icon']"
        >
          <slot :props="props"
                name="toggle-children-icon"
          >
          </slot>
        </template>
        <template #title="props">
          <slot
            name="title"
            :props="props"
          >
            <span
              v-if="props.row.title_html"
              v-html="props.row.title_html"
            />
            <span
              v-else
              v-text="props.row.title"
            />
          </slot>
        </template>
        <template
          v-for="(_, slot) of $slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope"
          />
        </template>
      </TFTable>
    </div>
    <TFPagination
      class="mb-3"
      v-if="hasPagination"
      :pages-count="pagesCount"
      :page-number="page"
      @pageChanged="loadTableData"
    />
  </div>
</template>

<script lang="ts">
import { merge, difference, differenceWith, isEqual } from 'lodash';
import axios from 'axios';
import Qs from 'qs';
import { vTooltip } from 'floating-vue';
import {
  computed,
  onMounted,
  ref,
  watch,
  onBeforeMount,
  reactive,
  nextTick,
  defineComponent,
  type PropType,
} from 'vue';

import TFTable from '@/components/tables/TFTable.vue';
import TFPagination from '@/components/tables/TFPagination.vue';
import type { TTableColumn, TTableRow } from '@/types/components';
import useColumnsState from '@/composables/table/useColumnsState';

axios.interceptors.request.use(config => {
  config.paramsSerializer = params =>
    Qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    });
  return config;
});

export default defineComponent({
  name: 'TFTableFull',
  components: {
    TFTable,
    TFPagination,
  },
  inheritAttrs: false,

  props: {
    apiUrl: { type: String, required: true },
    sharedParamsUrl: { type: String, required: true },
    params: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array as PropType<TTableColumn[]>,
      required: true,
    },
    filterMapping: {
      type: Object,
      default: () => {},
    },
    withTotal: { type: Boolean, default: false },
    colClasses: { type: Object, default: () => ({}) },
    isDraggable: { type: Boolean, default: true },
    isEditable: { type: Boolean, default: true },
    isFixable: { type: Boolean, default: true },
    hasPagination: { type: Boolean, default: true },
    hideUrlParams: { type: Boolean, default: false },
    tableNamePrefix: {
      type: [Number, String],
      default: window.location.pathname
    },
    externalForm: {
      type: Object,
      default: () => ({
        name: 'report',
        elements: ['sort_by', 'sort_dir'],
      }),
    },
    hasPreloader: { type: Boolean, default: true },
    csvUrl: { type: String, default: '' },
    canSaveToCsv: { type: Boolean, default: false },
  },

  setup(props) {
    const scrollAnchorForTable = ref<HTMLElement | null>(null);
    const mutableColsForComparison = ref<TTableColumn[]>([]);
    const headerCells = reactive<TTableColumn[]>([]);
    const staticColsForComparison = props.columns
      .filter(column => !column.hide)
      .map(column => {
        column.headerDataObject = {
          id: column.property,
          'data-cy': column.property,
          'data-cy-header-cell-title': true,
          class: { 'tf-table-header-cell-title': true },
        };
        column.directivesData = [
          {
            name: vTooltip,
            value: { content: column.tooltip },
            modifiers: { top: true },
          },
        ];

        if (column.property === props.params.sortBy) {
          column.direction = props.params.sortDir === 'asc';
        }
        return column;
      });

    const rows = ref<TTableRow[]>([]);
    const emptyText = ref('Loading');
    const query = ref(props.params.query);
    const page = ref(props.params.page);
    const pagesCount = ref(1);
    const totalRow = ref(undefined);
    const stickyElements = ref(false);
    const showDeletedBadges = ref(false);
    const deletedColumns = ref(new Map());
    const loading = ref(false);
    const tableName = ref(`${props.tableNamePrefix}`);

    const classes = computed(() => {
      const defaultClasses = {
        '0/': {
          'tf-table-sticky-row': stickyElements,
        },

        '/0': {
          'tf-table-sticky-col': stickyElements,
        },
      };

      return merge(defaultClasses, props.colClasses);
    });

    const calcTableMaxHeight = computed(() =>
      stickyElements.value ? `${window.innerHeight - 150}px` : '',
    );

    onBeforeMount(async () => {
      await getTotal();

      if (Array.isArray(getOrderFromLocalStorage())) {
        const deletedColumns = getVisualStateFromLocalStorage();
        const visibleColumns = getOrderFromLocalStorage();
        const originalColumns = staticColsForComparison;

        const lengthComparison =
          deletedColumns.size + visibleColumns.length ===
          originalColumns.length;

        const deletedPropertiesComparison = () => {
          const deletedColumnsFromArr = Array.from(
            deletedColumns,
            ([property, title]) => ({ property, title }),
          );
          const originalColumnsProperties = originalColumns.map(
            ({ property, title }) => ({ property, title }),
          );

          return (
            differenceWith(
              deletedColumnsFromArr,
              originalColumnsProperties,
              isEqual,
            ).length === 0
          );
        };

        const orderedPropertiesComparison = () => {
          const originalColumnsProperties = originalColumns.map(
            ({ property }) => property,
          );

          return (
            difference(visibleColumns, originalColumnsProperties).length === 0
          );
        };

        if (
          !lengthComparison ||
          !deletedPropertiesComparison() ||
          !orderedPropertiesComparison()
        ) {
          resetTable();
        }
      }
    });

    onMounted(() => {
      mutableColsForComparison.value = [...staticColsForComparison];
      headerCells.splice(0, headerCells.length, ...staticColsForComparison);

      addSearchColumnsToForm();
      const searchParams = new URLSearchParams(window.location.search);
      updateSortInputs(
        searchParams.get('sort_by') ?? '',
        searchParams.get('sort_dir'),
      );

      applyColumnSortOrder();
      deletedColumns.value = getVisualStateFromLocalStorage();
    });

    watch(headerCells, () => {
      showDeletedBadges.value = true;
    });

    const getTotal = async () => {
      if (!props.withTotal) {
        return;
      }

      const data = (
        await axios.get(props.apiUrl + '/datatable/total', {
          params: query.value,
        })
      ).data;

      totalRow.value = { ...{ title: 'Total', total: 'Total' }, ...data };
    };

    const {
      getOrderFromLocalStorage,
      getVisualStateFromLocalStorage,
      resetTable,
      applyColumnSortOrder,
      removeColumn,
      addColumn,
      saveColumnOrder,
      tableKey
    } = useColumnsState(
      tableName,
      headerCells,
      staticColsForComparison,
      mutableColsForComparison,
      deletedColumns
    );
    const setSharedParams = (params: { [key: string]: string }) => {
      window.history.replaceState(
        null,
        '',
        props.sharedParamsUrl +
          '?' +
          Qs.stringify(params, { arrayFormat: 'brackets' }),
      );
    };

    const loadTableData = async (pageNumber: number) => {

      loading.value = true;
      const params = query.value;
      params.page = pageNumber;

      if (!props.hideUrlParams) {
        setSharedParams(params);
      }

      try {
        const result = await axios.get(
          props.apiUrl + '/datatable',
          { params: params }
        );

        rows.value = result ? result.data?.items : [];
        pagesCount.value = result?.data?.count && typeof result.data.count === 'number'
          ? Math.ceil(result.data.count / props.params.perPage)
          : 1;
        emptyText.value = 'No data';
        page.value = pageNumber;

        if (rows.value.length) {
          nextTick().then(() => {
            if (scrollAnchorForTable.value) {
              scrollAnchorForTable.value.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        loading.value = false;
      }
    };

    const callChildren = async (parent: TTableRow) => {
      const parentsScope = getParentsParams(parent);

      const preparedQuery = { ...query.value, page: 1, _parents: parentsScope };

      const result = await axios.get(props.apiUrl + '/datatable', {
        params: preparedQuery,
      });

      const items = result.data.items.map((row: TTableRow) => {
        row._parent = parent;
        return row;
      });

      if (items.length < result.data.count) {
        const scopes = Object.keys(parentsScope);
        const subQuery = {
          ...query.value,
          page: 1,
          groups: query.value.groups.filter(
            (group: string) => !scopes.includes(group),
          ),
        };
        scopes.forEach(field => {
          subQuery[props.filterMapping[field]] = [parentsScope[field]];
        });

        if (parent.date) {
          subQuery.date_begin = parent.date;
          subQuery.date_end = parent.till_date || parent.date;
        }

        items.push({
          title_html: `
              More entries available,
              <a
               href="${props.apiUrl}?${Qs.stringify(subQuery, { arrayFormat: 'brackets' })}"
               target="_blank"
               >see</a>
            `,
        });
      }

      return items;
    };

    const getParentsParams = (parent: TTableRow): Record<string, string> => {
      let parents: Record<string, string> = {};

      const groupKey = props.params.groups[parent.level];

      if (typeof groupKey === 'string') {
        const value = parent[groupKey];

        if (typeof value === 'string' || typeof value === 'number') {
          parents[groupKey] = String(value);
        }
      }

      if (parent._parent) {
        parents = { ...parents, ...getParentsParams(parent._parent) };
      }

      return parents;
    };

    const callTempRows = async (columns: TTableColumn[]) => {
      const sorting =
        columns
          .map(column => {
            const col = {
              property: column.property,
              direction: column.direction === true ? 'asc' : 'desc',
              column: column,
            };

            column.direction = null;

            return col;
          })
          .pop() || ({} as TTableColumn);


      query.value.sort_by = sorting.property || null;
      query.value.sort_dir = sorting.direction || null;

      if (sorting.column) {
        sorting.column.direction = sorting.direction === 'asc';
      }

      updateSortInputs(sorting.property, sorting.direction);

      await loadTableData(page.value);

      return { rows: rows.value };
    };

    const toggleStickyElements = () => {
      stickyElements.value = !stickyElements.value;
    };

    const addSearchColumnsToForm = () => {
      const form = document.forms[props.externalForm.name];

      if (form) {
        props.externalForm.elements.forEach((name: string) => {
          const el = document.createElement('input');
          el.setAttribute('type', 'hidden');
          el.setAttribute('name', name);

          form.appendChild(el);
        });
      }
    };

    const updateSortInputs = (
      property: string | null,
      direction: boolean | string | null,
    ) => {
      const form = document.forms[props.externalForm.name];

      if (form) {
        const sortByElement = form.querySelector(
          '[name="sort_by"]',
        ) as HTMLInputElement | null;
        const sortDirElement = form.querySelector(
          '[name="sort_dir"]',
        ) as HTMLInputElement | null;

        if (sortByElement) {
          sortByElement.value = property ?? '';
        }

        if (sortDirElement) {
          sortDirElement.value =
            typeof direction === 'string' ? direction : '';
        }
      }
    };

    const saveStatToCsv = async () => {
      const columns = headerCells
        .map(item => item.property)
        .filter(item => item !== 'actions');

      const response = await axios.get(props.csvUrl, {
        params: {
          columns,
          ...query.value,
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const uri = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const dateFrom = query.value.date_from || 'start';
      const dateTo = query.value.date_to || 'end';
      const fileName = `${tableName.value}_${dateFrom}_${dateTo}.csv`;

      link.setAttribute('href', uri);
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return {
      showDeletedBadges,
      deletedColumns,
      addColumn,
      saveStatToCsv,
      resetTable,
      loading,
      calcTableMaxHeight,
      headerCells,
      rows,
      callChildren,
      totalRow,
      callTempRows,
      classes,
      saveColumnOrder,
      removeColumn,
      pagesCount,
      page,
      loadTableData,
      emptyText,
      stickyElements,
      toggleStickyElements,
      scrollAnchorForTable,
      tableKey,
      // for test
      query,
      applyColumnSortOrder,
      mutableColsForComparison,
      getTotal,
      getParentsParams,
      updateSortInputs
    };
  },
});
</script>
