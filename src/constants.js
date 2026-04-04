// some constance
export const LANG = {
  TW: 'zh-TW',
  EN: 'en'
};
export const LANG_SELECT = "lang-selection"

export const ROLE = {
  AUDIENCE: 'audience',
  PROJECTOR: 'projector'
};

export const Stage = {
  Waiting: 'Waiting', 
  Intro: 'Intro', 
  Vote: 'Vote', 
  Result: 'Result', 
  Performance: 'Performance', 
  Next: 'Next'
}

export const OPTION_SELECT = "option-selection"

export const Admin = {
  Start: 'Start', 
  SlideControl: 'SlideControl'
}

export const ADMIN_START = "start-control"
export const ADMIN_PREV_SLIDE = "previous-slide"
export const ADMIN_NEXT_SLIDE = "next-slide"

export const SONGDATA_CACHE_KEY = 'Florascent_songData';
export const SONGDATA_CACHE_TIME_KEY = 'Florascent_songData_timestamp';
export const STAGELIST_CACHE_KEY = 'Florascent_stageList';
export const STAGELIST_CACHE_TIME_KEY = 'Florascent_stageList_timestamp';
export const CACHE_TTL = 4 * 60 * 60 * 1000;  // 4 hr

export const QUERY_NOCACHE = "preview"
