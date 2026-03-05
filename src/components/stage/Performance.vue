<template>
  <div class="performance-page" :class="role">
    <div v-if="role === ROLE.AUDIENCE" class="audience-layout">
      <!-- 顯示關掉手機看表演 -->
    </div>
    <div v-else-if="role === ROLE.PROJECTOR" class="projector-layout">
      <!-- 黑屏 -->
    </div>
  </div>
</template>

<script setup>
import { LANG, ROLE } from '@/constants.js';

const props = defineProps({
  role: String,
  lang: String,
});
</script>

<style scoped>
.performance-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.projector-layout {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>