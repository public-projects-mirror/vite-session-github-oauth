<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import router from '../routes';
import { ElMessage } from 'element-plus';

const username = ref('');
const sessionId = ref('');
const state = ref('');

const showPasswordDialog = ref(false);
const newPassword = ref('');
const confirmPassword = ref(''); // New ref for confirming password

username.value = localStorage.getItem('username');
sessionId.value = localStorage.getItem('sessionId');
console.log(sessionId.value);

const handleState = async () => {
  try {
    const response = await axios.get('http://localhost:8080/user/state', {
      params: {
        sessionId: sessionId.value
      }
    });
    state.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const handleAddPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('Passwords do not match');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/user/addPassword', {
      password: newPassword.value
    }, {
      params: {
        sessionId: sessionId.value,
      }
    });
    console.log(response.data);
    if (response.data.status === 'OK') {
      ElMessage.success('Password added successfully');
      showPasswordDialog.value = false;
      newPassword.value = '';
      confirmPassword.value = ''; // Reset password fields
    } else {
      ElMessage.error('Failed to add password');
    }
  } catch (error) {
    console.log(error);
    ElMessage.error('An error occurred while adding the password');
  }
};

const handleLoginByGitHub = async () => {
  window.location.href = 'http://localhost:8082/oauth/authorize?sessionId=' + sessionId.value;
}

const handleLogout = async () => {
  try {
    const response = await axios.get('http://localhost:8080/auth/logout', {
      params: {
        sessionId: sessionId.value
      }
    });
    localStorage.removeItem('sessionId');
    sessionId.value = '';
    await router.push('/login');
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

// Execute on component mount
onMounted(() => {
  handleState();
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-2">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800">
        使用Session登录成功
      </h2>
      <p class="text-center text-gray-600">
        欢迎回来, {{ username }}
      </p>
      <div v-if="state == 'password'" class="flex justify-end">
        <button
            class="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="showPasswordDialog = true">
          添加密码
        </button>
      </div>
      <div v-else-if="state == 'githubLoginName'" class="flex justify-end">
        <button
            class="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="handleLoginByGitHub">
          绑定github账号
        </button>
      </div>
      <div class="flex justify-end">
        <button
            class="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="handleLogout">
          退出
        </button>
      </div>
    </div>
  </div>

  <!-- Password Dialog -->
  <el-dialog v-model="showPasswordDialog" title="添加密码" width="500" draggable>
    <div class="space-y-4">
      <!-- New Password -->
      <div class="flex items-center space-x-4">
        <label for="newPassword" class="text-sm font-medium text-gray-700">
          输入密码
        </label>
        <input v-model="newPassword" id="newPassword" name="newPassword" type="password" required
               class="w-5/6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <!-- Confirm Password -->
      <div class="flex items-center space-x-4">
        <label for="confirmPassword" class="text-sm font-medium text-gray-700">
          确认密码
        </label>
        <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" required
               class="w-5/6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddPassword">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<style scoped></style>
