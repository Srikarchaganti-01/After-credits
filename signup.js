const SUPABASE_URL = "https://ppyhlmmliemzxallkivw.supabase.co";
const SUPABASE_KEY = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";

const supbase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPass").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const { data, error } = await supbase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  console.log("Signup success:", data.user?.email);

  window.location.href = "auth.html";

  console.log("Signup success:", data.user?.email);
});
