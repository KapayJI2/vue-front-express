<template>
  <User />
</template>
<script>
import { defineAsyncComponent } from 'vue';
const User = defineAsyncComponent(() => import('@/components/User.vue'));
export default {
  components: {
    User,
  },
};
</script>
