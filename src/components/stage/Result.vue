<template>
  <div class="result-page" :class="role">
    
    <div v-if="role === ROLE.AUDIENCE" class="audience-layout">
      <div class="text-row">
        <h2 class="default-font title option-title" style="margin: 0;">{{ uiText.musicStarting }}</h2>
        <p class="default-font" style="margin: 5px;">{{ uiText.silenceDevices }}</p>
      </div>

      <div class="animation-row">
        <div class="img-box-vertical img-restrict-big video-restrict-big" style="width: 100%;">
          <img v-if="waitingURL !== null" :src="waitingURL" alt="LOADING..." />
          <!-- <video autoplay loop muted playsinline>
            <source :src="waitingURL_WEBM" type="video/webm">
            <source :src="waitingURL_MP4" type="video/mp4">
            Can not play animation!
          </video> -->
        </div>
      </div>

      <div class="text-row">
        <p class="default-font" style="margin: 5px;">{{ uiText.screenOffHint }}</p>
        <p class="default-font" style="margin: 5px;">{{ uiText.dontClose }}</p>
      </div>

      <div v-if="isBroken" class="broken-overlay">
        <div 
          v-for="i in 40" 
          :key="'w'+i" 
          class="broken-bar color0" 
          :style="GetRandomBarStyle()"
        ></div>
        <div 
          v-for="i in 40" 
          :key="'r'+i" 
          class="broken-bar color1" 
          :style="GetRandomBarStyle()"
        ></div>
        <div 
          v-for="i in 40" 
          :key="'b'+i" 
          class="broken-bar color2" 
          :style="GetRandomBarStyle()"
        ></div>
        <div 
          v-for="i in 20" 
          :key="'t'+i" 
          class="broken-bar" 
          :style="GetRandomBarStyle()"
        >{{uiText.screenOffHint}}</div>
        <div 
          v-for="i in 20" 
          :key="'t'+i" 
          class="broken-bar" 
          :style="GetRandomBarStyle()"
        >
          <span style="opacity: 0.5;">asorg[apq4wiv- queohsdkfjnsduifhg0aejrtpskd;lbnao'df[ihbs]]</span>
        </div>
      </div>
    </div>

    <div v-else-if="role === ROLE.PROJECTOR" class="projector-layout">
      
      <div class="bars-container relative-text-wrapper" :class="currentPhase">
        <div 
          v-for="(option, index) in processedOptions" 
          :key="index"
          class="bar-wrapper"
          :class="{ 
            'is-winner': isWinnerPhase && (winnerId === option.id), 
            'is-loser':  isWinnerPhase && (winnerId !== null && winnerId !== option.id)
          }"
          :style="getBarWrapperStyle(option)"
        >
          <div class="base-btn default-btn option-card">
            <h3 
              class="default-font title option-title" 
              :style="{ fontSize: getDynamicFontSize(option.id, 'title') }"
            >
              {{ option.title }}
            </h3>
            
            <div 
              class="percentage-text default-font"
              :style="{ fontSize: getDynamicFontSize(option.id, 'percent') }"
            >
              {{ animatedDisplayMap[option.id] }}%
            </div>
          </div>
        </div>
      </div>

      <div v-if="isTie && (currentPhase !== 'INITIAL')" class="tie-explanation fade-in">
        <p class="default-font">{{ uiText.tieBreakerNote }}</p>
      </div>

      <div class="blackout-overlay" :class="{ 'active': currentPhase === 'BLACKOUT' }"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { LANG, ROLE, RESULT_TRANSITION_TIMING } from '@/constants.js';
import { GetWaitingLink, GetOptions, GetIsBroken } from '@/utils/song_data_logic';
import { GetRandomBarStyle } from '@/utils/style_tools';
import { ChangeVideoUrlFormat } from '@/utils/assets_tools';

const props = defineProps({
  role: String,
  lang: String,
  songData: { type: Object, required: true },
  voteResult: { type: Array, required: true }
});

/* CONST */
const FONT_CONFIG = {
  TITLE_BASE: 2.5, 
  PERCENT_BASE: 3.0, 
  MAX_SCALE: 1.2
};
const currentPhase = ref('INITIAL'); 
const animatedDisplayMap = reactive({});

/* DATA */
const processedOptions = computed(() => {
  const baseOptions = GetOptions(props.songData, props.lang);
  
  return baseOptions.map((option, index) => {
    const result = props.voteResult[index] || { winner: false, percent: 50 }; 
    return { 
      ...option, 
      id: index,
      percentage: result.percent,
      isWinner: result.winner
    };
  });
});

const isBroken = computed(() => {
  return GetIsBroken(props.songData);
});

processedOptions.value.forEach(opt => {
  animatedDisplayMap[opt.id] = 50;
});

const waitingURL = computed(() => {
  return GetWaitingLink(props.songData);
});
// const waitingURL_WEBM = computed(() => {
//   return ChangeVideoUrlFormat(waitingURL.value, "webm");
// });
// const waitingURL_MP4 = computed(() => {
//   return ChangeVideoUrlFormat(waitingURL.value, "mp4");
// });

const winnerId = computed(() => {
  const winnerOption = processedOptions.value.find(opt => opt.isWinner);
  return winnerOption ? winnerOption.id : null;  
});
const isTie = computed(() => {
  const [opt1, opt2] = processedOptions.value;
  if (!opt1 || !opt2) return false;
  return opt1.percentage === opt2.percentage;
});
const isWinnerPhase = computed(() => {
  return currentPhase.value === 'WINNER' || currentPhase.value === 'BLACKOUT';
});

/* TIMER */
onMounted(() => {
  if (props.role === ROLE.PROJECTOR) {
    runProjectorAnimationSequence();
  }
});
const runProjectorAnimationSequence = () => {
  setTimeout(() => {  // Phase 1: REVEAL
    currentPhase.value = 'REVEAL';
    animateNumbers(); 

    setTimeout(() => {  // Phase 2: WINNER
      currentPhase.value = 'WINNER';
      
      setTimeout(() => {  // Phase 3: BLACKOUT
        currentPhase.value = 'BLACKOUT';
      }, RESULT_TRANSITION_TIMING.WINNER_HOLD);
    }, RESULT_TRANSITION_TIMING.REVEAL_DURATION);
  }, RESULT_TRANSITION_TIMING.INITIAL_HOLD);
};

/* UI size */
const getBarWrapperStyle = (option) => {
  const style = {};
  if (currentPhase.value === 'INITIAL') {
    style.width = '50%';
  } else if (currentPhase.value === 'REVEAL') {
    style.width = `${option.percentage}%`;
  }
  // WINNER 階段由 CSS class 控制
  return style;
};
const getDynamicFontSize = (id, type) => {
  const currentVal = animatedDisplayMap[id] || 0;
  let scale = 1.0;

  if (currentVal <= 50) {
    scale = currentVal / 50;
  } else {
    const extraRatio = (currentVal - 50) / 50;
    scale = 1.0 + extraRatio * (FONT_CONFIG.MAX_SCALE - 1.0);
  }

  const baseSize = type === 'title' ? FONT_CONFIG.TITLE_BASE : FONT_CONFIG.PERCENT_BASE;
  
  return `${baseSize * scale}em`;
};

/* TEXT */
const animateNumbers = () => {
  const startTime = performance.now();
  const duration = 2000; 

  const startValues = {};
  processedOptions.value.forEach(opt => startValues[opt.id] = 50);

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);

    processedOptions.value.forEach(opt => {
      const start = startValues[opt.id];
      const end = opt.percentage;
      const current = start + (end - start) * ease;
      animatedDisplayMap[opt.id] = Math.round(current);
    });

    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const uiLabels = {
  musicStarting: { [LANG.TW]: '音樂即將開始', [LANG.EN]: 'Music Starting Soon' },
  silenceDevices: { [LANG.TW]: '請關閉電子產品鈴聲', [LANG.EN]: 'Please silence your devices' },
  screenOffHint: { [LANG.TW]: '可關閉您的手機螢幕', [LANG.EN]: 'You may turn off your screen' },
  dontClose: { [LANG.TW]: '但請避免消除此頁面', [LANG.EN]: 'But please do not close this page' },
  tieBreakerNote: { [LANG.TW]: '※ 票數相等 (1:1)，取全場最快確認者為最終選擇', [LANG.EN]: '※ Tie vote (1:1). Fastest submission wins.' }
};
const uiText = computed(() => {
  const textObj = {};
  for (const key in uiLabels) {
    textObj[key] = uiLabels[key][props.lang] || uiLabels[key][LANG.TW];
  }
  return textObj;
});
</script>

<style scoped>
.result-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* ==========================================
   AUDIENCE SIDE
   ========================================== */
.audience-layout {
  padding: 10% 8% 15% 8%;
  height: 100%;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.text-row {
  width: 100%;
  text-align: center;
}

.animation-row {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ==========================================
   PROJECTOR SIDE
   ========================================== */
.projector-layout {
  padding: 4.5%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* --- 條狀圖容器 --- */
.bars-container {
  display: flex;
  width: 100%;
  height: 75%;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
.bar-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  transition: 
    width 1.5s cubic-bezier(0.25, 1, 0.5, 1), 
    flex-grow 1.5s cubic-bezier(0.25, 1, 0.5, 1),
    height 1.5s cubic-bezier(0.25, 1, 0.5, 1),
    transform 1.5s ease,
    opacity 0.4s ease;
}

/* --- 卡片內容 --- */
.option-card {
  width: 100%;
  height: 100%;
  border-radius: 30px; 
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fdfbf7; 
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: all 0.5s ease;
  font-size: clamp(6px, 1.3cqw, 80px);
}

.percentage-text {
  font-weight: bold;
  margin-top: 10px;
  color: #333;
  transition: font-size 0.2s linear; 
}
.option-title {
  margin: 0;
  transition: font-size 0.2s linear;
}

/* =========================================
   WINNER PHASE
   ========================================= */
.bars-container.WINNER .bar-wrapper.is-loser, 
.bars-container.BLACKOUT .bar-wrapper.is-loser {
  width: 0 !important;
  flex-grow: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  
  height: 65% !important; /* 關鍵：強制與 Winner 同高 */
  
  opacity: 0;
  transform: scale(0.8);
}
.bars-container.WINNER .bar-wrapper.is-winner, 
.bars-container.BLACKOUT .bar-wrapper.is-winner {
  width: 55% !important;  
  height: 65% !important; 
  transform: scale(1.1);
}
.bars-container.WINNER .option-card, 
.bars-container.BLACKOUT .option-card {
  border-color: #000; 
  background-color: #fff;
  border-width: 3px;
}

/* 同分說明 */
.tie-explanation {
  position: absolute;
  bottom: 3%;
  width: 100%;
  text-align: center;
  color: #333;
  animation: fadeIn 1s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 全黑遮罩 */
.blackout-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 2s ease;
  z-index: 9999;
}
.blackout-overlay.active {
  opacity: 1;
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
  /* z-index: 9999; */
}

.broken-bar {
  position: absolute;
  opacity: 0; /* 預設為全透明 */

  width: var(--base-width);
  transform: translate(-50%, -50%);
  
  /* 在同位置閃爍，閃爍時鐘建有幾幀長方形會變長 */
  /* 動畫名稱 | 時長 | 無限循環 | 線性 */
  animation: broken-bar-flicker 1.5s infinite linear;
}
.broken-bar.color0 {
  background-color: rgba(179, 209, 124, 0.532);
}
.broken-bar.color1 {
  background-color: rgba(199, 95, 20, 0.118);
}
.broken-bar.color2 {
  background-color: rgba(16, 80, 8, 0.141);
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
