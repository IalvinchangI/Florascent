<template>
  <div class="lobby-page">
    <div class="content-container">
      
      <div class="logo-wrapper">
        <div class="img-box img-box-square img-restrict video-restrict-small serif-font title title-en">
          <!-- <img :src="LOGO_URL" alt="Florascent"/> -->
          <video autoplay loop muted playsinline>
            <source :src="LOGO_VIDEO_URL" type="video/webm">
            Florascent
          </video>
        </div>
      </div>

      <div class="text-section">
        <p class="title-tw serif-font">請選擇您的語言</p>
        <p class="title-en serif-font">Please select your language</p>
      </div>

      <div class="button-group">
        <button class="base-btn default-btn animate-btn serif-font" @click="selectLanguage(LANG.TW)">繁體中文</button>
        <button class="base-btn default-btn animate-btn serif-font" @click="selectLanguage(LANG.EN)">ENGLISH</button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { LANG, LANG_SELECT } from '@/constants.js';
import { LOGO_URL, LOGO_VIDEO_URL } from '@/assets_url';

const emit = defineEmits([LANG_SELECT]);

const selectLanguage = (lang) => {
  emit(LANG_SELECT, lang);
};
</script>

<style scoped>
.lobby-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15%;
  padding-bottom: 15%;
  padding-left: 10%;
  padding-right: 10%;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  gap: 3dvh;
}

.logo-wrapper {
  width: 70%;
  padding-bottom: 20%;
}

.text-section {
  text-align: center;
}

.button-group {
  display: flex;
  gap: 15%;
  width: 100%;
}

.button-group button {
  flex: 1;
}
</style>
