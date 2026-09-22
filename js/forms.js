
import {state,user,available,activeLoans,unpaid,audit,notify,persist,uid,today,addDays} from "./state.js";
import {openModal,closeModal,field,select,formActions,toast} from "./ui.js";
import {validEmail,validPhone,validISBN,domain} from "./utils.js";

function error(layer,msg){const el=layer.querySelector(".form-error");if(el)el.textContent=msg;return false}
function domainsOK(email){const list=state.db.settings.emailDomains||[];return !list.length||list.includes(domain(email))}
function nameOK(v){return /^[\p{L}][\p{L} .'-]{1,79}$/u.test(v)}
function usernameOK(v){return /^[A-Za-z0-9_.-]{3,30}$/.test(v)}

export function bookForm(id=null){
  const b=id?state.db.books.find(x=>x.id===id):{title:"",author:"",isbn:"",publisher:"",year:"",genre:"",tags:"",copies:1,price:"",rating:"",cover:""};
  const intro=`<div class="form-intro"><span class="form-icon">▤</span><div><b>${id?"Update book details":"Add a book to the catalogue"}</b><p>Only <strong>Book name</strong>, <strong>Author name</strong> and <strong>Copies</strong> are required. Everything else is optional.</p></div></div>`;
  const essentials=`<div class="form-section"><div class="form-section-head"><div><h3>Book essentials</h3><p>Enter the information needed to create the catalogue entry.</p></div><span class="required-legend"><i>*</i> Required</span></div><div class="form-grid two">${field("title","Book name",b.title,"text","required","required")}${field("author","Author name",b.author,"text","required","required")}${field("copies","Copies",b.copies,"number","min=1 max=10000 required","required")}</div></div>`;
  const optional=`<div class="form-section optional-section"><div class="form-section-head"><div><h3>Additional details</h3><p>These fields can be left empty and completed later.</p></div><span class="optional-legend">Optional</span></div><div class="form-grid two">${field("isbn","ISBN",b.isbn,"text","inputmode=\"numeric\"","optional")}${field("publisher","Publisher",b.publisher,"text","","optional")}${field("year","Publication year",b.year,"number","min=1000 max=2100","optional")}${field("genre","Genre",b.genre,"text","","optional")}${field("tags","Tags",b.tags,"text","","optional")}${field("price","Price",b.price,"number","min=0 step=0.01","optional")}${field("rating","Rating",b.rating,"number","min=0 max=5 step=0.1","optional")}${field("cover","Cover URL",b.cover,"url","","optional")}</div></div>`;
  return openModal(id?"Edit book":"Add book",`<form id="bookForm">${intro}${essentials}${optional}<div class="form-error"></div>${formActions(id?"Save changes":"Add book")}</form>`,layer=>{
    layer.querySelector("#bookForm").addEventListener("submit",e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget);
      const title=String(fd.get("title")||"").trim(),author=String(fd.get("author")||"").trim(),isbn=String(fd.get("isbn")||"").replace(/[\s-]/g,""),yearRaw=String(fd.get("year")||"").trim(),genre=String(fd.get("genre")||"").trim(),copies=Number(fd.get("copies")),priceRaw=String(fd.get("price")||"").trim(),ratingRaw=String(fd.get("rating")||"").trim();
      const v={title,author,isbn,publisher:String(fd.get("publisher")||"").trim(),year:yearRaw?Number(yearRaw):"",genre,tags:String(fd.get("tags")||"").trim(),copies,price:priceRaw?Number(priceRaw):"",rating:ratingRaw?Number(ratingRaw):"",cover:String(fd.get("cover")||"").trim()};
      if(!v.title||!v.author)return error(layer,"Book name and author name are required.");
      if(!Number.isInteger(v.copies)||v.copies<1)return error(layer,"Copies must be a whole number of at least 1.");
      if(v.isbn&&!validISBN(v.isbn))return error(layer,"If entered, ISBN must be a valid ISBN-10 or ISBN-13.");
      if(v.isbn&&state.db.books.some(x=>x.isbn===v.isbn&&x.id!==id))return error(layer,"That ISBN already exists.");
      if(v.year!==""&&(!Number.isInteger(v.year)||v.year<1000||v.year>2100))return error(layer,"Publication year must be between 1000 and 2100.");
      if(v.price!==""&&(!Number.isFinite(v.price)||v.price<0))return error(layer,"Price must be zero or greater.");
      if(v.rating!==""&&(!Number.isFinite(v.rating)||v.rating<0||v.rating>5))return error(layer,"Rating must be between 0 and 5.");
      if(id){Object.assign(state.db.books.find(x=>x.id===id),v);audit("Edit book",v.title);toast("Book updated.")}else{state.db.books.push({id:uid(),...v,createdAt:Date.now()});audit("Add book",v.title);toast("Book added.")}
      persist();closeModal();window.dispatchEvent(new Event("lm-refresh"));
    });
  });
}
export function memberForm(id=null){
  const u=id?state.db.users.find(x=>x.id===id):{name:"",rollNumber:"",username:"",email:"",phone:"",memberType:"Student"};
  const intro=`<div class="form-intro"><span class="form-icon">♙</span><div><b>${id?"Update student record":"Register a student"}</b><p><strong>Name, roll number, email and phone</strong> are required. Login credentials are optional.</p></div></div>`;
  const required=`<div class="form-section"><div class="form-section-head"><div><h3>Student information</h3><p>These four fields are required for every student record.</p></div><span class="required-legend"><i>*</i> Required</span></div><div class="form-grid two">${field("name","Student name",u.name,"text","required","required")}${field("rollNumber","Roll number",u.rollNumber||"","text","required","required")}${field("email","Email",u.email,"email","required","required")}${field("phone","Phone number",u.phone||"","tel","required inputmode=\"numeric\"","required")}</div></div>`;
  const optional=`<div class="form-section optional-section"><div class="form-section-head"><div><h3>Account access</h3><p>Optional. Fill these only if the student should be able to sign in.</p></div><span class="optional-legend">Optional</span></div><div class="form-grid two">${select("memberType","Member type",[["Student","Student"],["Faculty","Faculty"],["Staff","Staff"]],u.memberType||"Student")}${field("username","Login username",u.username||"","text","autocomplete=\"username\"","optional")}${field("password",id?"New password (optional)":"Password (optional)","","password",id?"autocomplete=\"new-password\"":"autocomplete=\"new-password\"","optional")}</div><p class="hint">If a login username is entered for a new student, a password of at least 8 characters is required. Leave both blank for a student record without login access.</p></div>`;
  return openModal(id?"Edit student":"Register student",`<form id="memberForm">${intro}${required}${optional}<div class="form-error"></div>${formActions(id?"Save changes":"Register student")}</form>`,layer=>{
    layer.querySelector("#memberForm").addEventListener("submit",e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget),name=String(fd.get("name")||"").trim(),rollNumber=String(fd.get("rollNumber")||"").trim(),username=String(fd.get("username")||"").trim(),email=String(fd.get("email")||"").trim(),phone=String(fd.get("phone")||"").trim(),password=String(fd.get("password")||"");
      if(!nameOK(name))return error(layer,"Enter a valid student name.");
      if(!rollNumber)return error(layer,"Roll number is required.");
      if(state.db.users.some(x=>x.role==="member"&&String(x.rollNumber||"").toLowerCase()===rollNumber.toLowerCase()&&x.id!==id))return error(layer,"That roll number is already registered.");
      if(!validEmail(email))return error(layer,"Enter a valid email address.");
      if(!validPhone(phone))return error(layer,"Phone number must contain digits only (7–15 digits).");
      if(!domainsOK(email))return error(layer,`Email must use: ${(state.db.settings.emailDomains||[]).join(", ")}`);
      if(username&&!usernameOK(username))return error(layer,"Login username must be 3–30 letters, numbers, dots, underscores or hyphens.");
      if(username&&state.db.users.some(x=>x.username&&x.username.toLowerCase()===username.toLowerCase()&&x.id!==id))return error(layer,"Login username already exists.");
      if(username&&!id&&password.length<8)return error(layer,"Password must contain at least 8 characters when login access is enabled.");
      if(id){const x=state.db.users.find(u=>u.id===id);Object.assign(x,{name,rollNumber,email,phone,memberType:String(fd.get("memberType")||"Student"),username});if(password)x.password=password;else if(!username)x.password="";audit("Edit student",rollNumber);toast("Student updated.")}
      else{state.db.users.push({id:uid(),name,rollNumber,email,phone,memberType:String(fd.get("memberType")||"Student"),username,password,role:"member",active:true,createdAt:Date.now()});audit("Register student",rollNumber);toast("Student registered.")}
      persist();closeModal();window.dispatchEvent(new Event("lm-refresh"));
    });
  });
}
export function issueForm(bookId=""){
  const books=state.db.books.filter(x=>available(x)>0),members=state.db.users.filter(x=>x.role==="member"&&x.active!==false);
  return openModal("Issue book",`<form id="issueForm">${select("book","Book",books.map(x=>[x.id,`${x.title} — ${available(x)} available`]),bookId||books[0]?.id)}${select("member","Member",members.map(x=>[x.id,`${x.name} — ${x.rollNumber||x.username||"No roll"}`]),members[0]?.id)}${field("dueDate","Due date",addDays(today(),state.db.settings.loanDays),"date","required")}<div class="form-error"></div>${formActions("Issue book")}</form>`,layer=>{
    layer.querySelector("#issueForm").addEventListener("submit",e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget),book=state.db.books.find(x=>x.id===fd.get("book")),member=state.db.users.find(x=>x.id===fd.get("member")),due=String(fd.get("dueDate"));
      if(!book||!member)return error(layer,"Choose a valid book and member.");if(available(book)<1)return error(layer,"No copy is available.");if(activeLoans(member.id).length>=state.db.settings.maxLoans)return error(layer,"Member has reached the active loan limit.");if(unpaid(member.id).length)return error(layer,"Member has an outstanding fine.");if(due<today())return error(layer,"Due date cannot be in the past.");
      state.db.loans.push({id:uid(),bookId:book.id,memberId:member.id,issueDate:today(),dueDate:due,returned:false,renewals:0});notify(member.id,"Book issued",`${book.title} is due on ${due}.`);audit("Issue book",book.title);persist();toast("Book issued.");closeModal();window.dispatchEvent(new Event("lm-refresh"));
    });
  });
}
export function reservationForm(bookId){
  const book=state.db.books.find(x=>x.id===bookId),members=state.db.users.filter(x=>x.role==="member"&&x.active!==false);
  return openModal("Reserve book",`<form id="reservationForm"><div class="notice"><b>${book?.title||"Book"}</b> is unavailable.</div>${select("member","Member",members.map(x=>[x.id,`${x.name} — ${x.rollNumber||x.username||"No roll"}`]),members[0]?.id)}<div class="form-error"></div>${formActions("Place reservation")}</form>`,layer=>{
    layer.querySelector("#reservationForm").addEventListener("submit",e=>{
      e.preventDefault();const fd=new FormData(e.currentTarget),member=state.db.users.find(x=>x.id===fd.get("member"));
      if(!book||!member)return error(layer,"Invalid reservation.");if(available(book)>0)return error(layer,"A copy is available; issue it instead.");if(state.db.reservations.filter(x=>x.memberId===member.id&&x.status==="active").length>=state.db.settings.reservationLimit)return error(layer,"Reservation limit reached.");if(state.db.reservations.some(x=>x.bookId===book.id&&x.memberId===member.id&&x.status==="active"))return error(layer,"Member already has an active reservation.");
      state.db.reservations.push({id:uid(),bookId:book.id,memberId:member.id,status:"active",createdAt:Date.now()});notify(member.id,"Reservation placed",`${book.title} is in the reservation queue.`);audit("Reserve book",book.title);persist();toast("Reservation placed.");closeModal();window.dispatchEvent(new Event("lm-refresh"));
    });
  });
}
