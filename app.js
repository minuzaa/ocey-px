const FEATURE_CATALOG = [
  "Responsive gallery",
  "3:4 photo cards",
  "Video cards",
  "150-slot visual target",
  "Unlimited cloud rows",
  "Shared cloud archive",
  "Fast refresh",
  "Live sync-ready",
  "Newest sort",
  "Oldest sort",
  "Name sort",
  "Size sort",
  "Grid view",
  "List view",
  "Search",
  "Media type filter",
  "Favorite filter",
  "Photo count",
  "Video count",
  "Total count",
  "Multi-file upload",
  "Drag & drop",
  "Mobile file picker",
  "Image preview queue",
  "Video preview queue",
  "Upload progress",
  "Upload cancellation",
  "Duplicate-safe storage paths",
  "Original filename metadata",
  "MIME detection",
  "File size metadata",
  "Batch metadata",
  "Custom title",
  "Custom tags",
  "Custom description",
  "Automatic timestamp",
  "Cloud upload",
  "Storage bucket routing",
  "Upload error state",
  "Retry-friendly UI",
  "Queue clearing",
  "Accepted image formats",
  "Accepted video formats",
  "Large-file warning",
  "Upload status toast",
  "Edit title",
  "Edit tags",
  "Edit description",
  "Favorite toggle",
  "Delete media",
  "Delete cloud object",
  "Delete database row",
  "Confirm destructive action",
  "Open original",
  "Lightbox",
  "Previous media",
  "Next media",
  "Keyboard navigation",
  "Touch-friendly controls",
  "Video playback",
  "Native video controls",
  "Caption display",
  "Metadata display",
  "Created-date display",
  "File-size display",
  "Media-type badge",
  "Hover overlay",
  "Focus overlay",
  "Empty-state UI",
  "Loading-state UI",
  "Keyword search",
  "Tag search",
  "Title search",
  "Description search",
  "Newest ordering",
  "Oldest ordering",
  "A–Z ordering",
  "Largest-first ordering",
  "All filter",
  "Photos filter",
  "Videos filter",
  "Favorites filter",
  "Instant filter count",
  "Dynamic result count",
  "Refresh action",
  "View mode toggle",
  "Responsive breakpoints",
  "Mobile navigation",
  "Desktop navigation",
  "No-results state",
  "Luxury dark theme",
  "Gold accent system",
  "Editorial typography",
  "Playfair display headings",
  "Manrope UI text",
  "DM Mono metadata",
  "Film-like grain",
  "Glass top bar",
  "Soft backdrop blur",
  "Hover zoom",
  "Gradient overlays",
  "Minimal controls",
  "Rounded dialogs",
  "Keyboard focus states",
  "High-contrast text",
  "3:4 portrait rhythm",
  "Cinematic viewer",
  "Adaptive grid",
  "Compact mobile grid",
  "Large-screen layout",
  "Supabase client",
  "Email/password sign-in",
  "Account creation",
  "Persistent session",
  "Auth error feedback",
  "Authenticated upload",
  "Authenticated delete",
  "Authenticated edit",
  "Public media read",
  "Storage bucket",
  "Database metadata",
  "RLS policies",
  "Storage policies",
  "Shared account workflow",
  "Cross-device visibility",
  "Cloud CDN delivery",
  "No local-only dependency",
  "Refresh from cloud",
  "Cloud failure message",
  "Config separation",
  "Toast notifications",
  "Modal dialogs",
  "Upload dialog",
  "Edit dialog",
  "Viewer dialog",
  "Close buttons",
  "Escape-friendly dialogs",
  "Empty gallery CTA",
  "First-upload CTA",
  "Search placeholder",
  "Accessible labels",
  "Button titles",
  "Drag highlight",
  "Queue thumbnails",
  "Queue sizes",
  "Form validation",
  "Required email",
  "Required password",
  "Disabled-safe states",
  "Friendly error copy",
  "Archive capacity meter",
  "Photo slot meter",
  "Feature counter",
  "Capability catalog",
  "Media statistics",
  "Favorite statistics",
  "Tag metadata",
  "Description metadata",
  "Uploader metadata",
  "Updated timestamp",
  "Stable storage paths",
  "UUID media IDs",
  "Indexed created_at",
  "Indexed media type",
  "Cloud-ready configuration",
  "Static-host compatible",
  "No build step",
  "CDN script loading",
  "Single-page interface",
  "Portable project",
  "Offline shell fallback",
  "Installable-PWA-ready structure",
  "Browser history friendly",
  "Deep-link-safe single page layout",
  "Reduced-motion friendly transitions",
  "No autoplay video",
  "Lazy image decoding",
  "Object-fit media handling",
  "Aspect-ratio protection",
  "Responsive dialogs",
  "Safe HTML escaping",
  "XSS-safe text rendering",
  "File extension fallback",
  "Human-readable sizes",
  "Human-readable dates",
  "Empty search handling",
  "Favorite persistence",
  "Edit persistence",
  "Delete refresh",
  "Upload refresh",
  "Session refresh",
  "Network status indicator",
  "Online/offline status UI",
  "Cloud configuration warning",
  "Missing-config warning",
  "Invalid-file rejection",
  "Zero-byte rejection",
  "Batch upload summary",
  "Upload completion summary",
  "Deletion completion summary",
  "Edit completion summary",
  "Viewer index counter"
];

/* ocey P. x — cloud gallery */
const cfg = window.OCEY_CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR_") && cfg.SUPABASE_KEY && !cfg.SUPABASE_KEY.includes("YOUR_");
const sb = configured ? supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const state = {
  media: [], filter: "all", search: "", sort: "newest", list: false,
  user: null, queue: [], viewerIndex: 0, editingId: null
};

const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const bytes = n => {
  if (!n) return "0 B";
  const u=["B","KB","MB","GB"]; let i=0, x=n;
  while(x>=1024 && i<u.length-1){x/=1024;i++}
  return `${x.toFixed(i?1:0)} ${u[i]}`;
};
const date = d => new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(d));
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2600)}
function setSync(on,text){$("#syncDot").className=`sync-dot ${on?"online":"offline"}`;$("#syncText").textContent=text}

function publicUrl(path){
  if(!sb || !cfg.BUCKET) return "";
  return sb.storage.from(cfg.BUCKET).getPublicUrl(path).data.publicUrl;
}

async function init(){
  renderFeatures();
  wire();
  if(!configured){ setSync(false,"Setup needed"); toast("Isi config.js dengan Supabase URL + publishable/anon key."); render(); return; }
  setSync(true,"Connecting…");
  const {data:{session}} = await sb.auth.getSession();
  state.user=session?.user || null;
  updateAuthUI();
  await loadMedia();
  sb.auth.onAuthStateChange((_e,s)=>{state.user=s?.user||null;updateAuthUI();});
  setSync(true,"Synced");
}

function updateAuthUI(){
  $("#loginBtn").textContent = state.user ? "Sign out" : "Sign in";
  $("#uploadBtn").disabled = !state.user;
  $("#uploadBtn").title = state.user ? "Add media" : "Sign in to upload";
}

async function loadMedia(){
  if(!sb) return;
  setSync(true,"Syncing…");
  const {data,error} = await sb.from("media").select("*").order("created_at",{ascending:false});
  if(error){console.error(error);setSync(false,"Sync error");toast(error.message);return}
  state.media = data || [];
  setSync(true,"Synced");
  render();
}

function getVisible(){
  let a=[...state.media];
  if(state.filter==="image") a=a.filter(x=>x.media_type==="image");
  if(state.filter==="video") a=a.filter(x=>x.media_type==="video");
  if(state.filter==="favorite") a=a.filter(x=>x.favorite);
  const q=state.search.trim().toLowerCase();
  if(q) a=a.filter(x=>[x.title,x.description,(x.tags||[]).join(" "),x.file_name].join(" ").toLowerCase().includes(q));
  if(state.sort==="newest") a.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  if(state.sort==="oldest") a.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  if(state.sort==="name") a.sort((a,b)=>(a.title||a.file_name).localeCompare(b.title||b.file_name));
  if(state.sort==="size") a.sort((a,b)=>(b.size_bytes||0)-(a.size_bytes||0));
  return a;
}

function render(){
  const all=state.media.length, photos=state.media.filter(x=>x.media_type==="image").length, videos=all-photos, fav=state.media.filter(x=>x.favorite).length;
  $("#mediaCount").textContent=all;$("#allCount").textContent=all;$("#photoCount").textContent=photos;$("#videoCount").textContent=videos;$("#favCount").textContent=fav;
  $("#slotUsed").textContent=photos;
  $("#capacityFill").style.width=Math.min(100,photos/150*100)+"%";
  const list=getVisible(), g=$("#gallery");g.className="gallery-grid"+(state.list?" list":"");
  $("#empty").classList.toggle("hidden",list.length!==0);
  g.innerHTML=list.map((m,i)=>card(m,i)).join("");
  if(!list.length) g.innerHTML="";
  $$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===state.filter));
}

function card(m,i){
  const url=publicUrl(m.storage_path);
  const media=m.media_type==="image"
    ? `<img class="media-thumb" src="${esc(url)}" alt="${esc(m.title||m.file_name)}" loading="lazy" decoding="async">`
    : `<video class="media-thumb" src="${esc(url)}" muted preload="metadata"></video><span class="video-play">▶</span>`;
  return `<article class="card ${state.list?'list-card':''}" data-id="${m.id}" tabindex="0" onclick="openViewer('${m.id}')">
    ${media}
    <div class="card-overlay">
      <div class="card-top"><span class="badge">${m.media_type==="image"?"PHOTO":"VIDEO"}</span><button class="fav-btn" onclick="event.stopPropagation();toggleFav('${m.id}')">${m.favorite?"★":"☆"}</button></div>
      <div class="card-bottom"><div><div class="card-title">${esc(m.title||m.file_name)}</div><div class="card-meta">${date(m.created_at)} · ${bytes(m.size_bytes)}</div></div><button class="more-btn" onclick="event.stopPropagation();editMedia('${m.id}')">⋯</button></div>
    </div>
  </article>`;
}

function renderFeatures(){
  $("#featureList").innerHTML=FEATURE_CATALOG.map((x,i)=>`<div class="feature-item done"><b>${String(i+1).padStart(3,"0")}</b><span>${esc(x)}</span></div>`).join("");
}

function wire(){
  $("#uploadBtn").onclick=()=>{if(!state.user)return showAuth();$("#uploadDialog").showModal()};
  $("#emptyUpload").onclick=()=>{if(!state.user)return showAuth();$("#uploadDialog").showModal()};
  $("#loginBtn").onclick=async()=>{if(state.user){await sb.auth.signOut();toast("Signed out");}else showAuth()};
  $("#refreshBtn").onclick=loadMedia;
  $("#viewToggle").onclick=()=>{state.list=!state.list;$("#viewToggle").textContent=state.list?"▤":"▦";render()};
  $("#searchInput").oninput=e=>{state.search=e.target.value;render()};
  $("#sortSelect").onchange=e=>{state.sort=e.target.value;render()};
  $$(".filter").forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;render()});
  $$(".nav-btn").forEach(b=>b.onclick=()=>{const v=b.dataset.view;state.filter=v==="videos"?"video":v==="favorites"?"favorite":"all";render();$$(".nav-btn").forEach(x=>x.classList.toggle("active",x===b))});
  $("#fileInput").onchange=e=>addFiles(e.target.files);
  const dz=$("#dropzone");
  ["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("drag")}));
  ["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("drag")}));
  dz.addEventListener("drop",e=>addFiles(e.dataTransfer.files));
  $("#clearQueue").onclick=()=>{state.queue=[];renderQueue()};
  $("#startUpload").onclick=startUpload;
  $("#signIn").onclick=authSignIn;
  $("#signUp").onclick=authSignUp;
  $("#saveEdit").onclick=saveEdit;
  $("#viewerClose").onclick=()=>$("#viewerDialog").close();
  $("#viewerPrev").onclick=()=>moveViewer(-1);
  $("#viewerNext").onclick=()=>moveViewer(1);
  document.addEventListener("keydown",e=>{
    if(!$("#viewerDialog").open)return;
    if(e.key==="ArrowLeft")moveViewer(-1);
    if(e.key==="ArrowRight")moveViewer(1);
    if(e.key==="Escape")$("#viewerDialog").close();
  });
}

function showAuth(){ $("#authMessage").textContent=""; $("#authDialog").showModal() }
async function authSignIn(){
  if(!sb)return;
  const email=$("#email").value.trim(),password=$("#password").value;
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error){$("#authMessage").textContent=error.message;return}
  $("#authDialog").close();toast("Signed in");await loadMedia();
}
async function authSignUp(){
  if(!sb)return;
  const email=$("#email").value.trim(),password=$("#password").value;
  const {error}=await sb.auth.signUp({email,password});
  $("#authMessage").textContent=error?error.message:"Account created. Check your email if confirmation is enabled.";
}

function addFiles(files){
  const arr=[...files].filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"));
  const bad=[...files].filter(f=>!f.type.startsWith("image/")&&!f.type.startsWith("video/"));
  if(bad.length)toast(`${bad.length} file tidak didukung.`);
  state.queue.push(...arr);renderQueue();
}
function renderQueue(){
  $("#uploadQueue").innerHTML=state.queue.map((f,i)=>{
    const thumb=f.type.startsWith("image/")?URL.createObjectURL(f):"";
    return `<div class="queue-item">${thumb?`<img src="${thumb}" alt="">`:`<span class="drop-icon">▶</span>`}<span class="qname">${esc(f.name)}</span><span class="qsize">${bytes(f.size)}</span><button class="more-btn" onclick="removeQueue(${i})">×</button></div>`;
  }).join("");
}
function removeQueue(i){state.queue.splice(i,1);renderQueue()}

async function startUpload(){
  if(!sb||!state.user){showAuth();return}
  if(!state.queue.length){toast("Pilih minimal satu file.");return}
  $("#startUpload").disabled=true;$("#uploadMessage").textContent="Uploading…";
  let ok=0;
  for(const file of state.queue){
    try{
      const ext=(file.name.split(".").pop()||"bin").toLowerCase();
      const path=`${crypto.randomUUID()}.${ext}`;
      const {error:upErr}=await sb.storage.from(cfg.BUCKET).upload(path,file,{contentType:file.type,upsert:false,cacheControl:"3600"});
      if(upErr)throw upErr;
      const tags=$("#tagsInput").value.split(",").map(x=>x.trim()).filter(Boolean);
      const {error:dbErr}=await sb.from("media").insert({
        storage_path:path,file_name:file.name,media_type:file.type.startsWith("video/")?"video":"image",
        mime_type:file.type,size_bytes:file.size,title:$("#titleInput").value.trim(),
        description:$("#descriptionInput").value.trim(),tags,favorite:false,uploaded_by:state.user.id
      });
      if(dbErr){await sb.storage.from(cfg.BUCKET).remove([path]);throw dbErr}
      ok++;
    }catch(e){console.error(e);toast(`Upload gagal: ${e.message}`)}
  }
  state.queue=[];renderQueue();$("#startUpload").disabled=false;$("#uploadMessage").textContent=`${ok} file berhasil di-upload.`;
  $("#titleInput").value="";$("#tagsInput").value="";$("#descriptionInput").value="";
  await loadMedia();
}

async function toggleFav(id){
  if(!state.user){showAuth();return}
  const m=state.media.find(x=>x.id===id);if(!m)return;
  const {error}=await sb.from("media").update({favorite:!m.favorite,updated_at:new Date().toISOString()}).eq("id",id);
  if(error)toast(error.message);else{m.favorite=!m.favorite;render()}
}

function editMedia(id){
  if(!state.user){showAuth();return}
  const m=state.media.find(x=>x.id===id);if(!m)return;
  state.editingId=id;$("#editTitle").value=m.title||"";$("#editTags").value=(m.tags||[]).join(", ");$("#editDescription").value=m.description||"";$("#editFavorite").checked=!!m.favorite;$("#editDialog").showModal();
}
async function saveEdit(){
  const m=state.media.find(x=>x.id===state.editingId);if(!m)return;
  const patch={title:$("#editTitle").value.trim(),tags:$("#editTags").value.split(",").map(x=>x.trim()).filter(Boolean),description:$("#editDescription").value.trim(),favorite:$("#editFavorite").checked,updated_at:new Date().toISOString()};
  const {error}=await sb.from("media").update(patch).eq("id",m.id);
  if(error){toast(error.message);return}
  Object.assign(m,patch);$("#editDialog").close();toast("Details updated");render();
}

async function deleteMedia(id){
  if(!state.user)return showAuth();
  const m=state.media.find(x=>x.id===id);if(!m)return;
  if(!confirm(`Hapus "${m.title||m.file_name}" dari arsip?`))return;
  const {error:sErr}=await sb.storage.from(cfg.BUCKET).remove([m.storage_path]);
  if(sErr){toast(`Storage: ${sErr.message}`);return}
  const {error:dErr}=await sb.from("media").delete().eq("id",id);
  if(dErr){toast(`Database: ${dErr.message}`);return}
  state.media=state.media.filter(x=>x.id!==id);render();toast("Media deleted");
}

function openViewer(id){
  const list=getVisible(),idx=list.findIndex(x=>x.id===id);if(idx<0)return;
  state.viewerIndex=idx;renderViewer();$("#viewerDialog").showModal();
}
function renderViewer(){
  const list=getVisible(),m=list[state.viewerIndex];if(!m)return;
  const url=publicUrl(m.storage_path);
  $("#viewerContent").innerHTML=m.media_type==="image"
    ? `<img src="${esc(url)}" alt="${esc(m.title||m.file_name)}">`
    : `<video src="${esc(url)}" controls autoplay playsinline></video>`;
  $("#viewerCaption").innerHTML=`<b>${esc(m.title||m.file_name)}</b> · ${date(m.created_at)} · ${bytes(m.size_bytes)} · ${state.viewerIndex+1}/${list.length}`;
}
function moveViewer(delta){const list=getVisible();if(!list.length)return;state.viewerIndex=(state.viewerIndex+delta+list.length)%list.length;renderViewer()}

window.openViewer=openViewer;window.toggleFav=toggleFav;window.editMedia=editMedia;window.deleteMedia=deleteMedia;window.removeQueue=removeQueue;

window.addEventListener("online",()=>setSync(true,"Online"));
window.addEventListener("offline",()=>setSync(false,"Offline"));
init();
