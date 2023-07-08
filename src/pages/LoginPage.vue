<template>
  <Login />
</template>
<script>
import { defineAsyncComponent } from 'vue';
const Login = defineAsyncComponent(() => import('@/components/Login.vue'));

export default {
  components: {
    Login,
  },
};
</script>
