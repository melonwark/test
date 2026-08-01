import { toRaw, type Ref, ref } from 'vue';
import type { TTableColumn } from '@/types/components';

const useColumnsState = (
  tableName: Ref<string, string>,
  headerCells: TTableColumn[],
  staticColsForComparison: TTableColumn[],
  mutableColsForComparison: Ref<TTableColumn[]>,
  deletedColumns: Ref<Map<string, string>>,
) => {
  const tableKey = ref(0);

  const getOrderFromLocalStorage = () => {
    const data = window.localStorage.getItem(`${tableName.value}_order`);
    return data ? JSON.parse(data) : null;
  };

  const getVisualStateFromLocalStorage = () => {
    const data = window.localStorage.getItem(`${tableName.value}_hidden`);
    const obj = data ? JSON.parse(data) : null;
    return obj ? new Map(Object.entries(obj)) : new Map();
  };

  const setVisualStateToLocalStorage = (visualState: Ref<Map<string, string>>) => {
    window.localStorage.setItem(
      `${tableName.value}_hidden`,
      JSON.stringify(Object.fromEntries(visualState.value))
    );
  };

  const resetTable = () => {
    localStorage.removeItem(`${tableName.value}_order`);
    localStorage.removeItem(`${tableName.value}_hidden`);
    deletedColumns.value.clear();
    headerCells.splice(0, headerCells.length, ...staticColsForComparison);
    tableKey.value = 0;
  };

  const applyColumnSortOrder = () => {
    const sortArray = getOrderFromLocalStorage();
    if (sortArray) {
      const sortedColumns = headerCells
        .filter(el => sortArray.includes(el.property))
        .sort((a, b) => sortArray.indexOf(a.property) - sortArray.indexOf(b.property));
      headerCells.splice(0, headerCells.length, ...sortedColumns);
    }
  };

  const removeColumn = (property: string) => {
    const columnsMatchedItem = toRaw(
      headerCells.find(item => item?.property === property)
    );

    if (columnsMatchedItem && columnsMatchedItem.title) {
      deletedColumns.value.set(property, columnsMatchedItem.title);
    }

    headerCells.splice(
      headerCells.findIndex(item => item.property === property),
      1
    );

    saveColumnOrder(headerCells, false);
    applyColumnSortOrder();
    setVisualStateToLocalStorage(deletedColumns);
  };

  const addColumn = (property: string) => {
    deletedColumns.value.delete(property);
    const sortArray = getOrderFromLocalStorage() || [];
    sortArray.push(property);
    setVisualStateToLocalStorage(deletedColumns);

    if (!mutableColsForComparison.value.find(el => el.property === property)) {
      const pos = staticColsForComparison.findIndex(el => el.property === property);
      const el = staticColsForComparison.find(el => el.property === property);

      if (el) {
        mutableColsForComparison.value.splice(pos, 0, el);
      }
    }
    headerCells.splice(
      0,
      headerCells.length,
      ...mutableColsForComparison.value.filter(({ property }) => sortArray.includes(property))
    );

    saveColumnOrder([...headerCells], false);
  };

  const saveColumnOrder = (val: TTableColumn[], _mutable: boolean) => {
    if (_mutable) {
      headerCells.splice(0, headerCells.length, ...val);
      mutableColsForComparison.value = val;
    }
    const columnList = val.map(item => item.property);
    tableKey.value += 1;
    window.localStorage.setItem(`${tableName.value}_order`, JSON.stringify(columnList));
  };

  return {
    getOrderFromLocalStorage,
    getVisualStateFromLocalStorage,
    setVisualStateToLocalStorage,
    resetTable,
    applyColumnSortOrder,
    removeColumn,
    addColumn,
    saveColumnOrder,
    tableKey
  };
};

export default useColumnsState;
