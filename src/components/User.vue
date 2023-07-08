<template>
  <div class="user__info">
    <div
      class="sort__icon-wrapper"
      v-if="userGalleryStoreData.length && !isGallery"
      @click="isGallery = true"
    >
      <span class="sort__icon">
        <TableOutlined />
      </span>
    </div>
    <div
      class="sort__icon-wrapper"
      v-if="userGalleryStoreData.length && isGallery"
      @click="isGallery = false"
    >
      <span class="sort__icon">
        <MenuOutlined />
      </span>
    </div>
    <span class="user__info-email" @click="handleExitVisiblitySwitch()">
      <UserOutlined />
      &nbsp;{{ user }}
    </span>
    <div
      @mouseenter="handleMouseEventEnter()"
      @mouseleave="handleMouseEventExit()"
      @click="handleLogoutClick()"
      :class="{
        'user__exit-visible': isExitVisible,
        user__exit: !isExitVisible,
      }"
    >
      Выйти
    </div>
    <!-- <Button
            type="primary"
            @click="handleLogoutClick"
            class="btn__wrap"
            danger
            ghost
            :disabled="isLoading"
            >Выйти</Button
          > -->
  </div>

  <div class="loading__wrapper" v-if="isLoading">
    <div class="loading__wrapper--item">
      <Progress
        v-if="isProgressUpload"
        type="circle"
        :percent="statusPercents"
      />
      <div v-else class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div>Загрузка...</div>
    </div>
  </div>
  <div>
    <div>
      <div class="user__wrapper">
        <span class="user__info-title">Файлы пользователя</span>

        <div class="button__wrapper">
          <input type="file" name="" id="file-input" accept="*/*" />
          <Button
            type="primary"
            @click="handleFileUploadClick"
            class="btn__wrap"
            :loading="isLoading"
          >
            {{ isLoading ? 'Обновление данных' : 'Добавить' }}
          </Button>
        </div>
      </div>

      <Gallery
        v-if="userGalleryStoreData.length && isGallery && reRender"
        :gallery="userGalleryStoreData"
        @handleDelete="onHandleDelete"
        @handleDownload="onHandleDownload"
      />
      <TableList
        v-if="userGalleryStoreData.length && !isGallery"
        :list="userGalleryStoreData"
        @handleDelete="onHandleDelete"
        @handleDownload="onHandleDownload"
        @handleCopyToClipboard="onCopyToClipboard"
      />
    </div>
  </div>
</template>
<script>
import {
  delLocalStorage,
  getLocalStorage,
} from '@/utils/localStorage/index.js';
import { computed, onMounted, defineAsyncComponent, nextTick } from '@vue/runtime-core';
import { ref } from '@vue/reactivity';
import { Button, Progress } from 'ant-design-vue';
import { TableOutlined, MenuOutlined } from '@ant-design/icons-vue';
const Gallery = defineAsyncComponent(() => import('@/components/Gallery.vue'));
const TableList = defineAsyncComponent(() =>
  import('@/components/TableList.vue'),
);

import { useRouter } from 'vue-router';
import {
  downloadImage,
  fetchingGallery,
  removeImage,
  // uploadImage,
} from '@/utils/fetch/index.js';
import { UploadOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  components: {
    MenuOutlined,
    TableOutlined,
    Gallery,
    TableList,
    UploadOutlined,
    UserOutlined,
    Button,
    Progress,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const user = getLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_NAME);
    const token = getLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_KEY);
    const isLoading = ref(false);
    const isExitVisible = ref(false);
    const isMouseInArea = ref(false);
    const isGallery = ref(false);
    const isProgressUpload = ref(false);
    const statusPercents = ref(0);
    const reRender = ref(true);
    const userGalleryStoreData = computed(() => {
      console.log("COMP: ", store.getters.getImages);
      return store.getters.getImages ?? [];
    });
    onMounted(async () => {
      isLoading.value = true;
      const gallery = await fetchingGallery(user, token);
      store.dispatch('setImages', gallery);
      isLoading.value = false;
    });
    const forceRender = async () => {
      reRender.value = false;

      await nextTick();

      reRender.value = true;
    }
    const handleFileUploadClick = async () => {
      isProgressUpload.value = true;
      isLoading.value = true;
      const fileInput = document.querySelector('#file-input');
      if (!fileInput.files.length) {
        isLoading.value = false;
        return message.error('Файлы не выбраны');
      }
      const formData = new FormData();
      formData.append('attachedFile', fileInput.files[0]);
      // const image = await uploadImage(user, formData, token);
      ///=====
      try {
        const response = await axios
          .post(
            `${process.env.VUE_APP_API_URL}/user/${user}/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              onUploadProgress: (e) => {
                statusPercents.value = parseInt((e.loaded / e.total) * 100);
              },
            },
          )
          .catch((e) => {
            if (e instanceof Error) {
              console.log(e.message);
            }
          });
        const data = await response.data;
        if (response.statusText !== 'OK') {
          if (data.errors) {
            data.errors.map(({ msg }) => message.error(msg));
            return;
          }
          message.error(data.message);
          return;
        }
        message.success('Галерея полизователя обновлена');
        const image = data.file;

        ///=====
        fileInput.value = null;
        store.dispatch('addImage', image);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
      isLoading.value = false;
      isProgressUpload.value = false;
    };
    const onHandleDelete = async (name) => {
      isLoading.value = true;
      await removeImage(user, name, token);
      const gallery = await fetchingGallery(user, token);
      store.dispatch('removeImage', name);
      store.dispatch('setImages', gallery);
      await forceRender();
      isLoading.value = false;
    };
    const onHandleDownload = async (file) => {
      isLoading.value = true;
      const { name, filename } = file;
      await downloadImage(name, filename);
      isLoading.value = false;
    };
    const handleExitVisiblitySwitch = () => {
      if (!isExitVisible.value) {
        isExitVisible.value = true;
        const in_val = setInterval(() => {
          if (!isMouseInArea.value) {
            isExitVisible.value = false;
            clearInterval(in_val);
          }
        }, 4000);
      }
    };
    const handleMouseEventEnter = () => {
      isMouseInArea.value = true;
    };
    const handleMouseEventExit = () => {
      isMouseInArea.value = false;
    };
    const handleLogoutClick = () => {
      delLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_KEY);
      delLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_NAME);
      router.push({ name: 'home' });
    };
    const onCopyToClipboard = (file) => {
      const { filename, name } = file;
      navigator.clipboard.writeText(`${process.env.VUE_APP_API_URL + '/storage/download/' + filename + '/' + name}`);
      message.success("Ссылка на файл скопирована в буфер обмена");
    }
    return {
      isLoading,
      user,
      userGalleryStoreData,
      handleFileUploadClick,
      handleLogoutClick,
      onHandleDelete,
      onHandleDownload,
      handleExitVisiblitySwitch,
      isExitVisible,
      handleMouseEventEnter,
      handleMouseEventExit,
      isGallery,
      statusPercents,
      isProgressUpload,
      onCopyToClipboard,
      reRender
    };
  },
};
</script>
<style></style>
