import { computed, h } from 'vue';
import type { EmitFn, TTableColumn, TTableSlotFunction } from '@/types/components';


type TProps = {
  column: TTableColumn;
  removeIconSlot: TTableSlotFunction
}

const useRemoveCell = (props: TProps, emit: EmitFn) => {

  const isNonRemovable = computed(() => {
    return props.column.nonRemovable;
  });

  const removeIcon = () => {
    if (isNonRemovable.value) return null;

    return h(
      'div',
      {
        class: 'tf-table-remove-column',
        onClick: event => {
          event.stopPropagation();
          emit('removeColumn', props.column.property);
        },
      },

      [
        props.removeIconSlot
          ? props.removeIconSlot()
          : h('span', { class: 'tf-table-remove-column-icon' })
      ]
    );
  };

  return {
    removeIcon,
  };
};

export default useRemoveCell;
