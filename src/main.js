import { createApp } from 'vue';
import App from './App.vue';
import router from '@/routes';
import 'ant-design-vue/dist/antd.css';
import '@/assets/css/styles.css';
import store from './store/index.js';
const app = createApp(App);

app.use(router).use(store).mount('#app');
