import { db } from '@/firebase';
import { ref as dbRef, onValue, off, set } from 'firebase/database';
import { watch, onUnmounted } from 'vue';
import { Stage } from '@/constants';

/**
 * 1. 綁定控制訊號 (自動同步 DB)
 * @param {import('vue').Ref} output - 接收 controlSignal 的 Ref
 * @param {Function} [onFinishCallback] - (可選) 更新完時要執行的 Callback function
 */
export function ConfigOnControlSignalChange(output, onFinishCallback) {
  const signalRef = dbRef(db, 'controlSignal');
  
  // fetch signal
  const unsubscribe = onValue(signalRef, (snapshot) => {
    if (snapshot.exists()) {
      output.value = snapshot.val();
    } else {
      output.value = null;
    }
    
    // 檢查並執行傳入的 Callback function
    if (typeof onFinishCallback === 'function') {
      onFinishCallback();
    }
  });

  // disable detail
  return {
    query: signalRef, 
    event_type: 'value', 
    callback: unsubscribe
  };
}
export function DisableOnControlSignalChange({
  query, event_type, callback
}) {
  off(query, event_type, callback);
}

/**
 * 2. 自動計算並更新倒數時間字串
 * @param {import('vue').Ref} controlSignal - 監聽的訊號來源
 * @param {import('vue').Ref} output - 輸出的字串 (ex: "01:00")
 * @param {Function} [onTimeUpCallback] - (可選) 時間到時要執行的 Callback function
 */
export function ConfigDisplayTime(controlSignal, output, onTimeUpCallback) {
  let timerId = null;

  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  // 封裝好的本機倒數邏輯
  const calculateTime = (endTime) => {
    const now = Date.now();
    const remainMs = endTime - now;

    if (remainMs <= 0) {
      output.value = "00:00";
      clearTimer(); // 時間到，自動停止計時器
      
      // 檢查並執行傳入的 Callback function
      if (typeof onTimeUpCallback === 'function') {
        onTimeUpCallback();
      }
      return;
    }

    // 毫秒轉分秒的數學運算
    const totalSeconds = Math.floor(remainMs / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    output.value = `${m}:${s}`;
  };

  // 監控 controlSignal，只要 DB 的資料改變，就觸發這裡
  watch(controlSignal, (newVal) => {
    clearTimer(); // 每次訊號有變（例如主控台重設時間），先砍掉舊的計時器

    // 判斷是否需要開始倒數 (例如 endTime 大於 0)
    if (newVal && newVal.endTime > 0) {
      // 1. 收到訊號的瞬間先算一次，避免畫面延遲一秒才出現數字
      calculateTime(newVal.endTime); 
      // 2. 啟動本地端計時器，每秒更新畫面
      timerId = setInterval(() => {
        calculateTime(newVal.endTime);
      }, 1000);
    } else {
      output.value = "00:00"; // 沒有 endTime 時的預設顯示
    }
  }, { immediate: true, deep: true });

  // disable detail
  return {
    callback: clearTimer
  };
}
export function DisableDisplayTime({
  callback
}) {
  callback();
}

/**
 * 3. 取得投票結果
 * @param {import('vue').Ref} controlSignal - 監聽的訊號來源
 * @param {import('vue').Ref} output - 輸出的陣列
 */
export function ConfigVoteResult(controlSignal, output) {
  watch(controlSignal, (newVal) => {
    if (newVal && newVal.voteResult) {
      output.value = newVal.voteResult;
    } else {
      output.value = [
        { percent: 50, winner: true },
        { percent: 50, winner: false }
      ];
    }
  }, { immediate: true, deep: true });
}

/**
 * 4. 取得當前階段 (currentStage)
 * @param {import('vue').Ref} controlSignal - 監聽的訊號來源
 * @param {import('vue').Ref} output - 輸出的變數
 */
export function ConfigCurrentStage(controlSignal, output) {
  watch(controlSignal, (newVal) => {
    if (newVal && newVal.currentStage != null) {
      output.value = newVal.currentStage;
    } else {
      output.value = Stage.Waiting; 
    }
  }, { immediate: true, deep: true });
}

/**
 * 5. 取得當前歌曲索引 (currentSongIndex)
 * @param {import('vue').Ref} controlSignal - 監聽的訊號來源
 * @param {import('vue').Ref} output - 輸出的變數
 */
export function ConfigCurrentSongIndex(controlSignal, output) {
  watch(controlSignal, (newVal) => {
    if (newVal && newVal.currentSongIndex != null) {
      output.value = newVal.currentSongIndex;
    } else {
      output.value = 0;
    }
  }, { immediate: true, deep: true });
}

/**
 * 6. 設定並發送控制訊號到 Firebase (完全覆寫 controlSignal 節點)
 * @param {Object} payload - 包含所有控制訊號的物件
 * @param {number} [payload.endTime=0] - 倒數結束時間 (預設為 0)
 * @param {Array|null} [payload.voteResult=null] - 投票結果 (預設為 null)
 * @param {string} payload.currentStage - 當前階段
 * @param {number} payload.currentSongIndex - 當前歌曲索引
 */
export async function SetControlSignal({
  endTime = 0,
  voteResult = null,
  currentStage,
  currentSongIndex
}) {
  const signalRef = dbRef(db, 'controlSignal');
  
  try {
    // set() 會完全覆寫資料庫中 'controlSignal' 這個節點底下的所有東西
    await set(signalRef, {
      currentSongIndex, 
      currentStage, 
      endTime, 
      voteResult
    });
    console.log("Firebase controlSignal 更新成功！");
  } catch (error) {
    console.error("Firebase 更新失敗：", error);
  }
}
