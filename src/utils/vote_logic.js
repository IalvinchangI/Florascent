import { db, ResetNode } from '@/firebase';
import { ref as dbRef, push, get } from 'firebase/database';
import { ORIGINAL_VOTE_STATISTIC } from '@/constants';

// upload vote data
// "voteStatistic": [
//     {
//         "voteTime": Number in ms, 
//         "optionID": String ({songIndex}-{0 or 1})
//     }, 
//     // other people's voted
// ]
export async function UploadVoteData(option) {
  // 使用 push() 會在 voteStatistic 節點下自動生成唯一的 key 並加入資料
  const voteRef = dbRef(db, 'voteStatistic');
  const payload = {
    voteTime: Date.now(),
    optionID: option.id
  };

  try {
    await push(voteRef, payload);
    console.log(`[Vote] 成功投給選項: ${payload.optionID}`);
  } catch (error) {
    console.error("[Vote] 投票上傳失敗:", error);
    return 1;
  }
  return 0;
}


// download vote data
export async function DownloadVoteData() {
  const voteRef = dbRef(db, 'voteStatistic');
  
  try {
    const snapshot = await get(voteRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Firebase push 的資料是 Object (key為亂碼), 我們將其轉回 Array
      return Object.values(data);
    } else {
      console.warn("[Vote] 目前沒有任何投票資料");
      return [];
    }
  } catch (error) {
    console.error("[Vote] 下載投票資料失敗:", error);
    return [];
  }
}


// calculate vote data
// "voteResult": [
//     {
//         "id": "1-1", 
//         "percent": 50,
//         "winner": true
//     },
//     {
//         "id": "1-2", 
//         "percent": 50,
//         "winner": false
//     }
// ]
/**
 * 根據 songData 的 options 計算得票百分比與勝負 (包含沒人投票的預設值處理)
 * @param {Object|Array|null} rawVotes - 從 Firebase 取得的原始投票資料
 * @param {Array} songOptions - 當前歌曲的 options 陣列 (從 songData 取得)
 * @returns {Array} 計算完畢的 voteResult 陣列
 */
export function CalculateVoteData(rawVotes, songOptions) {
  // 1. 防呆：轉換投票資料為陣列
  let votesArray = [];
  if (rawVotes) {
    votesArray = Array.isArray(rawVotes) ? rawVotes : Object.values(rawVotes);
  }

  const optionStats = {};

  // 2. 根據 songData 的 options 預先建立所有的選項
  if (songOptions && Array.isArray(songOptions)) {
    songOptions.forEach(opt => {
      if (opt.id) {
        optionStats[opt.id] = {
          id: opt.id,
          count: 0,
          firstVoteTime: Infinity // 預設為無限大
        };
      }
    });
  }

  // 3. 統計實際的票數與最先投票時間
  votesArray.forEach(vote => {
    const vId = vote.optionID;
    if (vId && optionStats[vId]) {
      optionStats[vId].count++;
      
      // 更新最先投票時間
      if (vote.voteTime < optionStats[vId].firstVoteTime) {
        optionStats[vId].firstVoteTime = vote.voteTime;
      }
    }
  });

  const results = Object.values(optionStats);
  const totalVotes = results.reduce((sum, opt) => sum + opt.count, 0);

  // 4. 優先進行排序：確保後續指派「預設贏家」時，永遠是排在最前面的選項
  results.sort((a, b) => {
    const numA = parseInt(a.id.split('-')[1] || 0, 10);
    const numB = parseInt(b.id.split('-')[1] || 0, 10);
    return numA - numB;
  });

  let winningId = null;

  // 5. 判斷勝負與平手邏輯
  if (totalVotes > 0) {
    const maxVotes = Math.max(...results.map(o => o.count));
    const tiedOptions = results.filter(o => o.count === maxVotes);

    if (tiedOptions.length === 1) {
      winningId = tiedOptions[0].id;
    } else {
      // 發生平手，比對誰的第一票時間比較早
      const tieBreakerWinner = tiedOptions.reduce((prev, curr) => {
        return prev.firstVoteTime < curr.firstVoteTime ? prev : curr;
      });
      winningId = tieBreakerWinner.id;
    }
  } else if (results.length > 0) {
    // 沒人投票的預設狀況：直接指定排序後的第一個選項為贏家
    winningId = results[0].id;
  }

  // 6. 計算百分比並格式化輸出
  const numOptions = results.length;
  // 計算沒人投票時的基本平分比例 (例如 2個選項就是 50，3個選項就是 33)
  const basePercent = numOptions > 0 ? Math.floor(100 / numOptions) : 0;
  // 處理除不盡的餘數 (例如 3個選項會剩下 1)
  const remainder = numOptions > 0 ? 100 - (basePercent * numOptions) : 0;

  const finalResult = results.map((opt, index) => {
    let finalPercent = 0;

    if (totalVotes > 0) {
      // 有人投票，依真實比例計算
      finalPercent = Math.round((opt.count / totalVotes) * 100);
    } else if (numOptions > 0) {
      // 沒人投票，平分 100%。若有餘數則補給贏家(第一個選項)
      finalPercent = basePercent + (index === 0 ? remainder : 0);
    }

    return {
      id: opt.id,
      percent: finalPercent,
      winner: opt.id === winningId
    };
  });

  return finalResult;
}

export async function ResetVoteData() {
  await ResetNode(
    'voteStatistic', 
    ORIGINAL_VOTE_STATISTIC
  );
}
