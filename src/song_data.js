// song_data.js
import { LANG } from '@/constants.js'; // 如果這邊不能 import，就直接用字串 'zh-TW', 'en' 也可以

export const SongData = {
    index: 0,  
    // 標題改成物件，包含兩種語言
    title: {
        [LANG.TW]: "六月茉莉",
        [LANG.EN]: "June Jasmine"
    },
    // 歌詞/敘述也改成物件
    description: {
        [LANG.TW]: "六月茉莉滿山香 單身娘仔守空房、\n好花開透人來採 娘仔十八誰人知。\n\n六月茉莉香透天 單身娘仔看天星、\n好花也著好花盆 娘仔何時見親君。\n六月茉莉滿山香 單身娘仔守空房、\n好花開透人來採 娘仔十八誰人知。\n\n六月茉莉香透天 單身娘仔看天星、\n好花也著好花盆 娘仔何時見親君。",
        [LANG.EN]: "Jasmine in June fills the hills with fragrance,\nA single maiden guards her empty room.\nThe beautiful flowers bloom fully for picking,\nWho knows the eighteen-year-old maiden?\n\nJasmine in June scents the sky,\nThe single maiden gazes at the stars.\nJasmine in June fills the hills with fragrance,\nA single maiden guards her empty room.\nThe beautiful flowers bloom fully for picking,\nWho knows the eighteen-year-old maiden?\n\nJasmine in June scents the sky,\nThe single maiden gazes at the stars."
    }, 
    characterLink: "/src/assets/images/character.png", // 或圖片網址
    question: "", 
    voteTime: 0, 
    options: [
        {
            title: { [LANG.TW]: "選項一", [LANG.EN]: "Option 1" }, 
            description: { [LANG.TW]: "描述...", [LANG.EN]: "Desc..." }
        }, 
        // ...
    ], 
    canRegret: false
}