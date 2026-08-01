import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TFCard from '@/components/ui/TFCard.vue';

describe('TFCard', () => {
  it('should render default slot content', () => {
    const wrapper = mount(TFCard, {
      slots: {
        default: '<p>Default content</p>',
      },
    });

    expect(wrapper.find('.tf-card__content').text()).toBe('Default content');
  });

  it('should render header slot when provided', () => {
    const wrapper = mount(TFCard, {
      slots: {
        header: '<h1>Header content</h1>',
      },
    });

    const header = wrapper.find('.tf-card__header');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe('Header content');
  });

  it('should render preview slot when provided', () => {
    const wrapper = mount(TFCard, {
      slots: {
        preview: '<div>Preview content</div>',
      },
    });

    const preview = wrapper.find('.tf-card__preview');
    expect(preview.exists()).toBe(true);
    expect(preview.text()).toBe('Preview content');
  });

  it('should render footer slot when provided', () => {
    const wrapper = mount(TFCard, {
      slots: {
        footer: '<footer>Footer content</footer>',
      },
    });

    const footer = wrapper.find('.tf-card__footer');
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toBe('Footer content');
  });

  it('should have "has-header" class when header slot is provided', () => {
    const wrapper = mount(TFCard, {
      slots: {
        header: '<h1>Header</h1>',
      },
    });

    expect(wrapper.classes()).toContain('has-header');
  });

  it('should not have "has-header" class when header slot is not provided', () => {
    const wrapper = mount(TFCard);

    expect(wrapper.classes()).not.toContain('has-header');
  });

  it('should not render header, preview, and footer when slots are not provided', () => {
    const wrapper = mount(TFCard);

    expect(wrapper.find('.tf-card__header').exists()).toBe(false);
    expect(wrapper.find('.tf-card__preview').exists()).toBe(false);
    expect(wrapper.find('.tf-card__footer').exists()).toBe(false);
  });
});
