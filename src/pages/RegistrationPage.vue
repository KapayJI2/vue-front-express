<template>
  <Registration />
</template>
<script>
import { defineAsyncComponent } from 'vue';
const Registration = defineAsyncComponent(() =>
  import('@/components/Registration.vue'),
);
export default {
  components: {
    Registration,
  },
};
</script>
