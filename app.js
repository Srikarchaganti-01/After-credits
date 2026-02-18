  const dispname = document.getElementById("dispname");

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


//logout function

const logoutBtn = document.getElementById("logoutbtn");
logoutBtn.addEventListener("click", async () => {
  const {error} = await supbase.auth.signOut();
  if(error){
    console.error("logout error :",error);
    alert(error.message);
    return;
  }
  window.location.href = "landing.html";
});

// fetch entries the user name from supabase profiles
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

// rank logic 
function getrank(count){
  if(count <=15) return "Rookie";
  else if(count <= 30 && count >15) return "Story Hunter";
  else if(count <= 60 && count >30) return "Frame Analyst";
  else if(count <= 100 && count >15) return "Cinephile";
  else if(count <= 150 && count >15) return "Scene Architect";
  else if(count <= 210 && count >15) return "Narrative Scholar";
  else if(count <= 280 && count >15) return "Cinema Maniac";
  else if(count >300) return "Grand Auteur";
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
  render(entries);
  const rank = getrank(count);
  document.getElementById("rank").textContent = rank;
  trimList(10);
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
    ul.innerHTML = "<li>No Entries Yet</li>";
    return;
  }
  entries.forEach(entry => {
    const li = document.createElement("li");
    const titlespan = document.createElement("span");
    //entry.content_type + " : " + see later
    titlespan.textContent =  entry.title;
    const yearspan = document.createElement("span");
    yearspan.textContent = " : " + entry.year ?? "";
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
  if(title == "" || year == "" || rating == "" || status == "" || type == "") {
    alert("Fill the boxes Nigga");
    return;
  }

  addbtn.disabled = true;
  addbtn.textContent = "Adding...";
  try {
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
        rendercount(count);
        clearmes();
        trimList(10);

  } finally {
    addbtn.disabled = false;
    addbtn.textContent = "Add";
  }

});


// limit list 

function trimList(limit = 10) {
  while (licontan.children.length > limit) {
    licontan.lastElementChild.remove();
  }
}
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

// go to next 
titelem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    yearelem.focus();
  }
});
yearelem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    direlem.focus();
  }
});
direlem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    counelem.focus();
  }
});
counelem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    spartelem.focus();
  }
});
spartelem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    rateelem.focus();
  }
});
rateelem.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    noteelem.focus();
  }
});





init();



