import { ref, computed, watch, reactive, type Ref } from 'vue';
import TableCSSProcessor from '@/components/tables/tableCSSProcessor';
import type { TTableColumn } from '@/types/components';

const useStyles = (
  columns: TTableColumn[],
  initialClasses: Ref<Record<string, Record<string, boolean>>>
) => {


  const classes = ref(initialClasses);
  const cssProcessor = reactive(new TableCSSProcessor(columns.length, classes.value));

  watch(classes, newClasses => {
    classesChanged(newClasses);
  });

  watch(
    () => columns.length,
    newLength => {
      cssProcessor.updateColumns(newLength);
    },
    { immediate: true }
  );

  const tableClasses = computed(() => classes.value.table || {});
  const headerRowClasses = computed(() => cssProcessor.process(0));
  const infoClasses = computed(() => classes.value.info || {});

  const classesChanged = (classes: Record<string, Record<string, boolean>>)  => {
    cssProcessor.classes = classes;
  };

  return {
    classes,
    tableClasses,
    headerRowClasses,
    infoClasses,
    cssProcessor,
  };
};

export default useStyles;
