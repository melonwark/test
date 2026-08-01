import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import HeaderCell from '@/components/tables/HeaderCell.vue';
import { h } from 'vue';

describe('TFHeaderCell', () => {

  const cssProcessorMock = {
    totalRows: 10,
    totalColumns: 5,
    classes: { 'even/odd': { background: 'red' } },
    processedClasses: [],
    process: vi.fn(() => ({})),
    processFixed: vi.fn(() => ({})),
    updateColumns: vi.fn(),
    processClasses: vi.fn(),
  };

  const mountFactory = async (props = {}) => {
    return mount(HeaderCell, {
      props: {
        columnIndex: 0,
        cssProcessor: cssProcessorMock,
        ...props,
      },
    });
  };

  it('should render the default title', async () => {
    const wrapper = await mountFactory({
      title: '',
      column: { title: 'Default Title', direction: null },
    });

    expect(wrapper.find('span').text()).toBe('Default Title');

    wrapper.unmount();
  });

  it('should render a custom title', async () => {
    const wrapper = await mountFactory({
      title: 'Custom Title',
      column: { title: '', direction: null },
    });

    expect(wrapper.find('span').text()).toBe('Custom Title');

    wrapper.unmount();
  });

  it('should apply correct header classes', async () => {
    const wrapper = await mountFactory({
      isDraggableCss: true,
      column: {
        direction: true,
        nonDraggable: false,
        grouped: false,
      },
    });

    expect(wrapper.find('th').classes()).toContain('tf-table-cursor-pointer');
    expect(wrapper.find('th').classes()).toContain('tf-table-draggable-column');

    wrapper.unmount();
  });

  it('should render remove icon when editable', async () => {
    const removeIconSlot = vi.fn(() =>
      h('div', {}, 'Remove Icon')
    );

    const wrapper = await mountFactory({
      isEditable: true,
      removeIconSlot,
    });

    expect(removeIconSlot).toHaveBeenCalled();
    expect(wrapper.html()).toContain('Remove Icon');

    wrapper.unmount();
  });

  it('should render sort icon when sortable', async () => {
    const sortIconSlot = vi.fn(() =>
      h('div', {}, 'Sort Icon')
    );

    const wrapper = await mountFactory({
      column: { direction: true },
      sortIconSlot,
    });

    expect(sortIconSlot).toHaveBeenCalled();
    expect(wrapper.html()).toContain('Sort Icon');

    wrapper.unmount();
  });

  it('should correctly render sort icon if iconSlot includes several children nodes', async () => {
    const sortIconSlot = vi.fn(() => [
      h(
        'span',
        {},
        'icon-1'
      ),
      h(
        'span',
        {},
        'icon-2'
      )
    ]);

    const wrapper = await mountFactory({
      column: { direction: true },
      sortIconSlot,
    });

    expect(sortIconSlot).toHaveBeenCalled();
    expect(wrapper.html()).toContain('<span>icon-1</span>');
    expect(wrapper.html()).toContain('<span>icon-2</span>');

    wrapper.unmount();
  });

  it('should render fixative action when fixable', async () => {
    const fixativeBtnSlot = vi.fn(() =>
      h('div', {}, 'Fixative Button')
    );

    const wrapper = await mountFactory({
      isFixable: true,
      fixativeBtnColIndex: 0,
      fixativeBtnSlot,
    });

    expect(fixativeBtnSlot).toHaveBeenCalled();
    expect(wrapper.html()).toContain('Fixative Button');

    wrapper.unmount();
  });

  it('should render directives when column directivesData is provided', async () => {
    const directivesData = [
      { name: 'test-directive', value: { test: true }, modifiers: {} },
    ];

    const wrapper = await mountFactory({
      column: { directivesData },
    });

    expect(wrapper.find('span').exists()).toBe(true);

    wrapper.unmount();
  });
});
