import { ref, computed, watch, type ComputedRef } from 'vue';
import type { Ref } from 'vue';
import type { TTableColumn, TTableRow } from '@/types/components';

type TProps = {
  rows: TTableRow[];
  callTempRows: (sortColumns: TTableColumn[]) => Promise<{ rows: TTableRow[] }>;
};

const useAsyncRowLoader = (
  props: TProps,
  sortColumns: ComputedRef<TTableColumn[]>,
  loading: Ref<boolean>,
) => {
  const tempRows = ref<TTableRow[]>([]);
  const internalLoading = ref(false);

  const allRowsLoaded = computed(() => props.rows.length === props.rows.length);
  const allRowsFullyLoaded = computed(
    () => allRowsLoaded.value && !props.rows.find(noChildrenLoaded)
  );
  const unresolved = computed(() => {
    return sortColumns.value.length > 0 && !allRowsLoaded.value;
  });
  const currentRows = computed(() => {
    return !unresolved.value || loading.value ? props.rows : tempRows.value;
  });

  const noChildrenLoaded = (row: TTableRow) => {
    return row.hasOwnProperty('_hasChildren') && row._hasChildren;
  };

  const handleUnresolved = async () => {
    loading.value = true;

    const result = await props.callTempRows(sortColumns.value);

    tempRows.value = Array.from({ length: result.rows.length });
    loading.value = false;
  };

  watch(loading, newVal => {
    internalLoading.value = newVal;
  });

  return {
    tempRows,
    loading,
    allRowsLoaded,
    allRowsFullyLoaded,
    unresolved,
    currentRows,
    noChildrenLoaded,
    handleUnresolved,
    internalLoading,
  };
};

export default useAsyncRowLoader;
