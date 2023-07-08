<template>
  <div>
    <div class="gallery__img">
      <div v-if="!gallery.length">Галерея пуста</div>
      <div
        class="gallery__img-wrapper"
        v-for="(item, idx) in gallery"
        :key="idx"
      >
        <Image
          :image="item.filename"
          :name="item.metadata.name"
          :mimetype="item.metadata.mimetype"
          :filename="item.filename"
          @handleDeleteImage="handleDeleteImageFromGallery"
          @handleDownloadImage="handleDownloadFromGallery"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { defineAsyncComponent } from '@vue/runtime-core';
const Image = defineAsyncComponent(() => import('@/components/Image.vue'));

export default {
  components: { Image },
  props: {
    gallery: {
      type: Array,
      required: true,
    },
  },
  emits: ['handleDelete', 'handleDownload'],
  setup(props, { emit }) {
    const imgGallery = props.gallery;
    // const isReverse = ref(false);
    // const handleReverse = () => {
    //   isReverse.value = !isReverse.value;
    // };
    const handleDeleteImageFromGallery = (filename) => {
      emit('handleDelete', filename);
    };
    const handleDownloadFromGallery = (file) => {
      emit('handleDownload', file);
    };
    return {
      handleDeleteImageFromGallery,
      handleDownloadFromGallery,
      imgGallery,
      // isReverse,
      // handleReverse,
    };
  },
};
</script>
<style></style>
