import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import TFTableFull from '@/components/tables/TFTableFull.vue';
import type { TTableColumn, TTableRow } from '@/types/components';
import { localStorageMock } from '@/components/__tests__/mocks';
import { TFTable } from '@/index';

import axios from 'axios';
import Qs from 'qs';

type TTableColumnPick = Pick<
  TTableColumn,
  'property' |
  'title' |
  'direction' |
  'callTempRowsOnSort' |
  'order' |
  'groupCollapsable' |
  'grouped'
>;

type TTableRowOmit = Omit<
  TTableRow,
  '_children' |
  '_meta' |
  '_classes' |
  'level'
>

type TProps = {
  isEditable: boolean;
  isFixable: boolean;
  apiUrl: string;
  withTotal: boolean;
  filterMapping?: { [key: string]: string };
  canSaveToCsv?: boolean;
  csvUrl?: string;
  tableNamePrefix: string;
  sharedParamsUrl: string;
  hasPreloader: boolean;
  externalForm?: {
    name: string,
    elements: string[]
  }
  params: {
    [key: string]:
      | string
      | number
      | null
      | boolean
      | Record<string, unknown>
      | undefined
      | string[];
    query: { [key: string]: string | number | string[] }
  }
  columns: TTableColumnPick[];
};

const columnA = {
  property: 'PA',
  title: 'PATitle',
  direction: null,
  callTempRowsOnSort: true,
  order: 0,
  groupCollapsable: null,
  grouped: false
};

const columnB = {
  property: 'PB',
  title: 'PBTitle',
  direction: null,
  callTempRowsOnSort: true,
  order: 1,
  groupCollapsable: null,
  grouped: false
};

const columnC = {
  property: 'PC',
  title: 'PCTitle',
  direction: null,
  callTempRowsOnSort: true,
  order: 2,
  groupCollapsable: null,
  grouped: false
};

const columnD = {
  property: 'PD',
  title: 'PDTitle',
  direction: null,
  callTempRowsOnSort: true,
  order: 3,
  groupCollapsable: null,
  grouped: false
};

const columns: TTableColumn[] = [columnA, columnB, columnC];

const rows: TTableRowOmit[] = [
  { PA: '1', PB: '1', PC: 2, '_id': 'row_1' },
  { PA: '2', PB: '2', PC: 3, '_id': 'row_2'  },
  { PA: '3', PB: '3', PC: 3, '_id': 'row_3'  }
];

const initialProps: TProps = {
  isEditable: false,
  isFixable: false,
  apiUrl: '/api-url',
  tableNamePrefix: 'test_table',
  sharedParamsUrl: '/shared-params-url',
  withTotal: false,
  hasPreloader: false,
  params: {
    page: 1,
    perPage: 50,
    groups: ['PC', 'PA'],
    count: 3,
    query: {
      page: 1,
      per_page: 50,
      sort_by: 'PA',
      sort_dir: 'desc',
      groups: ['PC', 'PA'],
    },
  },
  columns,
};

let originalLocalStorage: Storage;

beforeAll((): void => {
  originalLocalStorage = window.localStorage;

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

afterAll((): void => {
  originalLocalStorage = window.localStorage;

  Object.defineProperty(window, 'localStorage', {
    value: originalLocalStorage,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('TFTableFull.vue', () => {
  const shallowMountFactory = async (
    props: Partial<TProps> = {},
    options: object
  ) => {
    return shallowMount(TFTableFull, {
      props: {
        ...initialProps,
        ...props,
      },
      ...options,
    });
  };

  const mountFactory = async (
    props: Partial<TProps> = {},
    options: object
  ) => {
    return mount(TFTableFull, {
      props: {
        ...initialProps,
        ...props,
      },
      ...options,
    });
  };

  describe('Axios  interceptor', () => {
    it('should correctly serialize query parameters with Qs.stringify', async () => {
      const stringifySpy = vi.spyOn(Qs, 'stringify').mockReturnValue(
        'page=1&per_page=50&sort_by=PA&sort_dir=desc&groups%5B%5D=PC&groups%5B%5D=PA'
      );
      const wrapper = await mountFactory( {}, {});

      expect(stringifySpy).toHaveBeenCalledWith(
        {
          groups: ['PC', 'PA'],
          page: 1,
          per_page: 50,
          sort_by: 'PA',
          sort_dir: 'desc'
        },
        {
          arrayFormat: 'brackets',
        }
      );

      wrapper.unmount();
    });
  });

  describe('Render', () => {
    it('should render top actions correctly', async () => {
      window.localStorage.setItem('test_table_hidden', JSON.stringify({ PB: 'PBTitle' }));
      const wrapper = await mountFactory( {},
        {
          slots: {
            'additional-buttons': '<button>Additional Button</button>',
          },
        }
      );

      expect(wrapper.find('.tf-table-outer-actions-container').exists()).toBe(true);

      await wrapper.setProps({ isEditable: true });

      expect(wrapper.find('.tf-table-deleted-columns').exists()).toBe(true);
      expect(wrapper.find('.tf-table-btn-reset').exists()).toBe(true);
      expect(wrapper.html()).toContain('<button>Additional Button</button>');

      wrapper.vm.showDeletedBadges = true;

      expect(wrapper.find('.tf-table-deleted-columns-inner').exists()).toBe(true);
      expect(wrapper.find('.tf-table-deleted-columns-inner').html()).toContain('PBTitle');

      wrapper.unmount();
    });

    it('should render remove-icon-slot correctly',  async() => {
      const wrapper =  await shallowMountFactory(
        {
          isEditable: true
        },
        {
          slots: {
            'remove-icon-slot': '<div class="custom-icon">[-]</div>',
          },
        },
      );

      const table = wrapper.findComponent(TFTable);

      expect(table.vm.$slots['remove-icon-slot']).toBeTruthy();

      wrapper.unmount();
    });

    it('should render toggle-children-icon slot with props correctly', async () => {
      const rowList = rows.map(el => {
        el._hasChildren = true;
        return el;
      });

      vi.spyOn(axios, 'get')
        .mockResolvedValueOnce({
          data: {
            items: rowList,
            count: 1
          }
        })
        .mockResolvedValueOnce({
          data: {
            items: [],
            count: 1
          }
        });

      const wrapper = await mountFactory(
        {},
        {
          slots: {
            'toggle-children-icon': `
              <template #toggle-children-icon="props">
                <span class="custom-toggle-children-icon">
                  {{ props.expanded ? '[-]' : '[+]' }}
                </span>
              </template>
            `,
          },
        }
      );

      Element.prototype.scrollIntoView = vi.fn();
      wrapper.vm.loading = false;

      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('<span class="custom-toggle-children-icon">[+]</span>');

      const toggleIcon =  wrapper.find('.custom-toggle-children-icon');

      await toggleIcon.trigger('click');

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('<span class="custom-toggle-children-icon">[-]</span>');

      wrapper.unmount();
    });

    it('should render "Get CSV" button when canSaveToCsv props specified', async () => {
      const wrapper = await mountFactory(
        {
          canSaveToCsv: true,
          csvUrl: 'http://test-csv-url'
        },
        {}
      );

      expect(wrapper.html()).toContain(
        '<button class="tf-table-btn tf-table-btn-csv"> Get CSV </button>'
      );

      wrapper.unmount();
    });

    it('should fixative-btn-slot slot correctly', async () => {
      const wrapper = await shallowMountFactory(
        {
          isFixable: true,
        },
        {
          slots: {
            'fixative-btn-slot': '<div class="fix-btn">fix</div>',
          },
        });

      const table = wrapper.findComponent(TFTable);

      expect(table.vm.$slots['fixative-btn-slot']).toBeTruthy();

      wrapper.unmount();
    });

    it('should correctly set sorting direction for the column', async () => {
      const props = { ...initialProps };
      props.params.sortBy = 'PA';
      props.params.sortDir = 'desc';

      const wrapper = await shallowMountFactory( props , {});
      const sortedColumn = wrapper.vm.headerCells
        .find(el => el.property === wrapper.props().params.sortBy);

      if (sortedColumn !== undefined) {
        expect(sortedColumn.direction).toBe(false);
      } else {
        throw new Error('Sorted column not found');
      }

      wrapper.unmount();
    });

    it('should render the cell slot correctly when slots are passed.', async () => {

      vi.spyOn(axios, 'get').mockResolvedValue({ data: { items: rows } });

      const wrapper = await mountFactory({} , {
        slots: {
          'PB': '<div>Test slot Column</div>',
          'row_slot_row_1': '<div>Test slot Row</div>',
          'PA_row_1': '<div>Test slot Cell</div>'
        },
      });

      Element.prototype.scrollIntoView = vi.fn();
      wrapper.vm.loading = false;

      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('Test slot Column');
      expect(wrapper.html()).toContain('Test slot Row');
      expect(wrapper.html()).toContain('Test slot Cell');

      wrapper.unmount();
    });

    it('should render preloader during the download of data', async () => {
      const wrapper = await mountFactory({
        hasPreloader: true
      } , {});

      wrapper.vm.loading = true;

      const preloader = wrapper.find('.tf-table-spinner');

      expect(preloader).toBeTruthy();

      wrapper.unmount();
    });

    it('should render preloader slot', async () => {
      const wrapper = await mountFactory({
        hasPreloader: true
      } , {
        slots: {
          preloader: '<div>test preloader slot</div>'
        }
      });

      wrapper.vm.loading = true;

      expect(wrapper.html()).toContain('test preloader slot');

      wrapper.unmount();
    });
  });

  describe('Correct editable actions', () => {
    it('should ensure localStorage is filled with the correct data when a column is removed or added', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { items: [] } });

      const wrapper = await mountFactory({ isEditable: true }, {});
      wrapper.vm.loading = false;
      wrapper.vm.showDeletedBadges = true;

      const checkLocalStorage = (hiddenCols: { [key: string]: string }, orderCols: string[]) => {
        const hiddenColsData = window.localStorage.getItem('test_table_hidden');
        const orderColsData = window.localStorage.getItem('test_table_order');

        expect(hiddenColsData ? JSON.parse(hiddenColsData) : null).toMatchObject(hiddenCols);
        expect(orderColsData ? JSON.parse(orderColsData) : null).toEqual(orderCols);
      };

      // Remove column
      const removableColumn = wrapper
        .findAll('.tf-table-header-cell-content .tf-table-remove-column')
        .at(1);

      if(removableColumn) {
        expect(removableColumn.exists()).toBe(true);
        await removableColumn.trigger('click');
      } else {
        throw new Error('removableColumn column not found');
      }

      await wrapper.vm.$nextTick();

      checkLocalStorage({ PB: 'PBTitle' }, ['PA', 'PC']);
      expect(wrapper.findAll('thead tr th')).toHaveLength(2);
      expect(wrapper.find('.tf-table-deleted-columns-inner').html()).toContain('PBTitle');

      // Add column back
      const removedColBadge = wrapper.find('.tf-table-deleted-column');

      expect(removedColBadge.exists()).toBe(true);
      await removedColBadge.trigger('click');

      await wrapper.vm.$nextTick();

      checkLocalStorage({}, ['PA', 'PB', 'PC']);
      expect(wrapper.findAll('.tf-table-deleted-column').length).toBe(0);
      expect(wrapper.findAll('thead tr th')).toHaveLength(3);
      expect(wrapper.findAll('thead tr th')
        .map(el => el.text()))
        .toEqual(['PATitle', 'PBTitle', 'PCTitle']);

      window.localStorage.clear();
      wrapper.unmount();
    });

    it('should reset columns state and clear local storage on clear button click', async () => {
      window.localStorage.setItem('test_table_new_hidden', JSON.stringify({ PB: 'PBTitle' }));
      window.localStorage.setItem('test_table_new_order', JSON.stringify(['PC', 'PA']));

      const wrapper = await mountFactory(
        {
          isEditable: true,
          tableNamePrefix: 'test_table_new'
        },
        {}
      );

      wrapper.vm.loading = false;
      wrapper.vm.showDeletedBadges = true;

      const resetBtn = wrapper.find('.tf-table-btn-reset');

      expect(wrapper.findAll('thead tr th').map(el => el.text())).toEqual(['PCTitle', 'PATitle']);
      expect(wrapper.find('.tf-table-deleted-columns-inner').html()).toContain('PBTitle');

      await resetBtn.trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('tf-table-deleted-column').length).toBe(0);
      expect(wrapper.findAll('thead tr th')).toHaveLength(3);
      expect(wrapper.findAll('thead tr th')
        .map(el => el.text())).toEqual(['PATitle', 'PBTitle', 'PCTitle']);
      expect(window.localStorage.getItem('test_table_new_hidden')).toBeNull();
      expect(window.localStorage.getItem('test_table_new_order')).toBeNull();

      wrapper.unmount();
    });

    it(`should reset the state of the columns and clear the local storage
        when there is a difference between the visible hidden columns and the
        "columns" prop`,
    async() => {
      vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: { items: [] } });
      window.localStorage.setItem('test_table_hidden', JSON.stringify({ PB: 'PBTitle' }));
      window.localStorage.setItem('test_table_order', JSON.stringify(['PA', 'PC']));

      const wrapper = await mountFactory({
        isEditable: true,
        columns: [...columns, ...[columnD]]
      }, {});
      wrapper.vm.loading = false;
      wrapper.vm.showDeletedBadges = true;

      expect(wrapper.findAll('.tf-table-deleted-column').length).toBe(0);
      expect(wrapper.findAll('thead tr th')
        .map(el => el.text()))
        .toEqual(['PATitle', 'PBTitle', 'PCTitle', 'PDTitle']);
      expect(window.localStorage.getItem('test_table_hidden')).toBeNull();
      expect(window.localStorage.getItem('test_table_order')).toBeNull();
    });

    it('should change classes of the first column and table header when the fix button is clicked', async () => {
      const wrapper = await mountFactory(
        {
          isFixable: true
        },
        {}
      );

      wrapper.vm.loading = false;
      (wrapper.vm as unknown as { rows: TTableRowOmit[] }).rows = rows;
      const fixBtn = wrapper.find('.tf-table-fix-btn');
      expect(fixBtn.classes('tf-table-fix-btn-unfixed')).toBe(true);

      // fixed cols

      await fixBtn.trigger('click');

      await wrapper.vm.$nextTick();

      expect(fixBtn.classes('tf-table-fix-btn-unfixed')).toBe(false);
      expect(fixBtn.classes('tf-table-fix-btn-fixed')).toBe(true);
      expect(wrapper.find('thead tr').classes()).toContain('tf-table-sticky-row');
      expect(wrapper.find('thead tr th').classes()).toContain('tf-table-sticky-col');
      wrapper
        .findAll('tbody > tr:first-child')
        .every(el => expect(el.find('td:first-of-type').classes('tf-table-sticky-col')).toBe(true));

      // unfixed cols

      await fixBtn.trigger('click');

      await wrapper.vm.$nextTick();

      expect(fixBtn.classes('tf-table-fix-btn-unfixed')).toBe(true);
      expect(fixBtn.classes('tf-table-fix-btn-fixed')).toBe(false);
      expect(wrapper.find('thead tr').classes('tf-table-sticky-row')).toBe(false);
      expect(wrapper.find('thead tr th').classes('tf-table-sticky-col')).toBe(false);
      wrapper
        .findAll('tbody > tr:first-child')
        .every(el => expect(el.find('td:first-of-type').classes('sticky-col')).toBe(false));

      wrapper.unmount();
    });

    it('should call "callTempRows" when clicking on the sort buttons', async () => {

      const wrapper = await mountFactory({}, {});

      wrapper.vm.loading = false;

      const sortIcon = wrapper.find('thead tr th [data-test="sort-PC"]');

      await sortIcon.trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.query.sort_by).toBe('PC');
      expect(wrapper.vm.query.sort_dir).toBe('desc');

      wrapper.unmount();
    });

    it('should be returned correct rows from the "callTempRows" method', async () => {
      const rowsList = {
        data: {
          items: [{
            PA: '11', PB: '111', PC: 222,
          }],
          count: 1
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(rowsList);

      const wrapper = await mountFactory({}, {});

      Element.prototype.scrollIntoView = vi.fn();

      wrapper.vm.loading = false;

      const scrollAnchor = wrapper.find('.tf-table-scroll-anchor');
      const scrollAnchorElement = scrollAnchor.element;

      const result = await wrapper.vm.callTempRows(columns);

      expect(result).toEqual({
        rows: [
          {
            PA: '11',
            PB: '111',
            PC: 222,
            _children: [],
            _meta: {
              index: 0,
              loading: false,
              parent: 0,
              visibleChildren: [],
            },
            _showChildren: false,
          }
        ]
      });

      if (wrapper.vm.rows.length) {
        expect(scrollAnchorElement.scrollIntoView).toHaveBeenCalled();
      }

      wrapper.unmount();
    });
  });

  describe('Check methods', () => {
    it('should set the correct column order when the addColumn method is called after the drag&drop event', async () => {
      const wrapper = await mountFactory({ isEditable: true }, {});

      window.localStorage.setItem('test_table_hidden', JSON.stringify({ PB: 'PBTitle' }));
      window.localStorage.setItem('test_table_order', JSON.stringify(['PA', 'PC']));

      wrapper.vm.loading = false;
      wrapper.vm.showDeletedBadges = true;
      wrapper.vm.applyColumnSortOrder();

      const table = wrapper.findComponent(TFTable);

      table.vm.draggableUpdate([columnC, columnA]);

      expect(wrapper.vm.mutableColsForComparison
        .map(el => el.property)).toEqual(['PC', 'PA']);

      wrapper.vm.addColumn('PB');

      expect(wrapper.vm.mutableColsForComparison
        .map(el => el.property)).toEqual(['PC', 'PB', 'PA']);

      wrapper.unmount();
    });

    it('should send a request and scroll to the table when the "loadTableData" method is called and a response is received', async () => {
      const rowsList = {
        data: {
          items: [{
            PA: '11', PB: '111', PC: 222,
          }],
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(rowsList);

      const wrapper = await mountFactory({},  {});

      Element.prototype.scrollIntoView = vi.fn();

      await wrapper.vm.loadTableData(1);

      expect(axios.get).toHaveBeenCalledWith('/api-url/datatable', {
        params: initialProps.params.query,
      });
      expect(wrapper.vm.rows).toEqual(rowsList.data.items);

      const scrollAnchor = wrapper.find('.tf-table-scroll-anchor');
      const scrollAnchorElement = scrollAnchor.element;

      if (wrapper.vm.rows.length) {
        await wrapper.vm.$nextTick();

        expect(scrollAnchorElement.scrollIntoView).toHaveBeenCalled();
      }

      wrapper.unmount();
    });

    it('should handle request errors gracefully when the "loadTableData" method is called', async () => {

      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Request failed'));

      const wrapper = await mountFactory({},  {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await wrapper.vm.loadTableData(1);

      expect(axios.get).toHaveBeenCalledWith('/api-url/datatable', {
        params: initialProps.params.query,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));
      expect(wrapper.vm.loading).toBe(false);
      consoleErrorSpy.mockRestore();

      wrapper.unmount();
    });

    it('should handle empty response data when the "loadTableData" method is called', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { items: [], count: 0 } });

      const wrapper = await mountFactory({},  {});

      await wrapper.vm.loadTableData(1);

      expect(wrapper.vm.rows).toEqual([]);
      expect(wrapper.vm.pagesCount).toBe(1);
      expect(wrapper.vm.emptyText).toBe('No data');
      expect(wrapper.vm.page).toBe(1);
      expect(wrapper.vm.loading).toBe(false);
    });

    it('should send a query and enrich the data when calling the "getTotal" method', async () => {
      const totalRow = { PA: '11', PB: '111', PC: 222 };
      const totalRowEnriched = Object.assign({ title: 'Total', total: 'Total' }, totalRow);

      vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: totalRow });

      const wrapper = await mountFactory({ withTotal: true }, {});

      expect(axios.get).toHaveBeenCalledWith('/api-url/datatable/total', {
        params: initialProps.params.query,
      });
      expect(wrapper.vm.totalRow).toEqual(totalRowEnriched);

      wrapper.unmount();
    });

    it('should send the request and change the returned items correctly when calling "callChildren" method', async () => {
      const wrapper = await mountFactory({
        filterMapping: { PC: 'PCTitle' }
      }, {});

      const params = {
        ...initialProps.params.query, ...{ _parents: { PC: '3' } }
      };

      const parentRow: TTableRowOmit = {
        PA: '3',
        PB: '3',
        PC: 3,
        _hasChildren: true,
        level: 0,
        date: 'string',
        _parent: {
          _hasChildren: false, level: 1,
        },
      };

      const childRow = {
        data: {
          items: [{
            PA: '11', PB: '111', PC: 222,
          }],
          count: 30,
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(childRow);

      const subRow = await wrapper.vm.callChildren(parentRow as TTableRow);

      expect(axios.get).toHaveBeenCalledWith('/api-url/datatable', {
        params: params,
      });

      expect(subRow[0]._parent).toEqual(parentRow);
      expect(subRow[1]).toHaveProperty('title_html');

      wrapper.unmount();
    });

    it('should return correct parent parameters for a single-level parent when calling "getParentsParams" method', async () => {
      const params = {
        ...initialProps.params, ...{ groups: ['PA', 'PB', 'PC'] }
      };

      const wrapper = await mountFactory({
        params
      }, {});

      const parentRow: TTableRowOmit = {
        PA: '3',
        PB: '3',
        PC: 3,
        level: 0,
      };

      const result = wrapper.vm.getParentsParams(parentRow as TTableRow);

      expect(result).toEqual({ PA: '3' });

      wrapper.unmount();
    });

    it('should return correct parent parameters for nested parents when calling "getParentsParams" method', async() => {

      const params = {
        ...initialProps.params, ...{ groups: ['PA', 'PB', 'PC'] }
      };

      const wrapper = await mountFactory({
        params
      }, {});

      const parentRow: TTableRowOmit = {
        level: 1,
        _parent: {
          level: 0,
          PA: 'valueA',
          PB: 'valueB',
          PC: 'valueC',
        },
        PB: 'childValueB',
      };

      const result = wrapper.vm.getParentsParams(parentRow as TTableRow);

      expect(result).toEqual({
        PA: 'valueA',
        PB: 'childValueB',
      });

      wrapper.unmount();
    });

    it('should axios get necessary query-params when calling the "saveStatToCsv" method', async () => {
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

      vi.spyOn(axios, 'get').mockResolvedValue({ data: 'mock csv content' });

      window = Object.create(window);
      const url = 'http://test-csv-url';
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        },
        writable: true
      });

      const wrapper = await shallowMountFactory({
        canSaveToCsv: true,
        csvUrl: 'http://test-csv-url',
      }, {});

      const expectedParams = {
        params: { ...initialProps.params.query, ...{ columns: ['PA', 'PB', 'PC'] } },
        responseType: 'blob',
      };

      wrapper.vm.resetTable();
      await wrapper.vm.saveStatToCsv();

      expect(axios.get).toHaveBeenCalledWith('http://test-csv-url', expectedParams);

      wrapper.unmount();
    });

    it('should add hidden inputs to the form when mounting the component', async() => {
      const form = document.createElement('form');

      vi.spyOn(document.body, 'appendChild');
      form.name = 'test-external-form';
      document.body.appendChild(form);

      const wrapper = await shallowMountFactory({
        externalForm: {
          name: 'test-external-form',
          elements: ['sort_by', 'sort_dir'],
        },
      }, {});

      expect(document.body).toMatchInlineSnapshot(`
        <body>
          <form
            name="test-external-form"
          >
            <input
              name="sort_by"
              type="hidden"
              value=""
            />
            <input
              name="sort_dir"
              type="hidden"
              value=""
            />
          </form>
        </body>
      `);

      document.body.removeChild(form);
      wrapper.unmount();
    });

    it('should change hidden inputs value when calling the "updateSortInputs" method', async() => {
      const form = document.createElement('form');

      vi.spyOn(document.body, 'appendChild');
      form.name = 'test-external-form';
      document.body.appendChild(form);

      const wrapper = await shallowMountFactory({
        externalForm: {
          name: 'test-external-form',
          elements: ['sort_by', 'sort_dir'],
        },
      }, {});

      wrapper.vm.updateSortInputs('test_val_1', 'test_val_2');

      expect(document.body).toMatchInlineSnapshot(`
        <body>
          <form
            name="test-external-form"
          >
            <input
              name="sort_by"
              type="hidden"
              value="test_val_1"
            />
            <input
              name="sort_dir"
              type="hidden"
              value="test_val_2"
            />
          </form>
        </body>
      `);

      document.body.removeChild(form);
      wrapper.unmount();
    });
  });
});
