// v6 tiles (15/10/2026): Charlie "the button one, I still think that we can push harder".
// 15 rebuilt as a big Stripe pay button (magnetic, shimmer, spinner morph, tick, sparkle). 10 ribbon redrawn as silk strands (no GIF banding).
// 09 number keeps ticking live after it lands. 05 and 09 start on their finished state at frame 0. 01 burst stays dense.
(function(){
const T2=window.T2;
const NAVY='#0A2540',SUB='#425466',PUR='#635BFF',GRN='#00B341';
const STOPS=['#FFD601','#FF6118','#EE30FB','#FB76FA','#7232F1'];
const GRAD='linear-gradient(110deg,#FFD601,#FF6118 25%,#EE30FB 50%,#FB76FA 72%,#7232F1)';
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif";
const cl=x=>Math.max(0,Math.min(1,x));
const IO=(t,a,d)=>{const x=cl((t-a)/d);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
const EO=(t,a,d)=>{const x=cl((t-a)/d);return 1-Math.pow(1-x,4)};
const BK=(t,a,d)=>{const x=cl((t-a)/d);if(x>=1)return 1;const c1=1.7,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const TAU=Math.PI*2;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const grad=u=>{u=cl(u)*(STOPS.length-1);const i=Math.min(STOPS.length-2,Math.floor(u)),f=u-i,a=hex(STOPS[i]),b=hex(STOPS[i+1]);return a.map((v,j)=>Math.round(v+(b[j]-v)*f))};
const q=(r,c)=>r.querySelector(c),qa=(r,c)=>[...r.querySelectorAll(c)];
const kf=(K,t)=>{if(t<=K[0][0])return K[0].slice(1);for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i],e=IO(t,a[0],b[0]-a[0]);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*e)}}return K[K.length-1].slice(1)};
const shift=(T,s)=>r=>{const f=T(r);return t=>f(((t+s)%6+6)%6)};

// 05 and 09 open on their finished state, so frame 0 (the thumbnail) is never an empty chart or £0,000,000
T2[4]=shift(T2[4],2.5);

// 01 Particles: the burst ring stays inside the tile and bright, so the tile never looks empty
const P0=T2[0];T2[0]=r=>{const f=P0(r);const c=q(r,'canvas'),x=c.getContext('2d');return t=>{f(t);
 const u=cl((t-2.75)/2.4);if(u<=0||u>=1)return;const a=Math.sin(Math.PI*u);
 const g=x.createRadialGradient(112,100,8,112,100,70);g.addColorStop(0,`rgba(255,214,250,${.0})`);g.addColorStop(.55,`rgba(238,48,251,${.22*a})`);g.addColorStop(1,'rgba(238,48,251,0)');
 x.globalCompositeOperation='destination-over';x.fillStyle=g;x.fillRect(0,0,224,200);x.globalCompositeOperation='source-over';}};

// 09 Number: after the roll lands the figure keeps counting up live, then rolls home; opens on the landed figure
T2[8]=shift(r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F3F5FA)';
 r.innerHTML=`<div style="position:absolute;left:16px;top:22px;font:400 11px ${F};color:${SUB}">Revenue this year <i class="z-dot" style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${GRN};margin-left:4px;vertical-align:1px"></i></div><div class="z-n" style="position:absolute;left:14px;top:44px"></div>
 <div class="z-ch" style="position:absolute;left:16px;top:94px;padding:5px 9px;border-radius:6px;background:#D7F7E1;font:500 10px ${F};color:#0A8A3A;opacity:0">+24% year on year</div>
 <div style="position:absolute;left:16px;right:16px;bottom:16px;height:52px;display:flex;align-items:flex-end;gap:5px">${[30,42,36,52,48,64,58,74,70,86,82,100].map((h,i)=>`<i class="z-b" style="flex:1;height:${h}%;border-radius:3px 3px 1px 1px;background:${i==11?GRAD:`rgba(99,91,255,${.16+i*.035})`};transform-origin:50% 100%"></i>`).join('')}</div>`;
 const el=q(r,'.z-n');el.style.cssText+=`;display:flex;font:500 32px/1 ${F};color:${NAVY};letter-spacing:-.03em;font-feature-settings:"ss01" on,"tnum" on`;
 const tpl='£1,284,960',cols=[];[...tpl].forEach(ch=>{if(!/\d/.test(ch)){const s=document.createElement('span');s.textContent=ch;el.appendChild(s);return}const w=document.createElement('span');w.style.cssText='display:inline-block;height:32px;overflow:hidden';const c=document.createElement('span');c.style.cssText='display:flex;flex-direction:column';for(let k=0;k<180;k++){const d=document.createElement('span');d.textContent=k%10;d.style.height='32px';c.appendChild(d)}w.appendChild(c);el.appendChild(w);cols.push({c,v:+ch})});
 const bs=qa(r,'.z-b'),ch=q(r,'.z-ch'),dot=q(r,'.z-dot');const NC=cols.length;
 const V0=1284960;const dp=(V,p)=>{const fl=Math.floor(V/p),rem=V-fl*p;return p==1?V:fl+cl(rem-(p-1))};const live=t=>{const V=V0+Math.max(0,t-1.9)*41;return cols.map((o,j)=>{const p=Math.pow(10,NC-1-j);return dp(V,p)-Math.floor(V0/p)})};
 const pos=t=>{const lv=live(t),rs=1-IO(t,4.75,.8);return cols.map((o,j)=>{const n=o.v+10*(1+j%3);return 10+n*EO(t,.05+j*.08,1.5)-n*IO(t,4.75+(NC-j)*.04,.8)+lv[j]*rs})};
 return t=>{const a=pos(t),b=pos(t+.03);cols.forEach((o,j)=>{o.c.style.transform=`translateY(${-a[j]*32}px)`;o.c.style.filter=`blur(${Math.min(2.6,Math.abs(b[j]-a[j])*3.2)}px)`});
  const g=BK(t,1.9,.5)*(1-IO(t,4.5,.3));ch.style.opacity=cl(g*2);ch.style.transform=`scale(${.7+.3*g})`;ch.style.transformOrigin='left center';
  dot.style.opacity=.35+.65*(.5+.5*Math.cos(t*TAU*1.5));
  bs.forEach((b,i)=>b.style.transform=`scaleY(${BK(t,.4+i*.06,.6)*(1-IO(t,4.6+i*.03,.6))*(i==11?1+.06*Math.sin(t*TAU*1.5):1)})`);}},2.5);

// 10 Ribbon -> twist : a silk ribbon of 26 fine strands twists through 3D space (lines survive the GIF palette, solid fills band)
T2[9]=r=>{r.style.background='radial-gradient(110% 90% at 50% 40%,#173560,#0A2540 72%)';
 const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');x.scale(2,2);
 const NS=26,ST=3,cols=[...Array(80)].map((_,i)=>grad(.04+i/79*.92));
 return t=>{x.clearRect(0,0,224,200);const ph=t*TAU/6;x.lineCap='round';
  const edge=X=>{const a=X*.026+ph,c=Math.cos(a),s=Math.sin(a);const yc=100+24*Math.sin(X*.02+ph)+7*Math.sin(X*.047-ph*2),w=34;return[yc,w*c,s]};
  const segs=[];for(let k=0;k<NS;k++){const v=k/(NS-1)*2-1;let pv=null;for(let X=-8;X<=232;X+=ST){const [yc,wc,s]=edge(X);const p=[X,yc+v*wc,s*v];if(pv){segs.push([pv[0],pv[1],p[0],p[1],p[2],X,wc])}pv=p}}
  segs.sort((A,B)=>A[4]-B[4]);
  for(const [x0,y0,x1,y1,z,X,wc] of segs){const col=cols[Math.max(0,Math.min(79,Math.round(X/224*79)))];const face=Math.abs(wc)/34;const lit=.38+.62*(.5+.5*z);
   x.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${(.25+.75*face)*lit})`;x.lineWidth=.9+.5*face;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke()}
  const g=x.createLinearGradient(0,0,224,0);g.addColorStop(0,'rgba(10,37,64,.95)');g.addColorStop(.12,'rgba(10,37,64,0)');g.addColorStop(.88,'rgba(10,37,64,0)');g.addColorStop(1,'rgba(10,37,64,.95)');x.fillStyle=g;x.fillRect(0,0,224,200);}};

// 15 Button -> pay : a big Stripe pay button. The pointer pulls it in, it presses, shrinks to a spinner,
// the ring fills, a tick draws with a sparkle burst, and it grows back as "Paid". A shimmer runs in every hold.
T2[14]=r=>{r.style.background='radial-gradient(100% 90% at 50% 40%,#FFFFFF,#EEEBFA)';
 const sp=[...Array(12)].map((_,i)=>`<i class="z-sp" style="position:absolute;left:112px;top:100px;width:${i%2?4:6}px;height:${i%2?4:6}px;margin:${i%2?-2:-3}px;border-radius:50%;background:${['#FFD601','#EE30FB','#7232F1','#00B341','#FB76FA','#635BFF'][i%6]};opacity:0"></i>`).join('');
 r.innerHTML=`<div class="z-gl" style="position:absolute;left:22px;top:66px;width:180px;height:68px;border-radius:34px;filter:blur(16px);opacity:.55"></div>
 <i class="z-r1" style="position:absolute;left:112px;top:100px;border-radius:50%;border:2px solid ${GRN};transform:translate(-50%,-50%);opacity:0"></i><i class="z-r2" style="position:absolute;left:112px;top:100px;border-radius:50%;border:1.5px solid ${GRN};transform:translate(-50%,-50%);opacity:0"></i>${sp}
 <div class="z-bt" style="position:absolute;left:22px;top:72px;width:180px;height:56px;border-radius:28px;overflow:hidden">
  <div class="z-gn" style="position:absolute;inset:0;background:linear-gradient(180deg,#2BD96B,#00C24A 55%,#009A38);opacity:0"></div>
  <div class="z-sh" style="position:absolute;top:0;bottom:0;left:0;width:70px;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));opacity:0"></div>
  <div class="z-hl" style="position:absolute;left:10%;right:10%;top:3px;height:42%;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,0))"></div>
  <div class="z-l1" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:7px;font:600 19px ${F};letter-spacing:-.01em;color:#fff;white-space:nowrap"><svg width="13" height="15" viewBox="0 0 13 15"><rect x="1" y="6.5" width="11" height="8" rx="2" fill="#fff"/><path d="M3.5 6.5V4.6a3 3 0 0 1 6 0v1.9" fill="none" stroke="#fff" stroke-width="1.8"/></svg>Pay £48.00</div>
  <div class="z-l2" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:7px;font:600 19px ${F};letter-spacing:-.01em;color:#fff;white-space:nowrap"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 12.5l4.6 4.6L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>Paid £48.00</div>
 </div>
 <i class="z-dk" style="position:absolute;left:82px;top:70px;width:60px;height:60px;border-radius:50%;background:#fff;box-shadow:0 10px 24px -8px rgba(50,50,93,.35),0 0 0 1px rgba(99,91,255,.08);opacity:0"></i><svg class="z-ring" width="60" height="60" viewBox="-2 -2 60 60" style="position:absolute;left:82px;top:70px;opacity:0;overflow:visible"><defs><linearGradient id="zrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD601"/><stop offset=".3" stop-color="#FF6118"/><stop offset=".6" stop-color="#EE30FB"/><stop offset="1" stop-color="#635BFF"/></linearGradient></defs>
  <circle cx="28" cy="28" r="22" fill="none" stroke="#ECEAF8" stroke-width="5"/><circle class="z-arc" cx="28" cy="28" r="22" fill="none" stroke="url(#zrg)" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="0 1" transform="rotate(-90 28 28)"/>
  <path class="z-tk" d="M18 28.5l6.5 6.5L38 21.5" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
 <div class="z-cu" style="position:absolute;left:0;top:0;width:18px;height:25px;z-index:9;transform-origin:0 0;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><svg width="18" height="25" viewBox="0 0 16 22"><path d="M1.5 1.5v16.2l4.1-3.9 2.7 6.3 2.9-1.2-2.7-6.2h5.7z" fill="#0A0A0A" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`;
 const bt=q(r,'.z-bt'),l1=q(r,'.z-l1'),l2=q(r,'.z-l2'),sh=q(r,'.z-sh'),hl=q(r,'.z-hl'),gl=q(r,'.z-gl'),ring=q(r,'.z-ring'),arc=q(r,'.z-arc'),tk=q(r,'.z-tk'),cu=q(r,'.z-cu'),r1=q(r,'.z-r1'),r2=q(r,'.z-r2'),sps=qa(r,'.z-sp'),dk=q(r,'.z-dk'),gn=q(r,'.z-gn');
 // cursor keyframes: [t, x, y, opacity]
 const K=[[0,214,196,0],[.25,214,196,0],[.4,200,182,1],[1.0,128,108,1],[1.25,124,106,1],[1.6,124,106,1],[2.3,196,178,1],[2.6,212,194,0],[6,214,196,0]];
 const PUR2='#7A73FF',PUR3='#4B44E0';
 return t=>{const [cx,cy,co]=kf(K,t);const press=Math.sin(cl((t-1.12)/.22)*Math.PI);
  cu.style.opacity=co;cu.style.transform=`translate(${cx}px,${cy}px) scale(${1-.16*press})`;
  // shape: wide pill -> circle (1.3-1.65) -> wide again (3.25-3.75)
  const shrink=EO(t,1.3,.4)*(1-BK(t,3.25,.55));const w=180-124*shrink,h=56;
  // magnetic pull while the pointer is close and the button is wide
  const dx=cx-112,dy=cy-100,dd=Math.hypot(dx,dy),pull=co*(1-shrink)*Math.max(0,1-dd/110)*.22;
  const sc=1-.07*press+.03*Math.sin(cl((t-3.25)/.6)*Math.PI);
  bt.style.left=(112-w/2)+'px';bt.style.width=w+'px';
  bt.style.transform=`translate(${dx*pull}px,${dy*pull}px) scale(${sc}) rotate(${dx*pull*.12}deg)`;
  // colour: purple -> white (spinner) -> green (done) -> purple again at the end of the loop
  const toW=EO(t,1.3,.3)*(1-EO(t,2.75,.25)),toG=EO(t,2.75,.25)*(1-IO(t,5.3,.3));
  bt.style.background=`linear-gradient(180deg,${PUR2},${PUR} 55%,${PUR3})`;gn.style.opacity=toG;
  bt.style.boxShadow=`inset 0 -3px 0 rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.35),0 ${14+10*pull*4}px ${26+12*pull*4}px -10px ${toG>.5?'rgba(0,179,65,.75)':'rgba(99,91,255,.8)'}`;
  bt.style.opacity=1-toW;hl.style.opacity=1-shrink;
  gl.style.background=toG>.5?'#00C24A':PUR;gl.style.opacity=(.5+.2*Math.sin(t*TAU/3))*(1-toW);gl.style.left=(112-w/2)+'px';gl.style.width=w+'px';gl.style.transform=`translate(${dx*pull}px,${dy*pull+6}px)`;
  // labels
  const a1=1-cl((t-1.22)/.15)+cl((t-5.42)/.3);const a2=cl((t-3.45)/.25)*(1-cl((t-5.15)/.22));
  l1.style.opacity=cl(a1);l1.style.transform=`translate(${dx*pull*.4}px,${dy*pull*.4+(t>5?(1-cl((t-5.3)/.4))*14:0)}px)`;
  l2.style.opacity=a2;l2.style.transform=`translateY(${(1-cl((t-3.45)/.3))*8-(t>5?cl((t-5.25)/.3)*-14:0)}px)`;
  // shimmer sweeps across in each hold
  const s1=cl((t-.1)/.8),s2=cl((t-4.1)/.8);const s=t<2?s1:s2;sh.style.opacity=s>0&&s<1?1:0;sh.style.transform=`translateX(${-80+s*(w+90)}px) skewX(-18deg)`;
  // spinner ring while it is a circle on white
  const rv=EO(t,1.42,.25)*(1-EO(t,2.78,.15));ring.style.opacity=Math.max(rv,t>2.8&&t<3.45?1:0);dk.style.opacity=rv;dk.style.transform=`scale(${.8+.2*rv})`;ring.style.transform=`scale(${.85+.15*rv})`;ring.style.transformOrigin='28px 28px';
  const prog=IO(t,1.55,1.15);arc.setAttribute('stroke-dasharray',`${Math.max(.001,prog*.98)} 1`);arc.setAttribute('transform',`rotate(${-90+360*IO(t,1.45,1.35)*1.5} 28 28)`);
  // done: tick draws inside the green circle
  const tkv=EO(t,2.85,.35)*(1-cl((t-3.3)/.15));tk.style.strokeDashoffset=1-tkv;tk.style.opacity=t>2.8&&t<3.45?1:0;
  ring.querySelectorAll('circle').forEach(c=>c.style.opacity=rv);
  // ripples and sparkle burst at the moment it succeeds
  [[r1,2.85,1.0,60,150],[r2,3.0,1.1,60,190]].forEach(([e,a,d,s0,s1v])=>{const k=cl((t-a)/d);const z=EO(t,a,d);e.style.width=e.style.height=(s0+(s1v-s0)*z)+'px';e.style.opacity=k>0&&k<1?.7*(1-k):0});
  sps.forEach((e,i)=>{const k=cl((t-2.9)/.9);const an=i/12*TAU+.3,d=(34+(i%3)*10)*EO(t,2.9,.9);e.style.transform=`translate(${Math.cos(an)*d}px,${Math.sin(an)*d*.8}px) scale(${1-k*.6})`;e.style.opacity=k>0&&k<1?1-k*k:0});
 }};
})();
// Free-font mode (#...-ff): every tile uses the system font (SF Pro on a Mac) instead of the brands' own font files.
if(/(^|-)ff(-|$)/.test(location.hash.slice(1))){const st=document.createElement('style');st.textContent=".tile,.tile *{font-family:system-ui,-apple-system,'Helvetica Neue',sans-serif !important}";document.head.appendChild(st)}
