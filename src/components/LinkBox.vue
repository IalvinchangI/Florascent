<template>
  <div class="link-box base-btn default-btn">
    
    <input 
      type="text" 
      class="url-input serif-font" 
      readonly 
      :value="projectorUrl"
      @click="selectAll" 
    />
    
    <div class="copy-icon-wrapper" @click="copyToClipboard" title="複製連結">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </div>

  </div>

  <div class="feedback-container">
      <div class="feedback-msg default-font" :class="{ visible: showCopiedMsg }">
      已複製！
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  projectorUrl: {
    type: String,
    default: window.location.origin + '/?role=projector' 
  }
});
const showCopiedMsg = ref(false);

const selectAll = (e) => {
  e.target.select();
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.projectorUrl);
    triggerFeedback();
  } catch (err) {
    console.error('Copy failed', err);
    alert('請手動複製連結');
  }
};

const triggerFeedback = () => {
  showCopiedMsg.value = true;
  setTimeout(() => {
    showCopiedMsg.value = false;
  }, 2000);
};
</script>

<style scoped>
/* --- 連結區塊樣式 --- */
.link-box {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: default;
}

.url-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.5rem;
  color: #000;
  text-align: center;
  width: 100%;
  transform: translateY(2px); 
}

.copy-icon-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  margin-left: 10px;
  color: #333;
}

.copy-icon-wrapper:hover {
  background-color: rgba(0,0,0,0.05);
}

.copy-icon-wrapper:active {
  transform: scale(0.95);
  background-color: rgba(0,0,0,0.1);
}

/* --- 提示文字容器 --- */
.feedback-container {
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}

.feedback-msg {
  color: #555;
  font-weight: bold;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease-out;
  font-size: 1rem;
  padding: 0px 5px;
  border-radius: 5px;
  background-color: rgba(0,0,0,0.05);
}

.feedback-msg.visible {
  opacity: 1;
  transform: translateY(0); /* 上浮效果 */
}
</style>
