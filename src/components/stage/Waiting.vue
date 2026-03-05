<template>
  <div class="waiting-page" :class="role">
    <div class="layout-container">
      
      <div class="media-section">
        <div class="img-box img-box-square img-restrict">
          <img src="/src/assets/images/logo.png" alt="Logo"/>
        </div>
        <div v-if="role === ROLE.PROJECTOR" class="img-box img-box-square img-restrict">
          <img src="/src/assets/images/qrcode.png" alt="QR Code"/>
        </div>
      </div>

      <div class="text-group">
        
        <div class="text-section info-text">
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in Introduction.get(LANG.TW)" :key="index" class="default-font">{{ line }}</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in Introduction.get(lang)" :key="index" class="default-font">{{ line }}</p>
          </div>
        </div>

        <div class="text-section rules-text default-font">
          <div v-if="role === ROLE.PROJECTOR">
            <p v-for="(line, index) in VoteRules.get(LANG.TW)" :key="index" class="default-font">{{ line }}</p>
          </div>
          <div v-else-if="role === ROLE.AUDIENCE">
            <p v-for="(line, index) in VoteRules.get(lang)" :key="index" class="default-font">{{ line }}</p>
          </div>
        </div>

      </div>
      </div>
  </div>
</template>

<script setup>
import {LANG, ROLE} from '@/constants.js';

const props = defineProps({
  role: String,
  lang: String
});

var Introduction = new Map()
Introduction.set(LANG.TW, [
  "1. 活動說明——活動說明——活動說明——活動說明——活動說明——", 
  "2. 活動說明——活動說明——活動說明——活動說明——活動說明——", 
  "3. 活動說明——活動說明——活動說明——活動說明——活動說明——", 
  "4. 活動說明——活動說明——活動說明——活動說明——活動說明——", 
  "5. 活動說明——活動說明——活動說明——活動說明——活動說明——"
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
  "1. 投票規則——投票規則——投票規則——投票規則——投票規則——", 
  "2. 投票規則——投票規則——投票規則——投票規則——投票規則——", 
  "3. 投票規則——投票規則——投票規則——投票規則——投票規則——", 
  "4. 投票規則——投票規則——投票規則——投票規則——投票規則——", 
  "5. 投票規則——投票規則——投票規則——投票規則——投票規則——"
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
  padding-top: 15%; 
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
