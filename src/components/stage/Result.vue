<template>
  <div class="result-page" :class="role">
    
    <div v-if="role === ROLE.AUDIENCE" class="audience-layout">
      <div class="text-row">
        <h2 class="serif-font title" style="margin: 0;">{{ uiText.musicStarting }}</h2>
        <p class="default-font" style="margin: 5px;">{{ uiText.silenceDevices }}</p>
      </div>

      <div class="animation-row">
        <div class="img-box img-box-vertical img-restrict">
          <img src="@/assets/images/character.png" alt="LOADING..." />
        </div>
      </div>

      <div class="text-row">
        <p class="default-font" style="margin: 5px;">{{ uiText.screenOffHint }}</p>
        <p class="default-font" style="margin: 5px;">{{ uiText.dontClose }}</p>
      </div>
    </div>

    <div v-else-if="role === ROLE.PROJECTOR" class="projector-layout">
      
      <div class="bars-container" :class="currentPhase">
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
              class="serif-font title" 
              :style="{ fontSize: getDynamicFontSize(option.id, 'title') }"
            >
              {{ getOptionTitle(option) }}
            </h3>
            
            <div 
              class="percentage-text serif-font"
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
import { LANG, ROLE } from '@/constants.js';

const props = defineProps({
  role: String,
  lang: String,
  songData: { type: Object, required: true },
  /**
   * voteResult 結構範例 (陣列):
   * [
   * { winner: false, percent: 40 },
   * { winner: true , percent: 60 }
   * ]
   */
  voteResult: { type: Array, required: true }
});

/* CONST */
const TRANSITION_TIMING = {
  INITIAL_HOLD: 1500,     
  REVEAL_DURATION: 3000,  
  WINNER_HOLD: 4000,      
  FADE_TO_BLACK: 2000     
};
const FONT_CONFIG = {
  TITLE_BASE: 2.5, 
  PERCENT_BASE: 3.0, 
  MAX_SCALE: 1.2
};
const currentPhase = ref('INITIAL'); 
const animatedDisplayMap = reactive({});

/* DATA */
const processedOptions = computed(() => {
  if (!props.songData || !props.songData.options) return [];
  
  return props.songData.options.map((option, index) => {
    const result = props.voteResult[index] || { winner: false, percent: 50 }; 
    return { 
      ...option, 
      id: index, 
      percentage: result.percent,
      isWinner: result.winner
    };
  });
});

processedOptions.value.forEach(opt => {
  animatedDisplayMap[opt.id] = 50;
});

const winnerId = computed(() => {
  const winnerOption = processedOptions.value.find(opt => opt.isWinner);
  return winnerOption ? winnerOption.id : null;  // 如果資料有誤沒有 winner，回傳 null (或可預設一個)
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
      }, TRANSITION_TIMING.WINNER_HOLD);
    }, TRANSITION_TIMING.REVEAL_DURATION);
  }, TRANSITION_TIMING.INITIAL_HOLD);
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
  
  return `${baseSize * scale}rem`;
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
const getOptionTitle = (option) => option.title[props.lang] || option.title[LANG.TW];

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
  width: 80%;
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
}

.percentage-text {
  font-weight: bold;
  margin-top: 10px;
  color: #333;
  transition: font-size 0.2s linear; 
}
.title {
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
  
  height: 300px !important; /* 關鍵：強制與 Winner 同高 */
  
  opacity: 0;
  transform: scale(0.8);
}
.bars-container.WINNER .bar-wrapper.is-winner, 
.bars-container.BLACKOUT .bar-wrapper.is-winner {
  width: 600px !important;  
  height: 300px !important; 
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
</style>
