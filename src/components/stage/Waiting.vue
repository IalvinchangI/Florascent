<template>
  <div class="waiting-page" :class="role">
    <div class="layout-container">
      
      <div class="media-section">
        <div class="img-box img-box-square img-restrict video-restrict-small serif-font title title-en">
          <!-- <img :src="LOGO_URL" alt="Florascent"/> -->
          <video autoplay loop muted playsinline>
            <source :src="LOGO_VIDEO_URL" type="video/webm">
            Florascent
          </video>
        </div>
        <div v-if="role === ROLE.PROJECTOR" class="img-box img-box-square img-restrict">
          <img :src="QRCODE_URL" alt="QR Code"/>
        </div>
      </div>

      <div class="text-group">
        
        <div class="text-section info-text default-font">
          <span class="title">活動說明</span>
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in Introduction.get(LANG.TW)" :key="index" class="default-font">{{ line }}&nbsp;</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in Introduction.get(lang)" :key="index" class="default-font">{{ line }}&nbsp;</p>
          </div>
        </div>

        <div class="text-section rules-text default-font">
          <span class="title">投票規則</span>
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in VoteRules.get(LANG.TW)" :key="index" class="default-font">{{ line }}&nbsp;</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in VoteRules.get(lang)" :key="index" class="default-font">{{ line }}&nbsp;</p>
          </div>
        </div>

      </div>
      </div>
  </div>
</template>

<script setup>
import {LANG, ROLE} from '@/constants.js';
import { LOGO_URL, QRCODE_URL } from '@/assets_url';

const props = defineProps({
  role: String,
  lang: String
});

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
.logo-box span, .qrcode-box span {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
}
.text-section {
  text-align: justify;
  line-height: 2;
}
.text-section p {
  margin: 0;
}

/* =========================================
   Audience
   ========================================= */
.waiting-page.audience {
  align-items: flex-start;
  padding-top: 25%; 
  padding-bottom: 10%;
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
  padding-bottom: 5vh;
}

.audience .text-group {
  order: 2;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  /* padding-bottom: 20px; */
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
  padding: 5%;
}

.projector .layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5vw;
}

.projector .media-section {
  order: 2;
  flex: 0 0 25%;
  min-width: 150px;
  width: 30%;
  height: 100%;
  padding: 0% 2%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5vh;
}

.projector .text-group {
  display: contents;
}
.projector .info-text {
  order: 1;
  flex: 1;
}
.projector .rules-text {
  order: 3;
  flex: 1;
}
</style>
