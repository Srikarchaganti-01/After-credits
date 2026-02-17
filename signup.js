const SUPABASE_URL = "https://ppyhlmmliemzxallkivw.supabase.co";
const SUPABASE_KEY = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";

const supbase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");

const signupbut = document.getElementById("signupbut");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user_Name = document.getElementById("userName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPass").value;
  const confirm = document.getElementById("signupConfirm").value;

    signupbut.disabled = true;
    signupbut.textContent = "Creating your account...";
    try{
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
          const user = data.user;
          if (!user) {
            alert("User not returned");
            return;
          }
          const { error: profileError } = await supbase
          .from("profiles")
          .insert([
            {
              id: user.id,        
              user_name: user_Name,
              pass : password
            }
        ]);
        if (profileError) {
          alert(profileError.message);
          return;
        }
      }finally{
        signupbut.disabled=false;
        signupbut.textContent = "Sign up";
      }
      window.location.href = "auth.html";

});
