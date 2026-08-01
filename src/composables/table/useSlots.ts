import { computed, type Ref, ref, type Slot, type Slots, type VNode } from 'vue';

const useSlots = (
  slots: Slots,
  columnProperties: Ref<string[]>
)=> {
  const propSlots = ref(slots);

  const sortIconSlot = computed(
    () => propSlots.value['sort-icon'] || undefined
  );
  const fixativeBtnSlot = computed(
    () => propSlots.value['fixative-btn'] || undefined
  );
  const removeIconSlot = computed(
    () => propSlots.value['remove-icon'] || undefined
  );
  const toggleChildrenIconSlot = computed(
    () => propSlots.value['toggle-children-icon'] || undefined
  );
  const rowSlots = computed(() => {
    const regexCell = new RegExp('^(' + columnProperties.value.join('|') + ')_', 'i');
    const regexRow = new RegExp('^row_slot_.+$', 'i');
    const slots: Record<string, Slot | (() => VNode) | undefined> = {};

    Object.keys(propSlots.value).forEach(slotKey => {

      if (
        columnProperties.value.includes(slotKey) ||
        regexCell.test(slotKey) ||
        regexRow.test(slotKey)
      ) {
        slots[slotKey] = propSlots.value[slotKey];
      }
    });
    return slots;
  });

  return {
    propSlots,
    sortIconSlot,
    fixativeBtnSlot,
    removeIconSlot,
    toggleChildrenIconSlot,
    rowSlots,
  };
};

export default useSlots;
