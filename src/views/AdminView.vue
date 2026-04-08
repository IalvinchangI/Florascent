<template>
  <div class="admin-container">

      <Loading v-if="isLoading" />

      <template v-else>
        <Start v-if="currentPage === Admin.Start" 
          @[ADMIN_START]="startControl"
        />
        <SlideControl v-else-if="currentPage === Admin.SlideControl" 
          :songData="songData[currentSongIndex]" :stageList="stageList"
          :voteResult="voteResult" :time="displayTime"
          :currentSongIndex="currentSongIndex" :currentStage="currentStage"
          @[ADMIN_PREV_SLIDE]="prevSlide" @[ADMIN_NEXT_SLIDE]="nextSlide" @[ADMIN_RESTART]="handleRestart"
        />
      </template>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Stage, Admin, 
  ADMIN_START, ADMIN_PREV_SLIDE, ADMIN_NEXT_SLIDE, ADMIN_RESTART, 
  ADMIN_CURRENT_PAGE_KEY, 
  QUERY_NOCACHE
} from '@/constants.js';
import { GetSongData } from '@/utils/song_data_logic';
import { 
  ConfigOnControlSignalChange, DisableOnControlSignalChange, 
  ConfigCurrentStage, ConfigCurrentSongIndex, 
  ConfigDisplayTime, ConfigVoteResult, DisableDisplayTime, 
  SetControlSignal, 
  ResetControlSignal
} from '@/utils/control_logic';
import {
  GetStageList, 
  GetIndexAndStage, 
  GetEndTimeFromData
} from '@/utils/stage_logic';
import {
  DownloadVoteData, CalculateVoteData, 
  ResetVoteData
} from '@/utils/vote_logic';

import Loading from '@/components/Loading.vue';
import Start from '@/components/admin/Start.vue';
import SlideControl from '@/components/admin/SlideControl.vue';

const route = useRoute();
const currentPage = ref(sessionStorage.getItem(ADMIN_CURRENT_PAGE_KEY) || Admin.Start);
const isLoading = ref(currentPage.value !== Admin.Start);
const disableControlSignalDetail = ref(null);
const disableDisplayTimeDetail = ref(null);


// ----- Start Control & Config ----- //

const songData = ref([]);
const controlSignal = ref(null);
const currentSongIndex = ref(0);
const currentStage = ref(Stage.Waiting);
const displayTime = ref("00:00");
const voteResult = ref([]);
const stageList = ref([]);
const loadControlData = () => {
  isLoading.value = true;
  
  // get songData & controlSignal
  GetSongData(songData, !(QUERY_NOCACHE in route.query)).then(() => {
    console.log("songData", songData);
    disableControlSignalDetail.value = ConfigOnControlSignalChange(controlSignal, () => { isLoading.value = false })
  }).then(() => {
    console.log("controlSignal", controlSignal);
    ConfigCurrentSongIndex(controlSignal, currentSongIndex);
    ConfigCurrentStage(controlSignal, currentStage);
    disableDisplayTimeDetail.value = ConfigDisplayTime(controlSignal, displayTime, () => { nextSlide() });
    ConfigVoteResult(controlSignal, voteResult);
  }).then(() => {
    console.log(currentSongIndex, currentStage, displayTime, voteResult);
  });
  
  // get stage list
  GetStageList(stageList, !(QUERY_NOCACHE in route.query)).then(() => {
    console.log("stageList", stageList);
  });
};
const leaveControl = async () => {
  await ResetControlSignal();
  await ResetVoteData();
  
  if (disableControlSignalDetail.value != null) {
    DisableOnControlSignalChange(disableControlSignalDetail.value);
  }
  if (disableDisplayTimeDetail.value != null) {
    DisableDisplayTime(disableDisplayTimeDetail.value);
  }
}

const startControl = async () => {
  isLoading.value = true;
  
  await ResetControlSignal();
  await ResetVoteData();

  currentPage.value = Admin.SlideControl;

  loadControlData();
}

const handleRestart = async () => {
  if (confirm("確定要重新開始活動嗎？目前所有的進度與投票結果將會被重置。")) {
    isLoading.value = true;
    
    await leaveControl();
    
    currentPage.value = Admin.Start; 
    isLoading.value = false;
  }
};


const changeSlide = async (offset) => {
  const { newIndex, newStage } = GetIndexAndStage(
    stageList.value, 
    currentSongIndex.value, 
    currentStage.value, 
    offset
  );
  
  let voteResult = null;
  const currentSongData = songData.value[currentSongIndex.value];
  if (newStage === Stage.Result) {
    await DownloadVoteData().then((votes) => {
      console.log("votes", votes);
      voteResult = CalculateVoteData(
        votes, 
        Object.values(currentSongData.options)
      );
      console.log("voteResult", voteResult);
    });
  }

  await SetControlSignal({
    currentSongIndex: newIndex, 
    currentStage: newStage, 
    endTime: GetEndTimeFromData(songData.value[newIndex], newStage), 
    voteResult: voteResult
  });
}
const prevSlide = () => {
  changeSlide(-1);
}
const nextSlide = () => {
  changeSlide(1);
}


onMounted(() => {
  isLoading.value = true;
  if (currentPage.value === Admin.SlideControl) {
    loadControlData();
  }
  else {
    isLoading.value = false;
  }
});
watch(currentPage, (newPage) => {
  sessionStorage.setItem(ADMIN_CURRENT_PAGE_KEY, newPage);
});
onUnmounted(() => {
  leaveControl();
});
</script>
