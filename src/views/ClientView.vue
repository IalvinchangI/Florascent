<template>
  <div class="client-container">
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
          :role="role" :lang="userLang" :songData="songData[currentSongIndex]" :time="displayTime" 
          @[LANG_SELECT]="setLang" @[OPTION_SELECT]="uploadVote" 
        />
        <Result v-else-if="currentStage === Stage.Result" 
          :role="role" :lang="userLang" :songData="songData[currentSongIndex]" :voteResult="voteResult"
        />
        <Performance v-else-if="currentStage === Stage.Performance" 
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { GetSongData } from '@/utils/song_data_logic';
import { 
  ConfigOnControlSignalChange, DisableOnControlSignalChange, 
  ConfigCurrentStage, ConfigCurrentSongIndex, 
  ConfigDisplayTime, ConfigVoteResult, DisableDisplayTime, 
} from '@/utils/control_logic';
import { IsAutoAdvanceStage } from '@/utils/stage_logic';
import { UploadVoteData } from '@/utils/vote_logic';
import { LANG, ROLE, LANG_SELECT, OPTION_SELECT, Stage, QUERY_NOCACHE } from '@/constants.js';

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


// const userLang = ref(localStorage.getItem('slido_lang') || null);
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
    disableDisplayTimeDetail.value = ConfigDisplayTime(controlSignal, displayTime, () => {
      if (role === ROLE.PROJECTOR && currentStage === Stage.Result) return;
      if (IsAutoAdvanceStage(currentStage.value) === true) {
        isLoading.value = true;
      }
    });
    ConfigVoteResult(controlSignal, voteResult);
  }).then(() => {
    console.log(currentSongIndex, currentStage, displayTime, voteResult);
  });
}

const uploadVote = (option) => {
  UploadVoteData(option);
  console.log("Vote ID:", option.id);
  // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
};

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
