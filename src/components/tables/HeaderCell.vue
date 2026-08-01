<script lang="ts">
import useSortCell from '@/composables/table/cell/useSortCell';
import useRemoveCell from '@/composables/table/cell/useRemoveCell';
import useFixativeCell from '@/composables/table/cell/useFixativeCell';

import {
  computed,
  defineComponent,
  h,
  toRaw,
  withDirectives,
  type PropType,
  type Directive,
  type DirectiveArguments,
} from 'vue';
import type { TTableColumn, TTableCssProcessor, TTableSlotFunction } from '@/types/components';

export default defineComponent({
  name: 'TFHeaderCell',
  props: {
    title: { type: String, default: '' },
    column: {
      type: Object as PropType<TTableColumn>,
      default: () => ({ title: '', direction: null })
    },
    columnIndex: {
      type: Number,
      required: true
    },
    cssProcessor: {
      type: Object as PropType<TTableCssProcessor>,
      required: true
    },
    isDraggableCss: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: false },
    isFixable: { type: Boolean, default: false },
    fixativeBtnColIndex: { type: Number, default: 0 },
    fixativeBtnSlot: {
      type: Function as PropType<TTableSlotFunction> | null,
      default: null
    },
    removeIconSlot: {
      type: Function as PropType<TTableSlotFunction> | null,
      default: null
    },
    sortIconSlot: {
      type: Function as PropType<TTableSlotFunction> | null,
      default: null
    }
  },

  setup(props, { emit }) {
    const { sortable, sortIcon } = useSortCell(props.column, props.sortIconSlot, emit);
    const { removeIcon } = useRemoveCell(props, emit);
    const { actionContainer } = useFixativeCell(props);


    const headerClasses = computed(() => ({
      'tf-table-cursor-pointer': [null, true, false, 'asc', 'desc']
        .includes(props.column.direction) && sortable.value,
      'tf-table-draggable-column': props.isDraggableCss && !props.column.nonDraggable,
      'tf-table-non-draggable-column': props.column.grouped || props.column.nonDraggable,
      'tf-table--fixative-cell': props.isFixable && props.fixativeBtnColIndex === props.columnIndex,
      ...props.cssProcessor.process(null, props.columnIndex),
      ...props.cssProcessor.process(0, props.columnIndex)
    }));


    const directives = computed(() => {
      return props.column.directivesData
        ? props.column.directivesData.map(d => [
          d.name as Directive<unknown, unknown>,
          toRaw(d.value),
          toRaw(d.modifiers) || {}
        ] as DirectiveArguments)
        : [];
    });

    return () => {
      const headerContent = [
        withDirectives(
          h('span',
            props.column.headerDataObject,
            [props.title || props.column.title]
          ),
          directives.value as DirectiveArguments
        )
      ];

      const iconR = removeIcon();
      const iconS = sortIcon();

      if (props.isEditable && iconR) {
        headerContent.unshift(iconR);
      }

      if (sortable.value && iconS) {
        if (Array.isArray(iconS)) {
          headerContent.push(...iconS);
        } else {
          headerContent.push(iconS);
        }
      }

      if (props.isFixable && props.fixativeBtnColIndex === props.columnIndex) {
        headerContent.unshift(actionContainer());
      }

      return h('th', {
        class: [
          headerClasses.value,
        ]
      }, [
        h('div',
          { class: { 'tf-table-header-cell-content': true } },
          headerContent
        )
      ]);
    };
  }
});
</script>
