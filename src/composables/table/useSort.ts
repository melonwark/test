import { computed, type ComputedRef, type Ref } from 'vue';
import useAsync from '@/composables/table/useAsync';
import type { TTableColumn, TTableRow } from '@/types/components';

type TProps = {
  rows: TTableRow[];
  callTempRows: (sortColumns: TTableColumn[]) => Promise<{ rows: TTableRow[] }>;
}

const useSort = (
  props: TProps,
  visibleColumns: Ref<TTableColumn[]>,
  sortColumns: ComputedRef<TTableColumn[]>,
  loading: Ref<boolean, boolean>,
) => {
  const { unresolved, currentRows, handleUnresolved } = useAsync(props, sortColumns, loading);

  const sortedRows = computed(() => {
    if (unresolved.value) {
      return currentRows.value.filter(row => row);
    }

    return currentRows.value.filter(prepareRow);
  });

  const prepareRow = (row: TTableRow) => {
    if (!row) return true;

    row._meta.visibleChildren = row._children.filter(prepareRow);

    return true;
  };

  const maxSortOrder = () => {
    return visibleColumns.value.reduce(
      (max, column) => (max < column.order ? column.order : max),
      0);
  };

  const sort = async (column: TTableColumn)=> {
    column.direction = column.direction === null
      ? false : column.direction === true
        ? null : !column.direction;

    column.order = maxSortOrder() + 1;

    if (column.callTempRowsOnSort || unresolved.value) {
      await handleUnresolved();
    }
  };

  return {
    sortedRows,
    maxSortOrder,
    sort,
  };
};

export default useSort;

