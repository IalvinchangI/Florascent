import { GetBackgroundLink } from "./song_data_logic";
import { BACKGROUND_HORIZONTAL_URL, BACKGROUND_VERTICAL_URL } from "@/assets_url";

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


