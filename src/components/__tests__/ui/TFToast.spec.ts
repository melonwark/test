import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TFToast from '@/components/ui/TFToast.vue';

describe('TFToast', () => {

  it('should mount and render Notifications component', () => {
    const wrapper = mount(TFToast, {
      props: {
        text: 'TEST',
      },
    });

    const notifications = wrapper.findComponent({ name: 'notifications' });
    expect(notifications.exists()).toBe(true);
  });

  it('should pass props to notifications', () => {
    const wrapper = mount(TFToast, {
      props: {
        group: 'test-group',
        position: 'bottom left',
        animationName: 'fade',
        width: 400,
        duration: 5000,
        speed: 300,
        max: 5,
        reverse: true,
        pauseOnHover: true,
        closeOnClick: true,
        ignoreDuplicates: false,
        dangerouslySetInnerHtml: true,
        classes: 'test-toast-class',
      },
    });

    const notifications = wrapper.findComponent({ name: 'notifications' });

    expect(notifications.props('group')).toBe('test-group');
    expect(notifications.props('position')).toBe('bottom left');
    expect(notifications.props('animationName')).toBe('fade');
    expect(notifications.props('width')).toBe(400);
    expect(notifications.props('duration')).toBe(5000);
    expect(notifications.props('speed')).toBe(300);
    expect(notifications.props('max')).toBe(5);
    expect(notifications.props('reverse')).toBe(true);
    expect(notifications.props('pauseOnHover')).toBe(true);
    expect(notifications.props('closeOnClick')).toBe(true);
    expect(notifications.props('ignoreDuplicates')).toBe(false);
    expect(notifications.props('dangerouslySetInnerHtml')).toBe(true);
    expect(notifications.props('classes')).toContain('test-toast-class');
    expect(notifications.props('classes')).toContain('tf-toast');
  });

  it('should call notify on mount if isForm is true and text is string', async () => {
    const wrapper = mount(TFToast, {
      props: {
        isForm: true,
        text: 'Some error occurred',
        group: 'form',
        toastType: 'error',
        title: 'Error!',
      },
    });

    await flushPromises();

    const title = wrapper.find('.notification-title').text();
    expect(title).toEqual('Error!');

    const text = wrapper.find('.notification-content').text();
    expect(text).toEqual('Some error occurred');

  });

  it('should call notify with joined string if text is object', async () => {
    const wrapper = mount(TFToast, {
      props: {
        isForm: true,
        text: {
          email: ['Email is required'],
          password: ['Password is too short'],
        },
        group: 'form',
        toastType: 'error',
        title: 'Error!',
      },
    });

    await flushPromises();

    const text = wrapper.find('.notification-content').text();
    expect(text).toEqual('Email is required<br/>Password is too short');

  });

  it('should emit destroy event on destroy method call', async () => {
    const wrapper = mount(TFToast, {
      props: {},
    });

    wrapper.vm.destroy();
    expect(wrapper.emitted('destroy')).toBeTruthy();
  });
});
