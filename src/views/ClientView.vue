<template>
  <div class="client-container" :style="currentBackgroundStyle">
    <LandscapeGuard v-if="role === ROLE.AUDIENCE" />

    <Lobby v-if="role === ROLE.AUDIENCE && !userLang" @[LANG_SELECT]="start" />

    <template v-else>
      <Loading v-if="isLoading" />

      <template v-else>
        <Waiting v-if="currentStage === Stage.Waiting || (currentStage === Stage.Next && role === ROLE.AUDIENCE)" 
          :role="role" :lang="userLang" 
        />
        <Intro v-else-if="currentStage === Stage.Intro" 
          :role="role" :lang="userLang" :songData="songData[currentSongIndex]" 
          @[LANG_SELECT]="setLang" 
        />
        <Vote v-else-if="currentStage === Stage.Vote" 
          :role="role" :lang="userLang" :songData="songData[currentSongIndex]" :time="displayTime" :currentRoute="currentRoute"
          @[LANG_SELECT]="setLang" @[OPTION_SELECT]="uploadVote" 
        />
        <Result v-else-if="currentStage === Stage.Result || (currentStage === Stage.Performance && role === ROLE.AUDIENCE)" 
          :role="role" :lang="userLang" :songData="songData[currentSongIndex]" :voteResult="voteResult"
        />
        <Performance v-else-if="currentStage === Stage.Performance && role === ROLE.PROJECTOR" 
          :role="role" :lang="userLang" 
        />
        <Next v-else-if="currentStage === Stage.Next && role === ROLE.PROJECTOR" 
          :role="role" :lang="userLang" 
        />
      </template>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { GetSongData, GetBackgroundLink } from '@/utils/song_data_logic';
import { 
  ConfigOnControlSignalChange, DisableOnControlSignalChange, 
  ConfigCurrentStage, ConfigCurrentSongIndex, ConfigCurrentRoute, 
  ConfigDisplayTime, ConfigVoteResult, DisableDisplayTime, 
} from '@/utils/control_logic';
import { IsAutoAdvanceStage } from '@/utils/stage_logic';
import { UploadVoteData } from '@/utils/vote_logic';
import { 
  LANG, Stage, ROLE, 
  LANG_SELECT, OPTION_SELECT, 
  QUERY_NOCACHE, 
  SHOW_BACKGROUND_STAGE
} from '@/constants.js';
import { GetBackgroundStyle } from '@/utils/assets_tools';

import LandscapeGuard from '@/components/LandscapeGuard.vue';
import Lobby from '@/components/Lobby.vue';
import Loading from '@/components/Loading.vue';
import Waiting from '@/components/stage/Waiting.vue';
import Intro from '@/components/stage/Intro.vue';
import Vote from '@/components/stage/Vote.vue';
import Result from '@/components/stage/Result.vue';
import Performance from '@/components/stage/Performance.vue';
import Next from '@/components/stage/Next.vue';

const route = useRoute();
const role = ref(ROLE.AUDIENCE);
const isLoading = ref(false);
const disableControlSignalDetail = ref(null);
const disableDisplayTimeDetail = ref(null);


const userLang = ref(null);
const setLang = (lang) => {
  userLang.value = lang;
  // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
};


// ----- Start Control & Config ----- //

const songData = ref([]);
const controlSignal = ref(null);
const currentSongIndex = ref(0);
const currentStage = ref(Stage.Waiting);
const currentRoute = ref(0);
const displayTime = ref("00:00");
const voteResult = ref([]);
const start = (lang) => {
  isLoading.value = true;

  // set language
  setLang(lang);

  // get songData & controlSignal
  GetSongData(songData, !(QUERY_NOCACHE in route.query)).then(() => {
    console.log(songData);
    disableControlSignalDetail.value = ConfigOnControlSignalChange(controlSignal, () => { isLoading.value = false })
  }).then(() => {
    console.log(controlSignal);
    ConfigCurrentSongIndex(controlSignal, currentSongIndex);
    ConfigCurrentStage(controlSignal, currentStage);
    ConfigCurrentRoute(controlSignal, currentRoute);
    disableDisplayTimeDetail.value = ConfigDisplayTime(controlSignal, displayTime, () => {
      if (role === ROLE.PROJECTOR && currentStage === Stage.Result) return;
      if (IsAutoAdvanceStage(currentStage.value) === true) {
        isLoading.value = true;
      }
    });
    ConfigVoteResult(controlSignal, voteResult);
  }).then(() => {
    console.log(currentSongIndex, currentStage, currentRoute, displayTime, voteResult);
  });
}

const uploadVote = (option) => {
  UploadVoteData(option);
  console.log("Vote ID:", option.id);
};


const currentBackgroundStyle = computed(() => {
  // 1. 決定方向
  const orientation = (role.value === ROLE.PROJECTOR) ? "horizontal" : "vertical";
  
  // 2. 取得單首歌曲資料 (防呆判斷)
  const currentSong = (songData.value && songData.value.length > 0 && currentSongIndex.value != null)
    ? songData.value[currentSongIndex.value] 
    : null;

  // 3. 判斷當前階段是否「不」在顯示清單中 (強制使用預設背景)
  const useDefault = !SHOW_BACKGROUND_STAGE.includes(currentStage.value);

  // 4. 呼叫 function 取得 style
  return GetBackgroundStyle(currentSong, useDefault, orientation);
});


onMounted(() => {
  if (route.query.role === ROLE.PROJECTOR) {
    role.value = ROLE.PROJECTOR;
    start(LANG.TW);
  }
});
onUnmounted(() => {
  if (disableControlSignalDetail.value != null) {
    DisableOnControlSignalChange(disableControlSignalDetail);
  }
  if (disableDisplayTimeDetail.value != null) {
    DisableDisplayTime(disableDisplayTimeDetail);
  }
});
</script>
