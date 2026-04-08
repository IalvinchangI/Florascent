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
export const ADMIN_RESTART = "restart-control"

export const SONGDATA_CACHE_KEY = 'Florascent_songData';
export const SONGDATA_CACHE_TIME_KEY = 'Florascent_songData_timestamp';
export const STAGELIST_CACHE_KEY = 'Florascent_stageList';
export const STAGELIST_CACHE_TIME_KEY = 'Florascent_stageList_timestamp';
export const CACHE_TTL = 4 * 60 * 60 * 1000;  // 4 hr

export const ADMIN_CURRENT_PAGE_KEY = 'Florascent_adminCurrentPage';

export const QUERY_NOCACHE = "preview";

export const RESULT_TRANSITION_TIMING = {
  INITIAL_HOLD: 1500,     
  REVEAL_DURATION: 3000,  
  WINNER_HOLD: 4000,      
  FADE_TO_BLACK: 2000     
};
export const RESULT_TOTAL_TIMING = Object.values(RESULT_TRANSITION_TIMING).reduce((sum, value) => sum + value, 0);

export const ORIGINAL_CONTORL_SIGNAL = {
  "currentSongIndex": 0,
  "currentRoute": 0,
  "currentStage": "Waiting",
  "endTime": 0,
  "voteResult": [
    {
      "id": "0-1",
      "percent": 50,
      "winner": true
    },
    {
      "id": "0-2",
      "percent": 50,
      "winner": false
    }
  ]
};

export const ORIGINAL_VOTE_STATISTIC = null;
