import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TFInputFile from '@/components/form/TFInputFile.vue';

describe('TFInputFile', () => {
  it('should render correctly with default label', () => {
    const wrapper = mount(TFInputFile, {
      props: { id: 'test-file', name: 'test-name' }
    });

    expect(wrapper.find('label span').text()).toBe('No file chosen');
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
  });

  it('should render custom label', () => {
    const wrapper = mount(TFInputFile, {
      props: {
        label: 'Upload your image'
      }
    });

    expect(wrapper.find('label span').text()).toBe('Upload your image');
  });

  it('should update label when file is selected', async () => {
    const wrapper = mount(TFInputFile, {
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot /><slot name="popper" /></div>'
          }
        }
      }
    });
    const input = wrapper.find('input[type="file"]');

    const fileMock = new File(
      ['(file content)'],
      'test.pdf',
      {
        type: 'text/plain',
      }
    );

    Object.defineProperty(input.element, 'files', {
      value: [fileMock],
      writable: false,
    });

    await input.trigger('change');
    await wrapper.vm.$nextTick();


    expect(wrapper.find('label span').text()).toBe('test.pdf');
    expect(wrapper.vm.imagePreview).toBe(null);
  });

  it('should set image preview if file is an image and hasPreview is true', async () => {
    const mockFileReaderInstance = {
      result: 'data:image/png;base64,mockdata',
      readAsDataURL: vi.fn(function (
        this: { onload: ((ev: ProgressEvent<FileReader>) => void) | null }
      ) {
        if (typeof this.onload === 'function') {
          const event = new ProgressEvent('load') as ProgressEvent<FileReader>;
          this.onload?.(event);
        }
      }),
      onload: null as ((ev: ProgressEvent<FileReader>) => void) | null
    };

    vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

    const wrapper = mount(TFInputFile, {
      props: {
        hasPreview: true
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot /><slot name="popper" /></div>'
          }
        }
      }
    });

    const input = wrapper.find('input[type="file"]');

    const fileMock = new File(
      ['(image data)'],
      'image.png',
      { type: 'image/png' }
    );

    Object.defineProperty(input.element, 'files', {
      value: [fileMock],
      writable: false
    });

    await input.trigger('change');
    await wrapper.vm.$nextTick();

    expect(mockFileReaderInstance.readAsDataURL).toHaveBeenCalledOnce();
    expect(wrapper.vm.imagePreview).toBe('data:image/png;base64,mockdata');

    const previewImg = wrapper.find('.tf-input-file-preview__image');

    expect(previewImg.exists()).toBe(true);
    expect(previewImg.attributes('src')).toBe('data:image/png;base64,mockdata');
  });

  it('should not update label if no file is selected', async () => {
    const wrapper = mount(TFInputFile, {
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot /><slot name="popper" /></div>'
          }
        }
      }
    });

    const input = wrapper.find('input[type="file"]');

    Object.defineProperty(input.element, 'files', {
      value: [],
      writable: false
    });

    await input.trigger('change');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('label span').text()).toBe('No file chosen');
    expect(wrapper.vm.imagePreview).toBe(null);
  });

});
