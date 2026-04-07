<template>
  <div class="next-page" :class="role">
    
    <div v-if="role === ROLE.PROJECTOR" class="projector-container">
      
      <div class="text-group">
        <h2 class="serif-font main-text">請查看您的手機頁面</h2>
        <p class="serif-font sub-text">Please view the content on your mobile device.</p>
      </div>

      <div class="icon-box">
        <img :src=PHONE_ICON_URL alt="Check Phone" />
      </div>

    </div>

    <div v-else-if="role === ROLE.AUDIENCE" class="audience-container">
    </div>

  </div>
</template>

<script setup>
import { ROLE } from '@/constants.js';
import { PHONE_ICON_URL } from '@/assets_url';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8vh;
  text-align: center;
}

.text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 2vh; */
}
.main-text {
  font-size: 2.5rem;
  margin: 0;
  letter-spacing: 5px;
  font-weight: bold;
  color: #000;
}
.sub-text {
  font-size: 2.3rem;
  margin: 0;
  letter-spacing: 1px;
  font-weight: bold;
  color: #000;
}


.icon-box {
  max-height: 60%;
  max-width: 60%;
  opacity: 0.8; /* 稍微讓線條柔和一點，配合背景 */
}
.icon-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
