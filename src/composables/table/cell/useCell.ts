import { computed, type EmitFn, h, type VNode } from 'vue';
import type {
  TTableColumn,
  TTableCssProcessor,
  TTableRow,
  TTableSlotFunction
} from '@/types/components';


type TProps = {
  toggleChildrenIconSlot?: TTableSlotFunction<{ expanded: boolean; loading: boolean }>;
  columnSlot: TTableSlotFunction<{ row: TTableRow; column: TTableColumn, rowIndex: number }>;
  cssProcessor: TTableCssProcessor;
  rowIndex: number;
  columnIndex: number;
  row: TTableRow;
  column: TTableColumn;
}


const useCell =  (props: TProps, emit: EmitFn) => {

  const toggleChildren = (event: Event)=> {
    event.stopPropagation();
    emit('toggle-children');
  };

  const cellClasses = computed(() => {
    return Object.assign(
      props.cssProcessor.process(
        null,
        props.columnIndex,
        undefined, props.column
      ),
      props.cssProcessor.process(
        props.rowIndex + 1,
        props.columnIndex, props.row,
        props.column
      ),
      props.cssProcessor.processFixed(
        props.row._classes,
        props.columnIndex,
        props.row, props.column
      )
    );
  });

  const style = computed(() => {
    return {
      'padding-left': (1 + (parent.value * 1.5)) + 'rem',
    };
  });

  const parent = computed(() => {
    let parentValue = 0;

    if (props.column.collapseIcon) {
      parentValue += props.row._meta.parent;
    }

    return parentValue;
  });

  const collapsable = computed(() => {
    return props.column.collapseIcon;
  });

  const hasCollapseIcon = computed(() => {
    return collapsable.value &&
            (props.row._meta.visibleChildren.length > 0 || props.row._hasChildren);
  });

  const classes = computed(() => {
    const base = { 'tf-table-children-row-icon': true };

    if (props.row._meta.loading) {
      return Object.assign(
        base,
        {
          'tf-table-children-row-icon-loading': true,
        }
      );
    }

    return Object.assign(
      base,
      {
        'tf-table-children-row-icon-contracted': !props.row._showChildren,
        'tf-table-children-row-icon-expanded': props.row._showChildren,
      }
    );
  });

  const value = (): (VNode | string | number)[] => {
    const elements: (VNode | string | number)[] = [];

    if (hasCollapseIcon.value) {
      elements.push(h('span', {
        onClick: toggleChildren,
        class: !props.toggleChildrenIconSlot ? classes.value : null
      },
      [
        props.toggleChildrenIconSlot
          ? props.toggleChildrenIconSlot({
            expanded: Boolean(props.row._showChildren),
            loading: props.row._meta.loading,
          })
          : null
      ]));
    }

    if (props.columnSlot) {
      const slotContent = props.columnSlot({
        row: props.row,
        column: props.column,
        rowIndex: props.rowIndex,
      });
      if (slotContent) {
        elements.push(...(Array.isArray(slotContent) ? slotContent : [slotContent]));
      }
    } else if (props.column.property && props.row.hasOwnProperty(props.column.property)) {
      const value = props.row[props.column.property];

      if (typeof value === 'string' || typeof value === 'number') {
        elements.push(value);
      }

      if (typeof value === 'boolean') {
        elements.push(value ? 'true' : 'false');
      }
    }
    return elements.length > 0 ? elements : [''];
  };

  return {
    cellClasses,
    style,
    value,
  };
};

export default useCell;
