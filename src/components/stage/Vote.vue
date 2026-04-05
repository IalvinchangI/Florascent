<template>
  <div class="vote-page" :class="role">
    
    <Header 
      :role="role" 
      :lang="lang" 
      :title="(currentPhase === 'WAITING') ? null : `《${currentTitle}》`" 
      :time="props.time"
      @[LANG_SELECT]="handleLangUpdate" 
    />

    <!-- AUDIENCE -->
    <div v-if="role === ROLE.AUDIENCE" class="layout-container">
      <div v-if="currentPhase === 'VOTING' || currentPhase === 'REGRET'" class="audience-layout">
        <!-- text -->
        <div v-if="currentPhase === 'VOTING'" class="text-row default-font">
          <p v-for="(line, index) in currentQuestion" :key="index" class="text-content">
            {{ line }}
          </p>
        </div>
        <div v-else-if="currentPhase === 'REGRET'" class="text-row default-font">
          <p v-for="(line, index) in getOptionRegretText(selectedOption)" :key="index" class="text-content italic-text">
            {{ line }}
          </p>
        </div>

        <!-- slots -->
        <div v-for="(option, index) in songData.options" :key="index" class="slot-row">
          <!-- VOTING || selected -->
          <div v-if="currentPhase === 'VOTING'" class="base-btn default-btn animate-btn img-box-horizontal option-button-wrapper full-size" @click="handleOptionSelect(option, index)">
            <h3 class="option-title serif-font title">{{ getOptionTitle(option) }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in getOptionDescriptoin(option)" :key="i">{{ line }}</p>
          </div>
          <div v-else-if="currentPhase === 'REGRET' && selectedOptionIndex !== index" class="regret-buttons-wrapper full-size">
            <div class="base-btn default-btn animate-btn img-box-horizontal option-button-wrapper half-card" @click="cancelChoice">
              <h3 class="option-title serif-font title">{{ getUIText('back', 'title') }}</h3>
              <p class="option-desc default-font">{{ getUIText('back', 'desc') }}</p>
            </div>
            <div class="base-btn default-btn animate-btn img-box-horizontal option-button-wrapper half-card" @click="confirmChoice">
              <h3 class="option-title serif-font title">{{ getUIText('continue', 'title') }}</h3>
              <p class="option-desc default-font">{{ getUIText('continue', 'desc') }}</p>
            </div>
          </div>
          <!-- REGRET && selected -->
          <div v-else class="base-btn default-btn img-box-horizontal option-button-wrapper full-size disable">
            <h3 class="option-title serif-font title">{{ getOptionTitle(option) }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in getOptionDescriptoin(option)" :key="i">{{ line }}</p>
          </div>
        </div>

      </div>  <!-- end (VOTING || REGRET) -->
      <div v-else-if="currentPhase === 'WAITING'" class="audience-layout">
        <!-- slot -->
        <div class="waiting-slot-row">
          <div class="base-btn default-btn img-box-horizontal option-button-wrapper full-size disable">
            <h3 class="option-title serif-font title">{{ getOptionTitle(selectedOption) }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in getOptionDescriptoin(selectedOption)" :key="i">{{ line }}</p>
          </div>
        </div>
        
        <!-- LOADING animation -->
        <div class="waiting-animation-row">
          <div class="img-box img-box-vertical img-restrict full-size">
            <img src="@/assets/images/character.png" alt="LOADING..." />
          </div>
        </div>

      </div>
    </div>

    <!-- PROJECTOR -->
    <div v-else-if="role === ROLE.PROJECTOR" class="layout-container">
      <div class="projector-layout">
        <!-- text -->
        <div class="text-row default-font">
          <p v-for="(line, index) in currentQuestion" :key="index" class="text-content">
            {{ line }}
          </p>
        </div>

        <!-- slots -->
        <div class="slot-row">
          <div v-for="(option, index) in songData.options" :key="index" class="base-btn default-btn option-button-wrapper full-size" style="cursor: default;">
            <h3 class="option-title serif-font title">{{ getOptionTitle(option) }}</h3>
            <p v-for="(line, idx) in getOptionDescriptoin(option)" :key="idx" class="option-desc default-font">{{ line }}</p>
          </div>
        </div>
      </div>

      <div class="video-overlay">
        <!-- TODO video -->
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { LANG, ROLE, LANG_SELECT, OPTION_SELECT } from '@/constants.js';
import Header from '@/components/Header.vue';

const props = defineProps({
  role: String,
  lang: String,
  songData: { type: Object, required: true }, 
  time: String
});
const uiLabels = {
  continue: {
    title: { [LANG.TW]: '繼續', [LANG.EN]: 'Continue' },
    desc:  { [LANG.TW]: '這就是我想要的', [LANG.EN]: 'Confirm Choice' }
  },
  back: {
    title: { [LANG.TW]: '返回', [LANG.EN]: 'Back' },
    desc:  { [LANG.TW]: '再讓我選一次', [LANG.EN]: 'Choose Again' }
  }
};

const emit = defineEmits([LANG_SELECT, OPTION_SELECT]);

// State
const currentPhase = ref('VOTING');
const selectedOption = ref(null);
const selectedOptionIndex = ref(null);

// Computed
const currentTitle = computed(() => {
  if (!props.songData?.title) return '';
  return props.songData.title[props.lang] || props.songData.title[LANG.TW];
});

const currentQuestion = computed(() => {
  if (!props.songData?.question) return [];
  const text = props.songData.question[props.lang] || props.songData.question[LANG.TW];
  return text ? text.split('\n') : [];
});

const getOptionMultiText = (option, field) => {
  if (!option || !option[field]) return [];
  const text = option[field][props.lang] || option[field][LANG.TW];
  return text ? text.split('\n') : [];
};
const getOptionTitle = (option) => {
  if (!option || !option.title) return '';
  return option.title[props.lang] || option.title[LANG.TW];
}
const getOptionDescriptoin = (option) => getOptionMultiText(option, 'description');
const getOptionRegretText = (option) => getOptionMultiText(option, 'regretText');
const getUIText = (key, field) => {
  return uiLabels[key][field][props.lang] || uiLabels[key][field][LANG.TW];
};

// Actions
const handleOptionSelect = (option, index) => {
  selectedOption.value = option;
  selectedOptionIndex.value = index; 
  
  if (props.songData.canRegret) {
    currentPhase.value = 'REGRET';
  } else {
    confirmChoice();
  }
};

const confirmChoice = () => {
  currentPhase.value = 'WAITING';
  emit(OPTION_SELECT, selectedOption.value);
};

const cancelChoice = () => {
  selectedOption.value = null;
  selectedOptionIndex.value = null;
  currentPhase.value = 'VOTING';
};

const handleLangUpdate = (lang) => {
  emit(LANG_SELECT, lang);
};
</script>

<style scoped>
.vote-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-title {
  margin: 0 0 5px 0;
}
.option-desc { 
  margin: 0;
  font-weight: bold;
}

/* ================== Audience Fixed Layout ================== */
.vote-page.audience {
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
}

.audience-layout {
  width: 100%;
  height: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.audience-layout .text-row {
  height: 45%; 
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
.audience-layout .slot-row {
  height: 25%;
  width: 100%;
}

.text-content {
  width: 100%;
  text-align: center;
  line-height: 1.8;
  margin: 0;
}

.italic-text {
  font-style: italic;
  text-align: center;
  color: #444;
}

.option-button-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.option-button-wrapper.disable {
  cursor: default;
  background-color: transparent;
}
.regret-buttons-wrapper {
  display: flex;
  gap: 15px;
}

.full-size {
  width: 100%;
  height: 100%;
}
.half-card {
  flex: 1;
  height: 100%;
  aspect-ratio: auto;
}

/* WAITING */
.waiting-slot-row {
  height: 25%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.waiting-animation-row {
  height: 70%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.waiting-animation-row .full-size {
  height: auto;
  width: 90%;
}

/* ================== Projector ================== */
.vote-page.projector {
  padding: 5%;
  justify-content: center;
}

/* Layout Container */
.projector .layout-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  height: 90%;
  width: 100%;
  max-width: 1200px;
  gap: 4vw;
}

.projector-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.projector-layout .text-row {
  height: 48%;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  line-height: 2;
  letter-spacing: 3px;
  overflow-y: hidden;
}
.projector-layout .slot-row {
  height: 48%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4vw;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}
</style>
