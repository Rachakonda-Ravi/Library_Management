import {THEMES} from "./config.js";
import {loadTheme,saveTheme} from "./storage.js";
import {state,user} from "./state.js";
import {esc,initials} from "./utils.js";

const THEME_ART={
  system:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="9" width="34" height="25" rx="5"/><path d="M17 40h14M24 34v6M15 18h18M15 24h11"/></svg>`,
  light:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.2 4.2M33.3 33.3l4.2 4.2M37.5 10.5l-4.2 4.2M14.7 33.3l-4.2 4.2"/></svg>`,
  dark:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M31 8c-8 2-13 8-13 16 0 9 7 16 16 16 2 0 4-.4 6-1.2A18 18 0 0 1 31 8Z"/></svg>`,
  ocean:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 27c5-6 9 6 14 0s9 6 14 0 7 4 10 0M7 35c5-5 9 5 14 0s9 5 14 0 6 3 8 0"/></svg>`,
  forest:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 42V25M24 27C14 25 10 18 11 9c9 1 15 6 13 18M24 32c9-1 14-7 13-16-8 1-14 6-13 16"/></svg>`,
  rose:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="21" r="7"/><path d="M24 14c-5-8-13 1-6 7-9-2-10 8-2 9-4 8 7 11 8 2 1 9 12 6 8-2 8-1 7-11-2-9 7-6-1-15-6-7Z"/></svg>`,
  slate:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 8h28v32H10zM16 14h16M16 21h16M16 28h10"/></svg>`,
  violet:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5l5.2 12.3L42 22l-12.8 4.5L24 39l-5.2-12.5L6 22l12.8-4.7Z"/></svg>`,
  sunset:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="25" r="9"/><path d="M7 25h5M36 25h5M11 12l4 4M33 34l4 4M24 6v6M24 38v5M37 12l-4 4M15 34l-4 4"/></svg>`,
  midnight:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 32c4-10 10-15 19-16l7 5-6 15-10 4-10-8Z"/><path d="M30 17l4-5M36 21l6-2M31 27l7 2"/></svg>`
};

export function theme(){return loadTheme()}
export function themeIcon(id=loadTheme()){return THEME_ART[id]||THEME_ART.system}
export function themeLabel(id=loadTheme()){return THEMES.find(x=>x[0]===id)?.[1]||"System"}
export function applyTheme(){let t=loadTheme();if(t==="system"){try{t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{t="light"}}document.documentElement.dataset.theme=t}
export function toast(message,type="success"){const old=document.querySelector(".toast");old?.remove();const n=document.createElement("div");n.className=`toast ${type}`;n.textContent=message;document.body.append(n);setTimeout(()=>n.remove(),2600)}
export function closeModal(){document.querySelector(".modal-layer")?.remove()}
export function openModal(title,content,onReady){
  closeModal();
  const layer=document.createElement("div");layer.className="modal-layer";
  layer.innerHTML=`<section class="modal" role="dialog" aria-modal="true"><header class="modal-head"><h2>${esc(title)}</h2><button type="button" class="icon-btn" data-close-modal aria-label="Close">×</button></header><div class="modal-body">${content}</div></section>`;
  document.body.append(layer);layer.addEventListener("mousedown",e=>{if(e.target===layer)closeModal()});layer.querySelector("[data-close-modal]")?.addEventListener("click",closeModal);onReady?.(layer);layer.querySelector("input,select,textarea,button")?.focus();return layer;
}
export function themeTrigger(){
  const id=loadTheme();
  return `<button type="button" class="theme-trigger" data-theme-menu aria-haspopup="dialog" aria-expanded="false" title="Change theme"><span class="theme-trigger-icon">${themeIcon(id)}</span><span class="theme-trigger-text">${esc(themeLabel(id))}</span></button>`;
}
export function themePopup(){
  const selected=loadTheme();
  return `<div class="theme-popover" data-theme-popover role="dialog" aria-label="Choose a theme"><div class="theme-popover-head"><div><strong>Choose a theme</strong><small>Pick an appearance for your library.</small></div><button type="button" class="icon-btn" data-close-theme aria-label="Close">×</button></div><div class="theme-options">${THEMES.map(([id,label])=>`<button type="button" class="theme-option ${selected===id?"selected":""}" data-theme="${id}"><span class="theme-option-art">${themeIcon(id)}</span><span><b>${esc(label)}</b><small>${id==="system"?"Follows device":`Use ${esc(label.toLowerCase())} appearance`}</small></span><i>${selected===id?"✓":""}</i></button>`).join("")}</div></div>`;
}
export function nav(){
  const items=[["dashboard","Dashboard","⌂"],["books","Books","▤"],["members","Members","♙"],["circulation","Circulation","↔"],["reservations","Reservations","◷"],["fines","Fines","₹"],["reports","Reports","▥"],["notifications","Notifications","●"],["audit","Activity","◌"],["settings","Settings","⚙"]];
  return items.map(([id,label,icon])=>`<button type="button" class="nav-item ${state.page===id?"active":""}" data-nav="${id}"><span>${icon}</span>${label}${id==="notifications"&&state.db.notifications.some(n=>!n.read)?`<b class="nav-count">${state.db.notifications.filter(n=>!n.read).length}</b>`:""}</button>`).join("");
}
export function layout(body){
  const u=user();
  document.querySelector("#app").innerHTML=`<div class="app"><header class="topbar"><button type="button" class="icon-btn menu-btn" data-menu>☰</button>${themeTrigger()}<div class="brand"><span class="brand-mark">L</span><div><strong>${esc(state.db.settings.libraryName)}</strong><small>School & College Library</small></div></div><div class="top-actions"><label class="global-search"><span>⌕</span><input id="globalSearch" value="${esc(state.search)}" placeholder="Search books and members" autocomplete="off"></label><span class="user-pill">${esc(u?.name||"Administrator")}</span><button type="button" class="btn secondary" data-logout>Sign out</button></div>${themePopup()}</header><div class="mobile-nav" id="mobileNav"></div><div class="shell"><aside class="sidebar">${nav()}</aside><main class="content">${body}</main></div></div>`;
  document.querySelector("#mobileNav").innerHTML=nav();
}
export function themes(){return THEMES.map(([id,label])=>`<button type="button" class="theme-choice ${loadTheme()===id?"selected":""}" data-theme="${id}"><span class="theme-option-art">${themeIcon(id)}</span><span>${esc(label)}</span></button>`).join("")}
export function setTheme(id){saveTheme(id);applyTheme();document.querySelectorAll("[data-theme]").forEach(x=>x.classList.toggle("selected",x.dataset.theme===id));document.querySelectorAll("[data-theme-menu]").forEach(x=>{x.querySelector(".theme-trigger-icon").innerHTML=themeIcon(id);const t=x.querySelector(".theme-trigger-text");if(t)t.textContent=themeLabel(id)});const pop=document.querySelector("[data-theme-popover]");if(pop){pop.querySelectorAll("[data-theme]").forEach(x=>{x.classList.toggle("selected",x.dataset.theme===id);const mark=x.querySelector("i");if(mark)mark.textContent=x.dataset.theme===id?"✓":""})}}
export function field(name,label,value="",type="text",extra="",status=""){const marker=status==="required"?`<em class="field-required">Required</em>`:status==="optional"?`<em class="field-optional">Optional</em>`:"";return `<label class="field"><span class="field-label">${esc(label)} ${marker}</span><input name="${esc(name)}" type="${type}" value="${esc(value)}" ${extra}></label>`}
export function select(name,label,options,value){return `<label class="field"><span>${esc(label)}</span><select name="${esc(name)}">${options.map(([v,t])=>`<option value="${esc(v)}" ${String(v)===String(value)?"selected":""}>${esc(t)}</option>`).join("")}</select></label>`}
export function formActions(saveText="Save"){return `<div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancel</button><button type="submit" class="btn">${esc(saveText)}</button></div>`}
export function pageHeader(title,subtitle="",actions=""){return `<div class="page-header"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><div class="header-actions">${actions}</div></div>`}
export function card(html,cls=""){return `<section class="card ${cls}">${html}</section>`}
export function empty(text){return `<div class="empty">${esc(text)}</div>`}
