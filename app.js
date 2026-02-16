
console.log("app.js loaded");

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

checkSession();

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

  console.log("Username:", data.user_name);
}
async function init() {
  const user = await checkSession();
  if (!user) return;

  await fetchProfile(user);
}

init();
