<template>
  <div class="login_wrapper">
    <Input
      v-model:value="email"
      placeholder="Email"
      style="margin: 4px 0px 4px 0px"
    />
    <InputPassword
      v-model:value="password"
      placeholder="Пароль"
      style="margin: 4px 0px 6px 0px"
    />
    <Button type="primary" @click="handleLoginClick" :loading="isLoading">
      Войти
    </Button>
    <p>
      Нет аккаунта?
      <router-link to="/registration">Зарегистрироваться</router-link>
    </p>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { addLocalStorage } from '@/utils/localStorage/index.js';
import { useRouter } from 'vue-router';
import { postRequestToRegOrLogin } from '@/utils/fetch';
import { Button, Input, InputPassword } from 'ant-design-vue';
export default {
  components: { Button, Input, InputPassword },
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const email = ref('');
    const password = ref('');
    const handleLoginClick = async () => {
      isLoading.value = true;
      const body = {
        email: email.value,
        password: password.value,
      };
      const data = await postRequestToRegOrLogin(body, 'login');
      if (!data) {
        isLoading.value = false;
        return;
      }
      addLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_KEY, data.token);
      addLocalStorage(process.env.VUE_APP_LOCAL_STORAGE_NAME, email.value);
      isLoading.value = false;
      router.push({ name: 'user' });
    };
    return {
      email,
      password,
      handleLoginClick,
      isLoading,
    };
  },
};
</script>
<style></style>
