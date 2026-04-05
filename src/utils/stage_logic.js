import { db } from '@/firebase';
import { ref as dbRef, get } from 'firebase/database';
import { Stage, STAGELIST_CACHE_KEY, STAGELIST_CACHE_TIME_KEY, CACHE_TTL, RESULT_TOTAL_TIMING } from '@/constants';

export async function GetStageList(output, useCache = true) {
  // check cache
  if (useCache === false) {
    console.log("[stageList] Do not use cache");
    sessionStorage.removeItem(STAGELIST_CACHE_KEY);
    sessionStorage.removeItem(STAGELIST_CACHE_TIME_KEY);
  } else {
    const cachedData = sessionStorage.getItem(STAGELIST_CACHE_KEY);
    const cacheTimestamp = sessionStorage.getItem(STAGELIST_CACHE_TIME_KEY);

    if (cachedData && cacheTimestamp) {
      const isExpired = (Date.now() - parseInt(cacheTimestamp, 10)) > CACHE_TTL;
      if (!isExpired) {
        console.log("[stageList] Use cache");
        output.value = JSON.parse(cachedData);
        return;
      } else {
        console.log("[stageList] Cache Expired");
      }
    }
  }

  // request Firebase
  try {
    const snapshot = await get(dbRef(db, 'stageList'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      output.value = Array.isArray(data) ? data : Object.values(data);
      
      // 成功抓到新資料後，重新寫入 sessionStorage
      sessionStorage.setItem(STAGELIST_CACHE_KEY, JSON.stringify(output.value));
      sessionStorage.setItem(STAGELIST_CACHE_TIME_KEY, Date.now().toString());
      console.log("[stageList] load data from database");
    } else {
      console.warn("[stageList] 資料庫中找不到 stageList 節點");
      output.value = [];
    }
  } catch (error) {
    console.error("[stageList] 抓取失敗:", error);

    const fallbackData = sessionStorage.getItem(STAGELIST_CACHE_KEY);
    if (fallbackData) {
      console.warn("[stageList] 啟動 Fallback：使用舊版快取資料");
      output.value = JSON.parse(fallbackData);
    }
  }
}

export function IsAutoAdvanceStage(stage) {
  return stage === Stage.Vote || stage === Stage.Result;
}

/**
 * 計算下一個(或上一個)階段與歌曲索引
 * @param {Array} stageListData - 從 Firebase 抓回來的完整 stageList 陣列 (例如 output.value)
 * @param {number} currentIndex - 當前的 currentSongIndex
 * @param {string} currentStage - 當前的 currentStage
 * @param {number} offset - 切換方向 (1 為下一步, -1 為上一步)
 * @returns {Object} 回傳包含 { newIndex, newStage } 的物件
 */
export function GetIndexAndStage(stageListData, currentIndex, currentStage, offset) {
  // 1. 防呆：如果沒有列表資料，維持原樣
  if (!stageListData || !Array.isArray(stageListData) || stageListData.length === 0) {
    return { newIndex: currentIndex, newStage: currentStage };
  }

  // 2. 找到當前 index 對應的流程表
  const listIndex = currentIndex;
  if (currentIndex >= stageListData.length || currentIndex < 0) {
    // 防呆：如果當前 index 根本不在資料庫裡，維持原樣
    return { newIndex: currentIndex, newStage: currentStage };
  }
  const currentList = stageListData[listIndex].list;
  const stagePos = currentList.indexOf(currentStage);

  // 防呆：如果當前階段不在列表中 (可能是手動改 DB 導致的)，預設從該首歌曲的第一個階段開始
  if (stagePos === -1) {
    return { newIndex: currentIndex, newStage: currentList[0] };
  }

  // 3. 計算目標位置
  const targetPos = stagePos + offset;

  // 4. 判斷是否需要「跨歌曲 (換 Index)」
  if (targetPos >= currentList.length) {
    // 狀況 A：下一步超過了當前 index 的最後一個階段 -> 進入「下一個 index」的第一個階段
    if (listIndex + 1 < stageListData.length) {
      const nextData = stageListData[listIndex + 1];
      return {
        newIndex: nextData.index,
        newStage: nextData.list[0]
      };
    } else {
      // 已經是整個活動的最後一個階段，到底了不給切換
      return { newIndex: currentIndex, newStage: currentStage }; 
    }
  } else if (targetPos < 0) {
    // 狀況 B：上一步超過了當前 index 的第一個階段 -> 退回「上一個 index」的最後一個階段
    if (listIndex - 1 >= 0) {
      const prevData = stageListData[listIndex - 1];
      return {
        newIndex: prevData.index,
        newStage: prevData.list[prevData.list.length - 1]
      };
    } else {
      // 已經是整個活動的最開頭，退無可退
      return { newIndex: currentIndex, newStage: currentStage };
    }
  } else {
    // 5. 狀況 C：在同一個 index 內正常切換階段
    return {
      newIndex: currentIndex,
      newStage: currentList[targetPos]
    };
  }
}

export function GetEndTimeFromData(currentSongData, currentStage) {
  let temp = 0; // in ms

  switch (currentStage) {
    case Stage.Vote:
      temp = currentSongData["voteTime"] * 1000;
      break;

    case Stage.Result:
      temp = RESULT_TOTAL_TIMING;
      break;

    default:
      return 0;
  }

  return Date.now() + temp;
}
