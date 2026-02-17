
console.log("app.js loaded");

const supabaseUrl = "https://ppyhlmmliemzxallkivw.supabase.co";
const supabaseKey = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";

const supbase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);
// check the user is logged in or not
async function checkSession() {
  const { data, error } = await supbase.auth.getUser();

  if (error) {
    console.error(error);
  }

  const user = data.user;

  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  console.log("Logged in user:", user.id);
  return user;
}


// fetchentries the user name from supabase profiles
async function fetchProfile(user) {
  const { data, error } = await supbase
    .from("profiles")
    .select("user_name")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile error:", error);
    return;
  }
  const dispname = document.getElementById("dispname");
  dispname.textContent=data.user_name;
  console.log("Username:", dispname.textContent);
}


//fetch entry count 
async function fetchcount(user) {
  const {count ,error} = await supbase
    .from("entries")
    .select("*",{count:"exact",head:true})
    .eq("user_id",user.id);
  if(error){
    console.error("count error : ",error);
    return 0;
  }  
  return count ?? 0;
}
//render count 
function rendercount(count){
  const countspan = document.querySelector("#totent span");
  if(countspan) countspan.textContent = count;
}


// init function 
async function init() {
  const user = await checkSession();
  if (!user) return;

  await fetchProfile(user);
  const count = await fetchcount(user);
  rendercount(count);
  const entries = await fetchentries(user);
  render(entries)
}

// content type button reading
const tybut =  document.querySelectorAll(".typbut");
tybut.forEach(btn => {
  btn.addEventListener("click",(e) =>{
    e.preventDefault();
    tybut.forEach(b => b.classList.remove("active"));
    console.log("removed");
    btn.classList.add("active");
    console.log("removed and added");
    const seltyp = getseltyp();
    console.log(seltyp);
  });
});
// getting content button data
function getseltyp() {
  const activeBtn = document.querySelector(".typbut.active");
  return activeBtn
    ? activeBtn.textContent.trim().toLowerCase()
    : null;
}


// status type button reading
const stbut = document.querySelectorAll(".statbut");
stbut.forEach(btn => {
  btn.addEventListener("click",(e) => {
    e.preventDefault();
    stbut.forEach(b => b.classList.remove("active"));
    console.log("STATUS REMOVED");
    btn.classList.add("active");
    console.log("added status");
    const selsta = getselsta();
    console.log(selsta);
  });
});
// getting status button reading
function getselsta() {
  const activeBtn = document.querySelector(".statbut.active");
  return activeBtn
    ? activeBtn.textContent.trim().toLowerCase()
    : null;
}



// getting aLL THE REMAINING DATA FOM DOM

const titelem = document.getElementById("ent_tit");
const yearelem = document.getElementById("ent_year");
const direlem = document.getElementById("ent_dir");
const counelem = document.getElementById("ent_con");
const spartelem = document.getElementById("ent_spart");
const rateelem = document.getElementById("ent_rate");
const noteelem = document.getElementById("ent_note");

const addbtn = document.querySelector(".ent_add_btn");


// fetching the data from supabse
async function fetchentries(user) {
  const{data,error} = await supbase
  .from("entries")
  .select("*")
  .eq("user_id",user.id)
  .order("created_at",{ascending:false});
if(error){
  console.error("Fetch error:",error);
  return[];
}
  return data;
}

// render the fetched data
function render(entries){
  const ul = document.getElementById("licontan");
  ul.innerHTML = "";
  if(!entries.length){
    ul.innerHTML = "<li>No Entrie Yet</li>";
    return;
  }
  entries.forEach(entry => {
    const li = document.createElement("li");
    const titlespan = document.createElement("span");
    titlespan.textContent = entry.title;
    const yearspan = document.createElement("span");
    yearspan.textContent = entry.year ?? "";
    li.appendChild(titlespan);
    li.appendChild(yearspan);
    ul.appendChild(li);
  })
}

// read values when add bt is clicked

addbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const title = titelem.value.trim();
  const year = yearelem.value ? parseInt(yearelem.value, 10) : null;
  const director  = direlem.value.trim();
  const country = counelem.value.trim();
  const strpartner = spartelem.value.trim();
  const rating = rateelem.value ? parseFloat(rateelem.value) : null;
  const note = noteelem.value.trim();
  const type = getseltyp();
  const status = getselsta();

  console.log({
    title,
    year,
    director,
    country,
    strpartner,
    rating,
    note,
    type,
    status
  });
// insering data to supabse 
  const user = await checkSession();
  if(!user) return;
  const entrydata = {
    user_id: user.id,
    title,
    year,
    director,
    country,
    rating,
    status,
    notes:note,
    content_type:type,
    username:dispname.textContent,
    streaming_partner:strpartner,
  }
  const{ data, error } = await supbase
    .from("entries")
    .insert([entrydata])
    .select();
  if(error) {
    console.error("Inser Error : ",error);
    alert(error.message);
    return;
  }

  console.log("The data is inserted into the data base");
  console.log("inserted : ",data);
  const entries = await fetchentries(user);
  render(entries);
  const count = await fetchcount(user);
  rendercount(user);
  clearmes();
});

// clear this mess
function clearmes() {
  titelem.value = "";
  yearelem.value = "";
  direlem.value = "";
  counelem.value = "";
  spartelem.value = "";
  rateelem.value = "";
  noteelem.value = "";
  document.querySelectorAll(".typbut")
    .forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".statbut")
    .forEach(btn => btn.classList.remove("active"));
}





init();