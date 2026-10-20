// v4 tiles (15/10/2026): 16 distinct premium motion techniques in Stripe's look. Replaces window.T2[0..15].
// seek(lt), lt in [0,6); lt=6 must equal lt=0 so the GIF loops without a seam.
(function(){
const T2=window.T2;
const NAVY='#0A2540',SUB='#425466',PUR='#635BFF',GRN='#00B341';
const STOPS=['#FFD601','#FF6118','#EE30FB','#FB76FA','#7232F1'];
const GRAD='linear-gradient(110deg,#FFD601,#FF6118 25%,#EE30FB 50%,#FB76FA 72%,#7232F1)';
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=dX(t);if(Math.abs(d)<1e-6)break;t-=(X(t)-x)/d}return Y(Math.min(1,Math.max(0,t)))}}
const E=bez(.25,1,.5,1),cl=x=>Math.max(0,Math.min(1,x));
const P=(t,a,d)=>E(cl((t-a)/d)),L=(t,a,d)=>cl((t-a)/d);
const IO=(t,a,d)=>{const x=cl((t-a)/d);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
const S=(t,a,d)=>{const x=cl((t-a)/d);if(x>=1)return 1;const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const TAU=Math.PI*2,W=(t,n=1,ph=0)=>Math.sin(t*TAU/6*n+ph);
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif",MONO="scp,'SF Mono',Menlo,monospace";
if(!document.getElementById('scp-ff')){const st=document.createElement('style');st.id='scp-ff';st.textContent='@font-face{font-family:scp;src:url(fonts/SourceCodePro-Medium.f5ba3e6a.woff2) format("woff2")}';document.head.appendChild(st)}
const q=(r,c)=>r.querySelector(c),qa=(r,c)=>[...r.querySelectorAll(c)];
const tick=(c,s,w=2)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M5 12.5l4.6 4.6L19 7.5" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const grad=u=>{u=cl(u)*(STOPS.length-1);const i=Math.min(STOPS.length-2,Math.floor(u)),f=u-i,a=hex(STOPS[i]),b=hex(STOPS[i+1]);return a.map((v,j)=>Math.round(v+(b[j]-v)*f))};
const rgb=(c,a=1)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
const cv=(r,bg)=>{const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');x.scale(2,2);return x};
const kf=(K,t)=>{if(t<=K[0][0])return K[0].slice(1);for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i],e=IO(t,a[0],b[0]-a[0]);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*e)}}return K[K.length-1].slice(1)};

// 01 Particles -> logo : 520 dots swarm into a sparkle mark, shimmer, burst out, drift home
T2[0]=r=>{r.style.background='radial-gradient(100% 90% at 50% 45%,#1B3A66,#0A2540 72%)';const x=cv(r);
 const R=rng(7),N=520,CX=112,CY=100,pts=[];const path=new Path2D();
 for(let k=0;k<=96;k++){const a=k/96*TAU,c=Math.cos(a),s=Math.sin(a);const X=CX+78*c*c*c,Y=CY+78*s*s*s;k?path.lineTo(X,Y):path.moveTo(X,Y)}
 const o=document.createElement('canvas').getContext('2d');
 while(pts.length<N){const tx=CX-80+R()*160,ty=CY-80+R()*160;if(!o.isPointInPath(path,tx,ty)&&Math.hypot(tx-CX,ty-CY)>14)continue;
  const an=Math.atan2(ty-CY,tx-CX)+(R()-.5)*.6,rd=70+R()*45;pts.push({tx,ty,sx:CX+Math.cos(an)*rd*1.1,sy:CY+Math.sin(an)*rd*.9,ph:R()*TAU,d:R()*.5,col:grad((tx-CX+80)/160*.85+.05)})}
 return t=>{x.clearRect(0,0,224,200);let form=0;const rot=.12*W(t);const cr=Math.cos(rot),sr=Math.sin(rot);
  for(const p of pts){const k=cl(1-IO(t,2.6+p.d*.6,.9)+P(t,4.0+p.d*.5,1.4));const u=L(t,2.6+p.d*.6,.9),push=Math.sin(Math.PI*u)*34;
   const dx=p.tx-CX,dy=p.ty-CY,ln=Math.hypot(dx,dy)||1;const tx=CX+dx*cr-dy*sr+dx/ln*push,ty=CY+dx*sr+dy*cr+dy/ln*push;
   const sx=p.sx+6*Math.cos(t*TAU/6+p.ph),sy=p.sy+6*Math.sin(t*TAU/6+p.ph*1.3);
   const px=sx+(tx-sx)*k,py=sy+(ty-sy)*k;form+=k;
   x.fillStyle=rgb(p.col,.35+.65*Math.max(k,u>0&&u<1?.8:0));x.beginPath();x.arc(px,py,1.1+.7*k,0,7);x.fill()}
  form/=N;const g=x.createRadialGradient(CX,CY,0,CX,CY,90);g.addColorStop(0,`rgba(238,48,251,${.28*form})`);g.addColorStop(1,'rgba(238,48,251,0)');
  x.globalCompositeOperation='destination-over';x.fillStyle=g;x.fillRect(0,0,224,200);x.globalCompositeOperation='source-over';}};

// 02 Gradient -> flow : Stripe's slanted hero gradient, ribbons of colour flowing like liquid
T2[1]=r=>{r.style.background='#fff';const c=document.createElement('canvas');c.width=224;c.height=200;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px;filter:blur(9px) saturate(1.2);transform:scale(1.12)';r.appendChild(c);const x=c.getContext('2d');
 r.insertAdjacentHTML('beforeend',`<svg style="position:absolute;left:0;top:0" width="224" height="200"><polygon points="0,0 224,0 224,8 0,74" fill="#fff"/></svg><div style="position:absolute;left:16px;top:16px;font:500 13px ${F};color:${NAVY};letter-spacing:-.01em">Flow</div>`);
 const cols=['#7232F1','#FB76FA','#EE30FB','#FF6118','#FFD601','#635BFF','#7232F1'];
 return t=>{x.fillStyle='#635BFF';x.fillRect(0,0,224,200);
  const y=(j,X)=>-10+j*34+16*Math.sin(X*.024+t*TAU/6+j*.8)+9*Math.sin(X*.05-t*TAU/3+j*1.7);
  for(let j=0;j<cols.length-1;j++){x.fillStyle=cols[j];x.beginPath();for(let X=-10;X<=234;X+=6)x.lineTo(X,y(j,X));for(let X=234;X>=-10;X-=6)x.lineTo(X,y(j+1,X)+6);x.closePath();x.fill()}}};

// 03 Glass card -> tilt : frosted glass card turns in 3D over moving colour, light sweeps its face
T2[2]=r=>{r.style.background='#0A2540';
 r.innerHTML=`${[['#EE30FB',40,40,90],['#FF6118',140,110,80],['#635BFF',120,20,100]].map(([c,l,tp,s],i)=>`<i class="z-b" style="position:absolute;left:${l}px;top:${tp}px;width:${s}px;height:${s}px;border-radius:50%;background:${c};filter:blur(16px);opacity:.85"></i>`).join('')}
 <div style="position:absolute;inset:0;perspective:520px"><div class="z-cd" style="position:absolute;left:37px;top:52px;width:150px;height:96px;border-radius:14px;background:rgba(255,255,255,.14);backdrop-filter:blur(14px) saturate(1.6);-webkit-backdrop-filter:blur(14px) saturate(1.6);border:1px solid rgba(255,255,255,.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.5);overflow:hidden">
  <div style="position:absolute;left:14px;top:14px;width:22px;height:16px;border-radius:4px;background:linear-gradient(135deg,#FFE9A8,#E7B84C)"></div>
  <svg style="position:absolute;right:14px;top:14px" width="14" height="16" viewBox="0 0 16 18"><path d="M3 4c3 3 3 7 0 10M7 2c4 4 4 10 0 14M11 0c5 5 5 13 0 18" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>
  <div style="position:absolute;left:14px;bottom:14px;font:400 12px ${F};letter-spacing:.14em;color:#fff">•••• 4242</div><div style="position:absolute;right:14px;bottom:13px;font:500 10px ${F};color:#fff">12/29</div>
  <i class="z-sp" style="position:absolute;top:-40px;bottom:-40px;width:70px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-18deg)"></i></div></div>`;
 const cd=q(r,'.z-cd'),sp=q(r,'.z-sp'),bs=qa(r,'.z-b');
 return t=>{const ry=20*W(t),rx=12*W(t,2,.6);cd.style.transform=`rotateY(${ry}deg) rotateX(${rx}deg)`;cd.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,.5),${-ry*.8}px ${18+rx*.6}px 30px -10px rgba(0,0,0,.55)`;
  sp.style.left=(40-ry*6)+'px';sp.style.opacity=.5+.5*Math.abs(W(t));bs.forEach((b,i)=>b.style.transform=`translate(${14*W(t,1,i*2)}px,${12*W(t,1,i*2+1.5)}px)`);}};

// 04 Text -> decode : random glyphs lock in letter by letter, Claude -> Motion -> Claude
T2[3]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F3F2FB)';
 r.innerHTML=`<div class="z-st" style="position:absolute;left:0;right:0;top:46px;text-align:center;font:500 9px ${MONO};letter-spacing:.14em;color:${SUB}">DECODING</div>
 <div class="z-w" style="position:absolute;left:0;right:0;top:66px;display:flex;justify-content:center;font:500 40px/52px ${MONO};color:${NAVY}">${[...Array(6)].map(()=>`<span style="display:inline-block;width:27px;text-align:center"></span>`).join('')}</div>
 <div style="position:absolute;left:40px;right:40px;top:132px;height:3px;border-radius:2px;background:#E6E3F5;overflow:hidden"><i class="z-pb" style="position:absolute;left:0;top:0;bottom:0;width:0;background:${GRAD}"></i></div>`;
 const sp=qa(r,'.z-w span'),pb=q(r,'.z-pb'),st=q(r,'.z-st');const A='Claude',B='Motion',G='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$';
 const h=(a,b)=>{let s=Math.imul(a*73856093^b*19349663,2654435761);s^=s>>>13;return Math.abs(s)%G.length};
 return t=>{const f=Math.floor(t*12);let prog=0,busy=false;
  sp.forEach((s,i)=>{const r1=.55+i*.15,r2=3.75+i*.15;let ch,dec=true;
   if(t<.4){ch=A[i]}else if(t<r1){ch=G[h(f,i)];dec=false;busy=true}else if(t<3.6){ch=B[i]}else if(t<r2){ch=G[h(f,i+9)];dec=false;busy=true}else ch=A[i];
   s.textContent=ch;s.style.color=dec?(t>=r1&&t<3.6?'transparent':NAVY):PUR;
   s.style.backgroundImage=dec&&t>=r1&&t<3.6?GRAD:'none';s.style.webkitBackgroundClip='text';s.style.backgroundClip='text';
   s.style.transform=`translateY(${dec?0:-2+4*((f+i)%2)}px)`});
  prog=t<3.6?L(t,.4,1.0):L(t,3.6,1.0);pb.style.width=(prog*100)+'%';pb.style.opacity=(t<.4||t>4.9)?0:1;st.textContent=busy?'DECODING':'DECODED';st.style.color=busy?PUR:SUB;}};

// 05 Line -> draw : one gradient stroke draws the chart with a glowing head, area fills, then the tail chases it off
T2[4]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F3F5FA)';
 const d='M10 160 C40 150 52 120 76 124 S110 150 130 108 S168 60 186 66 S206 40 214 30';
 r.innerHTML=`<svg style="position:absolute;left:0;top:0" width="224" height="200"><defs><linearGradient id="lg5" x1="0" x2="1"><stop offset="0" stop-color="#7232F1"/><stop offset=".5" stop-color="#EE30FB"/><stop offset="1" stop-color="#FF6118"/></linearGradient><linearGradient id="la5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EE30FB" stop-opacity=".35"/><stop offset="1" stop-color="#EE30FB" stop-opacity="0"/></linearGradient></defs>
 ${[60,100,140].map(y=>`<line x1="10" x2="214" y1="${y}" y2="${y}" stroke="#E9ECF3" stroke-dasharray="3 4"/>`).join('')}
 <path class="z-ar" d="${d} L214 190 L10 190Z" fill="url(#la5)" opacity="0"/><path class="z-ln" d="${d}" fill="none" stroke="url(#lg5)" stroke-width="3.2" stroke-linecap="round" pathLength="1"/><circle class="z-hd" r="5" fill="#fff" stroke="#EE30FB" stroke-width="3" style="filter:drop-shadow(0 0 6px #EE30FB)"/></svg>
 <div class="z-ch" style="position:absolute;right:12px;top:10px;padding:5px 9px;border-radius:7px;background:${NAVY};font:500 12px ${F};color:#fff;opacity:0">+128%</div>`;
 const ln=q(r,'.z-ln'),ar=q(r,'.z-ar'),hd=q(r,'.z-hd'),ch=q(r,'.z-ch');const TL=ln.getTotalLength();
 return t=>{const b=IO(t,.2,1.7),a=IO(t,4.6,1.2);ln.setAttribute('stroke-dasharray',`${Math.max(0,b-a)} 2`);ln.setAttribute('stroke-dashoffset',-a);
  const pt=ln.getPointAtLength(b*TL);hd.setAttribute('cx',pt.x);hd.setAttribute('cy',pt.y);hd.setAttribute('opacity',b>.01&&a<.99?1:0);
  ar.setAttribute('opacity',P(t,1.5,.6)*(1-P(t,4.5,.5)));const g=S(t,1.8,.5)*(1-P(t,4.5,.3));ch.style.opacity=cl(g*2);ch.style.transform=`translateY(${(1-g)*8}px) scale(${.8+.2*g})`;}};

// 06 Shape -> morph : one gradient form springs circle -> square -> star -> blob -> circle
T2[5]=r=>{r.style.background='radial-gradient(100% 90% at 50% 30%,#FFFFFF,#F1EFFA)';
 r.innerHTML=`<svg style="position:absolute;left:0;top:0;overflow:visible" width="224" height="200"><defs><linearGradient id="mg6" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD601"/><stop offset=".3" stop-color="#FF6118"/><stop offset=".6" stop-color="#EE30FB"/><stop offset="1" stop-color="#7232F1"/></linearGradient></defs><ellipse class="z-sd" cx="112" cy="178" rx="50" ry="6" fill="rgba(50,50,93,.18)"/><path class="z-sh" fill="url(#mg6)"/></svg>
 <div class="z-lb" style="position:absolute;left:0;right:0;top:10px;text-align:center;font:500 9px ${MONO};letter-spacing:.14em;color:${SUB}"></div>`;
 const sh=q(r,'.z-sh'),sd=q(r,'.z-sd'),lb=q(r,'.z-lb');const M=96;
 const mk=f=>[...Array(M)].map((_,i)=>{const a=i/M*TAU;return f(a)});
 const SH=[mk(a=>58),mk(a=>54/Math.pow(Math.pow(Math.abs(Math.cos(a)),4)+Math.pow(Math.abs(Math.sin(a)),4),.25)),mk(a=>44+24*Math.pow(.5+.5*Math.cos(5*a),1.5)),mk(a=>54+8*Math.sin(3*a+1)+7*Math.cos(5*a-.4))];
 const NM=['CIRCLE','SQUARE','STAR','BLOB'],TT=[.3,1.8,3.3,4.8];
 return t=>{let rad=SH[0].slice(),rot=0,cur=0;TT.forEach((a,j)=>{const m=S(t,a,.9);const nx=SH[(j+1)%4];rad=rad.map((v,i)=>v+(nx[i]-v)*m);rot+=90*m;if(t>a+.3)cur=(j+1)%4});
  const cx=112,cy=96+3*W(t,2);sh.setAttribute('d',rad.map((v,i)=>{const a=i/M*TAU+rot*Math.PI/180;return(i?'L':'M')+(cx+v*Math.cos(a)).toFixed(1)+' '+(cy+v*Math.sin(a)).toFixed(1)}).join(' ')+'Z');
  sh.style.filter='drop-shadow(0 14px 18px rgba(114,50,241,.35))';sd.setAttribute('rx',46+4*W(t,2));lb.textContent=NM[cur];}};

// 07 Dot grid -> wave : a ripple runs through a field of dots, lifting and colouring them as it passes
T2[6]=r=>{r.style.background='#FFFFFF';const x=cv(r);
 const C=[[64,72,.2],[164,132,3.0]];
 return t=>{x.clearRect(0,0,224,200);
  for(let gy=0;gy<13;gy++)for(let gx=0;gx<15;gx++){const px=14+gx*14.3,py=14+gy*14.4;let amp=0;
   C.forEach(([cx,cy,st])=>{const lt=t-st;if(lt<0||lt>2.8)return;const R=lt/2.2*230,dd=Math.hypot(px-cx,py-cy);amp=Math.max(amp,Math.exp(-((dd-R)**2)/(2*16*16))*(1-lt/2.8))});
   const col=grad(((px+py)/424)*.9+.05),base=[205,210,225];const m=cl(amp*1.4);const c=base.map((v,i)=>Math.round(v+(col[i]-v)*m));
   x.fillStyle=rgb(c);x.beginPath();x.arc(px,py-7*amp,1.5+3.4*amp,0,7);x.fill()}}};

// 08 Cards -> shuffle : a deck fans out, closes, then the top card slides off and tucks under, five times
T2[7]=r=>{r.style.background='linear-gradient(170deg,#F6F5FF,#ECEAF7)';
 const looks=[`background:${GRAD}`,`background:${NAVY}`,`background:${PUR}`,`background:#fff;border:1px solid #E3E8EE`,`background:#0B0B0F`];
 r.innerHTML=looks.map((l,i)=>`<div class="z-c" style="position:absolute;left:52px;top:62px;width:120px;height:76px;border-radius:9px;box-sizing:border-box;${l};box-shadow:0 14px 22px -12px rgba(50,50,93,.45);transform-origin:50% 160%"><i style="position:absolute;left:12px;top:12px;width:16px;height:12px;border-radius:3px;background:${i==3?'#E3E8EE':'rgba(255,255,255,.55)'}"></i><b style="position:absolute;left:12px;bottom:10px;font:500 9px ${F};letter-spacing:.12em;color:${i==3?NAVY:'#fff'}">•••• ${[4242,1881,5100,3007,9424][i]}</b></div>`).join('');
 const cs=qa(r,'.z-c');const SH=[1.7,2.54,3.38,4.22,5.06],DU=.84;
 return t=>{const fan=IO(t,.2,.5)*(1-IO(t,1.05,.5));let n=0,u=-1;SH.forEach(a=>{if(t>=a+DU)n++;else if(t>=a)u=(t-a)/DU});
  cs.forEach((c,i)=>{let dep=((i-n)%5+5)%5,x=0,y=0,rz=0;
   if(u>=0){if(dep===0){const e=IO(u,0,1);x=96*Math.sin(Math.PI*e);y=-14*Math.sin(Math.PI*e);rz=14*Math.sin(Math.PI*e);dep=e<.5?0:4*e;if(e>=.5)dep=4-4*(1-e)*0}else dep=dep-IO(u,0,1)}
   const z=u>=0&&((i-n)%5+5)%5===0?(IO(u,0,1)<.5?100:1):100-Math.round(dep*10);
   const fz=(Math.round(dep)-2)*16*fan;c.style.zIndex=z;
   c.style.transform=`translate(${x}px,${y-dep*5}px) rotate(${rz+fz}deg) scale(${1-dep*.035})`;});}};

// 09 Number -> roll : a big figure rolls up from zero with motion blur, holds, then spins back down
T2[8]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F3F5FA)';
 r.innerHTML=`<div style="position:absolute;left:16px;top:22px;font:400 11px ${F};color:${SUB}">Revenue this year</div><div class="z-n" style="position:absolute;left:14px;top:46px"></div>
 <div class="z-ch" style="position:absolute;left:16px;top:96px;padding:5px 9px;border-radius:6px;background:#D7F7E1;font:500 10px ${F};color:#0A8A3A;opacity:0">+24% year on year</div>
 <div style="position:absolute;left:16px;right:16px;bottom:18px;height:44px;display:flex;align-items:flex-end;gap:5px">${[30,42,36,52,48,64,58,74,70,86,82,100].map((h,i)=>`<i class="z-b" style="flex:1;height:${h}%;border-radius:3px 3px 1px 1px;background:${i==11?GRAD:'#E6E3F5'};transform-origin:50% 100%"></i>`).join('')}</div>`;
 const el=q(r,'.z-n');el.style.cssText+=`;display:flex;font:500 30px/1 ${F};color:${NAVY};letter-spacing:-.03em;font-feature-settings:"ss01" on,"tnum" on`;
 const tpl='£1,284,960',cols=[];[...tpl].forEach(ch=>{if(!/\d/.test(ch)){const s=document.createElement('span');s.textContent=ch;el.appendChild(s);return}const w=document.createElement('span');w.style.cssText='display:inline-block;height:30px;overflow:hidden';const c=document.createElement('span');c.style.cssText='display:flex;flex-direction:column';for(let k=0;k<50;k++){const d=document.createElement('span');d.textContent=k%10;d.style.height='30px';c.appendChild(d)}w.appendChild(c);el.appendChild(w);cols.push({c,v:+ch})});
 const bs=qa(r,'.z-b'),ch=q(r,'.z-ch');
 const sp=j=>o=>o.v+10*(1+j%3);const pos=t=>cols.map((o,j)=>{const n=sp(j)(o);return 10+n*P(t,.3+j*.08,1.4)-n*IO(t,4.6+(cols.length-j)*.04,.9)});
 return t=>{const a=pos(t),b=pos(t+.025);cols.forEach((o,j)=>{o.c.style.transform=`translateY(${-a[j]*30}px)`;o.c.style.filter=`blur(${Math.min(3,Math.abs(b[j]-a[j])*40*.035*3.4)}px)`});
  const g=S(t,2.0,.5)*(1-P(t,4.5,.3));ch.style.opacity=cl(g*2);ch.style.transform=`scale(${.7+.3*g})`;ch.style.transformOrigin='left center';
  bs.forEach((b,i)=>b.style.transform=`scaleY(${S(t,.4+i*.06,.5)*(1-IO(t,4.6+i*.03,.6))})`);}};

// 10 Ribbon -> twist : a gradient ribbon twists through 3D space, front and back lit differently
T2[9]=r=>{r.style.background='radial-gradient(110% 90% at 50% 40%,#173560,#0A2540 72%)';const x=cv(r);
 return t=>{x.clearRect(0,0,224,200);const ph=t*TAU/6,step=1;let prev=null;
  for(let X=-6;X<=230;X+=step){const a=X*.028+ph,c=Math.cos(a),s=Math.sin(a);const yc=100+26*Math.sin(X*.021+ph)+8*Math.sin(X*.05-ph*2),w=30;
   const p=[X,yc-w*c,yc+w*c,s];if(prev){const front=(p[2]-p[1])>0;const col=grad(X/224*.95);const sh=.55+.45*Math.abs(c);
    x.fillStyle=rgb(front?col.map(v=>Math.round(v*sh+(255-v)*.12*Math.abs(s))):col.map(v=>Math.round(v*.45*sh)));
    x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(p[0]+1.2,p[1]);x.lineTo(p[0]+1.2,p[2]);x.lineTo(prev[0],prev[2]);x.closePath();x.fill()}prev=p}
  const g=x.createLinearGradient(0,0,224,0);g.addColorStop(0,'rgba(10,37,64,.9)');g.addColorStop(.12,'rgba(10,37,64,0)');g.addColorStop(.88,'rgba(10,37,64,0)');g.addColorStop(1,'rgba(10,37,64,.9)');x.fillStyle=g;x.fillRect(0,0,224,200);}};

// 11 Liquid -> merge : gradient blobs drift, pull together into one drop and split apart again
T2[10]=r=>{r.style.background='#FFFFFF';const c=document.createElement('canvas');c.width=224;c.height=200;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');const img=x.createImageData(224,200);
 const B=[[112,100,34,52,30,1,0],[112,100,26,58,36,-1,1.7],[112,100,22,40,44,2,3.1],[112,100,18,64,22,-2,4.4]];
 const lut=[...Array(256)].map((_,i)=>grad(i/255));
 return t=>{const pull=.35+.65*(.5+.5*Math.cos(t*TAU/6));const bs=B.map(([cx,cy,rr,ax,ay,n,ph])=>[cx+ax*pull*Math.cos(t*TAU/6*n+ph),cy+ay*pull*Math.sin(t*TAU/6*n+ph),rr*rr]);
  const d=img.data;for(let yy=0;yy<200;yy++)for(let xx=0;xx<224;xx++){let f=0;for(const [bx,by,r2] of bs){const dx=xx-bx,dy=yy-by;f+=r2/(dx*dx+dy*dy+1)}
   const i=(yy*224+xx)*4;const a=cl((f-.92)/.16);if(a<=0){d[i+3]=0;continue}const col=lut[Math.round(cl((xx*.6+yy*.4)/200)*255)];const hl=cl((f-1.6)/2)*.25;
   d[i]=col[0]+(255-col[0])*hl;d[i+1]=col[1]+(255-col[1])*hl;d[i+2]=col[2]+(255-col[2])*hl;d[i+3]=a*255}
  x.putImageData(img,0,0);}};

// 12 Phone -> explode : an isometric phone splits into its layers, hangs in the air, then snaps back together
T2[11]=r=>{r.style.background='linear-gradient(170deg,#F5F7FB,#E9EDF5)';
 const L=[`background:${NAVY}`,`background:#1C2B44;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)`,`background:#fff`,`background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.8);backdrop-filter:blur(2px)`];
 const inner=[``,`${[[10,14,24,18],[40,14,18,18],[10,40,52,10],[10,56,30,26]].map(([l,tp,w,h],k)=>`<i style="position:absolute;left:${l}px;top:${tp}px;width:${w}px;height:${h}px;border-radius:3px;background:${k==3?GRAD:'#3A4A66'}"></i>`).join('')}`,
  `<i style="position:absolute;left:8px;top:12px;width:56px;height:34px;border-radius:6px;background:${GRAD}"></i>${[54,64,74].map((y,k)=>`<i style="position:absolute;left:8px;top:${y}px;width:${[48,36,42][k]}px;height:5px;border-radius:3px;background:#E3E8EE"></i>`).join('')}<i style="position:absolute;left:8px;top:96px;width:56px;height:16px;border-radius:8px;background:${PUR}"></i>`,``];
 r.innerHTML=`<div class="z-st" style="position:absolute;left:76px;top:30px;width:72px;height:128px;transform-style:preserve-3d">${L.map((s,i)=>`<div class="z-l" style="position:absolute;inset:0;border-radius:13px;${s};box-shadow:0 0 0 0 transparent">${inner[i]}</div>`).join('')}</div>
 <div class="z-sd" style="position:absolute;left:62px;top:150px;width:100px;height:30px;border-radius:50%;background:rgba(50,50,93,.2);filter:blur(8px)"></div>`;
 const st=q(r,'.z-st'),ls=qa(r,'.z-l'),sd=q(r,'.z-sd');
 return t=>{const e=IO(t,.4,1.0)*(1-IO(t,3.8,.9));const snap=Math.sin(cl((t-4.7)/.25)*Math.PI)*.08;
  st.style.transform=`translateY(${-6*e+3*W(t)}px) rotateX(56deg) rotateZ(${-42+5*W(t)}deg)`;
  ls.forEach((l,i)=>{l.style.transform=`translateZ(${i*3+i*30*e}px) scale(${1+snap*(i==3?1:0)})`;l.style.boxShadow=e>.05?`0 ${10*e}px ${18*e}px rgba(50,50,93,${.25*e})`:'none'});
  sd.style.transform=`scale(${1+.25*e})`;sd.style.opacity=.9-.4*e;}};

// 13 Rings -> orbit : three tilted orbits with moons passing in front of and behind a glowing core
T2[12]=r=>{r.style.background='radial-gradient(100% 90% at 50% 45%,#173560,#0A2540 72%)';const x=cv(r);
 const O=[[92,30,1,0,STOPS[1]],[70,23,2,1.5,STOPS[2]],[48,15,3,3,STOPS[4]]],CX=112,CY=100,TL=-.32;
 const pt=(rx,ry,a)=>{const X=rx*Math.cos(a),Y=ry*Math.sin(a);return[CX+X*Math.cos(TL)-Y*Math.sin(TL),CY+X*Math.sin(TL)+Y*Math.cos(TL),Math.sin(a)]};
 const ring=(rx,ry,a0,a1)=>{x.beginPath();for(let k=0;k<=40;k++){const [px,py]=pt(rx,ry,a0+(a1-a0)*k/40);k?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()};
 const moon=(px,py,z,c)=>{const s=4+2.5*(z+1)/2;x.fillStyle=c;x.shadowColor=c;x.shadowBlur=12;x.beginPath();x.arc(px,py,s,0,7);x.fill();x.shadowBlur=0};
 return t=>{x.clearRect(0,0,224,200);x.lineWidth=1.2;const ms=O.map(([rx,ry,n,ph,c])=>{const a=t*TAU/6*n+ph;return[...pt(rx,ry,a),c]});
  x.strokeStyle='rgba(255,255,255,.18)';O.forEach(([rx,ry])=>ring(rx,ry,Math.PI,TAU));ms.filter(m=>m[2]<0).forEach(m=>moon(...m));
  const g=x.createRadialGradient(CX-8,CY-10,2,CX,CY,26);g.addColorStop(0,'#FFE3F9');g.addColorStop(.35,'#EE30FB');g.addColorStop(1,'#7232F1');x.fillStyle=g;x.shadowColor='#EE30FB';x.shadowBlur=28+8*W(t,2);x.beginPath();x.arc(CX,CY,24,0,7);x.fill();x.shadowBlur=0;
  x.strokeStyle='rgba(255,255,255,.4)';O.forEach(([rx,ry])=>ring(rx,ry,0,Math.PI));ms.filter(m=>m[2]>=0).forEach(m=>moon(...m));}};

// 14 Words -> kinetic : MAKE IT MOVE. slams in line by line, exits up, then SHIP IT FAST. does the same
T2[13]=r=>{r.style.background='#FFFFFF';
 const sets=[['MAKE','IT','MOVE.'],['SHIP','IT','FAST.']];
 r.innerHTML=sets.map((s,k)=>`<div class="z-set" style="position:absolute;left:18px;top:30px">${s.map((w,i)=>`<div style="height:44px;overflow:hidden"><div class="z-w" style="font:600 42px/44px ${F};letter-spacing:-.045em;${i==2?`background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent`:`color:${NAVY}`}">${w}</div></div>`).join('')}</div>`).join('')+
 `<div class="z-ct" style="position:absolute;right:14px;bottom:12px;font:500 9px ${MONO};letter-spacing:.12em;color:${SUB}">01/02</div><i class="z-bar" style="position:absolute;left:18px;bottom:16px;height:3px;width:0;border-radius:2px;background:${GRAD}"></i>`;
 const ss=qa(r,'.z-set').map(s=>qa(s,'.z-w')),ct=q(r,'.z-ct'),bar=q(r,'.z-bar');
 return t=>{ss.forEach((ws,k)=>{const tt=!k&&t>5.2?t-6:t,a=k?2.6:-.35,b=k?5.3:2.35;ws.forEach((w,i)=>{const inn=S(tt,a+i*.13,.55),out=IO(tt,b+i*.08,.42);
   const dir=i==1?'X':'Y';const v=i==1?(-110*(1-inn)):(100*(1-inn));w.style.transform=`translate${dir}(${v}%) translateY(${-100*out}%)`;})});
  ct.textContent=t<2.6||t>5.6?'01/02':'02/02';bar.style.width=(t<2.6?L(t,0,2.5):t>5.6?0:L(t,2.6,2.9))*120+'px';}};

// 15 Button -> magnetic : the pointer drifts near, the button leans toward it, a click turns it green, then it lets go
T2[14]=r=>{r.style.background='radial-gradient(100% 90% at 50% 40%,#FFFFFF,#F1EFFA)';
 r.innerHTML=`<div class="z-bt" style="position:absolute;left:52px;top:80px;width:120px;height:40px;border-radius:20px;background:${PUR};box-shadow:0 10px 20px -8px rgba(99,91,255,.7);overflow:hidden">
  <div class="z-l1" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;font:500 13px ${F};color:#fff">Get started <span>→</span></div>
  <div class="z-l2" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px;font:500 13px ${F};color:#fff">${tick('#fff',15,3)}You're in</div></div>
 <i class="z-rp" style="position:absolute;left:112px;top:100px;width:0;height:0;border-radius:50%;border:2px solid ${PUR};transform:translate(-50%,-50%);opacity:0"></i>
 <div class="z-cu" style="position:absolute;left:0;top:0;width:16px;height:22px;z-index:9;transform-origin:0 0;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><svg width="16" height="22" viewBox="0 0 16 22"><path d="M1.5 1.5v16.2l4.1-3.9 2.7 6.3 2.9-1.2-2.7-6.2h5.7z" fill="#0A0A0A" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`;
 const bt=q(r,'.z-bt'),l1=q(r,'.z-l1'),l2=q(r,'.z-l2'),rp=q(r,'.z-rp'),cu=q(r,'.z-cu');
 const K=[[0,205,190,0],[.2,205,190,1],[1.0,170,140,1],[1.5,80,62,1],[2.0,118,104,1],[2.4,116,102,1],[3.0,170,132,1],[4.0,40,40,1],[4.6,12,16,1],[4.9,12,16,0],[6,205,190,0]];
 return t=>{const [cx,cy,o]=kf(K,t);const press=Math.sin(cl((t-2.28)/.24)*Math.PI);cu.style.opacity=o;cu.style.transform=`translate(${cx}px,${cy}px) scale(${1-.15*press})`;
  const dx=cx-112,dy=cy-100,dd=Math.hypot(dx,dy),pull=o*Math.max(0,1-dd/95)*.32;
  bt.style.transform=`translate(${dx*pull}px,${dy*pull}px) scale(${1+.06*pull*3-.06*press})`;
  const g=P(t,2.35,.35)*(1-P(t,4.7,.35));bt.style.background=`color-mix(in srgb,${GRN} ${g*100}%,${PUR})`;bt.style.boxShadow=`0 ${10+8*pull*3}px ${20+14*pull*3}px -8px ${g>.5?'rgba(0,179,65,.7)':'rgba(99,91,255,.75)'}`;
  l1.style.transform=`translate(${dx*pull*.5}px,${dy*pull*.5-g*10}px)`;l1.style.opacity=1-cl(g*2);l2.style.opacity=cl(g*2-1);l2.style.transform=`translateY(${(1-g)*10}px)`;
  const k=L(t,2.35,.7);rp.style.width=rp.style.height=(40+90*E(k))+'px';rp.style.opacity=k>0&&k<1?.6*(1-k):0;}};

// 16 Confetti -> burst : the button pops, 70 pieces of confetti burst out, flutter and fall, twice a loop
T2[15]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F4F2FB)';const x=cv(r);
 r.insertAdjacentHTML('beforeend',`<div class="z-bt" style="position:absolute;left:78px;top:54px;width:68px;height:68px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center;box-shadow:inset 0 2px 0 rgba(255,255,255,.45),0 14px 26px -8px rgba(238,48,251,.65)">${tick('#fff',34,3)}</div><div class="z-lb" style="position:absolute;left:0;right:0;top:134px;text-align:center;font:500 14px ${F};color:${NAVY}">You're live</div>`);
 const bt=q(r,'.z-bt'),lb=q(r,'.z-lb');const R=rng(16),cols=[...STOPS,PUR,GRN].map(hex);
 const P0=[...Array(120)].map(()=>{const a=-Math.PI/2+(R()-.5)*2.6,s=110+R()*120;return{vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,c:cols[Math.floor(R()*cols.length)],w:R()<.5,rot:R()*TAU,sp:(R()-.5)*14,fl:R()*TAU}});
 const BU=[.45,3.45];
 return t=>{x.clearRect(0,0,224,200);
  BU.forEach(b=>{const lt=t-b;if(lt<0||lt>2.5)return;P0.forEach(p=>{const dr=1-Math.exp(-1.6*lt);const px=112+p.vx/1.6*dr,py=90+p.vy/1.6*dr+120*lt*lt*.5;
   const a=lt<1.8?1:1-(lt-1.8)/.7;x.save();x.globalAlpha=a;x.translate(px,py);x.rotate(p.rot+p.sp*lt);x.scale(1,Math.cos(p.fl+lt*9));x.fillStyle=rgb(p.c);
   if(p.w)x.fillRect(-3.5,-1.6,7,3.2);else{x.beginPath();x.arc(0,0,2.4,0,7);x.fill()}x.restore()})});
  const sq=BU.reduce((m,b)=>{const lt=t-b;return lt>-.25&&lt<.5?(lt<0?1-.14*Math.sin(cl((lt+.25)/.25)*Math.PI/2):1+.14*Math.sin(cl(lt/.5)*Math.PI)*(1-cl(lt/.5))):m},1);
  bt.style.transform=`scale(${sq}) translateY(${2*W(t,2)}px)`;const v=BU.reduce((m,b)=>Math.max(m,Math.sin(cl((t-b)/2.6)*Math.PI)),0);lb.style.opacity=.35+.65*v;lb.style.transform=`translateY(${(1-v)*4}px)`;}};
})();
