<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import router from '../routes';

const username = ref('');
const password = ref('');

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', {
      username: username.value,
      password: password.value,
    });
    console.log(response.data);
    localStorage.setItem('sessionId', response.data.data);
    await router.push('/home');
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800">
        客户端注册(session注册)
      </h2>
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            用户名
          </label>
          <input v-model="username" id="username" name="username" type="text" required
                 class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            密码
          </label>
          <input v-model="password" id="password" name="password" type="password" required
                 class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="flex justify-end">
          <router-link to="/login">
            已有账号？点击登录
          </router-link>
        </div>
        <div>
          <button type="submit"
                  class="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click.prevent="handleRegister">
            注册
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
