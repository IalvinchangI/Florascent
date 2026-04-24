<template>
  <div class="next-page" :class="role">
    
    <div v-if="role === ROLE.PROJECTOR" class="projector-container">
      
      <div class="text-group relative-text-width-wrapper">
        <h2 class="default-font main-text">請查看您的手機頁面</h2>
        <p class="default-font sub-text">Please view the content on your mobile device.</p>
      </div>

      <div class="icon-box">
        <div class="phone-icon"></div>
      </div>

    </div>

    <div v-else-if="role === ROLE.AUDIENCE" class="audience-container">
    </div>

  </div>
</template>

<script setup>
import { ROLE } from '@/constants.js';

const props = defineProps({
  role: String,
  lang: String
});
</script>

<style scoped>
.next-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* =========================================
   Projector Style
   ========================================= */
.projector-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6vh;
  text-align: center;
}

.text-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5vh;
}
.main-text {
  font-size: clamp(24px, 3.3cqw, 120px);
  margin: 0;
  letter-spacing: 5px;
  font-weight: bold;
  color: #000;
}
.sub-text {
  font-size: clamp(20px, 3cqw, 110px);
  margin: 0;
  letter-spacing: 1px;
  font-weight: bold;
  color: #000;
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  padding: 20px;
}

/* =========================================
   CSS Phone Icon & Animation
   ========================================= */
.phone-icon {
  width: 230px;
  height: 350px;
  border: 12px solid #000;
  border-radius: 24px;
  position: relative;
  animation: vibrate-phone 5s infinite ease-in-out;
}

.phone-icon::before {
  content: '';
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #000;
  border-radius: 50%;
}

/* 手機偶爾震動的 Keyframes */
@keyframes vibrate-phone {
  /* 0% 到 85% 保持靜止 (約 4.25 秒) */
  0%, 85% { transform: translate(0) rotate(0deg); }
  
  /* 85% 到 95% 進行快速震動 */
  87% { transform: translate(-4px, 0) rotate(-4deg); }
  89% { transform: translate(4px, 0) rotate(4deg); }
  91% { transform: translate(-4px, 0) rotate(-4deg); }
  93% { transform: translate(4px, 0) rotate(4deg); }
  
  /* 95% 到 100% 回歸靜止 */
  95%, 100% { transform: translate(0) rotate(0deg); }
}
</style>
