<template>
  <div class="main__btn-wrapper">
    <Space>
      <Button type="primary" @click="handleLoginClick">Страница входа</Button>
      <Button type="primary" danger @click="handleRegistrationClick">
        Страница регистрации
      </Button>
    </Space>
  </div>
</template>
<script>
import { Button, Space } from 'ant-design-vue';
import { useRouter } from 'vue-router';
export default {
  components: { Button, Space },
  setup() {
    const router = useRouter();
    const handleLoginClick = () => {
      router.push({ name: 'login' });
    };
    const handleRegistrationClick = () => {
      router.push({ name: 'registration' });
    };
    return {
      handleLoginClick,
      handleRegistrationClick,
    };
  },
};
</script>
<style></style>
