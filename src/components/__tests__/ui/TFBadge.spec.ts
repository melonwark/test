import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TFBadge from '@/components/ui/TFBadge.vue';

describe('TFBadge.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountFactory = (props = {}, slots = { default: 'Default Slot' }) => {
    const tooltipMock = {
      mounted: vi.fn(),
      updated: vi.fn()
    };

    const clipboardDirectiveMock = {
      mounted: vi.fn(),
      updated: vi.fn()
    };

    return mount(TFBadge, {
      props,
      slots,
      global: {
        directives: {
          tooltip: tooltipMock,
          clipboard: clipboardDirectiveMock,
        }
      }
    });
  };

  it('should render formatted content if "content" prop is provided', () => {
    const wrapper = mountFactory({ content: 'hello_world' });

    expect(wrapper.text()).toBe('hello world');
  });

  it('should render default slot content if "content" is empty', () => {
    const wrapper = mountFactory({ content: '' });

    expect(wrapper.text()).toBe('Default Slot');
  });

  it('should apply correct badge classes', () => {
    const wrapper = mountFactory({
      variant: 'success',
      size: 'lg',
      outline: true,
    });

    const el = wrapper.find('.tf-badge');
    expect(el.classes()).toContain('tf-badge');
    expect(el.classes()).toContain('tf-badge-lg');
    expect(el.classes()).toContain('tf-badge-success-outline');
  });

  it('should render with tooltip directive content', () => {
    const wrapper = mountFactory({ tooltip: 'This is a tooltip' });

    expect(wrapper.vm.innerTooltipContent).toBe('This is a tooltip');
  });

  it('should render copy-enabled badge when withClipboard is true', () => {
    const wrapper = mountFactory({
      withClipboard: true,
      copyData: 'Copy this text',
    });

    expect(wrapper.find('.tf-badge-copy').exists()).toBe(true);
  });

  it('should reset tooltip content after mouseleave', async () => {
    vi.useFakeTimers();
    const wrapper = mountFactory({
      withClipboard: true,
      tooltip: 'Initial Tooltip',
    });

    wrapper.vm.innerTooltipContent = 'Copied!';
    await wrapper.trigger('mouseleave');

    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.innerTooltipContent).toBe('Initial Tooltip');

    vi.useRealTimers();
  });

  it('should update tooltip content when clipboard is successful', async () => {
    const wrapper =  mountFactory({
      tooltip: 'Default Tooltip',
      withClipboard: true,
      copyData: 'Some data to copy',
    });

    wrapper.vm.clipboardSuccessHandler('Some data to copy');

    expect(wrapper.vm.innerTooltipContent).toBe('Copied!');
  });

  it('should restore tooltip content when clipboard is unsuccessful', () => {
    const wrapper =  mountFactory({
      tooltip: 'Default Tooltip',
      withClipboard: true,
      copyData: 'Some data to copy',
    });

    wrapper.vm.clipboardSuccessHandler('');

    expect(wrapper.vm.innerTooltipContent).toBe('Default Tooltip');
  });

  it('should not render copy wrapper if withClipboard is false', () => {
    const wrapper = mountFactory({
      withClipboard: false,
    });

    expect(wrapper.find('.tf-badge-copy').exists()).toBe(false);
  });

  it('renders formatted content when withClipboard = true and content provided', () => {
    const wrapper = mountFactory({ content: 'foo_bar', withClipboard: true });
    expect(wrapper.text()).toBe('foo bar');
  });

  it('renders slot when withClipboard = true and content is empty', () => {
    const wrapper = mountFactory({ content: '', withClipboard: true }, { default: 'Fallback Slot' });
    expect(wrapper.text()).toBe('Fallback Slot');
  });

  it('renders slot when withClipboard = false and content is empty', () => {
    const wrapper = mountFactory({ content: '', withClipboard: false }, { default: 'Another Slot' });
    expect(wrapper.text()).toBe('Another Slot');
  });
});
