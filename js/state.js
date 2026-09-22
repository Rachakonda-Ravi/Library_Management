
import {newDatabase} from "./config.js";
import {loadDB,saveDB,loadSession,saveSession,clearSession} from "./storage.js";
import {uid,today,addDays} from "./utils.js";

export const state={db:loadDB(),page:"dashboard",search:"",bookSearch:"",memberSearch:""};

export function persist(){saveDB(state.db)}
export function user(){const s=loadSession();return s?.id?state.db.users.find(u=>u.id===s.id)||null:null}
export function login(u){saveSession({id:u.id,role:u.role})}
export function logout(){clearSession()}
export function audit(action,detail=""){const u=user();state.db.audit.unshift({id:uid(),time:Date.now(),user:u?.username||"system",action,detail});state.db.audit=state.db.audit.slice(0,500)}
export function notify(memberId,title,text){state.db.notifications.unshift({id:uid(),memberId,title,text,time:Date.now(),read:false})}
export function available(book){return Math.max(0,Number(book.copies||0)-state.db.loans.filter(x=>x.bookId===book.id&&!x.returned).length)}
export function activeLoans(memberId){return state.db.loans.filter(x=>x.memberId===memberId&&!x.returned)}
export function unpaid(memberId){return state.db.fines.filter(x=>(!memberId||x.memberId===memberId)&&!x.paid)}
export function reset(){state.db=newDatabase();persist();logout()}
export {uid,today,addDays};
