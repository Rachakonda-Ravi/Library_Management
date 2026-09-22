
export const APP_VERSION = 1;
export const DB_KEY = "lm_complete_database_v1";
export const SESSION_KEY = "lm_complete_session_v1";
export const THEME_KEY = "lm_complete_theme_v1";
export const PORT_FILE = ".library_port";

export const DEFAULT_SETTINGS = Object.freeze({
  libraryName:"Library Management",
  emailDomains:[],
  loanDays:14,
  maxLoans:5,
  maxRenewals:2,
  dailyFine:5,
  reservationLimit:3,
  reservationExpiryDays:3,
  fineGraceDays:0,
  currency:"INR",
  dateFormat:"DD/MM/YYYY",
  itemsPerPage:10
});

export const THEMES = [
  ["system","System"],["light","Light"],["dark","Dark"],
  ["ocean","Ocean"],["forest","Forest"],["rose","Rose"],["slate","Slate"],["violet","Violet"],["sunset","Sunset"],["midnight","Midnight"]
];

export function newDatabase(){
  return {
    version:APP_VERSION, createdAt:Date.now(), updatedAt:Date.now(),
    settings:structuredClone(DEFAULT_SETTINGS),
    users:[], books:[], loans:[], reservations:[], fines:[],
    notifications:[], audit:[]
  };
}
