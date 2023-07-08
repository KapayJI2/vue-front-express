<template>
  <div class="reg_wrapper">
    <Input
      v-model:value="userName"
      placeholder="Имя пользователя"
      style="margin: 4px 0px 4px 0px"
    />
    <Input
      v-model:value="email"
      placeholder="Email"
      style="margin: 4px 0px 4px 0px"
    />
    <InputPassword
      v-model:value="password"
      placeholder="Пароль"
      style="margin: 4px 0px 4px 0px"
    />
    <InputPassword
      v-model:value="confirmPassword"
      placeholder="Подтверждение пароля"
      style="margin: 4px 0px 6px 0px"
    />
    <p v-if="onCheckDisable">{{ errorMessage }}</p>
    <Button
      type="primary"
      @click="handleRegisterClick"
      :disabled="onCheckDisable"
    >
      Зарегистрироваться
    </Button>
    <p>
      Есть аккаунт?
      <router-link to="/login">Войти</router-link>
    </p>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { Input, InputPassword, Button } from 'ant-design-vue';
import { postRequestToRegOrLogin } from '@/utils/fetch/index.js';
export default {
  components: { Input, InputPassword, Button },
  setup() {
    const router = useRouter();
    const userName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    const onCheckDisable = ref(true);
    watch(confirmPassword, (newValue, oldValue) => {
      if (newValue !== password.value || newValue === '') {
        errorMessage.value = 'Пароли должны совпадать';
        return;
      }
      onCheckDisable.value = false;
      errorMessage.value = '';
    });
    const handleRegisterClick = async () => {
      const body = {
        userName: userName.value,
        email: email.value,
        password: password.value,
      };
      const response = await postRequestToRegOrLogin(body, 'registration');
      if (!response) {
        return;
      }
      router.push({ name: 'login' });
    };
    return {
      userName,
      email,
      password,
      confirmPassword,
      handleRegisterClick,
      onCheckDisable,
      errorMessage,
    };
  },
};
</script>
<style></style>
