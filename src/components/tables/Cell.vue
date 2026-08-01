<script lang="ts">
import { defineComponent, h, type PropType } from 'vue';
import useCell from '@/composables/table/cell/useCell';
import type {
  TTableCssProcessor,
  TTableColumn,
  TTableRow,
  TTableSlotFunction
} from '@/types/components';

export default defineComponent({
  name: 'TFTableCell',

  props: {
    row: {
      type: Object as PropType<TTableRow>,
      required: true,
    },
    rowIndex: {
      type: Number,
      required: true,
    },
    column: {
      type: Object as PropType<TTableColumn>,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
    cssProcessor: {
      type: Object as PropType<TTableCssProcessor>,
      required: true,
    },
    columnSlot: {
      type: Function as PropType<TTableSlotFunction<{
        row: TTableRow; column: TTableColumn, rowIndex: number
      }>>,
      default: null,
    },
    toggleChildrenIconSlot: {
      type: Function as PropType<TTableSlotFunction<{
        expanded: boolean, loading: boolean
      }>> | null,
      default: null,
    },
  },

  setup (props, { emit }) {
    const { cellClasses, style, value } = useCell(props, emit);

    return () =>
      h(
        'td',
        {
          class: cellClasses.value,
          style: style.value,
        },
        [
          value(),
        ]
      );
  },
});
</script>
