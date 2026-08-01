import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TFIcon from '@/components/ui/TFIcon.vue';


describe('TFIcon', () => {
  it('should render an image when src is provided', () => {
    const wrapper = mount(TFIcon, {
      props: {
        src: 'https://example.com/image.jpg',
        imgClass: 'my-img-class',
      },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/image.jpg');
    expect(img.classes()).toContain('my-img-class');
  });

  it('should render an icon when src is not provided but icon is', () => {
    const wrapper = mount(TFIcon, {
      props: {
        icon: 'my-icon',
      },
    });

    const icon = wrapper.find('i');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('icon');
  });

  it('should not render img or i if both src and icon are not provided', () => {
    const wrapper = mount(TFIcon, {
      props: {},
    });

    const img = wrapper.find('img');
    const icon = wrapper.find('i');

    expect(img.exists()).toBe(false);
    expect(icon.exists()).toBe(false);
  });

  it('should apply the correct class to the image', () => {
    const wrapper = mount(TFIcon, {
      props: {
        src: 'https://example.com/image.jpg',
        imgClass: 'custom-class',
      },
    });

    const img = wrapper.find('img');
    expect(img.classes()).toContain('custom-class');
  });

  it('should not render image if src is not provided', () => {
    const wrapper = mount(TFIcon, {
      props: {
        icon: 'my-icon',
      },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(false);
  });

  it('should not render icon if icon is not provided', () => {
    const wrapper = mount(TFIcon, {
      props: {
        src: 'https://example.com/image.jpg',
      },
    });

    const icon = wrapper.find('i');
    expect(icon.exists()).toBe(false);
  });

});
