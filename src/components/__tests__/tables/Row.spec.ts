import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Row from '@/components/tables/Row.vue';
import TableCSSProcessor from '@/components/tables/tableCSSProcessor';
import type {
  TTableRow,
  TTableColumn,
} from '@/types/components';

const columns: TTableColumn[] = [
  {
    groupCollapsable: null,
    property: 'PA',
    direction: null,
    callTempRowsOnSort: false,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false
  },
  {
    groupCollapsable: null,
    property: 'PB',
    direction: null,
    callTempRowsOnSort: false,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false
  },
  {
    groupCollapsable: null,
    property: 'PC',
    direction: null,
    callTempRowsOnSort: false,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false
  },
];

const row: TTableRow = {
  _id: 'row_1',
  _classes: { row: { 'row-class': true }  },
  _meta: {
    index: 0,
    loading: false,
    parent: 0,
    visibleChildren: []
  },
  _children: [],
  PA: '1',
  PB: '1',
  PC: 2,
  level: 0,
};

const mountFactory = async (props = {}) => {
  return mount(Row, {
    props: {
      row,
      rowIndex: 0,
      columns,
      cssProcessor: new TableCSSProcessor(1, {}),
      toggleChildrenIconSlot: undefined,
      slots: {},
      ...props,
    },
  });
};
describe('Row.vue', () => {
  it('should correctly render the line <tr>', async () => {
    const wrapper = await mountFactory();
    expect(wrapper.element.tagName).toBe('TR');
  });

  it('should apply the correct classes', async () => {
    const wrapper = await mountFactory();
    expect(wrapper.classes()).toContain('row-class');
  });

  it('should renders the correct number of cells', async () => {
    const wrapper = await mountFactory();
    const cells = wrapper.findAll('td');
    expect(cells).toHaveLength(columns.length);
  });

  it('should call the Toggle-Children treatment with an event', async() => {
    const wrapper = await mountFactory();
    wrapper.vm.handleToggleChildren();
    expect(wrapper.emitted('toggle-children')).toBeTruthy();
  });
});
