// v3 tiles (15/10/2026): every tile now plays two acts across the full 6 s and flows back to its first frame.
// No fade-to-reset, no 3-second freeze. Replaces window.T2[0..15]. seek(lt), lt in [0,6), and lt=6 must equal lt=0.
(function(){
const T2=window.T2;
const NAVY='#0A2540',SUB='#425466',PUR='#635BFF',GRN='#00B341',RED='#DF1B41';
const STOPS=['#FFD601','#FF6118','#EE30FB','#FB76FA','#7232F1'];
const GRAD='linear-gradient(110deg,#FFD601,#FF6118 25%,#EE30FB 50%,#FB76FA 72%,#7232F1)';
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=dX(t);if(Math.abs(d)<1e-6)break;t-=(X(t)-x)/d}return Y(Math.min(1,Math.max(0,t)))}}
const E=bez(.25,1,.5,1),cl=x=>Math.max(0,Math.min(1,x));
const P=(t,a,d)=>E(cl((t-a)/d)),L=(t,a,d)=>cl((t-a)/d);
const IO=(t,a,d)=>{const x=cl((t-a)/d);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
const S=(t,a,d)=>{const x=cl((t-a)/d);if(x>=1)return 1;const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const W=(t,ph=0)=>Math.sin(t*Math.PI/3+ph); // one full wave per 6 s loop, so ambient motion is seamless
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif";
const SH='0 18px 30px -16px rgba(50,50,93,.38),0 8px 16px -8px rgba(0,0,0,.12)';
const tick=(c,s,w=2)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M5 12.5l4.6 4.6L19 7.5" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cross=(c,s,w=2.6)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></svg>`;
const q=(r,c)=>r.querySelector(c),qa=(r,c)=>[...r.querySelectorAll(c)];
const chip=(cls,bg,fg,html,extra='')=>`<div class="z-${cls}" style="position:absolute;padding:6px 10px;border-radius:7px;background:${bg};font:500 11px ${F};color:${fg};display:flex;gap:5px;align-items:center;white-space:nowrap;box-shadow:0 8px 16px -8px rgba(0,0,0,.25);opacity:0;${extra}">${html}</div>`;

// keyframes [t, ...values] -> eased values at t
const kf=(K,t)=>{if(t<=K[0][0])return K[0].slice(1);for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i],e=IO(t,a[0],b[0]-a[0]);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*e)}}return K[K.length-1].slice(1)};
// macOS-style pointer with a click ring
const CUR=`<div class="z-cu" style="position:absolute;left:0;top:0;width:16px;height:22px;z-index:30;transform-origin:0 0;opacity:0;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><i class="z-cr" style="position:absolute;left:-12px;top:-12px;width:26px;height:26px;border-radius:50%;background:rgba(99,91,255,.25);border:1.5px solid rgba(99,91,255,.7);box-sizing:border-box;opacity:0"></i><svg style="position:absolute;left:0;top:0" width="16" height="22" viewBox="0 0 16 22"><path d="M1.5 1.5v16.2l4.1-3.9 2.7 6.3 2.9-1.2-2.7-6.2h5.7z" fill="#0A0A0A" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`;
// finger touch for phones and readers
const TOUCH=`<div class="z-cu" style="position:absolute;left:0;top:0;width:0;height:0;z-index:30;opacity:0"><i style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.55);border:1.5px solid rgba(10,37,64,.25);box-sizing:border-box;backdrop-filter:blur(2px)"></i><i class="z-cr" style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,.9);box-sizing:border-box;opacity:0"></i></div>`;
const curSet=(cu,K,clicks,t)=>{const [x,y,o]=kf(K,t);let pr=0,rk=-1;clicks.forEach(c=>{pr=Math.max(pr,Math.sin(cl((t-c+.1)/.24)*Math.PI));const k=L(t,c,.45);if(k>0&&k<1)rk=k});
 cu.style.opacity=o;cu.style.transform=`translate(${x}px,${y}px) scale(${1-.16*pr})`;const r=q(cu,'.z-cr');r.style.opacity=rk<0?0:(1-rk);r.style.transform=`scale(${.4+1.4*(rk<0?0:E(rk))})`};

// odometer wheels: set(pos[]) where pos is a wheel position (digit = pos mod 10), blur from speed
function wheel(el,tpl,size,weight,color){el.innerHTML='';el.style.display='flex';el.style.font=`${weight} ${size}px/1 ${F}`;el.style.color=color;el.style.letterSpacing='-.03em';el.style.fontFeatureSettings='"ss01" on,"tnum" on';
 const cols=[];[...tpl].forEach(ch=>{if(!/\d/.test(ch)){const s=document.createElement('span');s.textContent=ch;el.appendChild(s);return}
  const w=document.createElement('span');w.style.cssText=`display:inline-block;height:${size}px;overflow:hidden;position:relative`;const c=document.createElement('span');c.style.cssText='display:flex;flex-direction:column';
  for(let k=0;k<60;k++){const d=document.createElement('span');d.textContent=k%10;d.style.height=size+'px';c.appendChild(d)}w.appendChild(c);el.appendChild(w);cols.push(c)});
 return f=>t=>{const a=f(t),b=f(t+.025);cols.forEach((c,j)=>{c.style.transform=`translateY(${-a[j]*size}px)`;c.style.filter=`blur(${Math.min(3,Math.abs(b[j]-a[j])*40*.035*size/10)}px)`})}}

// 01 Checkout -> paid : finger taps Pay, button morphs to spinner then tick, receipt line lands, screen swipes to the next checkout
T2[0]=r=>{r.style.background='linear-gradient(160deg,#EEF0FF,#F9F5FF 60%,#FFF4EE)';
 r.innerHTML=`<div class="z-ph" style="position:absolute;left:36px;top:12px;width:152px;height:250px;border-radius:30px;background:#0B0B0F;box-shadow:0 24px 40px -18px rgba(50,50,93,.5),0 10px 20px -10px rgba(0,0,0,.25)">
 <div style="position:absolute;inset:5px;border-radius:25px;background:#fff;overflow:hidden">
  <div style="position:absolute;left:52px;top:7px;width:38px;height:11px;border-radius:6px;background:#0B0B0F;z-index:2"></div>
  <div class="z-sc" style="position:absolute;inset:0">
  <div style="position:absolute;left:14px;top:30px;width:38px;height:38px;border-radius:9px;background:${GRAD};overflow:hidden"><i class="z-gl" style="position:absolute;top:-10px;bottom:-10px;width:16px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg)"></i></div>
  <div style="position:absolute;left:60px;top:32px;font:400 10px ${F};color:${SUB}">Pro plan</div>
  <div style="position:absolute;left:60px;top:46px;font:500 19px/1 ${F};color:${NAVY};letter-spacing:-.03em">£49.00</div>
  <div class="z-fd" style="position:absolute;left:14px;top:82px;width:114px;height:28px;border-radius:6px;border:1px solid #E3E8EE;font:400 11px/26px ${F};color:${NAVY};padding-left:9px;box-sizing:border-box">•••• 4242</div>
  <div class="z-ok" style="position:absolute;left:0;right:0;top:86px;text-align:center;font:500 12px ${F};color:${NAVY};opacity:0">Payment successful</div>
  <div class="z-bt" style="position:absolute;left:14px;top:122px;width:114px;height:36px;border-radius:7px;background:${PUR};display:flex;align-items:center;justify-content:center;font:500 13px ${F};color:#fff;box-shadow:0 8px 16px -6px rgba(99,91,255,.7)">
   <span class="z-lb">Pay £49.00</span>
   <svg class="z-sp" viewBox="0 0 28 28" width="22" height="22" style="position:absolute;opacity:0"><circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/><circle class="z-arc" cx="14" cy="14" r="10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".75" transform="rotate(-90 14 14)"/></svg>
   <span class="z-tk" style="position:absolute;opacity:0;display:flex">${tick('#fff',22,2.8)}</span></div>
  <div class="z-rp" style="position:absolute;left:71px;top:140px;width:0;height:0;border-radius:50%;border:2px solid ${GRN};transform:translate(-50%,-50%);opacity:0"></div>
  <div class="z-rx" style="position:absolute;left:0;right:0;top:103px;text-align:center;font:400 9px ${F};color:${SUB};opacity:0">Receipt sent to sam@</div>
  </div>${TOUCH}
 </div></div>`;
 const ph=q(r,'.z-ph'),sc=q(r,'.z-sc'),bt=q(r,'.z-bt'),lb=q(r,'.z-lb'),sp=q(r,'.z-sp'),arc=q(r,'.z-arc'),tk=q(r,'.z-tk'),rp=q(r,'.z-rp'),ok=q(r,'.z-ok'),fd=q(r,'.z-fd'),rx=q(r,'.z-rx'),cu=q(r,'.z-cu'),gl=q(r,'.z-gl');
 return t=>{const u=t>=5.0?t-6:t;
  ph.style.transform=`translateY(${W(t)*2}px)`;gl.style.left=(-20+80*L(t,.0,1.0))+'px';
  const out=t>=4.55&&t<5.0?IO(t,4.55,.45):0,inn=t>=5.0?1-P(t,5.0,.5):0;sc.style.transform=`translateX(${-150*out+150*inn}px)`;
  curSet(cu,[[-1,71,150,0],[.45,71,150,0],[.55,71,141,1],[.95,71,141,1],[1.1,71,141,0]],[.7],u);
  const press=Math.sin(cl((u-.62)/.28)*Math.PI);const m=P(u,.9,.35);
  const w=114-(114-36)*m;bt.style.width=w+'px';bt.style.left=(14+(114-w)/2)+'px';bt.style.borderRadius=(7+11*m)+'px';bt.style.transform=`scale(${1-.06*press})`;
  lb.style.opacity=1-cl(m*2.5);const spin=L(u,1.05,.95);sp.style.opacity=cl((m-.6)*4)*(1-P(u,1.95,.12));sp.style.transform=`rotate(${spin*720}deg)`;arc.style.strokeDashoffset=.75-.5*Math.sin(spin*Math.PI);
  const g=P(u,1.95,.25);bt.style.background=g>0?`color-mix(in srgb,${GRN} ${g*100}%,${PUR})`:PUR;bt.style.boxShadow=`0 8px 16px -6px ${g>.5?'rgba(0,179,65,.7)':'rgba(99,91,255,.7)'}`;
  const k=S(u,2.0,.45);tk.style.opacity=cl(k*3);tk.style.transform=`scale(${k})`;
  const rr=L(u,2.05,.7);rp.style.width=rp.style.height=(36+80*E(rr))+'px';rp.style.opacity=rr>0&&rr<1?.7*(1-rr):0;
  fd.style.opacity=1-P(u,1.95,.2);fd.style.transform=`translateY(${-6*P(u,1.95,.2)}px)`;
  const o=P(u,2.2,.35);ok.style.opacity=o;ok.style.transform=`translateY(${(1-o)*8}px)`;
  const x=P(u,3.0,.45);rx.style.opacity=x;rx.style.transform=`translateY(${(1-x)*6}px)`;}};

// 02 Card -> flip : card floats with a sheen, flips to a receipt whose total rolls up, then keeps turning back to the card
T2[1]=r=>{r.style.background=`radial-gradient(120% 90% at 50% 0%,#1A3A5F,${NAVY} 70%)`;
 r.innerHTML=`<div style="position:absolute;left:0;top:0;width:224px;height:200px;perspective:520px">
 <div class="z-cd" style="position:absolute;left:30px;top:44px;width:164px;height:104px;transform-style:preserve-3d">
  <div style="position:absolute;inset:0;border-radius:10px;background:${GRAD};backface-visibility:hidden;overflow:hidden;box-shadow:0 22px 36px -14px rgba(238,48,251,.55)">
   <div style="position:absolute;left:14px;top:16px;width:24px;height:18px;border-radius:4px;background:linear-gradient(135deg,#FFE9A8,#E7B84C)"></div>
   <svg style="position:absolute;right:14px;top:16px" width="16" height="18" viewBox="0 0 16 18"><path d="M3 4c3 3 3 7 0 10M7 2c4 4 4 10 0 14M11 0c5 5 5 13 0 18" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5" stroke-linecap="round"/></svg>
   <div style="position:absolute;left:14px;bottom:16px;font:400 13px ${F};letter-spacing:.12em;color:#fff">•••• 4242</div>
   <div style="position:absolute;right:14px;bottom:15px;font:500 11px ${F};color:#fff;opacity:.9">12/29</div>
   <div class="z-sh" style="position:absolute;top:-20px;bottom:-20px;width:60px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg)"></div></div>
  <div style="position:absolute;inset:0;border-radius:10px;background:#fff;backface-visibility:hidden;transform:rotateY(180deg);box-shadow:0 22px 36px -14px rgba(0,0,0,.5)">
   <div class="z-bk" style="position:absolute;left:14px;top:16px;width:30px;height:30px;border-radius:50%;background:${PUR};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 12px -4px rgba(99,91,255,.7)">${tick('#fff',18,2.6)}</div>
   <div style="position:absolute;left:54px;top:15px;font:400 9px ${F};color:${SUB}">Payment received</div>
   <div class="z-am" style="position:absolute;left:53px;top:27px"></div>
   <div style="position:absolute;left:14px;right:14px;top:62px;height:1px;background:#E3E8EE"></div>
   <div style="position:absolute;left:14px;top:72px;font:400 9px ${F};color:${SUB}">Visa •• 4242 · Just now</div></div>
 </div></div>`;
 const cd=q(r,'.z-cd'),sh=q(r,'.z-sh'),bk=q(r,'.z-bk');
 const D=[4,8,5,0];const am=wheel(q(r,'.z-am'),'£4,850',20,500,NAVY)(t=>D.map((d,j)=>t>4.6?10:10+(10+d)*P(t,1.55+j*.09,1.0)));
 return t=>{const f1=S(t,1.0,.75),f2=S(t,3.9,.75);const tilt=W(t)*7*(t<1||t>4.6?1:0);
  cd.style.transform=`translateY(${W(t)*3}px) rotateX(${6+2*W(t,1)}deg) rotateY(${180*(f1+f2)+tilt}deg)`;
  const s1=L(t,.15,.8),s2=L(t,4.75,.8);sh.style.left=(-70+260*(t<3?s1:s2))+'px';
  const b=S(t,1.6,.45);bk.style.transform=`scale(${t>4.6?0:b})`;am(t);}};

// 03 Globe -> payments : dotted globe turns, payment arcs launch all loop long, counter ticks on each landing
T2[2]=r=>{r.style.background='radial-gradient(90% 80% at 50% 45%,#FFFFFF,#F1F4FA)';
 const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);
 const lab=document.createElement('div');lab.style.cssText=`position:absolute;left:12px;top:12px;padding:5px 8px;border-radius:6px;background:rgba(255,255,255,.85);box-shadow:0 6px 14px -8px rgba(50,50,93,.35);font:500 10px ${F};color:${NAVY};backdrop-filter:blur(6px)`;
 lab.innerHTML=`<span style="color:${SUB};font-weight:400">Payments </span><span class="z-n" style="display:inline-flex;vertical-align:bottom"></span>`;r.appendChild(lab);
 const arcs=[[[51,0],[40,-74],0],[[40,-74],[-23,-46],1.15],[[51,0],[1,104],2.3],[[52,13],[19,73],3.45],[[40,-74],[51,0],4.6]];
 const lands=arcs.map(a=>a[2]+.9); // .9 .. 5.5, all inside the loop, so the ones wheel turns exactly once per 6 s
 const od=wheel(q(lab,'.z-n'),'12,480',10,500,NAVY)(t=>[11,12,14,18,10+2*lands.reduce((s,l)=>s+P(t,l,.35),0)]);
 const x=c.getContext('2d');x.scale(2,2);
 const blobs=[[45,-100,22,30],[15,-60,14,12],[-15,-60,20,12],[50,15,14,22],[5,20,25,16],[45,90,25,45],[25,80,14,18],[-25,135,12,14]];
 const land=(la,lo)=>blobs.reduce((s,[a,b,ra,rb])=>{let dl=((lo-b+540)%360)-180;return s+Math.exp(-((la-a)**2/(ra*ra)+(dl*dl)/(rb*rb)))},0);
 const pts=[];const N=2600,ga=Math.PI*(3-Math.sqrt(5));
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,rr=Math.sqrt(1-y*y),th=ga*i;const la=Math.asin(y)*180/Math.PI,lo=((th*180/Math.PI)%360)-180;pts.push([la,lo,land(la,lo)>.45])}
 const CX=112,CY=112,RA=84;
 const proj=(la,lo,rot,alt=0)=>{const a=la*Math.PI/180,b=(lo+rot)*Math.PI/180,k=1+alt;let X=Math.cos(a)*Math.sin(b)*k,Y=Math.sin(a)*k,Z=Math.cos(a)*Math.cos(b)*k;
  const tl=-.32,Y2=Y*Math.cos(tl)-Z*Math.sin(tl),Z2=Y*Math.sin(tl)+Z*Math.cos(tl);return [CX+X*RA,CY-Y2*RA,Z2]};
 const slerp=(A,B,s)=>{const v=([la,lo])=>{const a=la*Math.PI/180,b=lo*Math.PI/180;return[Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)]};
  const p=v(A),q2=v(B);let dot=p[0]*q2[0]+p[1]*q2[1]+p[2]*q2[2];const om=Math.acos(Math.min(1,dot)),so=Math.sin(om)||1;
  const w1=Math.sin((1-s)*om)/so,w2=Math.sin(s*om)/so;const m=[p[0]*w1+q2[0]*w2,p[1]*w1+q2[1]*w2,p[2]*w1+q2[2]*w2];
  return [Math.asin(m[1])*180/Math.PI,Math.atan2(m[0],m[2])*180/Math.PI]};
 return t=>{const rot=-20+18*W(t);x.clearRect(0,0,224,200);
  const g=x.createRadialGradient(CX-20,CY-25,10,CX,CY,RA+6);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(220,228,245,.9)');
  x.fillStyle=g;x.beginPath();x.arc(CX,CY,RA,0,7);x.fill();
  for(const [la,lo,ld] of pts){const [px,py,z]=proj(la,lo,rot);if(z<0)continue;x.globalAlpha=ld?.4+.6*z:.10+.12*z;x.fillStyle=ld?'#33415E':'#8FA0C0';x.beginPath();x.arc(px,py,ld?1+.45*z:.7,0,7);x.fill()}
  x.globalAlpha=1;
  arcs.forEach(([A,B,st],i)=>{const lt=((t-st)%6+6)%6;const p=P(lt,0,.9),fade=1-P(lt,2.2,.6);if(p<=0||fade<=0)return;const col=STOPS[[2,1,4,2,3][i]];
   const seg=[];const n=40;for(let k=0;k<=n*p;k++){const s=k/n;const [la,lo]=slerp(A,B,s);seg.push(proj(la,lo,rot,.32*Math.sin(Math.PI*s)))}
   const gr=x.createLinearGradient(seg[0][0],seg[0][1],seg[seg.length-1][0],seg[seg.length-1][1]);gr.addColorStop(0,'rgba(99,91,255,.15)');gr.addColorStop(1,col);
   x.globalAlpha=fade;x.strokeStyle=gr;x.lineWidth=1.8;x.lineCap='round';x.beginPath();seg.forEach(([px,py],k)=>k?x.lineTo(px,py):x.moveTo(px,py));x.stroke();
   const [hx,hy]=seg[seg.length-1];x.fillStyle=col;x.shadowColor=col;x.shadowBlur=8;x.beginPath();x.arc(hx,hy,2.6,0,7);x.fill();x.shadowBlur=0;
   if(p>=1){const k=L(lt,.9,.8);const [ex,ey]=proj(B[0],B[1],rot);x.globalAlpha=fade*(1-k);x.strokeStyle=col;x.lineWidth=1.2;x.beginPath();x.arc(ex,ey,3+12*k,0,7);x.stroke()}
   x.globalAlpha=1;});
  lab.style.transform=`scale(${1+.06*lands.reduce((m,l)=>Math.max(m,Math.sin(cl((((t-l)%6+6)%6)/.3)*Math.PI)),0)})`;lab.style.transformOrigin='left center';
  od(t);}};

// 04 0 -> £12,480 : rolls up from zero, takes a live bump to £12,960, then spins back down to zero and round again
T2[3]=r=>{const c=document.createElement('canvas');c.width=224;c.height=200;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px;filter:blur(14px) saturate(1.15);transform:scale(1.15)';r.appendChild(c);
 const x=c.getContext('2d');
 r.insertAdjacentHTML('beforeend',`<div style="position:absolute;left:16px;top:20px;font:400 11px ${F};color:rgba(255,255,255,.9)">Gross volume · Today</div>
 <div class="z-nm" style="position:absolute;left:14px;top:40px;text-shadow:0 2px 12px rgba(80,20,120,.25)"></div>
 <div class="z-ch" style="position:absolute;left:16px;top:94px;height:22px;padding:0 9px;border-radius:6px;background:rgba(255,255,255,.95);font:500 10px/22px ${F};color:#0A8A3A;display:flex;gap:4px;align-items:center;box-shadow:0 8px 16px -8px rgba(0,0,0,.3);opacity:0;overflow:hidden">${tick('#0A8A3A',11,3)}<span style="position:relative;display:inline-block;width:92px;height:22px"><b class="z-c1" style="position:absolute;left:0;font-weight:500">+18% vs yesterday</b><b class="z-c2" style="position:absolute;left:0;font-weight:500">+22% vs yesterday</b></span></div>
 <svg style="position:absolute;left:0;bottom:0" width="224" height="70" viewBox="0 0 224 70"><path class="z-ln" d="M0 62 C30 60 40 48 62 46 S96 52 112 38 S146 30 160 22 S196 14 224 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity=".95"/><circle class="z-dt" r="4" fill="#fff" opacity="0"/></svg>`);
 const Z=[10,10,10,10,10],V1=[21,22,24,38,30],V2=[21,22,29,46,40];
 const roll=wheel(q(r,'.z-nm'),'£12,480',40,500,'#fff')(t=>Z.map((z,j)=>{let p=z+(V1[j]-z)*P(t,.3+j*.1,1.3);p+=(V2[j]-V1[j])*P(t,3.1+j*.07,.6);p+=(z-V2[j])*IO(t,5.1+(4-j)*.05,.7);return p}));
 const ch=q(r,'.z-ch'),c1=q(r,'.z-c1'),c2=q(r,'.z-c2'),ln=q(r,'.z-ln'),dt=q(r,'.z-dt');
 const blobs=[[STOPS[0],.2,.15],[STOPS[1],.15,.75],[STOPS[2],.65,.35],[STOPS[3],.85,.85],[STOPS[4],.55,.95],['#635BFF',.95,.2]];
 return t=>{x.fillStyle='#FF8A5B';x.fillRect(0,0,224,200);
  blobs.forEach(([col,bx,by],i)=>{const a=t*Math.PI/3+i*1.7;const px=(bx+.12*Math.cos(a))*224,py=(by+.12*Math.sin(a+i))*200;
   const g=x.createRadialGradient(px,py,0,px,py,120);g.addColorStop(0,col);g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,224,200)});
  roll(t);const k=S(t,1.85,.45)*(1-P(t,4.95,.3));ch.style.opacity=cl(k*2);ch.style.transform=`scale(${.6+.4*k})`;ch.style.transformOrigin='left center';
  const b=P(t,3.3,.4);c1.style.transform=`translateY(${-22*b}px)`;c2.style.transform=`translateY(${22-22*b}px)`;
  const lw=P(t,1.0,1.4)*(1-IO(t,5.0,.6));ln.style.strokeDashoffset=1-lw;
  const pt=ln.getPointAtLength(Math.max(.001,lw)*ln.getTotalLength());dt.setAttribute('cx',pt.x);dt.setAttribute('cy',pt.y);dt.setAttribute('opacity',lw>.02?.95:0);}};

// 05 Monthly -> yearly : pointer clicks Yearly, price rolls to £290 and the badge lands, then it clicks back to Monthly
T2[4]=r=>{r.style.background='linear-gradient(160deg,#F4F2FF,#FFF6F0)';
 r.innerHTML=`<div style="position:absolute;left:37px;top:16px;width:150px;height:30px;border-radius:15px;background:#E6E3F5">
 <div class="z-pl" style="position:absolute;left:2px;top:2px;width:73px;height:26px;border-radius:13px;background:#fff;box-shadow:0 2px 6px rgba(50,50,93,.2)"></div>
 <div style="position:absolute;left:0;width:75px;font:500 11px/30px ${F};color:${NAVY};text-align:center">Monthly</div><div style="position:absolute;left:75px;width:75px;font:500 11px/30px ${F};color:${NAVY};text-align:center">Yearly</div></div>
 <div class="z-cd" style="position:absolute;left:22px;top:58px;width:180px;height:128px;border-radius:12px;background:#fff;box-shadow:${SH}">
  <div style="position:absolute;left:16px;top:16px;width:24px;height:24px;border-radius:6px;background:${GRAD}"></div>
  <div style="position:absolute;left:48px;top:20px;font:500 13px ${F};color:${NAVY}">Pro</div>
  ${chip('bd','#EEEBFF',PUR,'2 months free','right:12px;top:16px;box-shadow:none')}
  <div style="position:absolute;left:14px;top:52px;width:160px;height:52px;overflow:hidden">
   <div class="z-a" style="position:absolute;left:0;top:0;font:500 46px/52px ${F};letter-spacing:-.04em;color:${NAVY}">£29</div>
   <div class="z-b" style="position:absolute;left:0;top:0;font:500 46px/52px ${F};letter-spacing:-.04em;color:${NAVY}">£290</div></div>
  <div class="z-pe" style="position:absolute;left:16px;top:104px;font:400 11px ${F};color:${SUB}">per month</div></div>${CUR}`;
 const pl=q(r,'.z-pl'),a=q(r,'.z-a'),b=q(r,'.z-b'),bd=q(r,'.z-bd'),pe=q(r,'.z-pe'),cd=q(r,'.z-cd'),cu=q(r,'.z-cu');
 const kk=t=>P(t,.95,.5)-P(t,3.75,.5);
 return t=>{curSet(cu,[[0,196,170,0],[.15,196,170,1],[.7,150,32,1],[1.5,168,92,1],[3.0,160,96,1],[3.55,78,32,1],[4.3,200,176,1],[4.55,200,176,0]],[.8,3.62],t);
  const s=S(t,.85,.5)-S(t,3.68,.5);pl.style.transform=`translateX(${s*73}px)`;
  const k=kk(t),v=Math.min(4,Math.abs(kk(t+.02)-k)*120);
  a.style.transform=`translateY(${-k*52}px)`;b.style.transform=`translateY(${(1-k)*52}px)`;a.style.filter=b.style.filter=`blur(${v}px)`;
  pe.textContent=k>.5?'per year':'per month';const g=S(t,1.45,.5)*(1-P(t,3.68,.25));bd.style.opacity=cl(g*2);bd.style.transform=`scale(${.5+.5*g})`;
  cd.style.transform=`translateY(${W(t)*2}px)`;}};

// 06 Tap -> approved : card swoops in to tap, waves ripple, screen goes green, then slides up to the next "Tap to pay"
T2[5]=r=>{r.style.background='radial-gradient(110% 90% at 50% 0%,#1E3B60,#0A2540 70%)';
 r.innerHTML=`<div class="z-rd" style="position:absolute;left:58px;top:40px;width:96px;height:170px;border-radius:18px;background:linear-gradient(160deg,#2B3446,#151B27);box-shadow:0 24px 36px -16px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.12)">
  <div style="position:absolute;left:8px;top:8px;width:80px;height:84px;border-radius:11px;background:#F6F9FC;overflow:hidden">
   <div style="position:absolute;left:0;right:0;top:12px;text-align:center"><div style="font:400 9px ${F};color:${SUB}">Total</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:2px">£24.00</div>
    <svg class="z-cl" style="margin-top:4px" width="20" height="16" viewBox="0 0 20 16"><path d="M5 3c2.5 2.5 2.5 7.5 0 10M9.5 1c4 4 4 10 0 14M14 0c5 5 5 11 0 16" fill="none" stroke="${PUR}" stroke-width="1.6" stroke-linecap="round"/></svg></div>
   <div class="z-s2" style="position:absolute;inset:0;background:${GRN};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;opacity:0"><span class="z-tk" style="display:flex">${tick('#fff',30,2.8)}</span><div style="font:500 12px ${F};color:#fff">Approved</div></div></div>
  ${[0,1,2].map(i=>`<div style="position:absolute;left:${16+i*22}px;top:104px;width:16px;height:9px;border-radius:3px;background:rgba(255,255,255,.12)"></div><div style="position:absolute;left:${16+i*22}px;top:119px;width:16px;height:9px;border-radius:3px;background:rgba(255,255,255,.12)"></div>`).join('')}</div>
 <svg style="position:absolute;left:0;top:0" width="224" height="200">${[0,1,2].map(i=>`<path class="z-w" d="M${150+i*9} ${36-i*7} a${16+i*9} ${16+i*9} 0 0 1 0 ${44+i*14}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0"/>`).join('')}</svg>
 <div class="z-cd" style="position:absolute;left:0;top:0;width:78px;height:50px;border-radius:7px;background:${GRAD};box-shadow:0 14px 24px -10px rgba(238,48,251,.6);overflow:hidden"><div style="position:absolute;left:8px;top:9px;width:14px;height:10px;border-radius:2px;background:rgba(255,255,255,.6)"></div><div style="position:absolute;left:8px;bottom:8px;font:500 8px ${F};letter-spacing:.1em;color:#fff">•••• 4242</div><i class="z-sh" style="position:absolute;top:-10px;bottom:-10px;width:24px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);transform:skewX(-20deg)"></i></div>`;
 const cd=q(r,'.z-cd'),s2=q(r,'.z-s2'),tk=q(r,'.z-tk'),ws=qa(r,'.z-w'),clx=q(r,'.z-cl'),rd=q(r,'.z-rd'),sh=q(r,'.z-sh');
 return t=>{const inn=S(t,.45,.6)*(1-IO(t,2.1,.6));const x=230-(230-108)*inn,y=-60+90*inn;
  cd.style.transform=`translate(${x}px,${y}px) rotate(${-18+18*inn}deg)`;sh.style.left=(-30+130*L(t,.45,.6))+'px';
  ws.forEach((w,i)=>{const k=L(t,.95+i*.12,.7);w.setAttribute('opacity',(k>0&&k<1?Math.sin(k*Math.PI):0)*.9)});
  const g=P(t,1.4,.3);s2.style.opacity=g;s2.style.transform=`translateY(${-84*IO(t,3.9,.45)}px)`;const k=S(t,1.5,.45);tk.style.transform=`scale(${k})`;
  clx.style.opacity=.45+.55*Math.abs(Math.sin(t*Math.PI*1.5));
  rd.style.transform=`translateY(${W(t)*2+3*Math.sin(cl((t-1.0)/.3)*Math.PI)}px)`;}};

// 07 Failed -> retried : declined card shakes, ring retries with a glowing tip, lands Succeeded, then unwinds to Declined
T2[6]=r=>{r.style.background='radial-gradient(90% 80% at 50% 40%,#FFFFFF,#F2F0FA)';
 r.innerHTML=`<svg style="position:absolute;left:0;top:0" width="224" height="200"><defs><linearGradient id="rg7b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PUR}"/><stop offset="1" stop-color="${GRN}"/></linearGradient></defs>
 <circle cx="112" cy="84" r="58" fill="none" stroke="#E9ECF3" stroke-width="12"/>
 <circle class="z-rd" cx="112" cy="84" r="58" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".62" transform="rotate(-90 112 84)"/>
 <circle class="z-ok" cx="112" cy="84" r="58" fill="none" stroke="url(#rg7b)" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 112 84)"/>
 <circle class="z-tp" cx="112" cy="26" r="7" fill="#fff" opacity="0" style="filter:drop-shadow(0 0 6px ${PUR})"/></svg>
 <div class="z-ic" style="position:absolute;left:88px;top:60px;width:48px;height:48px;border-radius:50%;background:${RED};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px -8px rgba(223,27,65,.6)"><span class="z-x" style="display:flex;position:absolute">${cross('#fff',24)}</span><span class="z-v" style="display:flex;position:absolute;opacity:0">${tick('#fff',26,2.8)}</span></div>
 ${chip('c1','#FFE7EA',RED,'Declined','left:0;right:0;margin:auto;width:max-content;top:160px;box-shadow:none')}${chip('c3','#EEEBFF',PUR,'Retrying…','left:0;right:0;margin:auto;width:max-content;top:160px;box-shadow:none')}${chip('c2','#D7F7E1','#0A8A3A',tick('#0A8A3A',11,3)+'Succeeded','left:0;right:0;margin:auto;width:max-content;top:160px;box-shadow:none')}`;
 const rd=q(r,'.z-rd'),ok=q(r,'.z-ok'),tp=q(r,'.z-tp'),ic=q(r,'.z-ic'),x=q(r,'.z-x'),v=q(r,'.z-v'),c1=q(r,'.z-c1'),c2=q(r,'.z-c2'),c3=q(r,'.z-c3');
 return t=>{const A=t<3;
  rd.style.opacity=A?1-P(t,.75,.25):P(t,5.0,.3);rd.style.strokeDashoffset=1-.38*(A?1:P(t,5.0,.5));
  const k=A?P(t,.9,1.1):1-IO(t,4.35,.6);ok.style.strokeDashoffset=1-k;
  const an=(-90+360*k)*Math.PI/180;tp.setAttribute('cx',112+58*Math.cos(an));tp.setAttribute('cy',84+58*Math.sin(an));tp.setAttribute('opacity',A&&k>.01&&k<.99?1:0);
  const g=A?P(t,1.95,.3):1-P(t,4.65,.3);ic.style.background=`color-mix(in srgb,${GRN} ${g*100}%,${RED})`;ic.style.boxShadow=`0 10px ${20+8*g*(.5+.5*W(t*2))}px -8px ${g>.5?'rgba(0,179,65,.7)':'rgba(223,27,65,.6)'}`;
  x.style.opacity=1-g;const s=A?S(t,1.95,.5):1-P(t,4.6,.25);v.style.opacity=cl(s*3);v.style.transform=`scale(${s})`;
  const sk=(a)=>Math.sin((t-a)*44)*4*(1-L(t,a,.45))*(t>a&&t<a+.45?1:0);
  ic.style.transform=`translateX(${sk(.15)+sk(5.2)}px) scale(${1+.12*Math.sin(cl((t-1.95)/.4)*Math.PI)})`;
  c1.style.opacity=A?1-P(t,.8,.2):P(t,5.0,.3);c3.style.opacity=P(t,.85,.2)*(1-P(t,1.9,.2));c2.style.opacity=A?P(t,1.95,.3):1-P(t,4.5,.3);
  c2.style.transform=`translateY(${(1-(A?P(t,1.95,.3):1))*6}px)`;}};

// 08 Link -> paid : customer asks, a payment link springs in, a finger taps Pay, it turns Paid, customer replies, chat scrolls away
T2[7]=r=>{r.style.background='linear-gradient(170deg,#F7F8FC,#EEF1F8)';
 r.innerHTML=`<div class="z-ch" style="position:absolute;inset:0">
 <div class="z-b1" style="position:absolute;left:14px;top:16px;padding:8px 12px;border-radius:16px 16px 16px 4px;background:#fff;box-shadow:0 4px 10px -4px rgba(50,50,93,.2);font:400 12px ${F};color:${NAVY};opacity:0">Can I pay online?</div>
 <div class="z-lk" style="position:absolute;left:60px;top:54px;width:150px;border-radius:14px 14px 4px 14px;background:#fff;box-shadow:${SH};overflow:hidden;opacity:0">
  <div style="height:54px;background:${GRAD};position:relative"><div style="position:absolute;left:12px;bottom:9px;font:500 20px ${F};letter-spacing:-.03em;color:#fff">£120.00</div><div class="z-pb" style="position:absolute;right:10px;bottom:10px;height:24px;width:44px;border-radius:12px;background:rgba(255,255,255,.95);color:${PUR};font:500 11px/24px ${F};color:#fff;text-align:center;overflow:hidden"><span class="z-p1" style="position:absolute;left:0;right:0">Pay</span><span class="z-p2" style="position:absolute;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:2px;height:24px">${tick('#fff',11,3)}Paid</span></div></div>
  <div style="padding:8px 12px 10px;position:relative"><div style="font:500 11px ${F};color:${NAVY}">Brand workshop</div><div style="font:400 10px ${F};color:${PUR};margin-top:3px">pay.link/a8f2</div>
   </div></div>
 <div class="z-b2" style="position:absolute;left:14px;top:178px;padding:8px 12px;border-radius:16px 16px 16px 4px;background:#fff;box-shadow:0 4px 10px -4px rgba(50,50,93,.2);font:400 12px ${F};color:${NAVY};opacity:0">Done, thank you!</div>
 </div>${TOUCH}`;
 const ch=q(r,'.z-ch'),b1=q(r,'.z-b1'),b2=q(r,'.z-b2'),lk=q(r,'.z-lk'),pb=q(r,'.z-pb'),p1=q(r,'.z-p1'),p2=q(r,'.z-p2'),cu=q(r,'.z-cu');
 return t=>{const u=t>=5.3?t-6:t;
  const a=S(u,-.45,.5);b1.style.opacity=cl(a*2);b1.style.transform=`translateY(${(1-a)*12}px)`;
  const k=S(u,.35,.6);lk.style.opacity=cl(k*2);lk.style.transform=`translateY(${(1-k)*30}px) scale(${.85+.15*k})`;lk.style.transformOrigin='right bottom';
  curSet(cu,[[-1,178,94,0],[1.05,178,94,0],[1.15,178,86,1],[1.6,178,86,1],[1.75,178,86,0]],[1.3],u);
  const g=P(u,1.55,.35);pb.style.width=(44+14*g)+'px';pb.style.background=g>0?`color-mix(in srgb,${GRN} ${g*100}%,#fff)`:'#fff';pb.style.color=g>.5?'#fff':PUR;pb.style.transform=`scale(${1-.08*Math.sin(cl((u-1.22)/.25)*Math.PI)+.08*Math.sin(cl((u-1.55)/.35)*Math.PI)})`;
  p1.style.transform=`translateY(${-24*g}px)`;p2.style.transform=`translateY(${24-24*g}px)`;
  const sc=P(u,2.9,.5),b=S(u,3.1,.5);b2.style.opacity=cl(b*2);b2.style.transform=`translateY(${(1-b)*12}px)`;
  const ex=t>=4.8&&t<5.3?IO(t,4.8,.5):0;ch.style.transform=`translateY(${-44*sc-150*ex}px)`;ch.style.opacity=1-ex;}};

// 09 Plan -> upgraded : pointer hovers the fanned plans, clicks Scale, it lifts forward, then settles back as the pointer leaves
T2[8]=r=>{r.style.background='radial-gradient(100% 90% at 50% 20%,#F6F4FF,#ECEAF7)';
 const pl=[['Starter','£19'],['Growth','£49'],['Scale','£99']];
 r.innerHTML=`<div style="position:absolute;inset:0;perspective:600px">${pl.map(([n,p],i)=>`<div class="z-pc" style="position:absolute;left:${18+i*64}px;top:44px;width:60px;height:104px;border-radius:10px;background:#fff;box-shadow:${SH};box-sizing:border-box;border:2px solid transparent">
  <div style="position:absolute;left:9px;top:10px;width:14px;height:14px;border-radius:4px;background:${i==2?GRAD:'#E3E8EE'}"></div>
  <div style="position:absolute;left:9px;top:32px;font:500 10px ${F};color:${NAVY}">${n}</div>
  <div style="position:absolute;left:8px;top:48px;font:500 18px ${F};letter-spacing:-.03em;color:${NAVY}">${p}</div>
  <div style="position:absolute;left:9px;top:70px;font:400 8px ${F};color:${SUB}">per month</div></div>`).join('')}</div>
 ${chip('up',PUR,'#fff',tick('#fff',12,3)+'Upgraded to Scale','left:0;right:0;margin:auto;width:max-content;top:164px')}${CUR}`;
 const pcs=qa(r,'.z-pc'),up=q(r,'.z-up'),cu=q(r,'.z-cu');
 return t=>{curSet(cu,[[0,210,196,0],[.15,210,196,1],[.65,172,98,1],[1.6,196,150,1],[3.6,192,146,1],[4.2,226,204,1],[4.4,226,204,0]],[.9],t);
  const hv=P(t,.45,.3)*(1-P(t,.9,.1)),k=S(t,.95,.6)*(1-IO(t,4.1,.7));
  pcs.forEach((c,i)=>{const ry=(i-1)*-18*(1-.4*k);let tz=0,sc=1,ty=0;
   if(i==2){tz=40*k+10*hv;sc=1+.18*k+.04*hv;ty=-8*k-3*hv+W(t)*1.5;c.style.borderColor=`rgba(99,91,255,${k})`;c.style.boxShadow=`0 ${18+10*k}px 30px -14px rgba(99,91,255,${.35+.3*k})`;c.style.zIndex=3}
   else{sc=1-.06*k;c.style.opacity=1-.35*k;ty=W(t,i)*1.5}
   c.style.transform=`translateY(${ty}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;});
  const g=S(t,1.35,.5)*(1-P(t,3.95,.3));up.style.opacity=cl(g*2);up.style.transform=`translateY(${(1-g)*8}px) scale(${.7+.3*g})`;}};

// 10 Cart -> order : items drop into the bag, receipt rises, the whole bag lifts away, a fresh empty bag drops in
T2[9]=r=>{r.style.background='linear-gradient(165deg,#FFF6EF,#F6F0FF)';
 const cols=[['#7A73FF','#4B3FE0'],['#FF9A4D','#F2540F'],['#F77CFF','#C21BD6']];
 r.innerHTML=`<div class="z-gr" style="position:absolute;inset:0"><svg style="position:absolute;left:82px;top:78px" width="60" height="32" viewBox="0 0 60 32"><path d="M8 32V20a22 22 0 0 1 44 0v12" fill="none" stroke="#4B3FE0" stroke-width="6" stroke-linecap="round"/></svg><div class="z-rc" style="position:absolute;left:62px;top:60px;width:100px;height:92px;border-radius:8px;background:#fff;box-shadow:${SH};padding:10px 12px;box-sizing:border-box;opacity:0">
   <div style="font:400 9px ${F};color:${SUB}">Order confirmed</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:3px">#2190</div>
   <div style="display:flex;gap:4px;align-items:center;font:500 10px ${F};color:#0A8A3A;margin-top:3px">${tick('#0A8A3A',11,3)}Paid £86</div></div>
 ${cols.map(([a,b],i)=>`<div class="z-it" style="position:absolute;left:${68+i*30}px;top:0;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,${a} 28%,${b} 100%);box-shadow:0 8px 14px -6px ${b}"></div>`).join('')}
 <div class="z-bg" style="position:absolute;left:47px;top:100px;width:130px;height:96px">
  <div style="position:absolute;inset:0;border-radius:12px 12px 16px 16px;background:linear-gradient(150deg,#8F88FF,#635BFF 45%,#7232F1);box-shadow:0 22px 34px -16px rgba(99,91,255,.75),inset 0 2px 0 rgba(255,255,255,.35);overflow:hidden">
   <div style="position:absolute;left:0;right:0;top:0;height:40%;background:linear-gradient(rgba(255,255,255,.28),rgba(255,255,255,0))"></div>
   <i class="z-sh" style="position:absolute;top:-10px;bottom:-10px;width:30px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg)"></i>
   <div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font:500 13px ${F};color:#fff">Basket</div></div>
  <div class="z-bd" style="position:absolute;right:-10px;top:-10px;width:28px;height:28px;border-radius:50%;background:#fff;font:500 14px/28px ${F};color:${PUR};text-align:center;box-shadow:0 6px 12px -4px rgba(50,50,93,.4);opacity:0">0</div></div></div>`;
 const it=qa(r,'.z-it'),bd=q(r,'.z-bd'),bg=q(r,'.z-bg'),rc=q(r,'.z-rc'),gr=q(r,'.z-gr'),sh=q(r,'.z-sh');
 return t=>{const u=t>=4.7?t-6:t;let n=0,squash=0;it.forEach((e,i)=>{const a=.25+i*.28;const k=S(u,a,.5);
   e.style.transform=`translate(${(1-k)*(i-1)*16}px,${-36+130*k}px) scale(${u<a?0:1-.5*P(u,a+.3,.2)})`;e.style.opacity=u<a?0:1-P(u,a+.35,.15);
   if(u>a+.35){n++;squash=Math.max(squash,1-cl((u-a-.35)/.3))}});
  const land=t>=4.7?Math.sin(cl((t-5.15)/.3)*Math.PI)*.8:0;squash=Math.max(squash,land);
  bg.style.transform=`scale(${1+.07*squash},${1-.07*squash})`;bg.style.transformOrigin='50% 100%';sh.style.left=(-40+200*L(u,1.6,.7))+'px';
  bd.textContent=n;bd.style.opacity=n?1:0;bd.style.transform=`scale(${n?.7+.3*S(u,.25+(n-1)*.28+.35,.35):0})`;
  const v=S(u,1.5,.6);rc.style.opacity=cl(v*3);rc.style.transform=`translateY(${(1-v)*50-42*v}px) rotate(${(1-v)*-6}deg)`;
  const y=t<4.7?-240*IO(t,3.85,.6):-240*(1-S(t,4.75,.5));gr.style.transform=`translateY(${y+W(t)*1.5}px)`;}};

// 11 Refund -> done : receipt prints, REFUNDED stamp slams down, the receipt tears off and drops, the next one prints
T2[10]=r=>{r.style.background='linear-gradient(170deg,#F3F5FA,#E9ECF4)';
 r.innerHTML=`<div style="position:absolute;left:30px;top:14px;width:164px;height:18px;border-radius:9px;background:linear-gradient(#2B3446,#151B27);box-shadow:0 6px 12px -4px rgba(0,0,0,.35);z-index:2"><i class="z-led" style="position:absolute;right:12px;top:6px;width:6px;height:6px;border-radius:50%;background:#3DDC84"></i></div>
 <div style="position:absolute;left:44px;top:22px;width:136px;height:178px;overflow:hidden">
  <div class="z-dr" style="position:absolute;inset:0">
  <div class="z-rc" style="position:absolute;left:0;top:0;width:136px;height:160px;background:#fff;box-shadow:0 10px 18px -10px rgba(50,50,93,.35);clip-path:polygon(0 0,100% 0,100% 94%,92% 100%,84% 94%,76% 100%,68% 94%,60% 100%,52% 94%,44% 100%,36% 94%,28% 100%,20% 94%,12% 100%,4% 94%,0 100%)">
   <div style="padding:16px 14px 0"><div style="font:400 9px ${F};color:${SUB}">Charge · ch_3Q8a</div><div style="font:500 26px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:4px">£120.00</div>
   ${[64,92,48].map(w=>`<div style="height:5px;width:${w}px;border-radius:3px;background:#EDF0F5;margin-top:9px"></div>`).join('')}</div></div>
  <div class="z-st" style="position:absolute;left:12px;top:88px;padding:6px 12px;border:3px solid ${PUR};border-radius:8px;font:500 17px ${F};letter-spacing:.06em;color:${PUR};background:rgba(255,255,255,.7);opacity:0">REFUNDED</div></div></div>`;
 const rc=q(r,'.z-rc'),st=q(r,'.z-st'),dr=q(r,'.z-dr'),led=q(r,'.z-led');
 return t=>{const u=t>=4.75?t-6:t;const k=P(u,-1.05,1.15);rc.style.transform=`translateY(${-160+160*k}px)`;
  const s=L(u,.45,.22);const sq=S(u,.67,.4);
  const sc=s<1?2.4-1.4*E(s):1+.12*(1-sq)*Math.sin(sq*Math.PI*2);st.style.opacity=cl(s*2.5);st.style.transform=`rotate(-12deg) scale(${sc})`;
  const bump=s>=1?Math.sin(cl((u-.67)/.25)*Math.PI*3)*2*(1-cl((u-.67)/.25)):0;
  const fall=t<4.75?IO(t,3.95,.7):0;dr.style.transform=`translate(${bump}px,${200*fall}px) rotate(${10*fall}deg)`;
  led.style.opacity=(u<.1&&u>-1.05)?.4+.6*Math.abs(Math.sin(t*12)):.35;}};

// 12 Fraud -> blocked : payments stream past the shield, bad ones hit it and bounce off red, the shield flashes on every block
T2[11]=r=>{r.style.background='radial-gradient(90% 80% at 50% 50%,#13325A,#0A2540 75%)';
 const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');x.scale(2,2);
 r.insertAdjacentHTML('beforeend',`<div class="z-sh" style="position:absolute;left:78px;top:60px;width:68px;height:78px"><svg viewBox="0 0 24 28" width="68" height="78" style="filter:drop-shadow(0 0 16px rgba(99,91,255,.8))"><defs><linearGradient id="sg12b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8F88FF"/><stop offset="1" stop-color="#5146F5"/></linearGradient></defs><path d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z" fill="url(#sg12b)"/><path class="z-fl" d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z" fill="${RED}" opacity="0"/><path d="M7.5 13.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
 <div style="position:absolute;left:14px;top:14px;padding:6px 10px;border-radius:7px;background:rgba(255,255,255,.1);font:400 10px ${F};color:#C9D3E6;display:flex;align-items:center;gap:6px"><i class="z-dot" style="width:6px;height:6px;border-radius:50%;background:#FF5C7A"></i>Fraud blocked live</div>`);
 const sh=q(r,'.z-sh'),fl=q(r,'.z-fl'),dot=q(r,'.z-dot');
 const lanes=[56,128,80,150,104,66,140,92];
 const parts=[...Array(12)].map((_,i)=>({s:i*.5,y:lanes[i%8],bad:i%3==1}));
 const CXs=112,CYs=99;
 return t=>{x.clearRect(0,0,224,200);let pulse=0;
  parts.forEach(p=>{const lt=((t-p.s)%6+6)%6;if(lt>1.7)return;const k=lt/1.7;let px,py,al=1;const hk=.5;
   if(p.bad&&k>hk){const b=(k-hk)/(1-hk);px=CXs-36-70*b;py=p.y+(CYs-p.y)*.7+(p.y<CYs?-1:1)*60*b;al=1-b;if(b<.25)pulse=Math.max(pulse,1-b/.25)}
   else if(p.bad){const a=k/hk;px=-14+(CXs-36+14)*a;py=p.y+(CYs-p.y)*.7*a}
   else{px=-14+252*k;py=p.y;al=px>CXs-40&&px<CXs+40?.15:1}
   const col=p.bad?'#FF5C7A':'#3DDC84';x.globalAlpha=al;
   const tr=x.createLinearGradient(px-26,py,px,py);tr.addColorStop(0,col+'00');tr.addColorStop(1,col);x.strokeStyle=tr;x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(px-26,py);x.lineTo(px,py);x.stroke();
   x.fillStyle=col;x.shadowColor=col;x.shadowBlur=10;x.beginPath();x.arc(px,py,6.5,0,7);x.fill();x.shadowBlur=0;
   x.strokeStyle='#fff';x.lineWidth=1.6;x.beginPath();if(p.bad){x.moveTo(px-2.4,py-2.4);x.lineTo(px+2.4,py+2.4);x.moveTo(px+2.4,py-2.4);x.lineTo(px-2.4,py+2.4)}else{x.moveTo(px-2.6,py+.2);x.lineTo(px-.6,py+2.2);x.lineTo(px+2.8,py-1.8)}x.stroke();
   if(p.bad&&k>hk){const b=(k-hk)/(1-hk);x.globalAlpha=(1-b)*.8;x.strokeStyle='#FF5C7A';x.lineWidth=2;x.beginPath();x.arc(CXs,CYs,38+40*b,0,7);x.stroke()}});
  x.globalAlpha=1;sh.style.transform=`scale(${1+.1*pulse}) translateY(${W(t)*2}px)`;fl.setAttribute('opacity',.55*pulse);dot.style.opacity=.4+.6*Math.abs(Math.sin(t*Math.PI));}};

// 13 Invoice -> sent : invoice slides in, flap seals, purple seal springs on, the envelope flies off, a new one slides in
T2[12]=r=>{r.style.background='linear-gradient(165deg,#F2F7FF,#F6F1FF)';
 r.innerHTML=`<div class="z-ev" style="position:absolute;left:37px;top:84px;width:150px;height:98px">
  <div style="position:absolute;inset:0;border-radius:10px;background:#C9C3FF"></div>
  <div class="z-iv" style="position:absolute;left:14px;top:-84px;width:122px;height:124px;border-radius:6px;background:#fff;box-shadow:${SH};padding:12px;box-sizing:border-box">
   <div style="font:500 11px ${F};color:${NAVY}">Invoice #1042</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:6px">£1,320</div>
   ${[78,60,70].map(w=>`<div style="height:5px;width:${w}px;border-radius:3px;background:#EDF0F5;margin-top:8px"></div>`).join('')}</div>
  <div style="position:absolute;inset:0;border-radius:10px;background:linear-gradient(160deg,#9F97FF,#635BFF 60%,#5146F5);clip-path:polygon(0 28%,50% 66%,100% 28%,100% 100%,0 100%);box-shadow:0 22px 34px -16px rgba(99,91,255,.75)"></div>
  <div class="z-fl" style="position:absolute;left:0;top:0;width:150px;height:64px;transform-origin:50% 0;background:linear-gradient(#B3ACFF,#7A70FF);clip-path:polygon(0 0,100% 0,50% 100%);opacity:0"></div>
  <div class="z-sl" style="position:absolute;left:57px;top:40px;width:36px;height:36px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px -6px rgba(238,48,251,.7),inset 0 2px 0 rgba(255,255,255,.35);opacity:0">${tick('#fff',20,3)}</div></div>
 <div class="z-tr" style="position:absolute;left:0;top:118px;width:224px;height:30px;opacity:0">${[0,1,2].map(i=>`<i style="position:absolute;left:${30+i*14}px;top:${4+i*9}px;width:${60-i*12}px;height:3px;border-radius:2px;background:rgba(99,91,255,.35)"></i>`).join('')}</div>
 ${chip('ch','#fff',NAVY,'Invoice sent · £1,320','left:0;right:0;margin:auto;width:max-content;top:20px')}`;
 const ev=q(r,'.z-ev'),iv=q(r,'.z-iv'),fl=q(r,'.z-fl'),sl=q(r,'.z-sl'),ch=q(r,'.z-ch'),tr=q(r,'.z-tr');
 return t=>{const u=t>=4.6?t-6:t;const k=P(u,.45,.5);const drop=u<0?-60*(1-P(u,-.55,.45)):0;iv.style.transform=`translateY(${k*84+drop}px)`;iv.style.opacity=k>.98?0:cl((u+.55)/.2+ (u>=0?1:0));
  const f=P(u,.95,.3);fl.style.opacity=f>0?1:0;fl.style.transform=`rotateX(${180-180*f}deg)`;
  const hop=Math.sin(cl((u-1.25)/.35)*Math.PI);
  const g=S(u,1.4,.5);sl.style.opacity=cl(g*3);sl.style.transform=`scale(${g}) rotate(${(1-g)*-30}deg)`;
  const fly=t<4.6?IO(t,3.4,.75):0,enter=t>=4.6?1-P(t,4.65,.55):0;
  ev.style.transform=`translate(${260*fly-260*enter}px,${-10*hop-40*fly+W(t)*1.5}px) rotate(${14*fly}deg)`;
  tr.style.opacity=Math.sin(cl((t-3.5)/.6)*Math.PI)*.9;tr.style.transform=`translateX(${120*L(t,3.5,.6)}px)`;
  const c=S(t,3.65,.5)*(1-P(t,4.95,.3));ch.style.opacity=cl(c*2);ch.style.transform=`translateY(${(1-c)*-10}px)`;}};

// 14 MRR -> up : bars spring up, line draws, +38% pops, a pointer scrubs month by month, then the bars drop and regrow
T2[13]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F1F3FA)';
 const hs=[34,48,42,62,74,70,96],mo=['Mar £31k','Apr £44k','May £38k','Jun £57k','Jul £68k','Aug £64k','Sep £88k'];
 r.innerHTML=`<div style="position:absolute;left:14px;top:14px;font:400 10px ${F};color:${SUB}">Monthly recurring revenue</div>
 ${chip('pc',GRN,'#fff','+38%','left:14px;top:32px;font-size:15px;padding:6px 10px')}
 ${hs.map((h,i)=>`<div class="z-br" style="position:absolute;left:${22+i*27}px;bottom:16px;width:18px;height:${h}px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,${['#7232F1','#9A4CF5','#C04BF2','#EE30FB','#FB76FA','#FF8A4C','#FF6118'][i]},rgba(99,91,255,.55));transform-origin:50% 100%;box-shadow:inset 0 1px 0 rgba(255,255,255,.5)"></div>`).join('')}
 <svg style="position:absolute;left:0;top:0" width="224" height="200"><path class="z-ln" d="${hs.map((h,i)=>`${i?'L':'M'}${31+i*27} ${184-h-8}`).join(' ')}" fill="none" stroke="${NAVY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><circle class="z-dt" cx="193" cy="${184-96-8}" r="4.5" fill="${NAVY}" opacity="0"/><line class="z-sx" x1="0" x2="0" y1="70" y2="184" stroke="${NAVY}" stroke-width="1" stroke-dasharray="3 3" opacity="0"/></svg>
 <div class="z-tt" style="position:absolute;left:0;top:44px;padding:4px 8px;border-radius:6px;background:${NAVY};font:500 10px ${F};color:#fff;white-space:nowrap;opacity:0;transform-origin:50% 100%"></div>`;
 const br=qa(r,'.z-br'),ln=q(r,'.z-ln'),dt=q(r,'.z-dt'),pc=q(r,'.z-pc'),sx=q(r,'.z-sx'),tt=q(r,'.z-tt');
 return t=>{const u=t>=5.6?t-6:t;
  br.forEach((b,i)=>{const k=t>=5.0&&t<5.6?1-IO(t,5.0+i*.05,.3):S(u,-.3+i*.08,.5);b.style.transform=`scaleY(${Math.max(0,k)})`});
  const lw=t>=5.0&&t<5.6?1-IO(t,4.95,.4):P(u,.5,.8);ln.style.strokeDashoffset=1-lw;dt.setAttribute('opacity',t>=4.9&&t<5.6?0:P(u,1.25,.15));
  const g=S(u,1.3,.5)*(1-P(t,4.9,.25));pc.style.opacity=cl(g*2);pc.style.transform=`scale(${.5+.5*g})`;pc.style.transformOrigin='left center';
  const on=P(t,2.2,.3)*(1-P(t,4.6,.3)),p=6*IO(t,2.4,2.0),i=Math.min(6,Math.round(p)),xx=31+p*27;
  sx.setAttribute('x1',xx);sx.setAttribute('x2',xx);sx.setAttribute('opacity',on*.5);
  tt.textContent=mo[i];tt.style.opacity=on;tt.style.left=Math.min(224-70,Math.max(4,xx-33))+'px';tt.style.top=(184-hs[i]-36)+'px';
  br.forEach((b,j)=>{b.style.filter=on>0&&j==i?'brightness(1.12) saturate(1.2)':'none';b.style.opacity=on>0&&j!=i?1-.35*on:1});}};

// 15 Currency -> converted : split-flap board flips $500 -> £395 -> €460 -> $500, one flip every two seconds
T2[14]=r=>{r.style.background='linear-gradient(170deg,#F5F7FB,#E9EDF5)';
 const ST=['$500','£395','€460'],CU=['USD','GBP','EUR'],RT=['1 USD = 0.79 GBP','1 GBP = 1.16 EUR','1 EUR = 1.09 USD'],FT=[.8,2.8,4.8];
 r.innerHTML=`<div class="z-hd" style="position:absolute;left:0;right:0;top:22px;display:flex;justify-content:center;gap:8px;align-items:center;font:500 11px ${F};color:${NAVY}"><span class="z-from" style="padding:5px 9px;border-radius:6px;background:#fff;box-shadow:0 2px 6px rgba(50,50,93,.15);width:26px;text-align:center">USD</span><svg width="26" height="10" viewBox="0 0 26 10"><path class="z-ar" d="M1 5h22m-5-4l5 4-5 4" fill="none" stroke="${PUR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><span class="z-to" style="padding:5px 9px;border-radius:6px;background:#EEEBFF;color:${PUR};box-shadow:0 2px 6px rgba(50,50,93,.15);width:26px;text-align:center">GBP</span></div>
 <div style="position:absolute;left:24px;top:64px;display:flex;gap:6px;perspective:300px">${[0,1,2,3].map(i=>`<div class="z-cl" style="position:relative;width:39px;height:64px;transform-style:preserve-3d">
  <div class="z-fa" style="position:absolute;inset:0;border-radius:7px;background:linear-gradient(#1F2A3D,#121A28);color:#fff;font:500 42px/64px ${F};text-align:center;backface-visibility:hidden;box-shadow:0 10px 18px -8px rgba(0,0,0,.45)"></div>
  <div class="z-fb" style="position:absolute;inset:0;border-radius:7px;background:linear-gradient(#2B2470,#1A1550);color:#fff;font:500 42px/64px ${F};text-align:center;backface-visibility:hidden;transform:rotateX(180deg);box-shadow:0 10px 18px -8px rgba(0,0,0,.45)"></div>
  <div style="position:absolute;left:0;right:0;top:31.5px;height:1px;background:rgba(0,0,0,.5);transform:translateZ(1px)"></div></div>`).join('')}</div>
 <div class="z-rt" style="position:absolute;left:0;right:0;top:146px;text-align:center;font:400 10px ${F};color:${SUB}"></div>`;
 const cls=qa(r,'.z-cl'),fa=qa(r,'.z-fa'),fb=qa(r,'.z-fb'),ar=q(r,'.z-ar'),fr=q(r,'.z-from'),to=q(r,'.z-to'),rt=q(r,'.z-rt'),hd=q(r,'.z-hd');
 return t=>{cls.forEach((c,i)=>{const rot=180*FT.reduce((s,a)=>s+S(t,a+i*.12,.6),0);c.style.transform=`rotateX(${-rot}deg)`;
   fa[i].textContent=ST[rot<180?0:2][i];fb[i].textContent=ST[rot<360?1:0][i];});
  // header names the flip that is coming next; it swaps while the arrow redraws
  const idx=t<2.6?0:t<4.6?1:2;fr.textContent=CU[idx];to.textContent=CU[(idx+1)%3];
  const sw=[0,2.6,4.6,6].reduce((m,a)=>Math.min(m,Math.abs(t-a)),9);hd.style.opacity=.25+.75*cl(sw/.18);
  const la=[0,2.6,4.6].reduce((m,a)=>t>=a?a:m,0);ar.style.strokeDashoffset=1-P(t,la,.4);
  const ri=t<1.2?2:t<3.2?0:t<5.2?1:2;rt.textContent=RT[ri];const rs=[1.2,3.2,5.2].reduce((m,a)=>Math.min(m,Math.abs(t-a)),9);rt.style.opacity=cl(rs/.2);}};

// 16 Alerts -> stack : payments drop onto the lock screen and stack, the stack fans out into a list, then swipes away
T2[15]=r=>{r.style.background='#E9EDF5';
 const am=['£49.00','£120.00','£24.00','£86.00'];
 r.innerHTML=`<div class="z-ph" style="position:absolute;left:30px;top:10px;width:164px;height:250px;border-radius:30px;background:#0B0B0F;box-shadow:0 24px 40px -18px rgba(50,50,93,.5)">
 <div style="position:absolute;inset:5px;border-radius:25px;background:linear-gradient(160deg,#7232F1,#EE30FB 45%,#FF6118 80%,#FFD601);overflow:hidden">
  <div style="position:absolute;left:57px;top:7px;width:40px;height:11px;border-radius:6px;background:#0B0B0F"></div>
  <div class="z-tm" style="position:absolute;left:0;right:0;top:24px;text-align:center;font:500 38px ${F};letter-spacing:-.03em;color:rgba(255,255,255,.95)">10:24</div>
  ${am.map((a,i)=>`<div class="z-nt" style="position:absolute;left:8px;top:82px;width:138px;height:40px;border-radius:12px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);box-shadow:0 6px 12px -6px rgba(0,0,0,.3);opacity:0">
   <div style="position:absolute;left:8px;top:8px;width:24px;height:24px;border-radius:6px;background:${PUR};display:flex;align-items:center;justify-content:center">${tick('#fff',14,3)}</div>
   <div style="position:absolute;left:40px;top:8px;font:500 10px ${F};color:${NAVY}">Payment received</div><div style="position:absolute;left:40px;top:22px;font:400 10px ${F};color:${SUB}">${a} · now</div></div>`).join('')}
  <div style="position:absolute;left:0;right:0;top:150px;text-align:center"><span class="z-bn" style="display:inline-block;padding:5px 11px;border-radius:12px;background:rgba(255,255,255,.25);font:500 11px ${F};color:#fff;opacity:0">4 new payments</span></div>
 </div></div>`;
 const nt=qa(r,'.z-nt'),bn=q(r,'.z-bn'),tm=q(r,'.z-tm');
 return t=>{const u=t>=5.1?t-6:t;let n=0;const ex=t<4.55?P(t,3.3,.55):t<5.1?1:0,out=t>=4.55&&t<5.1?IO(t,4.55,.5):0;
  nt.forEach((e,i)=>{const a=.2+i*.42;const k=S(u,a,.5);
   const pushed=[0,1,2,3].filter(j=>j>i&&u>.2+j*.42).length;const sTy=-60+60*k+pushed*6,sSc=1-pushed*.05,sOp=u<a?0:(pushed>2?0:1-pushed*.18);
   const row=3-i,lTy=-16+row*44;
   e.style.opacity=(sOp+(1-sOp)*ex*(u>=a?1:0))*(1-out);e.style.transform=`translateY(${sTy+(lTy-sTy)*ex-150*out}px) scale(${sSc+(1-sSc)*ex})`;e.style.zIndex=10+i;if(u>a+.2)n++});
  bn.textContent=`${n} new payment${n==1?'':'s'}`;bn.style.opacity=(n?1:0)*(1-ex)*(1-out);bn.style.transform=`scale(${1+.1*Math.sin(cl((u-.4-(n-1)*.42)/.3)*Math.PI)})`;
  tm.style.transform=`translateY(${-6*ex}px) scale(${1-.12*ex})`;}};
})();
