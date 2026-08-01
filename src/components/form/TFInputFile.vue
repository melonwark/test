<template>
  <div
    :class="['rendered tf-input-file', {'has-preview': hasPreview}]"
  >
    <input
      v-bind="form ? { form } : {}"
      :disabled="disabled"
      :id="id"
      :name="name"
      ref="fileInput"
      type="file"
      @change="previewFiles"
    >
    <label
      :for="id"
      data-browse="Choose file"
      class="tf-input-file-label"
    >
      <span>
        {{ content }}
      </span>
    </label>
    <VMenu
      placement="right"
      v-if="imagePreview"
      class="tf-input-file-preview"
      :triggers="['hover']"
    >
      <img
        class="tf-input-file-preview__image"
        :src="imagePreview"
        alt="File preview"
      />

      <template #popper>
        <img
          class="tf-input-file-preview__expanded-image"
          :src="imagePreview"
          alt="File preview"
        />
      </template>
    </VMenu>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'TFInputFile',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'No file chosen'
    },
    hasPreview: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const content = ref(props.label);
    const fileInput = ref(null);
    const imagePreview = ref<string | null>(null);

    const previewFiles = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      const file = files[0];
      content.value = file.name;

      if (props.hasPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = () => {
          imagePreview.value = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.value = null;
      }
    };

    return {
      content,
      fileInput,
      previewFiles,
      imagePreview
    };
  }
};
</script>
