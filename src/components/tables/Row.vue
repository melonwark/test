<template>
  <tr
    :class="rowClasses"
  >
    <cell
      v-for="(column, key) in columns"
      :column-slot="columnSlot(column)"
      :toggle-children-icon-slot="toggleChildrenIconSlot"
      :key="key"
      :row-index="rowIndex"
      :column-index="key"
      :row="row"
      :column="column"
      :css-processor="cssProcessor"
      @toggle-children="handleToggleChildren"
    />
  </tr>
</template>

<script lang="ts">
import Cell from '@/components/tables/Cell.vue';
import TableCSSProcessor from '@/components/tables/tableCSSProcessor';
import { computed, defineComponent, type PropType } from 'vue';
import type {
  TTableColumn,
  TTableCssProcessor,
  TTableRow,
  TTableSlotFunction
} from '@/types/components';

export default defineComponent({
  name: 'TFTableRow',

  components: {
    Cell,
  },

  props: {
    row: {
      type: Object as PropType<TTableRow>,
      required: true,
    },

    rowIndex: {
      type: Number,
      required: true,
    },

    columns: {
      type: Array as PropType<TTableColumn[]>,
      required: true,
    },

    slots: {
      type: Object,
      default: () => { return {}; },
    },

    cssProcessor: {
      type: Object as PropType<TTableCssProcessor>,
      required: true,
    },

    toggleChildrenIconSlot: {
      type: Function as PropType<TTableSlotFunction<{
        expanded: boolean, loading: boolean
      }>> | null,
      default: null,
    },
  },

  setup (props, { emit }) {
    const rowClasses = computed(() => {

      return Object.assign(
        props.cssProcessor.process(props.rowIndex + 1, null, props.row),
        props.row._classes ? TableCSSProcessor.processValue(props.row._classes.row, props.row) : {}
      );
    });

    const columnSlot = (column: TTableColumn) => {
      return props.slots[column.property + '_' + (props.row['_id'] || '')] ||
                props.slots[column.property] ||
                props.slots['row_slot_' + (props.row['_id'] || '')] ||
                null;
    };

    const handleToggleChildren = () => {
      emit('toggle-children');
    };

    return {
      rowClasses,
      columnSlot,
      handleToggleChildren,
    };
  },
});
</script>
