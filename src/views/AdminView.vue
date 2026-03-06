<template>
  <div class="admin-container">

      <Loading v-if="isLoading" />

      <template v-else>
        <Start v-if="currentPage === Admin.Start" />
        <!-- <SlideControl v-else-if="currentPage === Admin.SlideControl" 
          :songData="songData" :time="displayTime" 
          @[OPTION_SELECT]="uploadVote" 
        /> -->
      </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { db } from '../firebase'; 
// import { ref as dbRef, onValue } from 'firebase/database';
import { Stage, Admin } from '@/constants.js';
import {SongData, } from '@/song_data.js';

import Loading from '@/components/Loading.vue';
import Start from '@/components/admin/Start.vue';
// import SlideControl from '@/components/admin/SlideControl.vue';

const route = useRoute();
const isLoading = ref(false);  // ########################################### should be true
// const isLoading = ref(true);  // ########################################### should be true

// const currentPage = ref(Admin.SlideControl);
// const currentPage = ref(Admin.Start);
const currentPage = ref(Admin.Start);
// TODO localStorage.setItem('currentPage', currentPage); // 存進瀏覽器，防重新整理
// const currentSongId = ref('song1');
console.log(SongData);
const songData = SongData;
// const displayTime = ref("00:15")
// const uploadVote = (option) => {
//   console.log("Vote ID:", option.id);
//   // localStorage.setItem('slido_lang', lang); // 存進瀏覽器，防重新整理
// };

// const voteResult = [
//   {winner: true , percent: 50}, 
//   {winner: false, percent: 50}
// ]
// console.log(voteResult);

onMounted(() => {
  // TODO check sign in 
});
</script>
