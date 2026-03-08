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
//init
async function init() {
  const user = await checkSession();
  if (!user) return;

  await fetchProfile(user);
  const entries = await fetchentries(user);
  render(entries);
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
    // yearspan.textContent = " : " + entry.year ?? "";
    yearspan.textContent = " : " + (entry.year ?? "");
    li.appendChild(titlespan);
    li.appendChild(yearspan);
    ul.appendChild(li);
  })
}
init();