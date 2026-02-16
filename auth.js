const SUPABASE_URL = "https://ppyhlmmliemzxallkivw.supabase.co";
const SUPABASE_KEY = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";

const supbase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  const { data, error } = await supbase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  console.log("Logged in:", data.user?.email);

  window.location.href = "landing.html";

  console.log("Logged in:", data.user?.email);
});
