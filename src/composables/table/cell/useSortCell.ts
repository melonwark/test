import { computed, h } from 'vue';
import type { EmitFn, TTableColumn, TTableSlotFunction } from '@/types/components';

const useSortCell = (column: TTableColumn, sortIconSlot: TTableSlotFunction, emit: EmitFn) => {

  const sortable = computed(() => {
    return [
      null,
      true,
      false,
    ].includes(column.direction as boolean | null);
  });

  const sortIconClasses = computed(() => {
    if (!sortable.value) {
      return {};
    }

    return {
      'tf-table-sort': true,
      'tf-table-unsorted': column.direction === null,
      'tf-table-sort-down': column.direction === false,
      'tf-table-sort-up': column.direction === true,
    };
  });

  const sortIcon = () => {
    const handleClick = (event: Event) => {
      event.stopPropagation();
      emit('sort', column);
    };

    return sortIconSlot
      ? sortIconSlot({
        'data-test': `sort-${column.property}`,
        class: sortIconClasses.value,
        direction: column.direction,
        onClick: handleClick,
      })
      : h(
        'span',
        {
          'data-test': `sort-${column.property}`,
          class: sortIconClasses.value,
          onClick: sortable.value ? handleClick : null,
        },
      );
  };

  return {
    sortable,
    sortIconClasses,
    sortIcon,
  };
};

export default useSortCell;
