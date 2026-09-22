
import {state,user,logout} from "./state.js";
import {render} from "./render.js";
import {applyTheme} from "./ui.js";

applyTheme();
render();

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    const modal=document.querySelector(".modal-layer");
    if(modal)modal.remove();
  }
});
window.addEventListener("storage",()=>{
  location.reload();
});
