import { h } from 'vue';
import type { TTableSlotFunction } from '@/types/components';

type TProps = {
  fixativeBtnSlot: TTableSlotFunction
}
const useFixativeCell = (props: TProps) => {
  const actionContainer = () => {
    return h(
      'div',
      {
        class: 'tf-table-fixative-btn-container',
      },
      [props.fixativeBtnSlot ? props.fixativeBtnSlot() : null]
    );
  };

  return {
    actionContainer,
  };
};

export default useFixativeCell;
