import { computed, type Ref } from 'vue';
import type { TTableColumn, TTableRow } from '@/types/components';

const useGroup = (
  sortedRows: Ref<TTableRow[]>,
  maxSortOrder: () => number,
) => {
  const groupedRows = computed(() => {
    return sortedRows.value;
  });

  const group = async (column: TTableColumn) => {
    column.grouped = !column.grouped;
    column.direction = column.grouped ? !column.direction : null;
    column.order = maxSortOrder() + 1;
  };

  return {
    groupedRows,
    group,
  };
};

export default useGroup;

