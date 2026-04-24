<template>
  <div class="waiting-page" :class="role">
    <div class="layout-container">
      
      <div class="media-section">
        <div class="img-box img-box-square img-restrict video-restrict-small default-font title title-en">
          <!-- <img :src="LOGO_URL" alt="Florascent"/> -->
          <video autoplay loop muted playsinline>
            <source :src="logoVideoWEBM" type="video/webm">
            <source :src="logoVideoMP4" type='video/mp4'>
            Florascent
          </video>
        </div>
        <div v-if="role === ROLE.PROJECTOR" class="img-box img-box-square img-restrict">
          <img :src="QRCODE_URL" alt="QR Code"/>
        </div>
      </div>

      <div class="text-group" :class="{'scroll-mask-container': role === ROLE.AUDIENCE}" 
        ref="scrollBox" @scroll="handleScroll" :style="maskStyles"
      >
        
        <div class="text-section info-text default-font relative-text-width-wrapper">
          <div class="title relative-title">{{ (lang === LANG.EN) ? "Info" : "活動說明" }}</div>
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in Introduction.get(LANG.TW)" :key="index" class="default-font relative-text">{{ line }}&nbsp;</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in Introduction.get(lang)" :key="index" class="default-font relative-text">{{ line }}&nbsp;</p>
          </div>
        </div>

        <div class="text-section rules-text default-font relative-text-width-wrapper">
          <div class="title relative-title">{{ (lang === LANG.EN) ? "Rules" : "投票規則" }}</div>
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in VoteRules.get(LANG.TW)" :key="index" class="default-font relative-text">{{ line }}&nbsp;</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in VoteRules.get(lang)" :key="index" class="default-font relative-text">{{ line }}&nbsp;</p>
          </div>
        </div>

      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import {LANG, ROLE} from '@/constants.js';
import { LOGO_URL, LOGO_VIDEO_URL, QRCODE_URL } from '@/assets_url';
import { CalculateScrollMaskStyle } from '@/utils/style_tools';
import { ChangeVideoUrlFormat } from '@/utils/assets_tools';

const props = defineProps({
  role: String,
  lang: String
});

const logoVideoWEBM = ref(ChangeVideoUrlFormat(LOGO_VIDEO_URL, "webm"));
const logoVideoMP4 = ref(ChangeVideoUrlFormat(LOGO_VIDEO_URL, "mp4"));

var Introduction = new Map()
Introduction.set(LANG.TW, [
  "本展演時間預計100分鐘，前60分鐘為現場音樂演出呈現，後40分鐘為香水體驗時間。", 
  "", 
  "現場音樂演出呈現包含四首音樂，並分別在台前展示主體香水，現場將限量販售一本20元的節目冊，其中包含每一首音樂搭配的試香紙，想同時體驗嗅覺感受的朋友們歡迎購買！", 
  "", 
  "演出期間如遇身體不適，請與工作人員反應，並依照指示離場。"
])
Introduction.set(LANG.EN, [
  "1. Introduction——Introduction——Introduction——Introduction——Introduction——", 
  "2. Introduction——Introduction——Introduction——Introduction——Introduction——", 
  "3. Introduction——Introduction——Introduction——Introduction——Introduction——", 
  "4. Introduction——Introduction——Introduction——Introduction——Introduction——", 
  "5. Introduction——Introduction——Introduction——Introduction——Introduction——"
])

var VoteRules = new Map()
VoteRules.set(LANG.TW, [
  "每一首音樂開始前將會進行觀眾投票，您的選擇將會影響故事主角的決定以及後續的劇情走向，請把握投票時間儘速做出抉擇！", 
  "", 
  "“ 停留還是遠走，請選擇 ”", 
  "", 
  "請務必協助將手機及電子產品轉為靜音模式，以維護眾人的觀展體驗品質。演出期間不開放攝影錄音，請好好放鬆聽覺、視覺及嗅覺，享受時走時停的人生步調。"
])
VoteRules.set(LANG.EN, [
  "1. Vote Rules——Vote Rules——Vote Rules——Vote Rules——Vote Rules——", 
  "2. Vote Rules——Vote Rules——Vote Rules——Vote Rules——Vote Rules——", 
  "3. Vote Rules——Vote Rules——Vote Rules——Vote Rules——Vote Rules——", 
  "4. Vote Rules——Vote Rules——Vote Rules——Vote Rules——Vote Rules——", 
  "5. Vote Rules——Vote Rules——Vote Rules——Vote Rules——Vote Rules——"
])

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
  await nextTick(); // 確保 DOM 渲染完畢
  handleScroll();   // 執行一次以套用初始遮罩狀態
});
</script>

<style scoped>
.waiting-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.media-section .img-box {
  margin-bottom: 0;
}
.text-section {
  text-align: justify;
  line-height: 2;
}
.text-section p {
  margin: 0;
}

.relative-title {
  font-size: clamp(24px, 10cqw, 120px);
  margin: 0 0 0.5em 0;
}
.relative-text {
  font-size: clamp(18px, 6cqw, 80px);
}

/* =========================================
   Audience
   ========================================= */
.waiting-page.audience {
  align-items: flex-start;
  padding-top: 15%; 
  padding-bottom: 12%;
  padding-left: 10%;
  padding-right: 10%;
  box-sizing: border-box;
}

.audience .layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.audience .media-section {
  order: 1;
  width: 70%;
  max-width: 500px;
  flex-shrink: 0; 
  padding-bottom: 15%;
}

.audience .text-group {
  order: 2;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px; 
}
.audience .info-text {
  padding-bottom: 0;
}

/* =========================================
   Projector
   ========================================= */
.waiting-page.projector {
  align-items: center;
  padding: 4.5%;
}

.projector .layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.projector .media-section {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 23.5%;
  min-width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.projector .text-group {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}

.projector .info-text,
.projector .rules-text {
  width: calc(50% - max(11.75%, 75px) - 6vw);
  pointer-events: auto;
}
</style>
