const dispname = document.getElementById("dispname");
const supabaseUrl = "https://ppyhlmmliemzxallkivw.supabase.co";
const supabaseKey = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";
const supbase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);
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
let allentries = [];
function render(entries) {
  const ul = document.getElementById("licontan");
  ul.innerHTML = "";
  if (!entries.length) {
    ul.innerHTML = "<li>No Entries Yet</li>";
    return;
  }
  entries.forEach(entry => {
    const li = document.createElement("li");
    li.classList.add("accitem");
    const header = document.createElement("div");
    header.classList.add("acchead");
    const left = document.createElement("div");
    left.classList.add("accleft");
    const titlespan = document.createElement("span");
    titlespan.classList.add("acctitle");
    titlespan.textContent = entry.title ?? "Untitled";
    const yearspan = document.createElement("span");
    yearspan.classList.add("accyear");
    yearspan.textContent = entry.year ? ` (${entry.year})` : "";
    left.appendChild(titlespan);
    left.appendChild(yearspan);
    const arrow = document.createElement("i");
    arrow.classList.add("fa-solid", "fa-angle-down");
    header.appendChild(left);
    header.appendChild(arrow);
    const details = document.createElement("div");
    details.classList.add("accdetails");
    details.style.display = "none";
    details.innerHTML = `
      <h10>Rating : ${entry.rating ?? "Not rated"}/10</h10>
      <p>Content Type : ${entry.content_type ?? "Not specified"}</p>
      <p>Status : ${entry.status ?? "Not specified"}</p>
      <p>Director : ${entry.director ?? "Not specified"}</p>
      <p>Streaming Partner :  ${entry.streaming_partner ?? "Not specified"}</p>
      <p>Production House : ${entry.prohouse ?? "Not specified"}</p>
      <p>Notes : ${entry.notes ?? "No notes added"}</p>
    `;

    header.addEventListener("click", () => {
      const isOpen = details.style.display === "block";

      details.style.display = isOpen ? "none" : "block";

      arrow.classList.toggle("fa-angle-down");
      arrow.classList.toggle("fa-angle-up");
    });

    li.appendChild(header);
    li.appendChild(details);
    ul.appendChild(li);
  });
}
function proentries(){
  let finalentries = [...allentries];
  const filtype = getfiltyp();
  const sortype = getsortyp();

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
const flbut =  document.querySelectorAll(".filbut");
flbut.forEach(btn => {
  btn.addEventListener("click",(e) =>{
    e.preventDefault();
    flbut.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    proentries();
  });
});
function getfiltyp() {
  const activeBtn = document.querySelector(".filbut.active");
  return activeBtn ? activeBtn.id : null;
}
const srbut =  document.querySelectorAll(".sorbut");
srbut.forEach(btn => {
  btn.addEventListener("click",(e) =>{
    e.preventDefault();
    srbut.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    proentries();
  });
});
function getsortyp() {
  const activeBtn = document.querySelector(".sorbut.active");
  return activeBtn ? activeBtn.id : null;
}
async function init() {
  const user = await checkSession();
  if (!user) return;

  await fetchProfile(user);
  allentries = await fetchentries(user);
  proentries();
  console.log(allentries);
}


init();