import { reactive, watch, computed } from 'vue';
import type { TTableRow } from '@/types/components';

type TProps = {
  rows: TTableRow[]
  totalRow?: TTableRow | null
}
export function useRows (props: TProps) {
  const rowsState = reactive({
    rows: props.rows,
  });


  const rowsChanged  = (
    rows: TTableRow[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oldRows: TTableRow[] = [],
    parent: TTableRow | null = null
  ) => {
    initRows(rows, parent);
  };

  const initRows = (rows: TTableRow[], parent: TTableRow | null = null): TTableRow[]=> {
    rows.forEach((row, index) => initRow(row, parent, index));

    rows
      .filter(row => row._children && row._children.length > 0)
      .forEach(row => row._children && rowsChanged(row._children, [], row));

    return rows;
  };

  const initRow = (
    row: TTableRow,
    parent: TTableRow | null,
    index: number,
  ) => {

    row._children ??= [];

    row._showChildren ??= false;

    row._meta ??= {
      parent: parent ? parent._meta.parent + 1 : 0,
      loading: false,
      visibleChildren: row._children || [],
      index,
    };

  };

  const loadedRows = computed(() => rowsState.rows.filter(row => row));
  const processedTotalRow = computed(() =>
    props.totalRow ? initRows([props.totalRow]) : []);

  watch(
    () => props.rows,
    (newRows, oldRows) => {
      rowsChanged(newRows, oldRows);
    },
    {
      immediate: true,
    }
  );

  return {
    rowsState,
    loadedRows,
    processedTotalRow,
    rowsChanged,
    initRows,
    initRow,
  };
}


export default useRows;

