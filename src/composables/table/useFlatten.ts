import { computed, type Ref } from 'vue';
import type { TTableRow } from '@/types/components';

const useFlatten = (
  groupedRows: Ref<TTableRow[]>,
  initRows: (rows: TTableRow[], parent?: TTableRow | null) => TTableRow[],
  callChildren: (row: TTableRow) => Promise< TTableRow[]>
) => {
  const flattenedRows = computed(() => {
    return flatten(groupedRows.value);
  });

  const toggleChildren = async (row: TTableRow) => {
    row._showChildren = !row._showChildren;

    if (!row._hasChildren) {
      return;
    }

    if(row._meta && row._children) {
      row._meta.loading = true;
      row._children = initRows(await callChildren(row), row);
      delete row._hasChildren;
      row._meta.loading = false;
    }
  };

  const flatten = (rows: TTableRow[]): TTableRow[] => {
    return rows.reduce((flattenedRows, row) => {
      return flattenedRows.concat([
        row,
        ...(row && row._showChildren && row._meta ? flatten(row._meta.visibleChildren) : []),
      ]);
    }, [] as TTableRow[]);
  };

  return {
    flattenedRows,
    toggleChildren,
  };
};

export default useFlatten;
