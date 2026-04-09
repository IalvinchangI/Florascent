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
          <p v-for="(line, index) in selectedOption?.regretText" :key="index" class="text-content italic-text">
            {{ line }}
          </p>
        </div>

        <!-- slots -->
        <div v-for="(option, index) in processedOptions" :key="index" class="slot-row">
          <!-- VOTING || selected -->
          <div v-if="currentPhase === 'VOTING'" 
               class="base-btn default-btn img-box-horizontal animate-btn option-button-wrapper full-size"
               @click="!isBroken && handleOptionSelect(option, index)">
            <h3 class="option-title serif-font title">{{ option.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in option.description" :key="i">{{ line }}</p>
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
            <h3 class="option-title serif-font title">{{ option.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in option.description" :key="i">{{ line }}</p>
          </div>
        </div>

      </div>  <!-- end (VOTING || REGRET) -->
      <div v-else-if="currentPhase === 'WAITING'" class="audience-layout">
        <!-- slot -->
        <div class="waiting-slot-row">
          <div class="base-btn default-btn img-box-horizontal option-button-wrapper full-size disable">
            <h3 class="option-title serif-font title">{{ selectedOption?.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in selectedOption?.description" :key="i">{{ line }}</p>
          </div>
        </div>
        
        <!-- LOADING animation -->
        <div v-if="waitingURL !== null" class="waiting-animation-row">
          <div class="img-box img-box-vertical img-restrict full-size">
            <img :src="waitingURL" alt="LOADING..." />
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
          <div v-for="(option, index) in processedOptions" :key="index" class="base-btn default-btn option-button-wrapper full-size" style="cursor: default;">
            <h3 class="option-title serif-font title">{{ option.title }}</h3>
            <p v-for="(line, idx) in option.description" :key="idx" class="option-desc default-font">{{ line }}</p>
          </div>
        </div>
      </div>

      <div v-if="isBroken" class="broken-overlay">
        <div 
          v-for="i in 15" 
          :key="i" 
          class="broken-bar white" 
          :style="getRandomBarStyle()"
        ></div>
        <div 
          v-for="i in 25" 
          :key="i" 
          class="broken-bar black" 
          :style="getRandomBarStyle()"
        ></div>
      </div>
      <div v-else class="video-overlay">
        <!-- TODO video -->
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { LANG, ROLE, LANG_SELECT, OPTION_SELECT } from '@/constants.js';
import Header from '@/components/Header.vue';
import { GetWaitingLink, GetTitle, GetQuestion, GetOptions, GetCanRegret, GetIsBroken } from '@/utils/song_data_logic'; 

const props = defineProps({
  role: String,
  lang: String,
  songData: { type: Object, required: true }, 
  currentRoute: { type: Number, default: 0 },
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
  return GetTitle(props.songData, props.lang);
});

const currentQuestion = computed(() => {
  return GetQuestion(props.songData, props.lang, props.currentRoute);
});

const processedOptions = computed(() => {
  return GetOptions(props.songData, props.lang);
});

const waitingURL = computed(() => {
  return GetWaitingLink(props.songData);
});

const isBroken = computed(() => {
  return GetIsBroken(props.songData);
});

const getUIText = (key, field) => {
  return uiLabels[key][field][props.lang] || uiLabels[key][field][LANG.TW];
};

const getRandomBarStyle = () => {
  // Positions (0% to 100%)
  const top = Math.random() * 100 + '%';
  const left = Math.random() * 100 + '%';
  
  // Size: 黑色長方形，我們讓 width 隨機，height 較細
  const width = Math.random() * 500 + 200 + 'px'; // 隨機長度 (200px to 400px)
  const height = Math.random() * 5 + 30 + 'px';  // 較細的水平線 (50px to 55px)
  
  // Animation Delay: 負的 delay 可以讓動畫 stagger 開來，看起來像隨機閃爍
  const delay = Math.random() * -3 + 's'; 

  return {
    top,
    left,
    '--base-width': width,
    height,
    animationDelay: delay, // Staggered start
  };
};

// Actions
const handleOptionSelect = (option, index) => {
  selectedOption.value = option;
  selectedOptionIndex.value = index; 
  
  if (GetCanRegret(props.songData)) {
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

/* =========================================
   Broken Overlay Style & Animation
   ========================================= */

.broken-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 使用者無法操作 */
  overflow: hidden;    /* 黑色方塊變長時不會溢出螢幕 */
  background-color: rgba(0, 0, 0, 0.4);
  /* z-index: 9999; */
}

.broken-bar {
  position: absolute;
  opacity: 0; /* 預設為全透明 */

  width: var(--base-width);
  
  /* 在同位置閃爍，閃爍時鐘建有幾幀長方形會變長 */
  /* 動畫名稱 | 時長 | 無限循環 | 線性 */
  animation: broken-bar-flicker 1.5s infinite linear;
}
.broken-bar.white {
  background-color: rgb(140, 140, 140);
}
.broken-bar.black {
  background-color: rgb(31, 31, 31);
}

@keyframes broken-bar-flicker {
  /* 隨機閃爍效果，利用快速切換透明度 */
  0%   { opacity: 0; }
  5%   { opacity: 0.5; }
  10%  { opacity: 0; }
  15%  { opacity: 1; }
  20%  { opacity: 0; }
  25%  { opacity: 0.7; }
  30%  { opacity: 0; }
  35%  { opacity: 1; }

  /* 瞬間變為滿版長度 */
  39%  { opacity: 0.7; width: var(--base-width); }
  40%  { opacity: 1; width: calc(var(--base-width) + 300px); }
  42%  { opacity: 0.7; width: calc(var(--base-width) + 300px); }
  43%  { opacity: 1; width: var(--base-width); }
  
  50%  { opacity: 0; }
  100% { opacity: 0; } /* 長時間的黑暗，模擬Sporadic閃爍 */
}
</style>
