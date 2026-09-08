/* PERSONAL SETTINGS */
const SPOTIFY_PLAYLIST_URL = ""; // paste your Spotify playlist URL here when you send it

const screens=document.querySelectorAll(".screen");
function goTo(id){screens.forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"});if(id==="wheel")drawWheel();if(id==="final")startHearts();}
function flipCard(card){card.classList.toggle("flipped");}

function openPhoto(src,caption){document.getElementById("lightboxImg").src=src;document.getElementById("lightboxCaption").textContent=caption;document.getElementById("lightbox").classList.add("show");}
function closePhoto(e){if(!e||e.target.id==="lightbox"||e.target.classList.contains("close"))document.getElementById("lightbox").classList.remove("show");}

function setupSpotify(){if(!SPOTIFY_PLAYLIST_URL)return;const m=SPOTIFY_PLAYLIST_URL.match(/playlist[/:]([A-Za-z0-9]+)/);if(!m)return;document.querySelector(".spotify-box").innerHTML='<p class="spotify-title">YOUR SPOTIFY PLAYLIST</p><iframe style="border-radius:14px" src="https://open.spotify.com/embed/playlist/'+m[1]+'?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';}

const audio=document.getElementById("audio"),musicBtn=document.getElementById("musicBtn");
function toggleMusic(){const src=audio.querySelector("source").getAttribute("src");if(!src){alert("When you send your Spotify playlist link, I can add it to the playlist section. For background audio, add an MP3 in assets and set its filename in index.html.");return}if(audio.paused){audio.play();musicBtn.textContent="❚❚"}else{audio.pause();musicBtn.textContent="♫"}}

/* EDIT THESE GIFTS ANYTIME */
const gifts=["Boots 👢","A date night 💕","Movie night 🎬","Unlimited subscription to more kisses & hugs 💋🤗","You choose! ✦","One mystery gift 🎁"];
const canvas=document.getElementById("wheelCanvas"),ctx=canvas.getContext("2d");let currentAngle=0,spinning=false;
function drawWheel(){const s=canvas.width,c=s/2,r=s/2-8,sl=Math.PI*2/gifts.length;ctx.clearRect(0,0,s,s);const fills=["#f1d2d9","#ead8cf","#f4e4c9","#e5d4df","#f0d8c6","#e7d8cc"];for(let i=0;i<gifts.length;i++){let a=currentAngle+i*sl;ctx.beginPath();ctx.moveTo(c,c);ctx.arc(c,c,r,a,a+sl);ctx.closePath();ctx.fillStyle=fills[i%fills.length];ctx.fill();ctx.strokeStyle="#fffaf4";ctx.lineWidth=4;ctx.stroke();ctx.save();ctx.translate(c,c);ctx.rotate(a+sl/2);ctx.textAlign="right";ctx.fillStyle="#603d46";ctx.font="600 15px Poppins";wrapText(gifts[i],r-25,0,125,18);ctx.restore()}ctx.beginPath();ctx.arc(c,c,38,0,Math.PI*2);ctx.fillStyle="#8f4e61";ctx.fill();ctx.fillStyle="#fff";ctx.font="25px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("♡",c,c);}
function wrapText(text,x,y,maxWidth,lineHeight){const words=text.split(" ");let line="",lines=[];for(const w of words){const test=line+w+" ";if(ctx.measureText(test).width>maxWidth&&line){lines.push(line.trim());line=w+" "}else line=test}lines.push(line.trim());const sy=y-((lines.length-1)*lineHeight)/2;lines.forEach((l,i)=>ctx.fillText(l,x,sy+i*lineHeight));}
function spinWheel(){if(spinning)return;spinning=true;const b=document.getElementById("spinBtn"),res=document.getElementById("wheelResult");b.disabled=true;b.textContent="SPINNING... ♡";res.textContent="";const extra=5+Math.floor(Math.random()*3),idx=Math.floor(Math.random()*gifts.length),sl=Math.PI*2/gifts.length,target=-Math.PI/2-(idx*sl+sl/2),norm=currentAngle%(Math.PI*2);let delta=target-norm;while(delta<0)delta+=Math.PI*2;const start=currentAngle,final=start+extra*Math.PI*2+delta,dur=4200,t0=performance.now();function anim(now){const t=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-t,4);currentAngle=start+(final-start)*ease;drawWheel();if(t<1)requestAnimationFrame(anim);else{currentAngle=final;drawWheel();spinning=false;b.disabled=false;b.textContent="SPIN AGAIN ✦";res.innerHTML="You got: <span>"+gifts[idx]+"</span> 🎉";burstHearts();}}requestAnimationFrame(anim);}


function paperConfetti(){
  const pieces=90;
  const shapes=["▰","◆","●","■"];
  for(let i=0;i<pieces;i++){
    const p=document.createElement("span");
    p.className="paper-confetti";
    p.textContent="";
    const angle=(Math.random()*Math.PI*2);
    const distance=180+Math.random()*520;
    p.style.setProperty("--x",(Math.cos(angle)*distance)+"px");
    p.style.setProperty("--y",(Math.sin(angle)*distance-120)+"px");
    p.style.setProperty("--r",(Math.random()*1080-540)+"deg");
    p.style.setProperty("--duration",(1.8+Math.random()*1.5)+"s");
    p.style.width=(6+Math.random()*7)+"px";
    p.style.height=(8+Math.random()*10)+"px";
    p.style.borderRadius=Math.random()>.6?"50%":"2px";
    p.style.background=`hsl(${Math.floor(Math.random()*360)}, 75%, 65%)`;
    p.style.left=(50+(Math.random()*8-4))+"%";
    p.style.top=(52+(Math.random()*8-4))+"%";
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3500);
  }
  burstHearts();
}

function reveal(){document.querySelector(".secret-btn").style.display="none";document.querySelector(".gift").style.display="none";document.getElementById("finalMessage").classList.add("show");burstHearts();}
function restart(){document.getElementById("finalMessage").classList.remove("show");document.querySelector(".secret-btn").style.display="inline-block";document.querySelector(".gift").style.display="block";goTo("welcome");}
function createHeart(){const h=document.createElement("span");h.className="floating-heart";h.textContent=Math.random()>.2?"♡":"✦";h.style.left=Math.random()*100+"vw";h.style.fontSize=12+Math.random()*18+"px";h.style.animationDuration=7+Math.random()*7+"s";document.getElementById("hearts").appendChild(h);setTimeout(()=>h.remove(),15000);}
function startHearts(){for(let i=0;i<18;i++)setTimeout(createHeart,i*160)}function burstHearts(){for(let i=0;i<50;i++)setTimeout(createHeart,i*35)}
setInterval(()=>{if(document.visibilityState==="visible")createHeart()},1800);
setupSpotify();drawWheel();