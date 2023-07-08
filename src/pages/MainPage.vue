<template>
  <Main />
</template>
<script>
import { defineAsyncComponent } from 'vue';
const Main = defineAsyncComponent(() => import('@/components/Main.vue'));
export default {
  components: {
    Main,
  },
};
</script>
