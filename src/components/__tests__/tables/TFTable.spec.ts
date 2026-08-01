import { flushPromises, mount } from '@vue/test-utils';
import TFTable from '@/components/tables/TFTable.vue';
import { describe, expect, it } from 'vitest';
import type { TTableColumn, TTableRow } from '@/types/components';

const columns: TTableColumn[] = [
  {
    groupCollapsable: null,
    property: 'PA',
    direction: true,
    callTempRowsOnSort: true,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false,
    visible: true,
  },
  {
    groupCollapsable: null,
    property: 'PB',
    direction: null,
    callTempRowsOnSort: true,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false,
    visible: true,
  },
  {
    groupCollapsable: null,
    property: 'PC',
    direction: null,
    callTempRowsOnSort: true,
    nonDraggable: false,
    nonRemovable: false,
    order: 1,
    grouped: false,
    visible: true,
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


const mountFactory = async (props = {}, options = {}) => {
  return mount(TFTable, {
    props: {
      columns,
      rows: [row],
      ...props
    },
    ...options
  });
};

const sleep =  (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


describe('TFTable - Test Body Rows and Info Display', () => {

  it('should display loading indicator when data is loading', async () => {
    const wrapper = await mountFactory({
      callTempRows: async () => {
        await sleep(1000);
        return {
          rows: [],
          total: 0,
        };
      },
    });

    const sortIcon = wrapper.find('[data-test="sort-PA" ]');
    await sortIcon.trigger('click');


    await flushPromises();

    expect(wrapper.html()).toContain('<span>Loading...</span>');

    wrapper.unmount();
  });

  it('should render total row if provided', async () => {
    const totalRow = {
      PA: 'TotalPA',
      PB: 'TotalPB',
      PC: 'TotalPC',
    };

    const wrapper = await mountFactory({
      totalRow
    });

    const totalRowCells = wrapper.findAll('.tf-table-total-row');

    expect(totalRowCells.length).toBe(1);

    const totalRowCellsContent = totalRowCells[0].findAll('td');

    expect(totalRowCellsContent[0].text()).toBe('TotalPA');
    expect(totalRowCellsContent[1].text()).toBe('TotalPB');
    expect(totalRowCellsContent[2].text()).toBe('TotalPC');

    wrapper.unmount();
  });
});
