<template>
  <div class="loading-overlay relative-text-wrapper">
    <div class="loading-content">
      
      <div class="spinner-box">
        <div class="inner-square"></div>
      </div>

      <p class="loading-text default-font">
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
  gap: 5cqmin;
}

/* --- 方塊動畫 --- */
.spinner-box {
  width: 15cqmin;
  height: 15cqmin;
  border: 0.3cqmin solid #333;
  border-radius: 2.4cqmin;
  display: flex;
  justify-content: center;
  align-items: center;

  animation: rotate-scale 3s infinite ease-in-out;
}

.inner-square {
  width: 6cqmin;
  height: 6cqmin;
  background-color: #333;
  border-radius: 0.6cqmin;
  opacity: 0.8;
  
  /* 內部方塊反向旋轉 */
  animation: rotate-reverse 3s infinite ease-in-out;
}

/* --- 文字動畫 --- */
.loading-text {
  font-size: clamp(8px, 4.5cqmin, 120px);
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
