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

    <div v-if="role === ROLE.AUDIENCE" class="header-title-wrapper">
      <h1 class="header-title serif-font">{{ title }}</h1>
    </div>
    <div v-else-if="role === ROLE.PROJECTOR">
      <h1 class="header-title serif-font">{{ title }}</h1>
    </div>
  
    <div v-if="role === ROLE.AUDIENCE" class="header-pill-wrapper">
      <div v-if="time" class="base-btn pill-btn time-display" style="cursor: default;">
        {{ time }}
      </div>
      <div v-else class="header-icon-restrict base-btn pill-btn" style="cursor: default;">
        <img :src=LOGO_URL alt="logo" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { LANG, ROLE, LANG_SELECT } from '@/constants.js';
import { LOGO_URL } from '@/assets_url';

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
}
.app-header.audience {
  height: 6vh;
  max-width: 500px;
  justify-content: space-between;
  flex: 1;
  margin: 0 auto 3vh auto;
}
.app-header.projector {
  justify-content: center;
  margin-bottom: 6vh;
}

.header-title {
  margin: 0;
  height: 100%;
  width: 100%;
  font-weight: normal;
  text-align: center;
  font-size: clamp(1.2rem, 5vw, 2rem);
  letter-spacing: 2px;
}

.header-pill-wrapper {
  max-height: 40px;
  width: 20%;
  display: flex;
  justify-content: center;
  position: relative;
}
.header-title-wrapper {
  /* width: 50%; */
  display: flex;
  justify-content: center;
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
