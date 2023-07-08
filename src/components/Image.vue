<template>
  <div class="gallery__img-item-wrapper">
    <div class="bg__img-item"></div>
    <Image
      :preview="!img ? false : true"
      class="img__item"
      :src="img ?? require('../assets/img/other.png')"
    />
    <span class="download__icon" @click="handleDownload({ name, filename })">
      <Space><VerticalAlignBottomOutlined /></Space>
    </span>
    <span class="delete__icon" @click="handleDelete(filename)">
      <Space><DeleteOutlined /></Space>
    </span>
  </div>
  <div class="img__footer-title">
    <a :href="link" target="_blank" download>
      <span class="img__footer-title-text">{{ name }}</span>
    </a>
  </div>
</template>
<script>
import { Image, Space } from 'ant-design-vue';
import { ref } from '@vue/reactivity';
import {
  DeleteOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons-vue';
export default {
  components: { DeleteOutlined, VerticalAlignBottomOutlined, Image, Space },
  props: {
    image: { type: String },
    name: {
      type: String,
    },
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
  },
  emits: ['handleDeleteImage', 'handleDownloadImage'],
  setup(props, { emit }) {
    const handleDelete = (filename) => {
      emit('handleDeleteImage', filename);
    };
    const handleDownload = (file) => {
      emit('handleDownloadImage', file);
    };
    const img = props.mimetype.includes('image')
      ? process.env.VUE_APP_API_URL + '/storage/' + props.image
      : null;
    const link =
      process.env.VUE_APP_API_URL +
      '/storage/download/' +
      props.filename +
      '/' +
      props.name;
    const name = ref(props.name);
    const filename = ref(props.filename);
    return {
      img,
      link,
      name,
      filename,
      handleDelete,
      handleDownload,
    };
  },
};
</script>
<style></style>
