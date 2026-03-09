const dispname = document.getElementById("dispname");
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

// get all the entries to one 2D array called allentries
let allentries = [];
// but we dont dump the shit into the main code we crate a new function to do so the fun does the magic and adds them into array removing the burden 

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
    titlespan.textContent =  entry.title;
    const yearspan = document.createElement("span");
    yearspan.textContent = " : " + (entry.year ?? "");
    li.appendChild(titlespan);
    li.appendChild(yearspan);
    ul.appendChild(li);
  })
}

//funtion for filtering and sorting the entries
function proentries(){
  let finalentries = [...allentries];
  const filtype = getfiltyp();
  const sortype = getsortyp();

  //filter
  if(filtype === "movies"){
    finalentries = finalentries.filter(entry => entry.content_type?.toLowerCase() === "movie");
  }else if (filtype === "series"){
    finalentries = finalentries.filter(entry => entry.content_type?.toLowerCase() === "series");
  }else if (filtype === "watched"){
    finalentries = finalentries.filter(entry => entry.status?.toLowerCase() === "watched");
  }else if (filtype === "yetto"){
    finalentries = finalentries.filter(entry => entry.status?.toLowerCase() === "yet to watch");
  }else if (filtype === "all"){
    finalentries = finalentries;
  }

  // sort
  if (sortype === "rateup") {
    finalentries.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

  } else if (sortype === "ratedown") {
    finalentries.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  } else if (sortype === "yearup") {
    finalentries.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

  } else if (sortype === "yeardown") {
    finalentries.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  } else if (sortype === "date") {
    finalentries.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  render(finalentries);
}

// filter button reading
const flbut =  document.querySelectorAll(".filbut");
flbut.forEach(btn => {
  btn.addEventListener("click",(e) =>{
    e.preventDefault();
    flbut.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    proentries();
  });
});
// getting filter button data
function getfiltyp() {
  const activeBtn = document.querySelector(".filbut.active");
  return activeBtn ? activeBtn.id : null;
}

// sort button reading
const srbut =  document.querySelectorAll(".sorbut");
srbut.forEach(btn => {
  btn.addEventListener("click",(e) =>{
    e.preventDefault();
    srbut.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    proentries();
  });
});
// getting sort button data
function getsortyp() {
  const activeBtn = document.querySelector(".sorbut.active");
  return activeBtn ? activeBtn.id : null;
}


//initialising the total website
async function init() {
  const user = await checkSession();
  if (!user) return;

  await fetchProfile(user);
  allentries = await fetchentries(user);
  proentries();
  console.log(allentries);
}
init();