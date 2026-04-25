<template>
  <div class="intro-page" :class="[role, { 'has-image': currentCharacterLink != null }]">
    
    <Header 
      class="header-container"
      :role="role" 
      :lang="lang" 
      :title="`《${currentTitle}》`" 
      @[LANG_SELECT]="handleLangUpdate" 
    />

    <div v-if="role === ROLE.AUDIENCE" class="layout-container">
      <div v-if="currentCharacterLink != null" class="media-section">
        <div class="img-box-vertical img-restrict-big video-restrict-big">
          <img :src="currentCharacterLink" alt="Character Animation" />
          <!-- <video autoplay loop muted playsinline>
            <source :src="currentCharacterLink_MP4" type='video/mp4; codecs="hvc1"'>
            <source :src="currentCharacterLink_WEBM" type="video/webm">
            Can not play animation!
          </video> -->
        </div>
      </div>

      <div class="text-section default-font scroll-mask-container relative-text-width-wrapper" 
        ref="scrollBox" @scroll="handleScroll" :style="maskStyles"
      >
        <p v-for="(line, index) in currentDescriptionLines" :key="index">{{ line }}</p>
      </div>
    </div>

    <!-- projector -->
    <div v-else-if="role === ROLE.PROJECTOR" class="layout-container">
      <div class="text-section default-font relative-text-wrapper" style="justify-content: right;">
        <p v-for="(line, index) in leftDescriptionLines" :key="index">{{ line }}</p>
      </div>

      <div v-if="currentCharacterLink != null" class="media-section">
        <div class="img-box-horizontal img-restrict-small video-restrict-small">
          <img :src="currentCharacterLink" alt="Character Animation" />
          <!-- <video autoplay loop muted playsinline>
            <source :src="currentCharacterLink_MP4" type='video/mp4; codecs="hvc1"'>
            <source :src="currentCharacterLink_WEBM" type="video/webm">
            Can not play animation!
          </video> -->
        </div>
      </div>

      <div class="text-section default-font relative-text-wrapper" style="justify-content: left;">
        <p v-for="(line, index) in rightDescriptionLines" :key="index">{{ line }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { ROLE, LANG_SELECT } from '@/constants.js';
import Header from '@/components/Header.vue';
import { GetTitle, GetDescription, GetCharacterLink } from '@/utils/song_data_logic';
import { CalculateScrollMaskStyle } from '@/utils/style_tools';
import { ChangeVideoUrlFormat } from '@/utils/assets_tools';

const props = defineProps({
  role: String,
  lang: String,
  songData: {
    type: Object,
    required: true
  }
});

// 使用 GetTitle 取得標題
const currentTitle = computed(() => {
  return GetTitle(props.songData, props.lang);
});

// 使用 GetDescription 取得介紹文字 (已經是處理好的陣列)
const currentDescriptionLines = computed(() => {
  return GetDescription(props.songData, props.lang);
});
const rightDescriptionLines = computed(() => {
  const lines = currentDescriptionLines.value;
  const midIndex = Math.floor((lines.length + 1) / 2);
  return lines.slice(0, midIndex);
});
const leftDescriptionLines = computed(() => {
  const lines = currentDescriptionLines.value;
  const midIndex = Math.floor((lines.length + 1) / 2);
  return lines.slice(midIndex);
});

// 使用 GetCharacterLink 取得角色圖片連結
const currentCharacterLink = computed(() => {
  return GetCharacterLink(props.songData);
});
// const currentCharacterLink_WEBM = computed(() => {
//   return ChangeVideoUrlFormat(currentCharacterLink.value, "webm");
// });
// const currentCharacterLink_MP4 = computed(() => {
//   return ChangeVideoUrlFormat(currentCharacterLink.value, "mp4");
// });

const emit = defineEmits([LANG_SELECT]);
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
  await nextTick(); // 確保 DOM 渲染完畢
  handleScroll();   // 執行一次以套用初始遮罩狀態
});
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
  justify-content: space-between;
}

/* =========================================
   Audience Style
   ========================================= */
.intro-page.audience {
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
}
.audience .text-section p {
  font-size: clamp(12px, 5.5cqw, 60px);
  margin: 0.5rem 0;
}

.audience .media-section {
  order: 2;
  flex-shrink: 0;
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
  padding: 4.5%;
}

.projector .header-container {
  height: 10%;
  width: 100%;
}
.projector .layout-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between; 
  align-items: center;
  height: 85%;
  width: 100%;
  /* max-width: 1200px; */
  gap: 4vw;
}

.projector .media-section {
  height: 100%;
  display: flex;
  justify-content: center;
  flex: 0 1 auto;
}

.projector .text-section {
  writing-mode: vertical-rl; 
  text-orientation: mixed;
  line-height: 2.5;
  letter-spacing: 6px;
  text-align: start; 
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column; 
}
.projector .text-section p {
  font-size: clamp(24px, 5.3cqh, 120px);
  margin: 0 1rem;
}

.projector:not(.has-image) .text-section {
  flex: 1; 
  align-items: center; 
}
</style>
