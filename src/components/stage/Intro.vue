<template>
  <div class="intro-page" :class="[role, { 'has-image': songData.characterLink != null }]">
    
    <Header 
      :role="role" 
      :lang="lang" 
      :title="`《${currentTitle}》`" 
      @[LANG_SELECT]="handleLangUpdate" 
    />

    <div class="layout-container">
      <div v-if="songData.characterLink != null" class="media-section">
        <div v-if="role === ROLE.AUDIENCE" class="img-box img-box-vertical img-restrict">
          <img :src="songData.characterLink" alt="Character Animation" />
        </div>
        <div v-else-if="role === ROLE.PROJECTOR" class="img-box img-box-horizontal img-restrict">
          <img :src="songData.characterLink" alt="Character Animation" />
        </div>
      </div>

      <div class="text-section default-font">
        <p v-for="(line, index) in currentDescriptionLines" :key="index">{{ line }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { LANG, ROLE, LANG_SELECT } from '@/constants.js';
import Header from '@/components/Header.vue'

const props = defineProps({
  role: String,
  lang: String,
  songData: {
    type: Object,
    required: true
  }
});
const currentTitle = computed(() => {
  if (!props.songData || !props.songData.title) {
    return '';
  }
  return props.songData.title[props.lang] || props.songData.title[LANG.TW];
});

const currentDescriptionLines = computed(() => {
  if (!props.songData || !props.songData.description) {
    return [];
  }
  const text = props.songData.description[props.lang] || props.songData.description[LANG.TW];
  return text ? text.split('\n') : [];
});

const emit = defineEmits([LANG_SELECT]);
const handleLangUpdate = (lang) => {
  emit(LANG_SELECT, lang);
};
</script>

<style scoped>
/* =========================================
   Common Style
   ========================================= */
.intro-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-section p {
  margin: 0;
}

/* =========================================
   Audience Style
   ========================================= */
.intro-page.audience {
  padding: 10% 8% 15% 8%; 
}

/* Layout Container */
.audience .layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  height: 90%;
  width: 100%;
  max-width: 500px;
  justify-content: flex-start;
  gap: 3vh; 
}

.audience .text-section {
  order: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  text-align: center;
  line-height: 2.2;
  letter-spacing: 2px;
  width: 100%;
  overflow-y: auto;
}

.audience .media-section {
  order: 2;
  flex-shrink: 0;
  max-height: 55%;
  width: 70%;
}

.audience:not(.has-image) .layout-container {
  justify-content: center;
}
.audience:not(.has-image) .text-section {
  margin-bottom: 0;
}

/* =========================================
   Projector Style
   ========================================= */
.intro-page.projector {
  padding: 5%;
  justify-content: center; 
}

.projector .layout-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between; 
  align-items: center;
  height: 65vh; 
  width: 90%;
  /* max-width: 1200px; */
  gap: 4vw;
}

.projector .media-section {
  max-height: 100%;
  display: flex;
  justify-content: center;
}

.projector .text-section {
  writing-mode: vertical-rl; 
  text-orientation: mixed;
  line-height: 2.5;
  letter-spacing: 6px;
  text-align: start; 
  height: 100%; 
  display: flex;
  flex-direction: column; 
  justify-content: center; 
}

.projector:not(.has-image) .text-section {
  flex: 1; 
  align-items: center; 
}
</style>
