// v2 tiles, built to Monday's bar: big glossy hero objects, Stripe's real gradient, physical motion.
// Each builder returns seek(lt) for local time lt in [0,6). Loaded before tiles.js, which mounts T2[i] over T[i].
(function(){
const NAVY='#0A2540',SUB='#425466',PUR='#635BFF',GRN='#00B341';
const STOPS=['#FFD601','#FF6118','#EE30FB','#FB76FA','#7232F1'];
const GRAD='linear-gradient(110deg,#FFD601,#FF6118 25%,#EE30FB 50%,#FB76FA 72%,#7232F1)';
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=dX(t);if(Math.abs(d)<1e-6)break;t-=(X(t)-x)/d}return Y(Math.min(1,Math.max(0,t)))}}
const E=bez(.25,1,.5,1),cl=x=>Math.max(0,Math.min(1,x));
const P=(t,a,d)=>E(cl((t-a)/d)),L=(t,a,d)=>cl((t-a)/d);
const S=(t,a,d)=>{const x=cl((t-a)/d);if(x>=1)return 1;const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)}; // spring with overshoot
const R=t=>1-P(t,5.3,.5);
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif";
const tick=(c,s,w=2)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M5 12.5l4.6 4.6L19 7.5" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// odometer: one column per digit, rolls with motion blur
function odo(el,str,size,weight,color){
 el.innerHTML='';el.style.display='flex';el.style.font=`${weight} ${size}px/1 ${F}`;el.style.color=color;el.style.letterSpacing='-.03em';el.style.fontFeatureSettings='"ss01" on,"tnum" on';
 const cols=[];[...str].forEach((ch,i)=>{if(!/\d/.test(ch)){const s=document.createElement('span');s.textContent=ch;el.appendChild(s);return}
  const w=document.createElement('span');w.style.cssText=`display:inline-block;height:${size}px;overflow:hidden;position:relative`;
  const c=document.createElement('span');c.style.cssText='display:flex;flex-direction:column';
  for(let k=0;k<30;k++){const d=document.createElement('span');d.textContent=k%10;d.style.height=size+'px';c.appendChild(d)}
  w.appendChild(c);el.appendChild(w);cols.push({c,to:+ch+20,i})});
 return (t,a,dur,stg=.09)=>{cols.forEach((o,j)=>{const a2=a+j*stg,p=P(t,a2,dur),p2=P(t+.03,a2,dur);
  const y=o.to*p;o.c.style.transform=`translateY(${-y*size}px)`;o.c.style.filter=`blur(${Math.min(3,Math.abs(p2-p)*o.to*size*.06)}px)`})}}

const T2=[];

// 01 Checkout -> paid : big phone with a checkout sheet; button squashes, morphs to a spinner, lands a green tick
T2[0]=r=>{r.style.background='linear-gradient(160deg,#EEF0FF,#F9F5FF 60%,#FFF4EE)';
 r.innerHTML=`<div style="position:absolute;left:36px;top:12px;width:152px;height:250px;border-radius:30px;background:#0B0B0F;box-shadow:0 24px 40px -18px rgba(50,50,93,.5),0 10px 20px -10px rgba(0,0,0,.25)">
 <div style="position:absolute;inset:5px;border-radius:25px;background:#fff;overflow:hidden">
  <div style="position:absolute;left:52px;top:7px;width:38px;height:11px;border-radius:6px;background:#0B0B0F"></div>
  <div style="position:absolute;left:14px;top:30px;width:38px;height:38px;border-radius:9px;background:${GRAD}"></div>
  <div style="position:absolute;left:60px;top:32px;font:400 10px ${F};color:${SUB}">Pro plan</div>
  <div style="position:absolute;left:60px;top:46px;font:500 19px/1 ${F};color:${NAVY};letter-spacing:-.03em">£49.00</div>
  <div class="z-fd" style="position:absolute;left:14px;top:82px;width:114px;height:28px;border-radius:6px;border:1px solid #E3E8EE;font:400 11px/26px ${F};color:${NAVY};padding-left:9px;box-sizing:border-box">•••• 4242</div>
  <div class="z-ok" style="position:absolute;left:0;right:0;top:86px;text-align:center;font:500 12px ${F};color:${NAVY};opacity:0">Payment successful</div>
  <div class="z-bt" style="position:absolute;left:14px;top:122px;width:114px;height:36px;border-radius:7px;background:${PUR};display:flex;align-items:center;justify-content:center;font:500 13px ${F};color:#fff;box-shadow:0 8px 16px -6px rgba(99,91,255,.7)">
   <span class="z-lb">Pay £49.00</span>
   <svg class="z-sp" viewBox="0 0 28 28" width="22" height="22" style="position:absolute;opacity:0"><circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/><circle class="z-arc" cx="14" cy="14" r="10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".75" transform="rotate(-90 14 14)"/></svg>
   <span class="z-tk" style="position:absolute;opacity:0;display:flex">${tick('#fff',22,2.8)}</span></div>
  <div class="z-rp" style="position:absolute;left:71px;top:140px;width:0;height:0;border-radius:50%;border:2px solid ${GRN};transform:translate(-50%,-50%);opacity:0"></div>
 </div></div>`;
 const bt=r.querySelector('.z-bt'),lb=r.querySelector('.z-lb'),sp=r.querySelector('.z-sp'),arc=r.querySelector('.z-arc'),tk=r.querySelector('.z-tk'),rp=r.querySelector('.z-rp'),ok=r.querySelector('.z-ok'),fd=r.querySelector('.z-fd');
 return t=>{const d=R(t);const press=P(t,.7,.12)*(1-P(t,.82,.2));const m=P(t,.9,.35)*d;
  const w=114-(114-36)*m;bt.style.width=w+'px';bt.style.left=(14+(114-w)/2)+'px';bt.style.borderRadius=(7+11*m)+'px';bt.style.transform=`scale(${1-.06*press})`;
  lb.style.opacity=1-cl(m*2.5);const spin=L(t,1.05,.95);sp.style.opacity=cl((m-.6)*4)*(1-P(t,1.95,.12));sp.style.transform=`rotate(${spin*720}deg)`;arc.style.strokeDashoffset=.75-.5*Math.sin(spin*Math.PI);
  const g=P(t,1.95,.25)*d;bt.style.background=g>0?`color-mix(in srgb,${GRN} ${g*100}%,${PUR})`:PUR;bt.style.boxShadow=`0 8px 16px -6px ${g>.5?'rgba(0,179,65,.7)':'rgba(99,91,255,.7)'}`;
  const k=S(t,2.0,.45)*d;tk.style.opacity=cl(k*3);tk.style.transform=`scale(${k})`;
  const rr=L(t,2.05,.7);rp.style.width=rp.style.height=(36+80*E(rr))+'px';rp.style.opacity=(rr>0&&rr<1?.7*(1-rr):0)*d;
  const o=P(t,2.2,.35)*d;ok.style.opacity=o;ok.style.transform=`translateY(${(1-o)*8}px)`;fd.style.opacity=1-o;}};

// 02 Card -> flip : Stripe-gradient card floats on navy, sheen sweeps, flips in 3D to a paid receipt
T2[1]=r=>{r.style.background=`radial-gradient(120% 90% at 50% 0%,#1A3A5F,${NAVY} 70%)`;
 r.innerHTML=`<div style="position:absolute;left:0;top:0;width:224px;height:200px;perspective:520px">
 <div class="z-cd" style="position:absolute;left:30px;top:44px;width:164px;height:104px;transform-style:preserve-3d">
  <div class="z-fr" style="position:absolute;inset:0;border-radius:10px;background:${GRAD};backface-visibility:hidden;overflow:hidden;box-shadow:0 22px 36px -14px rgba(238,48,251,.55)">
   <div style="position:absolute;left:14px;top:16px;width:24px;height:18px;border-radius:4px;background:linear-gradient(135deg,#FFE9A8,#E7B84C)"></div>
   <svg style="position:absolute;right:14px;top:16px" width="16" height="18" viewBox="0 0 16 18"><path d="M3 4c3 3 3 7 0 10M7 2c4 4 4 10 0 14M11 0c5 5 5 13 0 18" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5" stroke-linecap="round"/></svg>
   <div style="position:absolute;left:14px;bottom:16px;font:400 13px ${F};letter-spacing:.12em;color:#fff">•••• 4242</div>
   <div style="position:absolute;right:14px;bottom:15px;font:500 11px ${F};color:#fff;opacity:.9">12/29</div>
   <div class="z-sh" style="position:absolute;top:-20px;bottom:-20px;width:60px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg)"></div></div>
  <div style="position:absolute;inset:0;border-radius:10px;background:#fff;backface-visibility:hidden;transform:rotateY(180deg);box-shadow:0 22px 36px -14px rgba(0,0,0,.5)">
   <div class="z-bk" style="position:absolute;left:14px;top:16px;width:30px;height:30px;border-radius:50%;background:${GRN};display:flex;align-items:center;justify-content:center">${tick('#fff',18,2.6)}</div>
   <div style="position:absolute;left:54px;top:15px;font:400 9px ${F};color:${SUB}">Payment received</div>
   <div style="position:absolute;left:53px;top:27px;font:500 20px/1 ${F};letter-spacing:-.03em;color:${NAVY}">£4,850</div>
   <div style="position:absolute;left:14px;right:14px;top:62px;height:1px;background:#E3E8EE"></div>
   <div style="position:absolute;left:14px;top:72px;font:400 9px ${F};color:${SUB}">Visa •• 4242 · Just now</div></div>
 </div></div>`;
 const cd=r.querySelector('.z-cd'),sh=r.querySelector('.z-sh');
 return t=>{const d=R(t);const fl=S(t,1.1,.75)*d;const fy=Math.sin(t*Math.PI/3)*3;
  const tilt=Math.sin(t*Math.PI/3)*7*(1-cl(fl));
  cd.style.transform=`translateY(${fy}px) rotateX(${8-4*cl(fl)}deg) rotateY(${fl*180+tilt}deg)`;
  const sw=L(t,.15,.8);sh.style.left=(-70+260*sw)+'px';}};

// 03 Globe -> payments : dotted globe turns, glowing payment arcs launch between cities
T2[2]=r=>{r.style.background='radial-gradient(90% 80% at 50% 45%,#FFFFFF,#F1F4FA)';
 const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);
 const lab=document.createElement('div');lab.style.cssText=`position:absolute;left:12px;top:12px;padding:5px 8px;border-radius:6px;background:rgba(255,255,255,.85);box-shadow:0 6px 14px -8px rgba(50,50,93,.35);font:500 10px ${F};color:${NAVY};backdrop-filter:blur(6px)`;
 lab.innerHTML=`<span style="color:${SUB};font-weight:400">Payments </span><span class="z-n" style="display:inline-flex;vertical-align:bottom"></span>`;r.appendChild(lab);
 const od=odo(lab.querySelector('.z-n'),'12,480',10,500,NAVY);
 const x=c.getContext('2d');x.scale(2,2);
 const blobs=[[45,-100,22,30],[15,-60,14,12],[-15,-60,20,12],[50,15,14,22],[5,20,25,16],[45,90,25,45],[25,80,14,18],[-25,135,12,14]];
 const land=(la,lo)=>blobs.reduce((s,[a,b,ra,rb])=>{let dl=((lo-b+540)%360)-180;return s+Math.exp(-((la-a)**2/(ra*ra)+(dl*dl)/(rb*rb)))},0);
 const pts=[];const N=2600,ga=Math.PI*(3-Math.sqrt(5));
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,rr=Math.sqrt(1-y*y),th=ga*i;const la=Math.asin(y)*180/Math.PI,lo=((th*180/Math.PI)%360)-180;pts.push([la,lo,land(la,lo)>.45])}
 const CX=112,CY=112,RA=84;
 const proj=(la,lo,rot,alt=0)=>{const a=la*Math.PI/180,b=(lo+rot)*Math.PI/180,k=1+alt;let X=Math.cos(a)*Math.sin(b)*k,Y=Math.sin(a)*k,Z=Math.cos(a)*Math.cos(b)*k;
  const tl=-.32,Y2=Y*Math.cos(tl)-Z*Math.sin(tl),Z2=Y*Math.sin(tl)+Z*Math.cos(tl);return [CX+X*RA,CY-Y2*RA,Z2]};
 const arcs=[[[51,0],[40,-74],.55],[[40,-74],[-23,-46],1.0],[[51,0],[1,104],1.45],[[52,13],[19,73],1.9]];
 const slerp=(A,B,s)=>{const v=([la,lo])=>{const a=la*Math.PI/180,b=lo*Math.PI/180;return[Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)]};
  const p=v(A),q=v(B);let dot=p[0]*q[0]+p[1]*q[1]+p[2]*q[2];const om=Math.acos(Math.min(1,dot)),so=Math.sin(om)||1;
  const w1=Math.sin((1-s)*om)/so,w2=Math.sin(s*om)/so;const m=[p[0]*w1+q[0]*w2,p[1]*w1+q[1]*w2,p[2]*w1+q[2]*w2];
  return [Math.asin(m[1])*180/Math.PI,Math.atan2(m[0],m[2])*180/Math.PI]};
 return t=>{const d=R(t);const rot=-20+18*Math.sin(t*Math.PI/3);x.clearRect(0,0,224,200);
  const g=x.createRadialGradient(CX-20,CY-25,10,CX,CY,RA+6);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(220,228,245,.9)');
  x.fillStyle=g;x.beginPath();x.arc(CX,CY,RA,0,7);x.fill();
  for(const [la,lo,ld] of pts){const [px,py,z]=proj(la,lo,rot);if(z<0)continue;x.globalAlpha=ld?.35+.6*z:.10+.12*z;x.fillStyle=ld?'#3B4A6B':'#8FA0C0';x.beginPath();x.arc(px,py,ld?1+.4*z:.7,0,7);x.fill()}
  x.globalAlpha=1;
  arcs.forEach(([A,B,st],i)=>{const p=P(t,st,.9)*d,fade=1-P(t,st+2.3,.6);if(p<=0||fade<=0)return;
   const seg=[];const n=40;for(let k=0;k<=n*p;k++){const s=k/n;const [la,lo]=slerp(A,B,s);seg.push(proj(la,lo,rot,.32*Math.sin(Math.PI*s)))}
   const gr=x.createLinearGradient(seg[0][0],seg[0][1],seg[seg.length-1][0],seg[seg.length-1][1]);gr.addColorStop(0,'rgba(99,91,255,.15)');gr.addColorStop(1,STOPS[[2,1,4,2][i]]);
   x.globalAlpha=fade;x.strokeStyle=gr;x.lineWidth=1.8;x.lineCap='round';x.beginPath();seg.forEach(([px,py],k)=>k?x.lineTo(px,py):x.moveTo(px,py));x.stroke();
   const [hx,hy]=seg[seg.length-1];x.fillStyle=STOPS[[2,1,4,2][i]];x.shadowColor=x.fillStyle;x.shadowBlur=8;x.beginPath();x.arc(hx,hy,2.6,0,7);x.fill();x.shadowBlur=0;
   if(p>=1){const q=L(t,st+.9,.8);const [ex,ey]=proj(B[0],B[1],rot);x.globalAlpha=fade*(1-q);x.strokeStyle=x.fillStyle;x.lineWidth=1.2;x.beginPath();x.arc(ex,ey,3+12*q,0,7);x.stroke()}
   x.globalAlpha=1;});
  od(t*d,.6,1.4,.1);}};

// 04 0 -> £12,480 : Stripe's flowing hero gradient, digits roll like an odometer, chip springs in
T2[3]=r=>{const c=document.createElement('canvas');c.width=224;c.height=200;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px;filter:blur(14px) saturate(1.15);transform:scale(1.15)';r.appendChild(c);
 const x=c.getContext('2d');
 r.insertAdjacentHTML('beforeend',`<div style="position:absolute;left:16px;top:20px;font:400 11px ${F};color:rgba(255,255,255,.9)">Gross volume · Today</div>
 <div class="z-nm" style="position:absolute;left:14px;top:40px;text-shadow:0 2px 12px rgba(80,20,120,.25)"></div>
 <div class="z-ch" style="position:absolute;left:16px;top:94px;padding:5px 9px;border-radius:6px;background:rgba(255,255,255,.95);font:500 10px ${F};color:#0A8A3A;display:flex;gap:4px;align-items:center;box-shadow:0 8px 16px -8px rgba(0,0,0,.3);opacity:0">${tick('#0A8A3A',11,3)}+18% vs yesterday</div>
 <svg style="position:absolute;left:0;bottom:0" width="224" height="70" viewBox="0 0 224 70"><path class="z-ln" d="M0 62 C30 60 40 48 62 46 S96 52 112 38 S146 30 160 22 S196 14 224 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity=".95"/></svg>`);
 const roll=odo(r.querySelector('.z-nm'),'£12,480',40,500,'#fff');const ch=r.querySelector('.z-ch'),ln=r.querySelector('.z-ln');
 const blobs=[[STOPS[0],.2,.15],[STOPS[1],.15,.75],[STOPS[2],.65,.35],[STOPS[3],.85,.85],[STOPS[4],.55,.95],['#635BFF',.95,.2]];
 return t=>{const d=R(t);x.fillStyle='#FF8A5B';x.fillRect(0,0,224,200);
  blobs.forEach(([col,bx,by],i)=>{const a=t*Math.PI/3+i*1.7;const px=(bx+.12*Math.cos(a))*224,py=(by+.12*Math.sin(a*1+i))*200;
   const g=x.createRadialGradient(px,py,0,px,py,120);g.addColorStop(0,col);g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,224,200)});
  roll(t*d+(1-d)*0,.55,1.5,.1);const k=S(t,2.1,.45)*d;ch.style.opacity=cl(k*2);ch.style.transform=`scale(${.6+.4*k})`;ch.style.transformOrigin='left center';
  ln.style.strokeDashoffset=1-P(t,1.2,1.4)*d;}};

window.T2=T2;
})();
