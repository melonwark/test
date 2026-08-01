import { ref, computed, watch } from 'vue';
import type { TTableColumn } from '@/types/components';

type TCssProcessor = {
  totalColumns: number
}

const useColumns = (columns: TTableColumn[], cssProcessor: TCssProcessor) => {
  const nonGroupedColumns = ref(columns);

  const visibleColumns = computed(() => columns.filter(column => column.visible));
  const columnProperties = computed(() => visibleColumns.value.map(column => column.property));
  const sortColumns = computed(() => {
    return visibleColumns.value
      .filter(column => column.hasOwnProperty('direction') && column.direction !== null)
      .sort((columnA, columnB) => {
        if (columnA.grouped !== columnB.grouped) {
          return Number(!columnB.grouped) - Number(!columnA.grouped);
        }
        return columnA.grouped ? (columnB.order - columnA.order) : (columnA.order - columnB.order);
      });
  });

  const filterColumnProperties = computed(() => {
    return visibleColumns.value
      .map(column => column.property);
  });
  const columnsChanged = (columns: TTableColumn[]) => {
    let maxSortOrder = maxSortOrderValue();

    columns.forEach(column => {
      initColumn(column, maxSortOrder);
      if (column.order === maxSortOrder) {
        maxSortOrder++;
      }
    });

    if (!columns.find(column => column.collapseIcon) && columns[0]) {
      columns[0].collapseIcon = true;
    }

    nonGroupedColumns.value = columns
      .filter(column => column.visible);

    // Assuming `cssProcessor` is passed as an argument to the composable
    cssProcessor.totalColumns = nonGroupedColumns.value.length;
  };
  const initColumn = (column: TTableColumn, order: number) => {
    if (typeof column.property !== 'string') {
      column.property = '';
    }

    if (!column.hasOwnProperty('visible')) {
      column.visible = true;
    }

    if (column.hasOwnProperty('order') || column.hasOwnProperty('direction')) {
      if (!Number.isInteger(column.order) || column.order < 0) {
        column.order = order;
      }

      if (!column.hasOwnProperty('direction')) {
        column.direction = null;
      }
    }
  };

  const maxSortOrderValue = () => {
    return Math.max(...columns.map(col => col.order || 0), 0);
  };

  watch(() => columns, newColumns => {
    columnsChanged(newColumns);
  }, {
    immediate: true,
    deep: true,
  });

  return {
    nonGroupedColumns,
    visibleColumns,
    columnProperties,
    sortColumns,
    filterColumnProperties,
    columnsChanged,
  };
};

export default useColumns;
