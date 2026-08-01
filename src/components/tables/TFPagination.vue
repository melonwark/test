<template>
  <nav class="tf-pagination-container">
    <ul
      v-if="pagesCount > 1"
      class="tf-pagination"
    >
      <li
        :class="prevButtonClasses"
        class="tf-page-item"
      >
        <button
          @click="setPreviousPage"
          class="tf-page-link"
          :disabled="prevButtonDisabled"
        >
          « {{ locale.prev }}
        </button>
      </li>
      <li
        v-for="(pageItem, index) in pageRange"
        :key="index"
        :class="pageNumberClasses(pageItem)"
        class="tf-page-item"
      >
        <button
          @click="setPage(pageItem)"
          class="tf-page-link"
          :disabled="pageItem === delimiter"
        >
          {{ pageItem }}
        </button>
      </li>
      <li
        :class="nextButtonClasses"
        class="tf-page-item"
      >
        <button
          @click="setNextPage"
          class="tf-page-link"
          :disabled="nextButtonDisabled"
        >
          {{ locale.next }} »
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';

export default {
  name: 'TFPagination',
  props: {
    pagesCount: { type: Number, required: true, default: 1 },
    pageNumber: { type: Number, required: true, default: 1 },
  },
  setup(props, { emit }) {
    const page = ref(props.pageNumber);
    const paginationItemsCount = 10;
    const sideItemsCount = 2;
    const delimiter = '...';

    const currentPage = computed({
      get: () => page.value,
      set: value => {
        page.value = Math.min(Math.max(value, 1), props.pagesCount);
      },
    });

    const locale = {
      prev: '',
      next: '',
    };

    const prevButtonDisabled = computed(() => currentPage.value === 1);
    const nextButtonDisabled = computed(() => currentPage.value === props.pagesCount);

    const prevButtonClasses = computed(() => ({
      disabled: prevButtonDisabled.value,
      'cursor-pointer': !prevButtonDisabled.value,
    }));

    const nextButtonClasses = computed(() => ({
      disabled: nextButtonDisabled.value,
      'cursor-pointer': !nextButtonDisabled.value,
    }));

    const pageRange = computed(() => {
      const range = [];

      if (props.pagesCount <= paginationItemsCount) {
        for (let i = 1; i <= props.pagesCount; i++) {
          range.push(i);
        }
      } else {
        const start = Math.max(1, currentPage.value - sideItemsCount);
        const end = Math.min(props.pagesCount, currentPage.value + sideItemsCount);

        if (start > 1) {
          range.push(1);
          if (start > 2) {
            range.push(delimiter);
          }
        }

        const middlePages = [];
        for (let i = start; i <= end; i++) {
          middlePages.push(i);
        }
        range.push(...middlePages);

        if (end < props.pagesCount) {
          if (end < props.pagesCount - 1) {
            range.push(delimiter);
          }
          range.push(props.pagesCount);
        }
      }

      return range;
    });

    const pageNumberClasses = (pageItem: number|string) => ({
      active: pageItem === currentPage.value,
      disabled: pageItem === delimiter,
      'cursor-pointer': pageItem !== delimiter,
    });

    const setPreviousPage = () => {
      if (!prevButtonDisabled.value) {
        currentPage.value -= 1;
      }
    };

    const setNextPage = () => {
      if (!nextButtonDisabled.value) {
        currentPage.value += 1;
      }
    };

    const setPage = (pageItem: number | string) => {
      if (pageItem !== delimiter) {
        currentPage.value = Number(pageItem);
      }
    };

    watch(currentPage, newValue => {
      emit('pageChanged', newValue);
    }, { immediate: true });

    return {
      currentPage,
      locale,
      prevButtonClasses,
      nextButtonClasses,
      pageRange,
      setPreviousPage,
      setNextPage,
      setPage,
      pageNumberClasses,
      delimiter,
      prevButtonDisabled,
      nextButtonDisabled
    };
  },
};
</script>
