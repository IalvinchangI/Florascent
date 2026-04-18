<template>
  <div class="admin-container" :style="backgroundStyle">

      <Loading v-if="isLoading" />

      <template v-else>
        <Start v-if="currentPage === Admin.Start" 
          @[ADMIN_START]="startControl"
        />
        <SlideControl v-else-if="currentPage === Admin.SlideControl" 
          :songData="songData[currentSongIndex]" :stageList="stageList"
          :voteResult="voteResult" :time="displayTime"
          :currentSongIndex="currentSongIndex" :currentStage="currentStage" :currentRoute="currentRoute"
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
import {
  GetSongData, 
  GetCanChangeRoute
} from '@/utils/song_data_logic';
import { 
  ConfigOnControlSignalChange, DisableOnControlSignalChange, 
  ConfigCurrentStage, ConfigCurrentSongIndex, ConfigCurrentRoute, 
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
  DownloadVoteData, CalculateVoteData, GetWinnerIndex, 
  ResetVoteData
} from '@/utils/vote_logic';
import { GetBackgroundStyle } from '@/utils/assets_tools';

import Loading from '@/components/Loading.vue';
import Start from '@/components/admin/Start.vue';
import SlideControl from '@/components/admin/SlideControl.vue';

const route = useRoute();
const currentPage = ref(sessionStorage.getItem(ADMIN_CURRENT_PAGE_KEY) || Admin.Start);
const isLoading = ref(currentPage.value !== Admin.Start);
const disableControlSignalDetail = ref(null);
const disableDisplayTimeDetail = ref(null);

const backgroundStyle = GetBackgroundStyle(null, true, "horizontal");


// ----- Start Control & Config ----- //

const songData = ref([]);
const controlSignal = ref(null);
const currentSongIndex = ref(0);
const currentStage = ref(Stage.Waiting);
const currentRoute = ref(0);
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
    ConfigCurrentRoute(controlSignal, currentRoute);
    disableDisplayTimeDetail.value = ConfigDisplayTime(controlSignal, displayTime, () => { nextSlide() });
    ConfigVoteResult(controlSignal, voteResult);
  }).then(() => {
    console.log(currentSongIndex, currentStage, currentRoute, displayTime, voteResult);
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


const routeHistory = ref([]);

const changeSlide = async (offset) => {
  const { newIndex, newStage } = GetIndexAndStage(
    stageList.value, 
    currentSongIndex.value, 
    currentStage.value, 
    offset
  );
  
  const currentSongData = songData.value[newIndex];
  
  let finalVoteResult = null;
  let finalRoute = currentRoute.value; 

  if (newStage === Stage.Result) {
    // 【前進到達 Result】
    if (currentStage.value === Stage.Vote && offset > 0) {
      routeHistory.value.push(currentRoute.value);
    }

    // 下載並計算投票結果
    const votes = await DownloadVoteData();
    finalVoteResult = CalculateVoteData(
      votes, 
      Object.values(currentSongData.options || [])
    );
    
    let winnerIndex = GetWinnerIndex(finalVoteResult);
    winnerIndex = (winnerIndex === null) ? 0 : winnerIndex - 1;

    // 決定新路線
    if (GetCanChangeRoute(currentSongData) === true) {
      finalRoute = winnerIndex;
    }
    else {
      finalRoute = 0;
    }

  } else if (currentStage.value === Stage.Result && offset < 0) {
    // 【從 Result 往回退 (例如退回 Vote)】
    finalRoute = routeHistory.value.pop() ?? 0;
    
  } 

  // 發送訊號給 Firebase
  await SetControlSignal({
    currentSongIndex: newIndex, 
    currentStage: newStage, 
    currentRoute: finalRoute, 
    endTime: GetEndTimeFromData(currentSongData, newStage), 
    voteResult: finalVoteResult
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

<style scoped>
.admin-container {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #f5efca 0%, #cfbb8e 100%);
  position: relative;
}
</style>
