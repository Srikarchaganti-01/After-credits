const supabaseUrl = "https://ppyhlmmliemzxallkivw.supabase.co";
const supabaseKey = "sb_publishable_ku2-MLJitQBIjO3Oge6JZA_FlXTl87I";

const supbase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

async function run() {
    
  const { data: loginData, error: loginError } =
    await supbase.auth.signInWithPassword({
      email: "gollayaswanth12@gmail.com",
      password: "yash134",
    });

  if (loginError) {
    console.error("Login error:", loginError);
    return;
  }

  const user = loginData.user;
  console.log("Logged in user:", user.id);

  
  const { error: insertError } = await supbase
    .from("entries")
    .insert([
      {
        user_id: user.id,
        title: "loki",
        content_type: "series",
        year:2019,
        director:"Marvel ",
        country:"Usa",
        rating:9.0,
        notes:"yashwanth account loki series",
        streaming_partner:"jio hotstar",
        status:"watched",
        cover_img_url:"url1",
      },
    ]);

  if (insertError) {
    console.error("Insert error:", insertError);
    return;
  }

  console.log("Insert success");

  const { data, error } = await supbase
    .from("entries")
    .select("*");

  if (error) {
    console.error("Fetch error:", error);
  } else {
    console.log("Entries:", data);
  }
}

run();
