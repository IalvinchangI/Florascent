<template>
  <div class="loading-overlay">
    <div class="loading-content">
      
      <div class="spinner-box">
        <div class="inner-square"></div>
      </div>

      <p class="loading-text serif-font">
        Loading<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </p>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loading-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(245, 239, 202, 0.9); */
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* --- 方塊動畫 --- */
.spinner-box {
  width: 50px;
  height: 50px;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  animation: rotate-scale 3s infinite ease-in-out;
}

.inner-square {
  width: 20px;
  height: 20px;
  background-color: #333;
  border-radius: 2px;
  opacity: 0.8;
  
  /* 內部方塊反向旋轉 */
  animation: rotate-reverse 3s infinite ease-in-out;
}

/* --- 文字動畫 --- */
.loading-text {
  font-size: 1.2rem;
  color: #333;
  letter-spacing: 2px;
  margin: 0;
  font-weight: bold;
}

/* 讓三個點點依序跳動 */
.dot {
  opacity: 0;
  animation: dot-fade 1.5s infinite;
}
.dot:nth-child(1) { animation-delay: 0.0s; }
.dot:nth-child(2) { animation-delay: 0.5s; }
.dot:nth-child(3) { animation-delay: 1.0s; }

/* --- Keyframes 定義 --- */
@keyframes rotate-scale {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); } /* 中間變大一點 */
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes rotate-reverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); } /* 反向轉 */
}

@keyframes dot-fade {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
