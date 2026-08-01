<template>
  <table
    :class="tableClasses"
    style="border-collapse: collapse"
  >
    <thead>
      <draggable
        v-if="isDraggable"
        :list="nonGroupedColumns"
        tag="tr"
        filter=".tf-table-non-draggable-column"
        draggable=".tf-table-draggable-column"
        :class="headerRowClasses"
        item-key="property"
        @change="draggableUpdate(nonGroupedColumns)"
      >
        <header-cell
          v-for="(column, key) in nonGroupedColumns"
          :key="key"
          :column="column"
          :column-index="key"
          :css-processor="cssProcessor"
          :sort-icon-slot="sortIconSlot"
          :remove-icon-slot="removeIconSlot"
          :fixative-btn-slot="fixativeBtnSlot"
          @sort="sort"
          @group="group"
          @removeColumn="removeColumn"
          :is-draggable-css="isDraggable"
          :is-editable="isEditable"
          :is-fixable="isFixable"
          :fixative-btn-col-index="fixativeBtnColIndex"
        />
      </draggable>
      <tr
        v-else
        :class="headerRowClasses"
      >
        <header-cell
          v-for="(column, key) in nonGroupedColumns"
          :key="key"
          :column="column"
          :column-index="key"
          :css-processor="cssProcessor"
          :sort-icon-slot="sortIconSlot"
          :fixative-btn-slot="fixativeBtnSlot"
          :remove-icon-slot="removeIconSlot"
          :is-editable="isEditable"
          :is-fixable="isFixable"
          :fixative-btn-col-index="fixativeBtnColIndex"
          @removeColumn="removeColumn"
          @sort="sort"
        />
      </tr>
    </thead>
    <tbody>
      <tr v-if="infoVisible">
        <td
          :class="infoClasses"
          :colspan="nonGroupedColumns.length"
        >
          <span v-if="internalLoading">
            <slot name="loading">Loading...</slot>
          </span>
          <span v-else>
            <slot name="no-rows">No results found</slot>
          </span>
        </td>
      </tr>
      <template v-else>
        <template
          v-for="(row, rowKey) in flattenedRows"
          :key="rowKey"
        >
          <row
            :row="row"
            :row-index="rowKey"
            :columns="nonGroupedColumns"
            :slots="rowSlots"
            :toggle-children-icon-slot="toggleChildrenIconSlot"
            :css-processor="cssProcessor"
            @toggle-children="toggleChildren(row)"
          />
        </template>
        <row
          class="tf-table-border-t tf-table-total-row"
          v-if="processedTotalRow.length"
          :row="processedTotalRow[0]"
          :row-index="0"
          :columns="nonGroupedColumns"
          :slots="rowSlots"
          :css-processor="cssProcessor"
        />
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, watch, defineComponent, type PropType, ref } from 'vue';
import useRows from '@/composables/table/useRows';
import useColumns from '@/composables/table/useColumns';
import useSlots from '@/composables/table/useSlots';
import useSort from '@/composables/table/useSort';
import useStyles from '@/composables/table/useStyles';
import useFlatten from '@/composables/table/useFlatten';
import useGroup from '@/composables/table/useGroup';
import useAsync from '@/composables/table/useAsync';

import { VueDraggableNext } from 'vue-draggable-next';
import HeaderCell from '@/components/tables/HeaderCell.vue';
import Row from '@/components/tables/Row.vue';
import defaultClasses from '@/components/tables/tableDefaultClasses';
import { merge } from 'lodash';
import type { TTableColumn, TTableRow } from '@/types/components';

export default defineComponent({
  name: 'TFTable',
  props: {
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    isFixable: {
      type: Boolean,
      default: false,
    },
    fixativeBtnColIndex: {
      type: Number,
      default: 0,
    },
    rows: {
      type: Array as PropType<TTableRow[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<TTableColumn[]>,
      required: true,
    },
    totalRow: {
      type: Object as PropType<TTableRow> | null,
      default: null,
    },
    slots: {
      type: Object,
      default: () => ({}),
    },
    callTempRows: {
      type: Function as PropType<(sortColumns: TTableColumn[]) =>
        Promise<{ rows: TTableRow[] }>>,
      default: () => Promise.resolve({ total: 0, rows: [] }),
    },
    callChildren: {
      type: Function as PropType<(row: TTableRow) => Promise< TTableRow[]>>,
      default: () => [],
    },
    classes: {
      type: Object,
    },
    page: {
      type: Number,
      default: 0,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  components: {
    HeaderCell,
    Row,
    draggable: VueDraggableNext,
  },
  setup(props, { emit, slots }) {

    const computedClasses = computed(() =>
      merge(defaultClasses, props.classes),
    );

    const loading = ref(false);

    const { initRows, processedTotalRow } = useRows(props);

    const {
      cssProcessor,
      headerRowClasses,
      tableClasses,
      infoClasses
    } = useStyles(props.columns, computedClasses);

    const {
      nonGroupedColumns,
      visibleColumns,
      sortColumns,
      columnProperties,
    } = useColumns(props.columns, cssProcessor);

    const {
      sortIconSlot,
      fixativeBtnSlot,
      removeIconSlot,
      toggleChildrenIconSlot,
      rowSlots,
    } = useSlots(slots, columnProperties);

    const { internalLoading } = useAsync(
      props,
      sortColumns,
      loading
    );

    const { sort, maxSortOrder, sortedRows } = useSort(
      props,
      visibleColumns,
      sortColumns,
      loading
    );

    const { groupedRows, group } = useGroup(
      sortedRows,
      maxSortOrder,
    );

    const { flattenedRows, toggleChildren } = useFlatten(
      groupedRows,
      initRows,
      props.callChildren,
    );

    const totalVisibleRows = computed(() => flattenedRows.value.length);
    const infoVisible = computed(
      () => totalVisibleRows.value === 0 || loading.value,
    );

    watch(
      totalVisibleRows,
      totalVisibleRows => {
        cssProcessor.totalRows =
          totalVisibleRows === 0 ? 2 : totalVisibleRows + 1;
      },
      {
        immediate: true,
      },
    );

    const draggableUpdate = (draggedColumns: TTableColumn[]) => {
      emit('updateColumnOrder', draggedColumns);
    };
    const removeColumn = (removeColumn: string) => {
      emit('removeColumn', removeColumn);
    };

    return {
      nonGroupedColumns,
      flattenedRows,
      cssProcessor,
      sortIconSlot,
      fixativeBtnSlot,
      removeIconSlot,
      toggleChildrenIconSlot,
      rowSlots,
      internalLoading,
      totalVisibleRows,
      infoVisible,
      sort,
      toggleChildren,
      draggableUpdate,
      removeColumn,
      headerRowClasses,
      tableClasses,
      processedTotalRow,
      group,
      infoClasses,
    };
  },
});
</script>
