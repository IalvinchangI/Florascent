import { db } from '@/firebase';
import { ref as dbRef, get } from 'firebase/database';
import { LANG, SONGDATA_CACHE_KEY, SONGDATA_CACHE_TIME_KEY, CACHE_TTL } from '@/constants';

/**
 * 取得歌曲資料
 * @param {import('vue').Ref} output - 接收資料的 Vue Ref
 * @param {boolean} useCache - 決定是否使用快取，預設為 true。若傳入 false，則強制清除舊快取並重新抓取。
 */
export async function GetSongData(output, useCache = true) {
  // check cache
  if (useCache === false) {
    console.log("[songData] Do not use cache");
    sessionStorage.removeItem(SONGDATA_CACHE_KEY);
    sessionStorage.removeItem(SONGDATA_CACHE_TIME_KEY);
  } else {
    const cachedData = sessionStorage.getItem(SONGDATA_CACHE_KEY);
    const cacheTimestamp = sessionStorage.getItem(SONGDATA_CACHE_TIME_KEY);

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
      sessionStorage.setItem(SONGDATA_CACHE_KEY, JSON.stringify(output.value));
      sessionStorage.setItem(SONGDATA_CACHE_TIME_KEY, Date.now().toString());
      console.log("[songData] load data from database");
    } else {
      console.warn("[songData] 資料庫中找不到 songData 節點");
      output.value = [];
    }
  } catch (error) {
    console.error("[songData] 抓取失敗:", error);

    const fallbackData = sessionStorage.getItem(SONGDATA_CACHE_KEY);
    if (fallbackData) {
      console.warn("[songData] 啟動 Fallback：使用舊版快取資料");
      output.value = JSON.parse(fallbackData);
    }
  }
}


/**
 * 取得該首歌曲是否允許反悔 (canRegret)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {boolean} 預設為 false
 */
export function GetCanRegret(song) {
  if (song && typeof song.canRegret === 'boolean') {
    return song.canRegret;
  }
  return false;
}

/**
 * 取得該首歌曲是否允許改變路線 (canChangeRoute)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {boolean} 預設為 false
 */
export function GetCanChangeRoute(song) {
  if (song && typeof song.canChangeRoute === 'boolean') {
    return song.canChangeRoute;
  }
  return false;
}

/**
 * 取得該首歌曲是否為損壞狀態/特殊狀態 (isBroken)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {boolean} 預設為 false
 */
export function GetIsBroken(song) {
  if (song && typeof song.isBroken === 'boolean') {
    return song.isBroken;
  }
  return false;
}

/**
 * 取得該首歌曲的角色圖片連結 (characterLink)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {string|null} 預設為 null
 */
export function GetCharacterLink(song) {
  if (song && typeof song.characterLink === 'string' && song.characterLink.trim() !== '') {
    return song.characterLink;
  }
  return null;
}

/**
 * 取得該首歌曲的等待畫面連結 (waitingLink)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {string|null} 預設為 null
 */
export function GetWaitingLink(song) {
  if (song && typeof song.waitingLink === 'string' && song.waitingLink.trim() !== '') {
    return song.waitingLink;
  }
  return null;
}

/**
 * 取得該首歌曲的背景連結 (backgroundLink)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} orientation - 背景的方向 (`horizontal`或`vertical`)
 * @returns {string|null} 預設為 null
 */
export function GetBackgroundLink(song, orientation) {
  if (song && typeof song.backgroundLink === 'object' && song.backgroundLink !== null) {
    switch (orientation) {
      case "horizontal":
        return song.backgroundLink.horizontal || null;
      case "vertical":
        return song.backgroundLink.vertical || null;
      default:
        return null;
    }
  }
  return null;
}

/**
 * 取得該首歌曲的投票時長 (voteTime)
 * @param {Object} song - 單首歌曲的資料物件
 * @returns {number} 回傳秒數，預設為 0 秒
 */
export function GetVoteTime(song) {
  if (song && typeof song.voteTime === 'number' && song.voteTime > 0) {
    return song.voteTime;
  }
  return 0; // 預設 0 秒
}


/**
 * 取得該首歌曲的介紹文字 (description)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} lang - 當前選擇的語言 (例如 'zh-TW', 'en')
 * @returns {Array<string>} 回傳以換行符號切割後的字串陣列
 */
export function GetDescription(song, lang) {
  if (!song || !song.description) return [];
  const text = song.description[lang] || song.description[LANG.TW];
  return text ? text.split('\n') : [];
}

/**
 * 取得該首歌曲的標題 (title)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} lang - 當前選擇的語言 (例如 'zh-TW', 'en')
 * @returns {string} 回傳對應語言的標題，預設為空字串
 */
export function GetTitle(song, lang) {
  if (!song || !song.title) return '';
  return song.title[lang] || song.title[LANG.TW] || '';
}

/**
 * 取得該首歌曲的投票選項清單 (options)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} lang - 當前選擇的語言 (例如 'zh-TW', 'en')
 * @returns {Array<Object>} 回傳處理過語言的選項陣列
 */
export function GetOptions(song, lang) {
  if (!song || !Array.isArray(song.options)) return [];
  
  return song.options.map(option => {
    // 預先過濾出當前語言的文字，方便前端直接使用，不用在 template 裡面再判斷一次
    const titleText = option.title ? (option.title[lang] || option.title[LANG.TW]) : '';
    const descText = option.description ? (option.description[lang] || option.description[LANG.TW]) : '';
    const regretText = option.regretText ? (option.regretText[lang] || option.regretText[LANG.TW]) : '';

    return {
      id: option.id,
      title: titleText,
      description: descText ? descText.split('\n') : [],
      regretText: regretText ? regretText.split('\n') : []
    };
  });
}

/**
 * 取得該首歌曲的問題文字 (question)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} lang - 當前選擇的語言 (例如 'zh-TW', 'en')
 * @param {number} currentRoute - 當前路線索引 (由 controlSignal 提供)
 * @returns {Array<string>} 回傳以換行符號切割後的字串陣列
 */
export function GetQuestion(song, lang, currentRoute = 0) {
  if (!song || !song.question) return [];

  let textObj = null;

  // 如果 question 是一個陣列 (代表有多條路線可選)
  if (Array.isArray(song.question)) {
    // 防呆：確保 currentRoute 不會超出陣列範圍
    const safeRouteIndex = (currentRoute >= 0 && currentRoute < song.question.length) 
      ? currentRoute 
      : 0;
    textObj = song.question[safeRouteIndex];
  } else {
    // 如果 question 只是一個單一物件 (單一路線)
    textObj = song.question;
  }

  if (!textObj) return [];
  
  const text = textObj[lang] || textObj[LANG.TW];
  return text ? text.split('\n') : [];
}

/**
 * 取得該首歌曲的作者資訊 (author)
 * @param {Object} song - 單首歌曲的資料物件
 * @param {string} lang - 當前選擇的語言 (例如 'zh-TW', 'en')
 * @returns {Object} 回傳處理過語言的作者資訊物件
 */
export function GetAuthor(song, lang) {
  if (!song || !song.author) return {};
  
  const author = song.author;

  const lyricsText = author.Lyrics ? (author.Lyrics[lang] || author.Lyrics[LANG.TW]) : '';
  const composerText = author.Composer ? (author.Composer[lang] || author.Composer[LANG.TW]) : '';

  return {
    Lyrics: lyricsText,
    Composer: composerText
  };
}
