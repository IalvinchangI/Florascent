<template>
  <div class="vote-page" :class="role">
    
    <Header 
      class="header-container"
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
        <div v-if="currentPhase === 'VOTING'" class="text-row default-font relative-text-wrapper"  
          :class="{'scroll-mask-container': role === ROLE.AUDIENCE}" ref="scrollBox" @scroll="handleScroll" :style="maskStyles"
        >
          <p v-for="(line, index) in currentQuestion" :key="index" class="text-content">
            {{ line }}
          </p>
        </div>
        <div v-else-if="currentPhase === 'REGRET'" class="text-row default-font relative-text-wrapper"
          :class="{'scroll-mask-container': role === ROLE.AUDIENCE}" ref="scrollBox" @scroll="handleScroll" :style="maskStyles"
        >
          <p v-for="(line, index) in selectedOption?.regretText" :key="index" class="text-content italic-text">
            {{ line }}
          </p>
        </div>

        <!-- slots -->
        <div v-for="(option, index) in processedOptions" :key="index" class="slot-row">
          <!-- VOTING || selected -->
          <div v-if="currentPhase === 'VOTING'" 
               class="base-btn default-btn img-box-horizontal animate-btn option-button-wrapper full-size relative-text-wrapper"
               @click="!isBroken && handleOptionSelect(option, index)">
            <h3 class="option-title default-font title" :class="{ 'long': option.title.length >= 25 }">{{ option.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in option.description" :key="i">{{ line }}</p>
          </div>
          <div v-else-if="currentPhase === 'REGRET' && selectedOptionIndex !== index" class="regret-buttons-wrapper full-size">
            <div class="base-btn default-btn animate-btn img-box-horizontal option-button-wrapper half-card relative-text-wrapper" @click="cancelChoice">
              <h3 class="option-title default-font title short">{{ getUIText('back', 'title') }}</h3>
              <p class="option-desc default-font short">{{ getUIText('back', 'desc') }}</p>
            </div>
            <div class="base-btn default-btn animate-btn img-box-horizontal option-button-wrapper half-card relative-text-wrapper" @click="confirmChoice">
              <h3 class="option-title default-font title short">{{ getUIText('continue', 'title') }}</h3>
              <p class="option-desc default-font short">{{ getUIText('continue', 'desc') }}</p>
            </div>
          </div>
          <!-- REGRET && selected -->
          <div v-else class="base-btn default-btn img-box-horizontal option-button-wrapper full-size disable relative-text-wrapper">
            <h3 class="option-title default-font title" :class="{ 'long': option.title.length >= 25 }">{{ option.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in option.description" :key="i">{{ line }}</p>
          </div>
        </div>

      </div>  <!-- end (VOTING || REGRET) -->
      <div v-else-if="currentPhase === 'WAITING'" class="audience-layout">
        <!-- slot -->
        <div class="waiting-slot-row">
          <div class="base-btn default-btn img-box-horizontal option-button-wrapper full-size disable relative-text-wrapper">
            <h3 class="option-title default-font title" :class="{ 'long': selectedOption?.title.length >= 25 }">{{ selectedOption?.title }}</h3>
            <p class="option-desc default-font" v-for="(line, i) in selectedOption?.description" :key="i">{{ line }}</p>
          </div>
        </div>
        
        <!-- LOADING animation -->
        <div v-if="waitingURL !== null" class="waiting-animation-row">
          <div class="img-box-vertical video-restrict-big full-size">
            <video autoplay loop muted playsinline>
              <source :src="waitingURL_WEBM" type="video/webm">
              <source :src="waitingURL_MP4" type="video/mp4">
              Can not play animation!
            </video>
          </div>
        </div>

      </div>
    </div>

    <!-- PROJECTOR -->
    <div v-else-if="role === ROLE.PROJECTOR" class="layout-container">
      <div class="projector-layout">
        <!-- text -->
        <div class="text-row default-font relative-text-wrapper">
          <p v-for="(line, index) in currentQuestion" :key="index" class="text-content">
            {{ line }}
          </p>
        </div>

        <!-- slots -->
        <div class="slot-row">
          <div 
            v-for="(option, index) in processedOptions" :key="index" 
            class="base-btn default-btn option-button-wrapper full-size relative-text-wrapper" style="cursor: default;"
          >
            <h3 class="option-title default-font title" :class="{ 'long': option.title.length >= 25 }">{{ option.title }}</h3>
            <p v-for="(line, idx) in option.description" :key="idx" class="option-desc default-font">{{ line }}</p>
          </div>
        </div>
      </div>

      <div v-if="isBroken" class="broken-overlay">
        <div 
          v-for="i in 60" 
          :key="i" 
          class="broken-bar white" 
          :style="getRandomBarStyle()"
        ></div>
        <div 
          v-for="i in 60" 
          :key="i" 
          class="broken-bar black" 
          :style="getRandomBarStyle()"
        ></div>
      </div>
      <div v-else class="countdown-overlay img-restrict">
        <img v-if="countdownURL" :src="countdownURL">
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { LANG, ROLE, LANG_SELECT, OPTION_SELECT, VOTE_SELECTED_OPTION_KEY } from '@/constants.js';
import Header from '@/components/Header.vue';
import { GetWaitingLink, GetTitle, GetQuestion, GetOptions, GetCanRegret, GetIsBroken } from '@/utils/song_data_logic';
import { GetCountdownSecondLink, PreloadtCountdownSecondLink, ChangeVideoUrlFormat } from '@/utils/assets_tools';
import { CalculateScrollMaskStyle } from '@/utils/style_tools';

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
const selectedOption = computed(() => {
  if (selectedOptionIndex.value === null) return null;
  return processedOptions.value[selectedOptionIndex.value];
});

const waitingURL = computed(() => {
  return GetWaitingLink(props.songData);
});
const waitingURL_WEBM = computed(() => {
  return ChangeVideoUrlFormat(waitingURL.value, "webm");
});
const waitingURL_MP4 = computed(() => {
  return ChangeVideoUrlFormat(waitingURL.value, "mp4");
});
console.log(waitingURL_MP4);

const countdownURL = computed(() => {
  return GetCountdownSecondLink(props.time);
});

const isBroken = computed(() => {
  return GetIsBroken(props.songData);
});

// Helper Function
const getUIText = (key, field) => {
  return uiLabels[key][field][props.lang] || uiLabels[key][field][LANG.TW];
};

const getRandomBarStyle = () => {
  // Positions (0% to 100%)
  const top = Math.random() * 100 + '%';
  const left = Math.random() * 100 + '%';
  
  // Size: 黑色長方形，我們讓 width 隨機，height 較細
  const width = Math.random() * 700 + 10 + 'px'; // 隨機長度 (10px to 710px)
  const height = Math.random() * 20 + 10 + 'px';  // 較細的水平線 (10px to 30px)
  
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

const getSavedVotes = () => {
  const savedString = sessionStorage.getItem(VOTE_SELECTED_OPTION_KEY);
  return savedString ? JSON.parse(savedString) : {};
};
const checkSavedVote = () => {
  if (props.role !== ROLE.AUDIENCE || props.songData?.index == null) return;
  
  const votes = getSavedVotes();
  const savedVoteIndex = votes[props.songData.index]; // 直接用 index 查字典

  // 檢查是否有存檔 (注意：要用 !== undefined，因為 index 可能是 0)
  if (savedVoteIndex !== undefined) {
    selectedOptionIndex.value = savedVoteIndex;
    currentPhase.value = 'WAITING';
  } else {
    selectedOptionIndex.value = null;
    currentPhase.value = 'VOTING';
  }
};

// Actions
const handleOptionSelect = (option, index) => {
  selectedOptionIndex.value = index; 
  
  if (GetCanRegret(props.songData)) {
    currentPhase.value = 'REGRET';
  } else {
    confirmChoice();
  }
};

const confirmChoice = () => {
  currentPhase.value = 'WAITING';

  if (props.songData?.index != null) {
    const votes = getSavedVotes(); // 先抓出舊紀錄
    votes[props.songData.index] = selectedOptionIndex.value; // 更新這首歌的紀錄
    sessionStorage.setItem(VOTE_SELECTED_OPTION_KEY, JSON.stringify(votes)); // 轉回字串存進去
  }

  emit(OPTION_SELECT, selectedOption.value);
};

const cancelChoice = () => {
  selectedOptionIndex.value = null;
  currentPhase.value = 'VOTING';
};

const handleLangUpdate = (lang) => {
  emit(LANG_SELECT, lang);
};

// Scroll Mask
const scrollBox = ref(null);
const maskStyles = ref({});

// 處理滾動事件
const handleScroll = () => {
  if (props.role === ROLE.AUDIENCE) {
    maskStyles.value = CalculateScrollMaskStyle(scrollBox.value);
  } else {
    maskStyles.value = {};
  }
};


onMounted(async () => {
  if (props.role === ROLE.PROJECTOR) {
    await nextTick(); // 確保 DOM 渲染完畢
    handleScroll();   // 執行一次以套用初始遮罩狀態
    PreloadtCountdownSecondLink();
  }
});
watch(() => props.songData?.index, (newId) => {
  if (newId != null) {
    checkSavedVote();
  }
}, { immediate: true });
</script>

<style scoped>
.vote-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.option-title {
  margin: 0 5% 0.5em 5%;
  font-size: clamp(12px, 6cqw, 120px);
}
.option-title.short {
  font-size: clamp(12px, 12cqw, 120px);
}
.option-title.long {
  font-size: clamp(12px, 4.7cqw, 120px);
}
.option-desc {
  margin: 0 5%;
  font-size: clamp(8px, 4.5cqw, 80px);
}
.option-desc.short {
  font-size: clamp(8px, 9cqw, 80px);
}

.text-content {
  width: 100%;
  text-align: center;
}

/* ================== Audience Fixed Layout ================== */
.vote-page.audience {
  padding: 10% 8% 15% 8%;
}

.audience .header-container {
  height: 7%;
  width: 100%;
}
.audience .layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  height: 90%;
  width: 100%;
  justify-content: flex-start;
}

.audience-layout {
  width: 100%;
  height: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3%;
}

.audience-layout .text-row {
  flex: 1;
  max-height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.audience-layout .slot-row {
  height: 25%;
  width: 100%;
}

.audience-layout .text-content {
  line-height: 1.5;
  font-size: clamp(8px, 6cqh, 120px);
  margin: 0.5em 0;
}

.italic-text {
  font-style: italic;
  text-align: center;
  color: #000000;
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
  padding: 4.5%;
}

.projector .header-container {
  height: 10%;
  width: 100%;
}
.projector .layout-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  height: 88%;
  width: 100%;
  /* max-width: 1200px; */
}

.projector-layout {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5%;
}

.projector-layout .text-row {
  flex: 1;
  width: 100%;
  text-align: center;
  /* font-size: 1.5rem; */
  line-height: 2;
  letter-spacing: 3px;
  overflow-y: hidden;
}
.projector-layout .slot-row {
  height: 45%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3%;
}
.projector-layout .text-content {
  line-height: 2;
  font-size: clamp(8px, 8.5cqh, 120px);
  margin: 0;
}

.countdown-overlay {
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
