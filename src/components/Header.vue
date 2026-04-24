<template>
  <div class="app-header" :class="role">
    <div v-if="role === ROLE.AUDIENCE" class="header-pill-wrapper">
      <button class="base-btn pill-btn animate-btn" @click.stop="toggleMenu">
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
    </div>

    <div class="header-title-wrapper relative-text-wrapper">
      <h1 class="default-font title header-title" :class="{ 'long': title?.length >= 10, 'extra-long': title?.length >= 20 }">
        {{ title }}
      </h1>
    </div>
  
    <div v-if="role === ROLE.AUDIENCE" class="header-pill-wrapper">
      <div v-if="time" class="base-btn pill-btn time-display" style="cursor: default;">
        {{ time }}
      </div>
      <div v-else class="header-icon-restrict base-btn pill-btn" style="cursor: default;">
        <img :src="LOGO_ICON_URL" alt="logo" style="transform: translateY(2px);" />
      </div>
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
.app-header {
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
  font-size: clamp(16px, 15cqw, 40px);
}
.app-header.audience .header-title.long {
  font-size: clamp(16px, 10cqw, 40px);
}
.app-header.audience .header-title.extra-long {
  font-size: clamp(8px, 6cqw, 36px);
}
.app-header.projector .header-title {
  font-size: clamp(16px, 70cqh, 60px);
}

.header-pill-wrapper {
  max-height: 40px;
  width: 20%;
  display: flex;
  justify-content: center;
  position: relative;
}
.header-title-wrapper {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-icon-restrict img {
  height: 100%;
  width: 100%;
  object-fit: scale-down;
  overflow: hidden;
}
.time-display {
  color: #d9534f; 
  font-weight: bold;
}
</style>
