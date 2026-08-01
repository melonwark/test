<template>
  <div
    class="relative rendered"
    :class="[ wrapperClasses, containerClass ]"
    @keydown.backspace="removeLastTag()"
  >
    <div
      v-if="hasActions"
      class="combo-box-item"
    >
      <slot name="actions"></slot>
    </div>
    <VueMultiselect
      ref="selectRef"
      v-model="innerValue"
      :id="id"
      :options="selectOptions"
      :multiple="multiple"
      :placeholder="placeholder"
      :label="optionType === 'Object' ? labelName : null"
      :track-by="optionType === 'Object' ? trackBy : null"
      :searchable="searchable"
      :options-limit="autocomplete ? 50 : 300"
      :max-height="maxHeight"
      :internal-search="internalSearch"
      :disabled="disabled"
      select-label=""
      @search-change="debouncedFindOptions"
      :allow-empty="!required"
      :deselect-label="required ? 'Field is required' : 'Press enter to remove'"
      :clear-on-select="clearOnSelect"
      :tabindex="0"
      :loading="searchIsLoading"
      :hide-selected="hideSelected"
      :close-on-select="closeOnSelect"
      :open-direction="openDirection"
      @remove="deactivate"
      @update:modelValue="inputEventHandler"
      :class="selectClasses"
      @open="isOpen = true"
      @close="isOpen = false"
      :data-cy="dataCy"
    >
      <template #noResult>
        {{
          loadingText ||
            'No elements found. Consider changing the search query.'
        }}
      </template>
      <template
        v-if="isDraggable"
        #selection="{ remove }"
      >
        <div
          @click.prevent.stop="toggleOptionsList"
          @mouseleave.prevent="searchFocus"
        >
          <div
            @mousedown="draggableFocus"
            class="draggable-wrapper"
            tabindex="0"
          >
            <draggable
              ref="drag"
              :list="innerValue"
              ghost-class="ghost"
            >
              <span
                class="multiselect__tag draggable-item"
                v-for="(option, index) in innerValue"
                :key="index"
              >
                <span>{{ option[labelName] || option }}</span>
                <span
                  class="multiselect__tag-remove-btn"
                  @click.prevent.stop="remove(option)"
                >
                  <i class="multiselect__tag-icon" /></span>
              </span>
            </draggable>
          </div>
        </div>
      </template>
    </VueMultiselect>
    <label
      class="label"
      :class="[
        { active: activeClasses },
        { multiple: multiple && !searchable },
      ]"
    >
      {{ placeholder }}
    </label>
    <p
      v-if="hasError"
      class="error-feedback invalid-feedback"
    >
      {{ errorFeedback }}
    </p>
    <div v-if="multiple">
      <input
        v-bind="form ? { form } : {}"
        type="hidden"
        v-for="(val, index) in innerValue"
        :key="index"
        :name="`${name}[]`"
        :value="prepareInputValue(val)"
      />
    </div>
    <input
      v-else
      v-bind="form ? { form } : {}"
      type="hidden"
      :name="name"
      :value="prepareInputValue(innerValue)"
    />
  </div>
</template>

<script lang="ts">
import {
  ref,
  watch,
  computed,
  onMounted,
  nextTick,
  defineComponent, onUnmounted
} from 'vue';
import VueMultiselect from 'vue-multiselect';
import { VueDraggableNext } from 'vue-draggable-next';
import axios from 'axios';
import eventBus from '@/utils/eventBus.js';
import debounce from '@/utils/debounce';
import type { PropType } from 'vue';
import type { TMultiselectValue } from '@/types/components';
import type { TMultiselect } from '@/types/components';

export default defineComponent({
  name: 'TFMultiselect',
  components: {
    VueMultiselect,
    draggable: VueDraggableNext,
  },
  props: {
    id: { type: String, default: '' },
    optionType: { type: String, default: 'Object' }, // 'notObject' или 'Object'
    options: {
      type: Array as PropType<(string | number | object)[]>,
      default: () => [],
      validator: (propValue: (string | number | object)[]) => {
        const isValid = propValue.every(
          el =>
            typeof el === 'string' ||
            typeof el === 'number' ||
            typeof el === 'object',
        );

        if (!isValid) {
          console.error(
            '[:options] prop validator err: array contains invalid types',
          );
        }
        return isValid;
      },
    },
    labelName: { type: String, default: 'name' },
    trackBy: { type: String, default: 'id' },
    value: {
      type: [Array, Object, String, Number] as PropType<
        TMultiselectValue | TMultiselectValue[]
      >,
      default: () => [],
    },
    multiple: { type: Boolean, default: false },
    autocomplete: { type: String, default: '' },
    autocompleteQueryKey: { type: String, default: 'q' },
    placeholder: { type: String, default: '' },
    internalSearch: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    name: { type: String, default: '' },
    required: { type: Boolean, default: false },
    isDraggable: { type: Boolean, default: false },
    clearOnSelect: { type: Boolean, default: true },
    closeOnSelect: { type: Boolean, default: false },
    reloadPageOnSelect: { type: Boolean, default: false },
    hasActions: { type: Boolean, default: false },
    hasError: { type: Boolean, default: false },
    errorFeedback: { type: String, default: 'This field is invalid' },
    insertGroupClipboard: { type: Boolean, default: false },
    eventBusEmitter: { type: String, default: '' },
    eventBusClearListener: { type: String, default: 'clearReportFilters' },
    callEmitterOnMount: { type: Boolean, default: true },
    hideSelected: { type: Boolean, default: false },
    searchOnMounted: { type: Boolean, default: false },
    maxHeight: { type: Number, default: 300 },
    openDirection: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    dataCy: { type: String, default: '' },
    containerClass: { type: String, default: 'form-field' },
    actionsPosition: { type: String, default: 'left' },
    form: { type: String, default: '' }
  },

  setup(props, { emit }) {
    const selectOptions = ref(props.options);
    const innerValue = ref<TMultiselectValue>(null);
    const loadingText = ref('');
    const isOpen = ref(false);
    const selectRef = ref<TMultiselect | null>(null);
    const searchIsLoading = ref(false);

    const activeClasses = computed(
      () =>
        (props.multiple && Array.isArray(innerValue.value)
          && innerValue.value?.length)
        || (!props.multiple && innerValue.value)
        || (props.searchable && isOpen.value),
    );

    const selectClasses = computed(() => ({
      required: props.required,
      'has-actions': props.hasActions,
      'has-tags':
        props.multiple
        && Array.isArray(innerValue.value)
        && innerValue.value?.length,
      'is-invalid': props.hasError,
      filled: activeClasses.value,
    }));

    const wrapperClasses = computed(() => ({
      'combo-box': props.hasActions,
      'is-invalid': props.hasError,
      [`has-item-${props.actionsPosition}`]: props.hasActions
    }));

    onMounted(async () => {
      if (Object.keys(props.options).length === 0 && props.searchOnMounted) {
        await findOptions('');
      }

      const findMatchingOption = <T,>(
        options: T[],
        value: TMultiselectValue,
        trackBy: string | null,
      ): T | undefined => {
        return options.find(option => {
          if (trackBy && option && typeof option === 'object') {
            const trackOfOption = (option as Record<string, unknown>)[trackBy];

            if (value !== null && typeof value === 'object') {
              const trackOfValue = (value as Record<string, unknown>)[trackBy];

              return (trackOfValue ?? value) === (trackOfOption ?? option);
            } else {
              return String(value) === String(trackOfOption);
            }
          } else {
            return String(value) === String(option);
          }
        });
      };

      if (props.multiple && Array.isArray(props.value) && props.value) {
        innerValue.value = props.value.map((valueItem: TMultiselectValue) =>
          findMatchingOption(selectOptions.value, valueItem, props.trackBy),
        );
      } else {
        innerValue.value =
          findMatchingOption(selectOptions.value, props.value, props.trackBy) ??
          null;
      }

      if (!innerValue.value && props.required) {
        innerValue.value = selectOptions.value[0];
      }

      if (props.searchable) {
        const searchInput = selectRef.value?.$el.querySelector(
          '.multiselect__input',
        ) as HTMLElement;

        if (searchInput) {
          searchInput.addEventListener('click', () => {
            if (
              !innerValue.value ||
              (Array.isArray(innerValue.value) && innerValue.value.length === 0)
            ) {
              selectRef.value?.deactivate();
            }
          });
        }
      }

      eventBus.$on(props.eventBusClearListener, () => {
        clear();
      });

      nextTick(() => {
        if (props.callEmitterOnMount) {
          callEmitter();
        }
      });
    });

    onUnmounted(() => {
      eventBus.$off(props.eventBusClearListener);
      eventBus.$off(props.callEmitterOnMount);
    });

    watch(
      () => props.options,
      val => (selectOptions.value = val),
      { deep: true },
    );

    watch(
      () => props.value,
      val => (innerValue.value = val),
      { deep: true },
    );

    const clear = () => {
      if (props.required) {
        innerValue.value = selectOptions.value[0];
      } else if (props.multiple) {
        innerValue.value = [];
      } else {
        innerValue.value = null;
      }
    };

    const searchFocus = () => {
      if (selectRef.value && selectRef.value.isOpen) {

        if (props.searchable) {
          selectRef.value.$refs.search.focus();
        } else {
          const multiselectElement = selectRef.value.$el;

          if (multiselectElement) {
            multiselectElement.focus();
          }
        }
      }
    };

    const callEmitter = () => {
      if (props.eventBusEmitter) {
        eventBus.$emit(props.eventBusEmitter, prepareDataForEmit());
      } else {
        emit('input', prepareDataForEmit());
      }
    };

    const prepareDataForEmit = () =>
      props.multiple ? innerValue.value : prepareInputValue(innerValue.value);

    const prepareInputValue = (value: TMultiselectValue) => {
      if (value && typeof value === 'object' && props.optionType === 'Object') {
        return (value as Record<string, unknown>)[props.trackBy];
      }
      return value;
    };

    const clearSearchInput = () => {
      if (selectRef.value) {
        selectRef.value.search = '';
      }
    };

    const findOptions = async (value: string | number) => {
      const encodedURI = encodeURIComponent(value);
      searchIsLoading.value = true;

      const query =
        props.insertGroupClipboard
          ? encodedURI
            .split(/%7C|%20|%3B|%2C/g)
            .filter(Boolean)
          : null;

      loadingText.value = '';

      if (props.autocomplete) {
        loadingText.value = 'Loading';

        await axios
          .get(props.autocomplete, {
            params: {
              [props.autocompleteQueryKey]:
                query && query.length > 0
                  ? decodeURIComponent(query.join(','))
                  : encodedURI,
            },
          })
          .then(res => {
            if (query && query.length > 1) {
              clearSearchInput();
            }
            loadingText.value = '';
            selectOptions.value = res.data;

            if (
              res.data.length &&
              query &&
              query.length > 1 &&
              props.insertGroupClipboard
            ) {
              if (Array.isArray(innerValue.value)) {
                const set = new Set();
                innerValue.value.concat(...res.data).forEach(el => {
                  set.add(JSON.stringify(el));
                });
                innerValue.value = [...set].map(item =>
                  typeof item === 'string' ? JSON.parse(item) : item,
                );
              }
            }
          }).finally(() => {
            searchIsLoading.value = false;
          });
      }
    };

    const debouncedFindOptions = debounce(findOptions);

    const draggableFocus = () => {
      if (selectRef.value?.isOpen) {
        if (props.searchable && selectRef.value.$refs.search) {
          selectRef.value.$refs.search.blur();
        }
        const multiselectElement = selectRef.value.$el;

        if (multiselectElement) {
          multiselectElement.blur();
        }
        selectRef.value.isOpen = true;
      }
    };

    const toggleOptionsList = () => {
      selectRef.value?.toggle();
    };

    const deactivate = () => {
      nextTick(() => {
        if (Array.isArray(innerValue.value) && innerValue.value?.length === 0) {
          selectRef.value?.deactivate();
        }
      });
    };

    const removeLastTag = () => {
      selectRef.value?.removeLastElement();
    };

    const inputEventHandler = () => {
      if (props.reloadPageOnSelect) {
        let urlQueries: unknown = '';

        if (props.multiple && Array.isArray(innerValue.value)) {
          innerValue.value.forEach(item => {
            urlQueries += `${prepareInputValue(item)},`;
          });
        } else {
          urlQueries = prepareInputValue(innerValue.value);
        }

        const url = new URL(window.location.href);
        url.searchParams.set(`${props.name}`, `${urlQueries}`);
        window.history.pushState({}, '', url.href);
        window.location.reload();
      }
      callEmitter();
    };


    return {
      selectOptions,
      innerValue,
      loadingText,
      isOpen,
      selectRef,
      searchFocus,
      findOptions,
      draggableFocus,
      activeClasses,
      toggleOptionsList,
      prepareInputValue,
      callEmitter,
      prepareDataForEmit,
      clear,
      deactivate,
      removeLastTag,
      inputEventHandler,
      selectClasses,
      wrapperClasses,
      debouncedFindOptions,
      searchIsLoading,
      clearSearchInput
    };
  },
});
</script>
