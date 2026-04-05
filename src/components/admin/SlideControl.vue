<template>
  <div class="slide-control-page">
    <div class="layout-wrapper">

      <div class="left-column">
        <div class="monitor-frame img-box default-btn light-bg" ref="currentContainer">
          <div class="scaler-wrapper" :style="currentScaleStyle">
            <div class="simulated-screen template-view">
              <component 
                :is="currentComponent" 
                :role="ROLE.PROJECTOR"
                :lang="LANG.TW" 
                :songData="songData"
                :voteResult="voteResult" 
                :time="time"
                :currentStage="currentStage"
              />
            </div>
          </div>
          <div class="monitor-label default-font">目前畫面</div>
          <div class="click-blocker"></div>
        </div>

        <div class="control-bar">
          
          <button class="nav-btn base-btn animate-btn" @click="emit(ADMIN_PREV_SLIDE)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="info-display img-box default-btn white-bg">
            <span class="song-title serif-font">《{{ currentSongTitle }}》</span>
            <span class="separator">|</span>
            <span class="page-name default-font">{{ pageName }}</span>
          </div>

          <div v-if="IsAutoAdvanceStage(currentStage)" class="nav-btn base-btn auto-mode cursor-default"  @click="emit(ADMIN_NEXT_SLIDE)">
            <div class="timer-box">
              <span class="time-text serif-font">{{ time }}</span>
              <span class="auto-label default-font">自動跳轉</span>
            </div>
            <!-- <div class="progress-bar"></div> -->
          </div>

          <button v-else class="nav-btn base-btn animate-btn" @click="emit(ADMIN_NEXT_SLIDE)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

        </div>
      </div>

      <div class="right-column">
        
        <div class="next-slide-box img-box default-btn white-bg" ref="nextContainer">
           <div class="scaler-wrapper" :style="nextScaleStyle">
            <div class="simulated-screen template-view">
               <component 
                :is="nextComponent" 
                :role="ROLE.PROJECTOR"
                :lang="LANG.TW" 
                :songData="songData"
                :voteResult="voteResult" 
                :time="time"
              />
            </div>
          </div>
          <div class="monitor-label small default-font">下一頁</div>
          <div class="click-blocker"></div>
        </div>

        <div class="link-panel img-box default-btn white-bg">
          <LinkBox />
          <div class="panel-body"></div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { LANG, Stage, ROLE, ADMIN_PREV_SLIDE, ADMIN_NEXT_SLIDE } from '@/constants.js';
import { IsAutoAdvanceStage, GetIndexAndStage } from '@/utils/stage_logic';

// Components
import LinkBox from '@/components/LinkBox.vue';
import Waiting from '@/components/stage/Waiting.vue';
import Intro from '@/components/stage/Intro.vue';
import Vote from '@/components/stage/Vote.vue';
import Result from '@/components/stage/Result.vue';
import Performance from '@/components/stage/Performance.vue';
import Next from '@/components/stage/Next.vue';

const props = defineProps({
  songData: { type: Object, required: true },
  stageList: { type: Array, required: true },
  currentSongIndex: { type: Number, required: true },
  currentStage: { type: String, required: true },
  voteResult: { type: Array, default: () => [] },
  time: { type: String, default: "00:00" }
});

const emit = defineEmits([ADMIN_PREV_SLIDE, ADMIN_NEXT_SLIDE]);

// --- 舞台順序 ---
const getComponentByStage = (stage) => {
  switch (stage) {
    case Stage.Waiting:     return Waiting;
    case Stage.Intro:       return Intro;
    case Stage.Vote:        return Vote;
    case Stage.Result:      return Result;
    case Stage.Performance: return Performance;
    case Stage.Next:        return Next;
    default:                return Waiting;
  }
};

const currentComponent = computed(() => getComponentByStage(props.currentStage));

const nextComponent = computed(() => {
  const { newIndex: index, newStage: stage } = GetIndexAndStage(
    props.stageList, 
    props.currentSongIndex, props.currentStage, 
    1
  );
  return getComponentByStage(stage);
});

// --- 資訊顯示 ---
const currentSongTitle = computed(() => props.songData?.title?.[LANG.TW] || '');
const pageName = computed(() => {
  const map = {
    [Stage.Waiting]: '活動介紹', 
    [Stage.Intro]: '歌曲介紹', 
    [Stage.Vote]: '投票進行中', 
    [Stage.Result]: '投票結果', 
    [Stage.Performance]: '表演中', 
    [Stage.Next]: '準備下一首曲目'
  };
  return map[props.currentStage] || props.currentStage;
});

// --- 自動縮放邏輯 ---
const SCREEN_W = 1280;
const SCREEN_H = 720;
const currentContainer = ref(null);
const nextContainer = ref(null);
const scaleCurrent = ref(0.5);
const scaleNext = ref(0.3);

const calculateScale = (container) => {
  if (!container) return 0.1;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const scaleW = cw / SCREEN_W;
  const scaleH = ch / SCREEN_H;
  return Math.min(scaleW, scaleH) * 0.95; 
};

const updateScales = () => {
  if (currentContainer.value) scaleCurrent.value = calculateScale(currentContainer.value);
  if (nextContainer.value) scaleNext.value = calculateScale(nextContainer.value);
};

let resizeObserver = null;
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(updateScales);
  });
  if (currentContainer.value) resizeObserver.observe(currentContainer.value);
  if (nextContainer.value) resizeObserver.observe(nextContainer.value);
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

const currentScaleStyle = computed(() => ({
  transform: `scale(${scaleCurrent.value})`
}));
const nextScaleStyle = computed(() => ({
  transform: `scale(${scaleNext.value})`
}));
</script>

<style scoped>
.slide-control-page {
  width: 100%;
  height: 100%;
  padding: 2vh 2vw; 
  box-sizing: border-box;
  overflow: hidden; 
  display: flex;
  justify-content: center;
}

.layout-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
}

/* ================= 左欄 ================= */
.left-column {
  flex: 1; 
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  min-width: 0;
}

.monitor-frame {
  flex: 1; 
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 2px;
}

/* ================= 右欄 ================= */
.right-column {
  width: 25vw;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  min-width: 0;
}

.next-slide-box {
  height: 35%; 
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 2px;
}

.link-panel {
  flex: 1; 
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: flex-start;
  gap: 10px;
}

/* ================= Scaler ================= */
.scaler-wrapper {
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.simulated-screen {
  width: 1280px;
  height: 720px;
  background-color: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 30px rgba(0,0,0,0.1);
  overflow: hidden; 
}

/* ================= Control Bar ================= */
.control-bar {
  height: 60px;
  display: flex;
  gap: 15px;
  flex-shrink: 0; 
}

.nav-btn {
  width: 80px;
  height: 100%;
  padding: 0;
  border-radius: 12px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  position: relative;
  overflow: hidden;
}

.info-display {
  flex: 1;
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  gap: 15px;
  border-radius: 12px;
}

.song-title {
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap; 
}

.separator {
  color: #bbb;
  font-weight: 300;
}

.page-name {
  color: #555;
  font-size: 1.1rem;
  white-space: nowrap;
}

/* ================= Auto Mode Styles ================= */
.auto-mode {
  background-color: #f0f0f0;
  color: #d9534f;
  border-color: #ccc;
  width: 100px;
}

.cursor-default {
  cursor: default;
}

.timer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
  z-index: 2;
}

.time-text {
  font-size: 1.4rem;
  font-weight: bold;
}

.auto-label {
  font-size: 0.7rem;
  color: #888;
}

/* 簡單的進度條動畫背景 (選填) */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #d9534f;
  width: 100%;
  opacity: 0.3;
}

/* ================= Others ================= */
.monitor-label {
  position: absolute;
  top: 15px;
  left: 20px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  z-index: 5;
  background-color: rgba(253, 251, 247, 0.8); 
  padding: 2px 8px;
  border-radius: 4px;
}
.monitor-label.small {
  font-size: 1rem;
  top: 10px;
  left: 15px;
}

.click-blocker {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 10;
}

.panel-body {
  flex: 1;
}

.light-bg { background-color: #fdfbf7; }
.white-bg { background-color: #ffffff; }

</style>
