import { GetBackgroundLink } from "./song_data_logic";
import { BACKGROUND_HORIZONTAL_URL, BACKGROUND_VERTICAL_URL, COUNTDOWN_SECOND_URLS } from "@/assets_url";

/**
 * 取得當前畫面的背景樣式 (Background Style)
 * * 根據目前的歌曲資料、所處階段以及設備方向，決定要顯示「該歌曲的專屬背景」或是「預設背景」。
 * * @param {Object|null} songData - 單首歌曲的資料物件。若資料尚未載入請傳入 null。
 * @param {boolean} useDefaultBackground - 是否強制使用預設背景 (例如：當前階段不屬於需要顯示圖片的階段時傳入 true)。
 * @param {string} orientation - 螢幕方向，傳入 "horizontal" (投影幕) 或 "vertical" (手機觀眾)。
 * @returns {Object} 回傳可直接綁定於 Vue :style 的 CSS 樣式物件。
 */
export function GetBackgroundStyle(songData, useDefaultBackground, orientation) {
    const template = {
        backgroundImage: `url('${(orientation === "horizontal") ? BACKGROUND_HORIZONTAL_URL : BACKGROUND_VERTICAL_URL}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    // 如果還沒載入資料，或是沒有選中歌曲，就用預設背景
    if (!songData) {  // songData = single song data
        return template;
    }

    // 判斷是否在需要顯示背景的四個階段中
    if (useDefaultBackground === false) {
        const bgUrl = GetBackgroundLink(
            songData, 
            orientation
        );
        if (bgUrl) {
            template.backgroundImage = `url('${bgUrl}')`;
            return template;
        }
    }
    
    // 否則回傳預設背景
    return template;
}

/**
 * 根據倒數時間（MM:SS）取得對應秒數的提示圖片 URL。
 * 註：僅在倒數時間小於 1 分鐘（即分鐘數為 0）時才會觸發顯示。
 *
 * @param {string} time - 倒數時間字串，預期格式為 "MM:SS"（例如 "00:15"）。
 * @returns {string|null} 回傳對應秒數的圖片 URL。若格式不符、時間大於等於 1 分鐘或查無圖片，則回傳 null。
 */
export function GetCountdownSecondLink(time) {
    // 1. 防呆機制：確保 time 參數存在，且包含時間分隔符號 ":"
    if (!time || !time.includes(":")) {
        return null;
    }

    // 2. 解析字串：將時間拆分為分鐘與秒數，並轉換為十進位整數 (Base 10)
    const splitTime = time.split(":");
    const minutes = parseInt(splitTime[0], 10);
    const seconds = parseInt(splitTime[1], 10);

    // 3. 條件限制：如果還有剩餘的分鐘數（大於等於 1 分鐘），則不顯示倒數圖片
    if (minutes !== 0) {
        return null;
    }

    // 4. 回傳結果：使用解析出的秒數作為 Key，尋找對應的圖片 URL，若無則回傳 null
    return COUNTDOWN_SECOND_URLS[seconds - 1] || null;
}

/**
 * 預載每一張倒數圖片
 */
export async function PreloadtCountdownSecondLink() {
    COUNTDOWN_SECOND_URLS.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}
