<template>
  <div class="header-container" :class="role">
    
    <div class="app-header" :class="role">
      <div class="header-pill-wrapper relative-text-wrapper">
        <template v-if="role === ROLE.AUDIENCE">
          <button class="base-btn pill-btn animate-btn language-font default-font" @click.stop="toggleMenu">
            {{ lang === LANG.TW ? 'Language' : '語言' }}
          </button>

          <div v-if="showMenu" class="dropdown-menu">
            <div class="dropdown-item default-font" :class="{ active: lang === LANG.TW }" @click="selectLanguage(LANG.TW)">
              繁體中文
            </div>
            <div class="dropdown-item default-font" :class="{ active: lang === LANG.EN }" @click="selectLanguage(LANG.EN)">
              ENGLISH
            </div>
          </div>
        </template>
        <template v-else-if="role === ROLE.PROJECTOR">
          <div v-if="author?.Lyrics" class="projector-author-text default-font">
            {{ author.Lyrics }}
          </div>
        </template>
      </div>

      <div class="header-title-wrapper relative-text-wrapper">
        <h1 class="default-font title header-title" :class="{ 'long': title?.length >= 10, 'extra-long': title?.length >= 20 }">
          {{ title }}
        </h1>
      </div>
    
      <div class="header-pill-wrapper" :class="{ 'relative-text-wrapper': role === ROLE.PROJECTOR }">
        <template v-if="role === ROLE.AUDIENCE">
          <div v-if="time" class="base-btn pill-btn time-font" style="cursor: default;">
            {{ time }}
          </div>
          <div v-else class="header-icon-restrict base-btn pill-btn" style="cursor: default;">
            <img :src="LOGO_ICON_URL" alt="logo" style="transform: translateY(2px);" />
          </div>
        </template>
        <template v-else-if="role === ROLE.PROJECTOR">
          <div v-if="author?.Composer" class="projector-author-text default-font">
            {{ author.Composer }}
          </div>
        </template>
      </div>
    </div>

    <div v-if="role === ROLE.AUDIENCE && (author?.Lyrics || author?.Composer)" class="audience-author-row relative-text-width-wrapper default-font" :class="role">
      <span v-if="author?.Lyrics" class="author-item" style="justify-content: right;" :class="{ 'long': author.Lyrics?.length >= 10 }">{{ author.Lyrics }}</span>
      <span v-if="author?.Composer" class="author-item" style="justify-content: left;" :class="{ 'long': author.Composer?.length >= 10 }">{{ author.Composer }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { LANG, ROLE, LANG_SELECT } from '@/constants.js';
import { LOGO_ICON_URL } from '@/assets_url';

const props = defineProps({
  role: { type: String, required: true },
  lang: { type: String, default: LANG.TW },
  title: { type: String, default: '' }, 
  author: { type: Object, default: () => ({}) }, // 稍微修正了 default object 的寫法避免 Vue 噴警告
  time: { type: String, default: null }
});

const emit = defineEmits([LANG_SELECT]);

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const selectLanguage = (lang) => {
  emit(LANG_SELECT, lang);
  showMenu.value = false;
};
const closeMenu = () => {
  if (showMenu.value) showMenu.value = false;
};
onMounted(() => document.addEventListener('click', closeMenu));
onUnmounted(() => document.removeEventListener('click', closeMenu));
</script>

<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 16px; /* 標題列與下方作詞作曲的間距 */
}

.app-header {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  gap: 3%;
}
.app-header.audience {
  justify-content: space-between;
}
.app-header.projector {
  justify-content: center; 
}

.header-title {
  margin: 0;
  text-align: center;
  letter-spacing: 2px;
  line-height: 1;
}
.app-header.audience .header-title {
  font-size: clamp(16px, 15cqw, 120px);
}
.app-header.audience .header-title.long {
  font-size: clamp(16px, 10cqw, 120px);
}
.app-header.audience .header-title.extra-long {
  font-size: clamp(8px, 6cqw, 120px);
}
.app-header.projector .header-title {
  font-size: clamp(16px, 70cqh, 120px);
}

.header-pill-wrapper {
  height: 100%;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.app-header.audience .header-pill-wrapper {
  max-height: 40px;
}
.header-title-wrapper {
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-header.audience .header-title-wrapper {
  width: 100%;
  flex: 1;
}

.header-icon-restrict img {
  height: 100%;
  width: 100%;
  object-fit: scale-down;
  overflow: hidden;
}
.time-font {
  color: #d9534f;
  font-size: clamp(6px, 8cqw, 24px);
  font-weight: bold;
}

.language-font {
  color: #333;
  font-size: clamp(6px, 13cqw, 24px);
}

.pill-btn {
  width: 100%;
  aspect-ratio: 2 / 1;
  border-radius: 20px;
  line-height: 1;
  letter-spacing: 1px;
  font-size: clamp(0.5rem, 2.1vw, 0.9rem);
  overflow: hidden;
  
  -webkit-user-select: none;
  user-select: none;
  
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-menu {
  position: absolute;
  background-color: #fdfbf7; 
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  min-width: 100px;
  z-index: 1000;
  top: 100%;
  left: 0;
  margin-top: 5px;
}
.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;
  color: #333;
}
.dropdown-item:hover {
  background-color: #eee;
}
.dropdown-item.active {
  font-weight: bold;
  background-color: #e6e6e6;
}

.projector-author-text {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  font-size: clamp(16px, 40cqh, 120px);
  letter-spacing: 1px;
}

.audience-author-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10%;
  width: 100%;
}
.author-item {
  width: 45%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #000000;
  font-size: clamp(8px, 5cqw, 24px);
  letter-spacing: 0px;
}
.audience .author-item.long {
  font-size: clamp(8px, 3.8cqw, 24px);
}
</style>
