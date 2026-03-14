import { db } from '@/firebase';
import { ref as dbRef, get } from 'firebase/database';
import { CACHE_KEY, CACHE_TIME_KEY, CACHE_TTL } from '@/constants';

/**
 * 取得歌曲資料
 * @param {import('vue').Ref} output - 接收資料的 Vue Ref
 * @param {boolean} useCache - 決定是否使用快取，預設為 true。若傳入 false，則強制清除舊快取並重新抓取。
 */
export async function GetSongData(output, useCache = true) {
  // check cache
  if (useCache == false) {
    console.log("[songData] Do not use cache");
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIME_KEY);
  } else {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    const cacheTimestamp = sessionStorage.getItem(CACHE_TIME_KEY);

    if (cachedData && cacheTimestamp) {
      const isExpired = (Date.now() - parseInt(cacheTimestamp, 10)) > CACHE_TTL;
      if (!isExpired) {
        console.log("[songData] Use cache");
        output.value = JSON.parse(cachedData);
        return;
      } else {
        console.log("[songData] Cache Expired");
      }
    }
  }

  // request Firebase
  try {
    const snapshot = await get(dbRef(db, 'songData'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      output.value = Array.isArray(data) ? data : Object.values(data);
      
      // 成功抓到新資料後，重新寫入 sessionStorage
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(output.value));
      sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      console.log("[songData] load data from database");
    } else {
      console.warn("[songData] 資料庫中找不到 songData 節點");
      output.value = [];
    }
  } catch (error) {
    console.error("[songData] 抓取失敗:", error);

    const fallbackData = sessionStorage.getItem(CACHE_KEY);
    if (fallbackData) {
      console.warn("[songData] 啟動 Fallback：使用舊版快取資料");
      output.value = JSON.parse(fallbackData);
    }
  }
}
