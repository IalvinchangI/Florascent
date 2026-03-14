<template>
  <div class="admin-container">

      <Loading v-if="isLoading" />

      <template v-else>
        <Start v-if="currentPage === Admin.Start" 
          @[ADMIN_START]="startControl"
        />
        <SlideControl v-else-if="currentPage === Admin.SlideControl" 
          :songData="songData[currentSongId]" :voteResult="voteResult" :time="displayTime" :currentStage="currentStage" :autoAdvance="autoAdvance"
          @[ADMIN_PREV_SLIDE]="prevSlide" @[ADMIN_NEXT_SLIDE]="nextSlide" 
        />
      </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Stage, Admin, ADMIN_START, ADMIN_PREV_SLIDE, ADMIN_NEXT_SLIDE, QUERY_NOCACHE } from '@/constants.js';
import { GetSongData } from '@/utils/song_data_logic';

import Loading from '@/components/Loading.vue';
import Start from '@/components/admin/Start.vue';
import SlideControl from '@/components/admin/SlideControl.vue';

const route = useRoute();
const isLoading = ref(false);

// const currentStage = ref(Stage.Waiting);
const currentStage = ref(Stage.Result);
const autoAdvance = ref(true);

const currentPage = ref(Admin.Start);
// TODO localStorage.setItem('currentPage', currentPage); // 存進瀏覽器，防重新整理
const currentSongId = ref(0);
const songData = ref([]);
const displayTime = ref("00:15")
// const uploadVote = (option) => {
//   console.log("Vote ID:", option.id);
//   // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
// };

const voteResult = [
  {winner: true , percent: 50}, 
  {winner: false, percent: 50}
]
// console.log(voteResult);

onMounted(() => {
  // EMPTY
});

const startControl = () => {
  isLoading.value = true;
  currentPage.value = Admin.SlideControl;
  // console.log("startControl");

  // get songData
  GetSongData(songData, !(QUERY_NOCACHE in route.query)).then(() => {
    isLoading.value = false;
    console.log(songData);
  });
}
const prevSlide = () => {
  currentStage.value = Stage.Waiting;
  // console.log("startControl");
}
const nextSlide = () => {
  currentStage.value = Stage.Intro;
  // console.log("startControl");
}
</script>
