<template>
  <div class="client-container">
    <!-- <LandscapeGuard v-if="role === ROLE.AUDIENCE" /> -->
    <div v-if="role === ROLE.AUDIENCE" />

    <Lobby v-if="role === ROLE.AUDIENCE && !userLang" @[LANG_SELECT]="setLang" />

    <template v-else>
      <!-- <Loading v-if="isLoading" /> -->
      <div v-if="isLoading" />

      <template v-else>
        <Waiting v-if="currentStage === Stage.Waiting" :role="role" :lang="userLang" />
        <Intro v-else-if="currentStage === Stage.Intro" 
          :role="role" :lang="userLang" :songData="songData" 
          @[LANG_SELECT]="setLang" 
        />
        <Vote v-else-if="currentStage === Stage.Vote" 
          :role="role" :lang="userLang" :songData="songData" :time="displayTime" 
          @[LANG_SELECT]="setLang" @[OPTION_SELECT]="uploadVote" 
        />
        <Result v-else-if="currentStage === Stage.Result" 
          :role="role" :lang="userLang" :songData="songData" :voteResult="voteResult"
        />
        <!-- <Performance v-else-if="currentStage === 'Performance'" :role="role" :lang="userLang" /> -->
        <!-- <Next v-else-if="currentStage === 'Next'" :role="role" :lang="userLang" /> -->
      </template>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { db } from '../firebase'; 
// import { ref as dbRef, onValue } from 'firebase/database';
import { LANG, ROLE, LANG_SELECT, OPTION_SELECT, Stage } from '@/constants.js';
import {SongData, } from '@/song_data.js';

import LandscapeGuard from '@/components/LandscapeGuard.vue';
import Lobby from '@/components/Lobby.vue';
// import Loading from '@/components/Loading.vue';
import Waiting from '@/components/stage/Waiting.vue';
import Intro from '@/components/stage/Intro.vue';
import Vote from '@/components/stage/Vote.vue';
import Result from '@/components/stage/Result.vue';
// import Performance from '@/components/stage/Performance.vue';
// import Next from '@/components/stage/Next.vue';

const route = useRoute();
// const role = ref(ROLE.PROJECTOR);
const role = ref(ROLE.AUDIENCE);
const isLoading = ref(false);  // ########################################### should be true

// const userLang = ref(localStorage.getItem('slido_lang') || null);
const userLang = ref(null);
const setLang = (lang) => {
  userLang.value = lang;
  // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
};

const currentStage = ref(Stage.Result);
// const currentStage = ref(Stage.Intro);
// const currentStage = ref(Stage.Waiting);
// const currentSongId = ref('song1');
console.log(SongData);
const songData = SongData;
const displayTime = ref("00:15")
const uploadVote = (option) => {
  console.log("Vote ID:", option.id);
  // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
};

const voteResult = [
  {winner: true , percent: 50}, 
  {winner: false, percent: 50}
]
console.log(voteResult);

onMounted(() => {
  if (route.query.role === ROLE.PROJECTOR) {
    role.value = ROLE.PROJECTOR;
  }
});
</script>
