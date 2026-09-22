
export const $ = (selector,root=document)=>root.querySelector(selector);
export const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
export const esc = v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const uid = ()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}_${Math.random().toString(36).slice(2)}`;
export const today = ()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
export function addDays(date,days){const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+Number(days||0));return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
export function formatDate(v,format="DD/MM/YYYY"){if(!v)return"—";const d=new Date(v);if(Number.isNaN(d.getTime()))return"—";const dd=String(d.getDate()).padStart(2,"0"),mm=String(d.getMonth()+1).padStart(2,"0"),yy=d.getFullYear();return format==="MM/DD/YYYY"?`${mm}/${dd}/${yy}`:`${dd}/${mm}/${yy}`}
export function money(v,currency="INR"){try{return new Intl.NumberFormat("en-IN",{style:"currency",currency}).format(Number(v)||0)}catch{return `${currency} ${Number(v)||0}`}}
export function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim())}
export function validPhone(v){return /^\d{7,15}$/.test(String(v).trim())}
export function validISBN(v){return /^(\d{9}[\dXx]|\d{13})$/.test(String(v).replace(/[\s-]/g,""))}
export function initials(v){return String(v||"?").trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"?"}
export function domain(v){return String(v).trim().toLowerCase().split("@")[1]||""}
export function csv(rows){return rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\r\n")}
export function download(name,data,type="application/octet-stream"){const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
