<template>
  <Loading v-if="isLoading === true" :style="backgroundStyle" />
  <div v-else class="sign-in-page" :style="backgroundStyle">
    <div class="layout-container">

      <div v-if="!isError" class="login-box base-btn default-btn ">
        <div class="input-box base-btn default-btn cursor-text animate-btn">
          <input 
            type="text" 
            v-model="form.account"
            class="real-input serif-font"
            placeholder="帳號"
          />
          <div class="icon-placeholder"></div>
        </div>

        <div class="input-box base-btn default-btn  cursor-text animate-btn">
          <input 
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            class="real-input serif-font"
            placeholder="密碼"
            @keyup.enter="handleLogin"
          />
          
          <div class="icon-wrapper" @click="togglePassword" :title="showPassword ? '隱藏密碼' : '顯示密碼'">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </div>
        </div>

        <button class="action-btn base-btn default-btn animate-btn serif-font" @click="handleLogin">
          登入
        </button>
      </div>

      <div v-else class="error-container base-btn default-btn ">
        <div class="warning-text default-font">
          <p>觀眾請坐在觀眾席</p>
          <p>好好欣賞表演</p>
        </div>

        <button class="retry-btn base-btn default-btn animate-btn serif-font" @click="handleRetry">
          重試
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';

import Loading from './Loading.vue';
import router from '@/router';
import { auth } from '@/firebase';
import { GetBackgroundStyle } from '@/utils/assets_tools';

const route = useRoute();

const backgroundStyle = GetBackgroundStyle(null, true, "horizontal");

// 狀態管理
const isError = ref(false); 
const showPassword = ref(false);
const isLoading = ref(false);

const form = reactive({
  account: '',
  password: ''
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!form.account || !form.password) {
    return;
  }

  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(auth, form.account, form.password);
    
    // success
    const redirectPath = route.query.redirect || '/admin';
    router.push(redirectPath);

  } catch (error) {
    // failed
    console.error("Login failed:", error);
    
    isError.value = true;
    form.password = ''; 
  } finally {
    isLoading.value = false;
  }
};

const handleRetry = () => {
  isError.value = false;
};
</script>

<style scoped>
.sign-in-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40%;
  width: 30%;
  min-height: 320px;
  min-width: 400px;
}

/* --- 通用設定 --- */
.cursor-text {
  cursor: text !important;
}

/* --- 1. 大外框 (Login Box & Error Container) --- */
/* 將原本分散的樣式統一，讓 Sign In 和 Retry 外框一致 */
.login-box, .error-container {
  width: 100%;
  height: 100%;
  padding: 40px 30px;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 內容垂直置中 */
  gap: 25px;
  
  cursor: default;
}

/* Error 狀態需要內容撐開 */
.error-container {
  gap: 20%;
  padding: 60px 30px 40px 30px;
}


/* --- 輸入框區塊 --- */
.input-box {
  width: 100%;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.real-input {
  flex: 1;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.5rem;
  text-align: center;
  color: #000;
  padding-left: 24px;
}
.real-input::placeholder {
  color: #aaa;
  font-size: 1.2rem;
}

/* --- Icon 設定 --- */
.icon-wrapper {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: opacity 0.2s;
}
.icon-wrapper:hover {
  opacity: 0.7;
}

.icon-placeholder {
  width: 24px;
}

/* --- 按鈕樣式 --- */
.action-btn, .retry-btn {
  width: 50%;
  min-width: 120px;
  font-size: 1.5rem;
  padding: 10px 0;
  margin-top: 10px;
}

/* --- 文字樣式 --- */
.warning-text {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 2;
}
.warning-text p {
  margin: 0;
}
</style>
