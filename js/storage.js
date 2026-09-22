
import {DB_KEY,SESSION_KEY,THEME_KEY,DEFAULT_SETTINGS,newDatabase} from "./config.js";

function ls(){try{return window.localStorage}catch{return null}}
function ss(){try{return window.sessionStorage}catch{return null}}
function get(store,key){try{return store?.getItem(key)||null}catch{return null}}
function put(store,key,value){try{store?.setItem(key,value);return true}catch{return false}}
function remove(store,key){try{store?.removeItem(key)}catch{}}

function normalize(raw){
  const base=newDatabase();
  if(!raw||typeof raw!=="object")return base;
  return {
    ...base,...raw,version:1,updatedAt:Date.now(),
    settings:{...DEFAULT_SETTINGS,...(raw.settings||{})},
    users:Array.isArray(raw.users)?raw.users:[],
    books:Array.isArray(raw.books)?raw.books:[],
    loans:Array.isArray(raw.loans)?raw.loans:[],
    reservations:Array.isArray(raw.reservations)?raw.reservations:[],
    fines:Array.isArray(raw.fines)?raw.fines:[],
    notifications:Array.isArray(raw.notifications)?raw.notifications:[],
    audit:Array.isArray(raw.audit)?raw.audit:[]
  };
}
export function storageAvailable(){const s=ls();try{if(!s)return false;const k="__lm_probe__";s.setItem(k,"1");s.removeItem(k);return true}catch{return false}}
export function loadDB(){try{const raw=get(ls(),DB_KEY);return raw?normalize(JSON.parse(raw)):newDatabase()}catch{return newDatabase()}}
export function saveDB(db){db.updatedAt=Date.now();return put(ls(),DB_KEY,JSON.stringify(db))}
export function loadSession(){try{return JSON.parse(get(ss(),SESSION_KEY)||"null")}catch{return null}}
export function saveSession(v){return put(ss(),SESSION_KEY,JSON.stringify(v))}
export function clearSession(){remove(ss(),SESSION_KEY)}
export function loadTheme(){return get(ls(),THEME_KEY)||"system"}
export function saveTheme(v){return put(ls(),THEME_KEY,v)}
export function clearDB(){remove(ls(),DB_KEY);clearSession()}
export function exportDB(db){return {format:"LibraryManagementBackup",formatVersion:1,exportedAt:new Date().toISOString(),database:db}}
export function importDB(payload){
  const raw=payload?.format==="LibraryManagementBackup"?payload.database:payload;
  if(!raw||typeof raw!=="object"||!Array.isArray(raw.users)||!Array.isArray(raw.books)||!raw.settings)throw new Error("Invalid backup");
  return normalize(raw);
}
