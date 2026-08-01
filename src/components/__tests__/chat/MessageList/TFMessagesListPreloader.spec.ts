import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MessagesListPreloader from '@/components/chat/MessageList/MessagesListPreloader.vue';
import { merge } from 'lodash';
import { ref } from 'vue';


const defaultOptions = {
  global: {
    provide: {
      userRole: 1,
      chatHeight: ref(500),
    },
  },
};


describe('TFMessagesListPreloader', () => {
  const mountFactory = async ( options = {}) => {
    const mergedOptions = merge(defaultOptions, options);

    return mount(MessagesListPreloader, {
      props: {},
      ...mergedOptions
    });
  };


  it('should compute skeletonItemsCount correctly based on chatHeight', async() => {
    const wrapper = await mountFactory();

    expect(wrapper.vm.skeletonItemsCount).toBe(3);
  });

  it('should render the skeleton items correctly when chatHeight is smaller', async () => {
    const wrapper = await mountFactory({
      global: {
        provide: {
          chatHeight: ref(100),
        },
      },
    });

    const skeletonItems = wrapper.findAll('[data-test="preloader-item"]');

    expect(skeletonItems.length).toBe(1);
  });

});
