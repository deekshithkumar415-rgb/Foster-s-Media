(() => {
const $=id=>document.getElementById(id), cfg=window.FOSTERS_CONFIG||{};
const ready=cfg.supabaseUrl&&!cfg.supabaseUrl.includes("PASTE_")&&cfg.supabaseAnonKey&&!cfg.supabaseAnonKey.includes("PASTE_");
const db=ready&&window.supabase?.createClient?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
let mode="admin";
if(!db)$("warning").classList.remove("hidden");
function msg(t){$("message").textContent=t}
function setMode(m){mode=m;document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));$("admin-form").classList.toggle("hidden",m!=="admin");$("influencer-form").classList.toggle("hidden",m!=="influencer");msg("")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
async function enter(user){
const {data:p,error}=await db.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle();
if(error)return msg("Login succeeded, but profile lookup failed. Check profiles table columns and RLS.");
if(!p)return msg("No profile found for this account. Ask the admin to create its profile.");
const role=String(p.role||"").toLowerCase();if(!["admin","influencer"].includes(role))return msg("This account has no valid portal role.");
$("login").classList.add("hidden");$("dashboard").classList.remove("hidden");$("signout").classList.remove("hidden");
$("welcome").textContent="Welcome"+(p.full_name?", "+p.full_name:"");$("subtitle").textContent=role==="admin"?"Your campaign operations workspace.":"Your campaign updates.";
$( "admin").classList.toggle("hidden",role!=="admin");$("influencer").classList.toggle("hidden",role!=="influencer");
}
$("admin-form").onsubmit=async e=>{e.preventDefault();if(!db)return msg("Add Supabase settings in config.js first.");msg("Signing in…");const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)return msg(error.message);await enter(data.user)};
$("influencer-form").onsubmit=async e=>{e.preventDefault();if(!db)return msg("Add Supabase settings in config.js first.");msg("Sending OTP…");const {error}=await db.auth.signInWithOtp({phone:$("phone").value.trim()});if(error)return msg(error.message);$("otp-wrap").classList.remove("hidden");$("verify").classList.remove("hidden");msg("OTP sent. Enter the code from your SMS.")};
$("verify").onclick=async()=>{const {data,error}=await db.auth.verifyOtp({phone:$("phone").value.trim(),token:$("otp").value.trim(),type:"sms"});if(error)return msg(error.message);await enter(data.user)};
$("signout").onclick=async()=>{await db.auth.signOut();$("dashboard").classList.add("hidden");$("login").classList.remove("hidden");$("signout").classList.add("hidden");$("admin-form").reset();$("influencer-form").reset();$("otp-wrap").classList.add("hidden");$("verify").classList.add("hidden");setMode("admin")};
if(db)db.auth.getSession().then(({data})=>{if(data.session?.user)enter(data.session.user)});
})();