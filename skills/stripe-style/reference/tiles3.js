// v2 tiles 05-16, same bar as tiles2.js. Adds to window.T2 (index = tile number - 1).
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
const S=(t,a,d)=>{const x=cl((t-a)/d);if(x>=1)return 1;const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const R=t=>1-P(t,5.3,.5);
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif";
const SH='0 18px 30px -16px rgba(50,50,93,.38),0 8px 16px -8px rgba(0,0,0,.12)';
const tick=(c,s,w=2)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M5 12.5l4.6 4.6L19 7.5" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cross=(c,s,w=2.6)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></svg>`;
const q=(r,c)=>r.querySelector(c),qa=(r,c)=>[...r.querySelectorAll(c)];
const chip=(cls,bg,fg,html,extra='')=>`<div class="z-${cls}" style="position:absolute;padding:6px 10px;border-radius:7px;background:${bg};font:500 11px ${F};color:${fg};display:flex;gap:5px;align-items:center;white-space:nowrap;box-shadow:0 8px 16px -8px rgba(0,0,0,.25);opacity:0;${extra}">${html}</div>`;

// 05 Monthly -> yearly : pill slides with a spring, price swaps up with blur, badge springs in
T2[4]=r=>{r.style.background='linear-gradient(160deg,#F4F2FF,#FFF6F0)';
 r.innerHTML=`<div style="position:absolute;left:37px;top:16px;width:150px;height:30px;border-radius:15px;background:#E6E3F5">
 <div class="z-pl" style="position:absolute;left:2px;top:2px;width:73px;height:26px;border-radius:13px;background:#fff;box-shadow:0 2px 6px rgba(50,50,93,.2)"></div>
 <div style="position:absolute;left:0;width:75px;font:500 11px/30px ${F};color:${NAVY};text-align:center">Monthly</div><div style="position:absolute;left:75px;width:75px;font:500 11px/30px ${F};color:${NAVY};text-align:center">Yearly</div></div>
 <div style="position:absolute;left:22px;top:58px;width:180px;height:128px;border-radius:12px;background:#fff;box-shadow:${SH}">
  <div style="position:absolute;left:16px;top:16px;width:24px;height:24px;border-radius:6px;background:${GRAD}"></div>
  <div style="position:absolute;left:48px;top:20px;font:500 13px ${F};color:${NAVY}">Pro</div>
  ${chip('bd','#EEEBFF',PUR,'2 months free','right:12px;top:16px;box-shadow:none')}
  <div style="position:absolute;left:14px;top:52px;width:160px;height:52px;overflow:hidden">
   <div class="z-a" style="position:absolute;left:0;top:0;font:500 46px/52px ${F};letter-spacing:-.04em;color:${NAVY}">£29</div>
   <div class="z-b" style="position:absolute;left:0;top:0;font:500 46px/52px ${F};letter-spacing:-.04em;color:${NAVY}">£290</div></div>
  <div class="z-pe" style="position:absolute;left:16px;top:104px;font:400 11px ${F};color:${SUB}">per month</div></div>`;
 const pl=q(r,'.z-pl'),a=q(r,'.z-a'),b=q(r,'.z-b'),bd=q(r,'.z-bd'),pe=q(r,'.z-pe');
 return t=>{const d=R(t);const s=S(t,.8,.5)*d;pl.style.transform=`translateX(${s*73}px)`;
  const k=P(t,.95,.5)*d,v=Math.abs(P(t,.97,.5)-P(t,.95,.5))*300;
  a.style.transform=`translateY(${-k*52}px)`;a.style.filter=`blur(${Math.min(4,v)}px)`;b.style.transform=`translateY(${(1-k)*52}px)`;b.style.filter=a.style.filter;
  pe.textContent=k>.5?'per year':'per month';const g=S(t,1.45,.5)*d;bd.style.opacity=cl(g*2);bd.style.transform=`scale(${.5+.5*g})`;}};

// 06 Tap -> approved : card taps a reader, contactless waves ripple, screen turns green
T2[5]=r=>{r.style.background='radial-gradient(110% 90% at 50% 0%,#1E3B60,#0A2540 70%)';
 r.innerHTML=`<div style="position:absolute;left:58px;top:40px;width:96px;height:170px;border-radius:18px;background:linear-gradient(160deg,#2B3446,#151B27);box-shadow:0 24px 36px -16px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.12)">
  <div class="z-sc" style="position:absolute;left:8px;top:8px;width:80px;height:84px;border-radius:11px;background:#F6F9FC;overflow:hidden">
   <div class="z-s1" style="position:absolute;left:0;right:0;top:16px;text-align:center"><div style="font:400 9px ${F};color:${SUB}">Total</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:2px">£24.00</div><div style="font:400 9px ${F};color:${SUB};margin-top:4px">Tap to pay</div></div>
   <div class="z-s2" style="position:absolute;inset:0;background:${GRN};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;opacity:0"><span class="z-tk" style="display:flex">${tick('#fff',30,2.8)}</span><div style="font:500 12px ${F};color:#fff">Approved</div></div></div>
  ${[0,1,2].map(i=>`<div style="position:absolute;left:${16+i*22}px;top:104px;width:16px;height:9px;border-radius:3px;background:rgba(255,255,255,.12)"></div><div style="position:absolute;left:${16+i*22}px;top:119px;width:16px;height:9px;border-radius:3px;background:rgba(255,255,255,.12)"></div>`).join('')}</div>
 <svg class="z-wv" style="position:absolute;left:0;top:0" width="224" height="200">${[0,1,2].map(i=>`<path class="z-w" d="M${150+i*9} ${36-i*7} a${16+i*9} ${16+i*9} 0 0 1 0 ${44+i*14}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0"/>`).join('')}</svg>
 <div class="z-cd" style="position:absolute;left:0;top:0;width:78px;height:50px;border-radius:7px;background:${GRAD};box-shadow:0 14px 24px -10px rgba(238,48,251,.6)"><div style="position:absolute;left:8px;top:9px;width:14px;height:10px;border-radius:2px;background:rgba(255,255,255,.6)"></div><div style="position:absolute;left:8px;bottom:8px;font:500 8px ${F};letter-spacing:.1em;color:#fff">•••• 4242</div></div>`;
 const cd=q(r,'.z-cd'),s1=q(r,'.z-s1'),s2=q(r,'.z-s2'),tk=q(r,'.z-tk'),ws=qa(r,'.z-w');
 return t=>{const d=R(t);const inn=S(t,.5,.6)*(1-P(t,2.2,.6));const x=230-(230-108)*inn,y=-60+(-60-30)*-inn;
  cd.style.transform=`translate(${x}px,${y}px) rotate(${-18+18*inn}deg)`;
  ws.forEach((w,i)=>{const k=L(t,1.0+i*.12,.7);w.setAttribute('opacity',(k>0&&k<1?Math.sin(k*Math.PI):0)*.9)});
  const g=P(t,1.5,.3)*d;s2.style.opacity=g;s1.style.opacity=1-g;const k=S(t,1.6,.45)*d;tk.style.transform=`scale(${k})`;}};

// 07 Failed -> retried : ring sweeps round with a glowing tip, red cross morphs to a green tick
T2[6]=r=>{r.style.background='radial-gradient(90% 80% at 50% 40%,#FFFFFF,#F2F0FA)';
 r.innerHTML=`<svg style="position:absolute;left:0;top:0" width="224" height="200"><defs><linearGradient id="rg7" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PUR}"/><stop offset="1" stop-color="${GRN}"/></linearGradient></defs>
 <circle cx="112" cy="88" r="58" fill="none" stroke="#E9ECF3" stroke-width="12"/>
 <circle class="z-rd" cx="112" cy="88" r="58" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".62" transform="rotate(-90 112 88)"/>
 <circle class="z-ok" cx="112" cy="88" r="58" fill="none" stroke="url(#rg7)" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 112 88)"/>
 <circle class="z-tp" cx="112" cy="30" r="7" fill="#fff" opacity="0" style="filter:drop-shadow(0 0 6px ${PUR})"/></svg>
 <div class="z-ic" style="position:absolute;left:88px;top:64px;width:48px;height:48px;border-radius:50%;background:${RED};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px -8px rgba(223,27,65,.6)"><span class="z-x" style="display:flex;position:absolute">${cross('#fff',24)}</span><span class="z-v" style="display:flex;position:absolute;opacity:0">${tick('#fff',26,2.8)}</span></div>
 ${chip('c1','#FFE7EA',RED,'Declined','left:84px;top:162px;opacity:1;box-shadow:none')}${chip('c2','#D7F7E1','#0A8A3A',tick('#0A8A3A',11,3)+'Succeeded','left:72px;top:162px;box-shadow:none')}`;
 const rd=q(r,'.z-rd'),ok=q(r,'.z-ok'),tp=q(r,'.z-tp'),ic=q(r,'.z-ic'),x=q(r,'.z-x'),v=q(r,'.z-v'),c1=q(r,'.z-c1'),c2=q(r,'.z-c2');
 return t=>{const d=R(t);const fade=P(t,.6,.3)*d;rd.style.opacity=1-fade;const k=P(t,.8,1.2)*d;ok.style.strokeDashoffset=1-k;
  const an=(-90+360*k)*Math.PI/180;tp.setAttribute('cx',112+58*Math.cos(an));tp.setAttribute('cy',88+58*Math.sin(an));tp.setAttribute('opacity',k>.01&&k<.99?1:0);
  const g=P(t,1.95,.3)*d;ic.style.background=g>0?`color-mix(in srgb,${GRN} ${g*100}%,${RED})`:RED;ic.style.boxShadow=`0 10px 20px -8px ${g>.5?'rgba(0,179,65,.6)':'rgba(223,27,65,.6)'}`;
  x.style.opacity=1-g;const s=S(t,1.95,.5)*d;v.style.opacity=cl(s*3);v.style.transform=`scale(${s})`;ic.style.transform=`scale(${1+.12*Math.sin(cl((t-1.95)/.4)*Math.PI)*d})`;
  c1.style.opacity=1-g;c2.style.opacity=g;c2.style.transform=`translateY(${(1-g)*6}px)`;}};

// 08 Link -> paid : a payment-link preview springs into a chat, then a Paid badge pops on it
T2[7]=r=>{r.style.background='linear-gradient(170deg,#F7F8FC,#EEF1F8)';
 r.innerHTML=`<div class="z-b1" style="position:absolute;left:14px;top:16px;padding:8px 12px;border-radius:16px 16px 16px 4px;background:#fff;box-shadow:0 4px 10px -4px rgba(50,50,93,.2);font:400 12px ${F};color:${NAVY}">Can I pay online?</div>
 <div class="z-lk" style="position:absolute;left:60px;top:54px;width:150px;border-radius:14px 14px 4px 14px;background:#fff;box-shadow:${SH};overflow:hidden;opacity:0">
  <div style="height:58px;background:${GRAD};position:relative"><div style="position:absolute;left:12px;bottom:10px;font:500 20px ${F};letter-spacing:-.03em;color:#fff">£120.00</div></div>
  <div style="padding:9px 12px"><div style="font:500 11px ${F};color:${NAVY}">Brand workshop</div><div style="font:400 10px ${F};color:${PUR};margin-top:3px">pay.link/a8f2</div></div>
  ${chip('pd',GRN,'#fff',tick('#fff',12,3)+'Paid','right:8px;top:8px')}</div>`;
 const b1=q(r,'.z-b1'),lk=q(r,'.z-lk'),pd=q(r,'.z-pd');
 return t=>{const d=R(t);const a=S(t,.2,.5);b1.style.opacity=cl(a*2);b1.style.transform=`translateY(${(1-a)*12}px)`;
  const k=S(t,.8,.6)*d;lk.style.opacity=cl(k*2);lk.style.transform=`translateY(${(1-k)*30}px) scale(${.85+.15*k})`;lk.style.transformOrigin='right bottom';
  const g=S(t,1.8,.5)*d;pd.style.opacity=cl(g*2);pd.style.transform=`scale(${g}) rotate(${(1-g)*-12}deg)`;}};

// 09 Plan -> upgraded : three plan cards fanned in 3D, the top plan lifts forward with a glow
T2[8]=r=>{r.style.background='radial-gradient(100% 90% at 50% 20%,#F6F4FF,#ECEAF7)';
 const pl=[['Starter','£19'],['Growth','£49'],['Scale','£99']];
 r.innerHTML=`<div style="position:absolute;inset:0;perspective:600px">${pl.map(([n,p],i)=>`<div class="z-pc" style="position:absolute;left:${18+i*64}px;top:44px;width:60px;height:104px;border-radius:10px;background:#fff;box-shadow:${SH};box-sizing:border-box;border:2px solid transparent">
  <div style="position:absolute;left:9px;top:10px;width:14px;height:14px;border-radius:4px;background:${i==2?GRAD:'#E3E8EE'}"></div>
  <div style="position:absolute;left:9px;top:32px;font:500 10px ${F};color:${NAVY}">${n}</div>
  <div style="position:absolute;left:8px;top:48px;font:500 18px ${F};letter-spacing:-.03em;color:${NAVY}">${p}</div>
  <div style="position:absolute;left:9px;top:70px;font:400 8px ${F};color:${SUB}">per month</div></div>`).join('')}</div>
 ${chip('up',GRN,'#fff',tick('#fff',12,3)+'Upgraded','left:70px;top:164px')}`;
 const pcs=qa(r,'.z-pc'),up=q(r,'.z-up');
 return t=>{const d=R(t);const k=S(t,.8,.6)*d;pcs.forEach((c,i)=>{const ry=(i-1)*-18*(1-.4*k);let tz=0,sc=1,ty=0;
   if(i==2){tz=40*k;sc=1+.18*k;ty=-8*k;c.style.borderColor=`rgba(99,91,255,${k})`;c.style.boxShadow=`0 ${18+10*k}px 30px -14px rgba(99,91,255,${.35+.3*k})`;c.style.zIndex=3}
   else{sc=1-.06*k;c.style.opacity=1-.35*k}
   c.style.transform=`translateY(${ty}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;});
  const g=S(t,1.4,.5)*d;up.style.opacity=cl(g*2);up.style.transform=`scale(${.5+.5*g})`;}};

// 10 Cart -> order : glossy items drop with a bounce into a big gradient bag, receipt rises out of it
T2[9]=r=>{r.style.background='linear-gradient(165deg,#FFF6EF,#F6F0FF)';
 const cols=[['#7A73FF','#4B3FE0'],['#FF9A4D','#F2540F'],['#F77CFF','#C21BD6']];
 r.innerHTML=`<svg style="position:absolute;left:82px;top:78px" width="60" height="32" viewBox="0 0 60 32"><path d="M8 32V20a22 22 0 0 1 44 0v12" fill="none" stroke="#4B3FE0" stroke-width="6" stroke-linecap="round"/></svg><div class="z-rc" style="position:absolute;left:62px;top:60px;width:100px;height:92px;border-radius:8px;background:#fff;box-shadow:${SH};padding:10px 12px;box-sizing:border-box;opacity:0">
   <div style="font:400 9px ${F};color:${SUB}">Order confirmed</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:3px">#2190</div>
   <div style="display:flex;gap:4px;align-items:center;font:500 10px ${F};color:#0A8A3A;margin-top:3px">${tick('#0A8A3A',11,3)}Paid £86</div></div>
 ${cols.map(([a,b],i)=>`<div class="z-it" style="position:absolute;left:${68+i*30}px;top:0;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,${a} 28%,${b} 100%);box-shadow:0 8px 14px -6px ${b}"></div>`).join('')}
 <div class="z-bg" style="position:absolute;left:47px;top:100px;width:130px;height:96px">
  <div style="position:absolute;inset:0;border-radius:12px 12px 16px 16px;background:linear-gradient(150deg,#8F88FF,#635BFF 45%,#7232F1);box-shadow:0 22px 34px -16px rgba(99,91,255,.75),inset 0 2px 0 rgba(255,255,255,.35)">
   <div style="position:absolute;left:0;right:0;top:0;height:40%;border-radius:12px 12px 0 0;background:linear-gradient(rgba(255,255,255,.28),rgba(255,255,255,0))"></div>
   <div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font:500 13px ${F};color:#fff">Basket</div></div>
  <div class="z-bd" style="position:absolute;right:-10px;top:-10px;width:28px;height:28px;border-radius:50%;background:#fff;font:500 14px/28px ${F};color:${PUR};text-align:center;box-shadow:0 6px 12px -4px rgba(50,50,93,.4);opacity:0">0</div></div>`;
 const it=qa(r,'.z-it'),bd=q(r,'.z-bd'),bg=q(r,'.z-bg'),rc=q(r,'.z-rc');
 return t=>{const d=R(t);let n=0,squash=0;it.forEach((e,i)=>{const a=.35+i*.3;const k=S(t,a,.5);
   e.style.transform=`translate(${(1-k)*(i-1)*16}px,${-36+130*k}px) scale(${t<a?0:1-.5*P(t,a+.3,.2)})`;e.style.opacity=t<a?0:1-P(t,a+.35,.15);
   if(t>a+.35){n++;squash=Math.max(squash,1-cl((t-a-.35)/.3))}});
  bg.style.transform=`scale(${1+.06*squash},${1-.06*squash})`;bg.style.transformOrigin='50% 100%';
  bd.textContent=n;bd.style.opacity=n?d:0;bd.style.transform=`scale(${n?.7+.3*S(t,.35+(n-1)*.3+.35,.35):0})`;
  const u=S(t,1.6,.6)*d;rc.style.opacity=cl(u*3);rc.style.transform=`translateY(${(1-u)*50-42*u}px) rotate(${(1-u)*-6}deg)`;}};

// 11 Refund -> done : a receipt prints out of a slot, then a REFUNDED stamp slams onto it
T2[10]=r=>{r.style.background='linear-gradient(170deg,#F3F5FA,#E9ECF4)';
 r.innerHTML=`<div style="position:absolute;left:30px;top:14px;width:164px;height:18px;border-radius:9px;background:linear-gradient(#2B3446,#151B27);box-shadow:0 6px 12px -4px rgba(0,0,0,.35);z-index:2"></div>
 <div style="position:absolute;left:44px;top:22px;width:136px;height:178px;overflow:hidden">
  <div class="z-rc" style="position:absolute;left:0;top:0;width:136px;height:160px;background:#fff;box-shadow:0 10px 18px -10px rgba(50,50,93,.35);clip-path:polygon(0 0,100% 0,100% 94%,92% 100%,84% 94%,76% 100%,68% 94%,60% 100%,52% 94%,44% 100%,36% 94%,28% 100%,20% 94%,12% 100%,4% 94%,0 100%)">
   <div style="padding:16px 14px 0"><div style="font:400 9px ${F};color:${SUB}">Charge · ch_3Q8a</div><div style="font:500 26px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:4px">£120.00</div>
   ${[64,92,48].map(w=>`<div style="height:5px;width:${w}px;border-radius:3px;background:#EDF0F5;margin-top:9px"></div>`).join('')}</div></div></div>
 <div class="z-st" style="position:absolute;left:56px;top:110px;padding:6px 12px;border:3px solid ${PUR};border-radius:8px;font:500 17px ${F};letter-spacing:.06em;color:${PUR};background:rgba(255,255,255,.7);opacity:0">REFUNDED</div>`;
 const rc=q(r,'.z-rc'),st=q(r,'.z-st');
 return t=>{const d=R(t);const k=P(t,.3,1.1)*d;rc.style.transform=`translateY(${-160+160*k}px)`;
  const s=L(t,1.55,.22)*d;const land=s>=1?1:0;const sq=S(t,1.77,.4);
  const sc=s<1?2.4-1.4*E(s):1+.12*(1-sq)*Math.sin(sq*Math.PI*2);st.style.opacity=cl(s*2.5);st.style.transform=`rotate(-12deg) scale(${sc})`;
  rc.style.marginLeft=(land*d*Math.sin(cl((t-1.77)/.25)*Math.PI*3)*2*(1-cl((t-1.77)/.25)))+'px';}};

// 12 Fraud -> blocked : payments stream at a shield, bad ones bounce off red, good ones pass green
T2[11]=r=>{r.style.background='radial-gradient(90% 80% at 50% 50%,#13325A,#0A2540 75%)';
 const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');x.scale(2,2);
 r.insertAdjacentHTML('beforeend',`<div class="z-sh" style="position:absolute;left:84px;top:62px;width:56px;height:64px"><svg viewBox="0 0 24 28" width="56" height="64" style="filter:drop-shadow(0 0 14px rgba(99,91,255,.8))"><defs><linearGradient id="sg12" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8F88FF"/><stop offset="1" stop-color="#5146F5"/></linearGradient></defs><path d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z" fill="url(#sg12)"/><path d="M7.5 13.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
 <div style="position:absolute;left:14px;top:14px;padding:6px 10px;border-radius:7px;background:rgba(255,255,255,.1);font:400 10px ${F};color:#C9D3E6">Blocked today <b class="z-n" style="font-weight:500;color:#fff;margin-left:3px">38</b></div>`);
 const sh=q(r,'.z-sh'),n=q(r,'.z-n');
 const parts=[...Array(22)].map((_,i)=>({s:(i*0.273)%6,y:40+((i*53)%120),bad:i%3==0}));
 return t=>{x.clearRect(0,0,224,200);let hits=0,pulse=0;
  parts.forEach(p=>{for(const off of [0,-6,6]){const lt=t-p.s+off;if(lt<0||lt>1.6)continue;const k=lt/1.6;
   let px,py,al=1;const hitk=.5;
   if(p.bad&&k>hitk){const b=(k-hitk)/(1-hitk);px=104-60*b;py=p.y+(p.y<94?-1:1)*50*b+((94-p.y)*.6);al=1-b;if(b<.2)pulse=Math.max(pulse,1-b/.2)}
   else if(p.bad){px=-10+114*(k/hitk);py=p.y+(94-p.y)*.6*(k/hitk)}
   else{px=-10+244*k;py=p.y;al=px>90&&px<134?.25:1}
   if(p.bad&&k>hitk&&off==0)hits++;
   const col=p.bad?'#FF5C7A':'#3DDC84';x.globalAlpha=al;x.strokeStyle=col;x.lineWidth=2;x.lineCap='round';x.beginPath();x.moveTo(px-10,py);x.lineTo(px,py);x.stroke();
   x.fillStyle=col;x.shadowColor=col;x.shadowBlur=6;x.beginPath();x.arc(px,py,2.4,0,7);x.fill();x.shadowBlur=0;}});
  x.globalAlpha=1;sh.style.transform=`scale(${1+.08*pulse})`;n.textContent=38+parts.filter(p=>p.bad&&t-p.s>.8).length;}};

// 13 Invoice -> sent : invoice slides into a glossy envelope, flap closes, a green seal springs on, chip lands
T2[12]=r=>{r.style.background='linear-gradient(165deg,#F2F7FF,#F6F1FF)';
 r.innerHTML=`<div class="z-ev" style="position:absolute;left:37px;top:84px;width:150px;height:98px">
  <div style="position:absolute;inset:0;border-radius:10px;background:#C9C3FF"></div>
  <div class="z-iv" style="position:absolute;left:14px;top:-84px;width:122px;height:124px;border-radius:6px;background:#fff;box-shadow:${SH};padding:12px;box-sizing:border-box">
   <div style="font:500 11px ${F};color:${NAVY}">Invoice #1042</div><div style="font:500 22px ${F};letter-spacing:-.03em;color:${NAVY};margin-top:6px">£1,320</div>
   ${[78,60,70].map(w=>`<div style="height:5px;width:${w}px;border-radius:3px;background:#EDF0F5;margin-top:8px"></div>`).join('')}</div>
  <div style="position:absolute;inset:0;border-radius:10px;background:linear-gradient(160deg,#9F97FF,#635BFF 60%,#5146F5);clip-path:polygon(0 28%,50% 66%,100% 28%,100% 100%,0 100%);box-shadow:0 22px 34px -16px rgba(99,91,255,.75)"></div>
  <div class="z-fl" style="position:absolute;left:0;top:0;width:150px;height:64px;transform-origin:50% 0;background:linear-gradient(#B3ACFF,#7A70FF);clip-path:polygon(0 0,100% 0,50% 100%);opacity:0"></div>
  <div class="z-sl" style="position:absolute;left:57px;top:40px;width:36px;height:36px;border-radius:50%;background:${GRN};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px -6px rgba(0,179,65,.7),inset 0 2px 0 rgba(255,255,255,.35);opacity:0">${tick('#fff',20,3)}</div></div>
 ${chip('ch','#fff',NAVY,'Invoice sent · £1,320','left:52px;top:20px')}`;
 const ev=q(r,'.z-ev'),iv=q(r,'.z-iv'),fl=q(r,'.z-fl'),sl=q(r,'.z-sl'),ch=q(r,'.z-ch');
 return t=>{const d=R(t);const k=P(t,.5,.5)*d;iv.style.transform=`translateY(${k*84}px)`;iv.style.opacity=k>.98?0:1;
  const f=P(t,1.0,.3)*d;fl.style.opacity=f>0?1:0;fl.style.transform=`rotateX(${180-180*f}deg)`;
  const hop=Math.sin(cl((t-1.3)/.35)*Math.PI)*d;ev.style.transform=`translateY(${-10*hop}px)`;
  const g=S(t,1.45,.5)*d;sl.style.opacity=cl(g*3);sl.style.transform=`scale(${g}) rotate(${(1-g)*-30}deg)`;
  const c=S(t,1.7,.5)*d;ch.style.opacity=cl(c*2);ch.style.transform=`translateY(${(1-c)*-10}px)`;}};

// 14 MRR -> up : glossy gradient bars spring up one by one, a line draws through them, +38% pops
T2[13]=r=>{r.style.background='linear-gradient(170deg,#FFFFFF,#F1F3FA)';
 const hs=[34,48,42,62,74,70,96];
 r.innerHTML=`<div style="position:absolute;left:14px;top:14px;font:400 10px ${F};color:${SUB}">Monthly recurring revenue</div>
 ${chip('pc',GRN,'#fff','+38%','left:14px;top:32px;font-size:15px;padding:6px 10px')}
 ${hs.map((h,i)=>`<div class="z-br" style="position:absolute;left:${22+i*27}px;bottom:16px;width:18px;height:${h}px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,${['#7232F1','#9A4CF5','#C04BF2','#EE30FB','#FB76FA','#FF8A4C','#FF6118'][i]},rgba(99,91,255,.55));transform-origin:50% 100%;box-shadow:inset 0 1px 0 rgba(255,255,255,.5)"></div>`).join('')}
 <svg style="position:absolute;left:0;top:0" width="224" height="200"><path class="z-ln" d="${hs.map((h,i)=>`${i?'L':'M'}${31+i*27} ${184-h-8}`).join(' ')}" fill="none" stroke="${NAVY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><circle class="z-dt" cx="193" cy="${184-96-8}" r="4.5" fill="${NAVY}" opacity="0"/></svg>`;
 const br=qa(r,'.z-br'),ln=q(r,'.z-ln'),dt=q(r,'.z-dt'),pc=q(r,'.z-pc');
 return t=>{const d=R(t);br.forEach((b,i)=>{const k=S(t,.4+i*.1,.55)*d;b.style.transform=`scaleY(${Math.max(0,k)})`});
  ln.style.strokeDashoffset=1-P(t,1.2,.8)*d;dt.setAttribute('opacity',P(t,1.95,.15)*d);const g=S(t,2.0,.5)*d;pc.style.opacity=cl(g*2);pc.style.transform=`scale(${.5+.5*g})`;pc.style.transformOrigin='left center';}};

// 15 Currency -> converted : split-flap board flips $100 to £79, character by character
T2[14]=r=>{r.style.background='linear-gradient(170deg,#F5F7FB,#E9EDF5)';
 const A='$500',B='£395';
 r.innerHTML=`<div style="position:absolute;left:0;right:0;top:22px;display:flex;justify-content:center;gap:8px;align-items:center;font:500 11px ${F};color:${NAVY}"><span style="padding:5px 9px;border-radius:6px;background:#fff;box-shadow:0 2px 6px rgba(50,50,93,.15)">USD</span><svg width="26" height="10" viewBox="0 0 26 10"><path class="z-ar" d="M1 5h22m-5-4l5 4-5 4" fill="none" stroke="${PUR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><span class="z-gb" style="padding:5px 9px;border-radius:6px;background:#fff;box-shadow:0 2px 6px rgba(50,50,93,.15)">GBP</span></div>
 <div style="position:absolute;left:24px;top:64px;display:flex;gap:6px;perspective:300px">${[0,1,2,3].map(i=>`<div class="z-cl" style="position:relative;width:39px;height:64px;transform-style:preserve-3d">
  <div class="z-fa" style="position:absolute;inset:0;border-radius:7px;background:linear-gradient(#1F2A3D,#121A28);color:#fff;font:500 42px/64px ${F};text-align:center;backface-visibility:hidden;box-shadow:0 10px 18px -8px rgba(0,0,0,.45)">${A[i]}</div>
  <div class="z-fb" style="position:absolute;inset:0;border-radius:7px;background:linear-gradient(#2B2470,#1A1550);color:#fff;font:500 42px/64px ${F};text-align:center;backface-visibility:hidden;transform:rotateX(180deg);box-shadow:0 10px 18px -8px rgba(0,0,0,.45)">${B[i].trim()}</div>
  <div style="position:absolute;left:0;right:0;top:31.5px;height:1px;background:rgba(0,0,0,.5);transform:translateZ(1px)"></div></div>`).join('')}</div>
 <div class="z-rt" style="position:absolute;left:0;right:0;top:146px;text-align:center;font:400 10px ${F};color:${SUB};opacity:0">1 USD = 0.79 GBP</div>`;
 const cls=qa(r,'.z-cl'),ar=q(r,'.z-ar'),gb=q(r,'.z-gb'),rt=q(r,'.z-rt');
 return t=>{const d=R(t);ar.style.strokeDashoffset=1-P(t,.5,.35)*d;cls.forEach((c,i)=>{const k=S(t,.8+i*.14,.6)*d;c.style.transform=`rotateX(${-k*180}deg)`});
  const g=P(t,1.0,.3)*d;gb.style.background=g>.5?'#EEEBFF':'#fff';gb.style.color=g>.5?PUR:NAVY;rt.style.opacity=P(t,1.7,.3)*d;}};

// 16 Alerts -> stack : payment notifications drop onto a lock screen and stack, badge counts up
T2[15]=r=>{r.style.background='#E9EDF5';
 const am=['£49.00','£120.00','£24.00','£86.00'];
 r.innerHTML=`<div style="position:absolute;left:30px;top:10px;width:164px;height:250px;border-radius:30px;background:#0B0B0F;box-shadow:0 24px 40px -18px rgba(50,50,93,.5)">
 <div style="position:absolute;inset:5px;border-radius:25px;background:linear-gradient(160deg,#7232F1,#EE30FB 45%,#FF6118 80%,#FFD601);overflow:hidden">
  <div style="position:absolute;left:57px;top:7px;width:40px;height:11px;border-radius:6px;background:#0B0B0F"></div>
  <div style="position:absolute;left:0;right:0;top:24px;text-align:center;font:500 38px ${F};letter-spacing:-.03em;color:rgba(255,255,255,.95)">10:24</div>
  ${am.map((a,i)=>`<div class="z-nt" style="position:absolute;left:8px;top:82px;width:138px;height:40px;border-radius:12px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);box-shadow:0 6px 12px -6px rgba(0,0,0,.3);opacity:0">
   <div style="position:absolute;left:8px;top:8px;width:24px;height:24px;border-radius:6px;background:${PUR};display:flex;align-items:center;justify-content:center">${tick('#fff',14,3)}</div>
   <div style="position:absolute;left:40px;top:8px;font:500 10px ${F};color:${NAVY}">Payment received</div><div style="position:absolute;left:40px;top:22px;font:400 10px ${F};color:${SUB}">${a} · now</div></div>`).join('')}
  <div class="z-bd" style="position:absolute;left:0;right:0;top:150px;text-align:center"><span class="z-bn" style="display:inline-block;padding:5px 11px;border-radius:12px;background:rgba(255,255,255,.25);font:500 11px ${F};color:#fff">0 new payments</span></div>
 </div></div>`;
 const nt=qa(r,'.z-nt'),bn=q(r,'.z-bn');
 return t=>{const d=R(t);let n=0;nt.forEach((e,i)=>{const a=.5+i*.38;const k=S(t,a,.5);const later=nt.length-1-i;
   const pushed=[0,1,2,3].filter(j=>j>i&&t>.5+j*.38).length;const ty=-60+60*k+pushed*6,sc=1-pushed*.05;
   e.style.opacity=t<a?0:(pushed>2?0:1-pushed*.18)*d+(d<1?0:0);e.style.transform=`translateY(${ty}px) scale(${sc})`;e.style.zIndex=10+i;if(t>a+.2)n++});
  bn.textContent=`${n*3} new payments`;bn.style.transform=`scale(${1+.1*Math.sin(cl((t-.5-(n-1)*.38-.2)/.3)*Math.PI)})`;}};
})();
