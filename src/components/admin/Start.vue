<template>
  <div class="admin-start-page">
    <div class="layout-container">
      
      <LinkBox />

      <button class="start-btn base-btn default-btn animate-btn default-font" @click="handleStart">
        開始
      </button>

    </div>
  </div>
</template>

<script setup>
import { ADMIN_START } from '@/constants';
import LinkBox from '@/components/LinkBox.vue';

const emit = defineEmits([ADMIN_START]);

const handleStart = () => {
  emit(ADMIN_START);
};
</script>

<style scoped>
.admin-start-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 600px;
  gap: 10px; 
}

/* --- 開始按鈕 --- */
.start-btn {
  width: 50%; 
  min-width: 150px;
  padding: 15px 0;
  margin-top: 10px;
  
  font-size: 2rem;
  letter-spacing: 10px;
  text-indent: 10px; 
  
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
