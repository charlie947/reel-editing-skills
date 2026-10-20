// 16 Stripe-style UI moments, built in code from stripe-design-system.md.
// Each tile is a pure function of time: seekTiles(seconds). 6 s loop, one object, one change.
(function(){
const NAVY='#061B31',SUB='#425466',PUR='#635BFF',PUR2='#533AFD',GRN='#00B341',SURF='#F8FAFD';
const GRAD='linear-gradient(110deg,#FFD601,#FF6118 25%,#EE30FB 50%,#FB76FA 72%,#7232F1)';
const SH='0 14px 20px -14px rgba(50,50,93,.28),0 8px 16px -8px rgba(0,0,0,.10)';
// cubic-bezier(.25,1,.5,1): Stripe's default ease (44 uses on stripe.com)
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
 const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=dX(t);if(Math.abs(d)<1e-6)break;t-=(X(t)-x)/d}return Y(Math.min(1,Math.max(0,t)))}}
const E=bez(.25,1,.5,1);
const cl=x=>Math.max(0,Math.min(1,x));
const P=(t,a,d)=>E(cl((t-a)/d));          // eased progress
const L=(t,a,d)=>cl((t-a)/d);             // linear progress
const R=t=>1-L(t,5.35,.45);               // reset: 1 until 5.35s, then fades to 0 by 5.8s
const mix=(a,b,p)=>a+(b-a)*p;
const css=(el,o)=>{for(const k in o)el.style[k]=o[k];};

const T=[]; // [build(root) -> seek(t)]
const card=(x,y,w,h,extra='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#fff;border-radius:6px;box-shadow:${SH};${extra}`;
const tick=(c='#fff',s=10)=>`<svg viewBox="0 0 12 12" width="${s}" height="${s}"><path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// 01 Checkout -> paid
T.push(r=>{r.innerHTML=`<div style="${card(30,28,164,144)}">
 <div style="position:absolute;left:16px;top:16px;font:400 10px/1 Inter,system-ui,sans-serif;color:${SUB}">Total due</div>
 <div style="position:absolute;left:15px;top:32px;font:300 38px/1 Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}">£49.00</div>
 <div class="bt" style="position:absolute;left:16px;top:94px;width:132px;height:34px;border-radius:5px;background:${PUR};overflow:hidden">
  <div class="pr" style="position:absolute;left:0;top:0;bottom:0;width:0;background:${PUR2}"></div>
  <div class="a" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:500 13px Inter,system-ui,sans-serif;color:#fff">Pay</div>
  <div class="b" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;font:500 13px Inter,system-ui,sans-serif;color:#fff;opacity:0">${tick('#fff',12)}Paid</div></div></div>`;
 const bt=r.querySelector('.bt'),pr=r.querySelector('.pr'),a=r.querySelector('.a'),b=r.querySelector('.b');
 return t=>{const press=P(t,.9,.15)*(1-P(t,1.05,.2)),prog=L(t,1.1,.9)*R(t),done=P(t,2.0,.3)*R(t);
  bt.style.transform=`scale(${1-.04*press})`;pr.style.width=(prog*100)+'%';
  bt.style.background=done>0?`color-mix(in srgb,${GRN} ${done*100}%,${PUR})`:PUR;pr.style.opacity=1-done;
  a.style.opacity=1-done;b.style.opacity=done;b.style.transform=`translateY(${(1-done)*6}px)`;}});

// 02 Card -> added
T.push(r=>{r.innerHTML=`<div style="${card(22,16,180,170)}">
 <div style="position:absolute;left:14px;top:14px;font:400 10px Inter,system-ui,sans-serif;color:${SUB}">Card number</div>
 <div style="position:absolute;left:14px;top:30px;width:152px;height:28px;border-radius:4px;border:1px solid #E3E8EE"></div>
 <div class="num" style="position:absolute;left:24px;top:36px;font:400 14px Inter,system-ui,sans-serif;letter-spacing:.06em;color:${NAVY};opacity:0">•••• 4242</div>
 <div style="position:absolute;left:14px;top:72px;font:400 10px Inter,system-ui,sans-serif;color:${SUB}">Saved cards</div></div>
 <div class="cd" style="position:absolute;left:54px;top:106px;width:116px;height:72px;border-radius:8px;background:${GRAD};box-shadow:0 12px 24px -10px rgba(114,50,241,.55)">
  <div style="position:absolute;left:12px;top:14px;width:20px;height:15px;border-radius:3px;background:rgba(255,255,255,.55)"></div>
  <div style="position:absolute;left:12px;bottom:12px;font:500 11px Inter,system-ui,sans-serif;letter-spacing:.08em;color:#fff">•••• 4242</div></div>`;
 const cd=r.querySelector('.cd'),n=r.querySelector('.num');
 return t=>{const s=P(t,.7,.5),d=R(t),k=s*d;cd.style.transform=`translateX(${(1-k)*190}px) rotate(${(1-k)*8}deg)`;cd.style.opacity=k;
  n.style.opacity=P(t,1.25,.3)*d;}});

// 03 0 -> £12,480
T.push(r=>{r.innerHTML=`<div style="${card(24,26,176,148)}">
 <div style="position:absolute;left:16px;top:16px;font:400 10px Inter,system-ui,sans-serif;color:${SUB}">Gross volume · Today</div>
 <div class="v" style="position:absolute;left:15px;top:33px;font:300 34px/1 Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}">£0</div>
 <svg style="position:absolute;left:12px;top:78px" width="152" height="60" viewBox="0 0 152 60"><path d="M0 59H152" stroke="#E3E8EE"/>
 <path class="ln" d="M2 54 C20 52 26 44 40 42 S62 46 74 34 S98 30 108 20 S132 14 150 6" fill="none" stroke="${PUR}" stroke-width="2.2" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
 <circle class="dt" cx="150" cy="6" r="4" fill="${PUR}" opacity="0"/></svg></div>`;
 const v=r.querySelector('.v'),ln=r.querySelector('.ln'),dt=r.querySelector('.dt');
 return t=>{const d=R(t),on=t>=.8&&d>.5;v.textContent=on?'£12,480':'£0';v.style.opacity=t<.8?1:mix(.0,1,P(t,.8,.25))*(d>.5?1:d*2);
  ln.style.strokeDashoffset=1-L(t,1.0,1.1)*d;dt.setAttribute('opacity',P(t,2.05,.25)*d);}});

// 04 Invoice -> sent
T.push(r=>{r.innerHTML=`<div class="iv" style="${card(36,24,152,152)}">
 <div style="position:absolute;left:14px;top:14px;font:500 11px Inter,system-ui,sans-serif;color:${NAVY}">Invoice #1042</div>
 ${[0,1,2].map(i=>`<div style="position:absolute;left:14px;right:14px;top:${40+i*19}px;display:flex;justify-content:space-between;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}"><span>${['Design','Build','Support'][i]}</span><span>£${[400,800,120][i]}</span></div>`).join('')}
 <div style="position:absolute;left:14px;right:14px;top:100px;height:1px;background:#E3E8EE"></div>
 <div class="sb" style="position:absolute;left:14px;top:112px;width:124px;height:26px;border-radius:5px;background:${PUR};font:500 11px/26px Inter,system-ui,sans-serif;color:#fff;text-align:center">Send invoice</div></div>
 <div class="ok" style="position:absolute;left:0;right:0;top:78px;display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0">
 <div style="width:40px;height:40px;border-radius:50%;background:${GRN};display:flex;align-items:center;justify-content:center">${tick('#fff',20)}</div>
 <div style="font:300 20px Inter,system-ui,sans-serif;color:${NAVY}">Sent</div></div>`;
 const iv=r.querySelector('.iv'),sb=r.querySelector('.sb'),ok=r.querySelector('.ok');
 return t=>{const pr=P(t,.8,.12)*(1-P(t,.92,.15)),go=P(t,1.0,.45),d=R(t),g=go*d,o=P(t,1.35,.3)*d;
  sb.style.transform=`scale(${1-.05*pr})`;iv.style.transform=`translateY(${-g*170}px) scale(${1-.25*g})`;iv.style.opacity=1-g;
  ok.style.opacity=o;ok.style.transform=`scale(${.85+.15*o})`;}});

// 05 Monthly -> yearly
T.push(r=>{r.innerHTML=`<div style="position:absolute;left:46px;top:20px;width:132px;height:26px;border-radius:13px;background:#E9EEF5">
 <div class="pl" style="position:absolute;left:2px;top:2px;width:64px;height:22px;border-radius:11px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)"></div>
 <div style="position:absolute;left:0;width:66px;top:0;font:500 10px/26px Inter,system-ui,sans-serif;color:${NAVY};text-align:center">Monthly</div>
 <div style="position:absolute;left:66px;width:66px;top:0;font:500 10px/26px Inter,system-ui,sans-serif;color:${NAVY};text-align:center">Yearly</div></div>
 <div style="${card(40,58,144,118)}"><div style="position:absolute;left:14px;top:14px;font:500 11px Inter,system-ui,sans-serif;color:${NAVY}">Pro</div>
 <div class="ch" style="position:absolute;right:12px;top:11px;padding:3px 7px;border-radius:4px;background:#EEEBFF;font:500 8.5px Inter,system-ui,sans-serif;color:${PUR};opacity:0">2 months free</div>
 <div style="position:absolute;left:14px;top:40px;height:44px;overflow:hidden;width:120px"><div class="pc" style="font:300 38px/44px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}"><div>£29</div><div>£290</div></div></div>
 <div class="pe" style="position:absolute;left:15px;top:90px;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">per month</div></div>`;
 const pl=r.querySelector('.pl'),pc=r.querySelector('.pc'),ch=r.querySelector('.ch'),pe=r.querySelector('.pe');
 return t=>{const s=P(t,.8,.35)*R(t)+(R(t)<1?0:0);pl.style.transform=`translateX(${s*64}px)`;pc.style.transform=`translateY(${-P(t,.95,.4)*R(t)*44}px)`;
  ch.style.opacity=P(t,1.35,.3)*R(t);ch.style.transform=`scale(${.8+.2*P(t,1.35,.3)})`;pe.textContent=t>1.1&&R(t)>.5?'per year':'per month';}});

// 06 Payout -> bank
T.push(r=>{r.innerHTML=`<div style="${card(16,26,112,66)}"><div style="position:absolute;left:12px;top:11px;font:400 9px Inter,system-ui,sans-serif;color:${SUB}">Balance</div>
 <div class="bl" style="position:absolute;left:11px;top:27px;font:300 22px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}">£3,200</div></div>
 <div style="${card(96,112,112,66)}"><div style="position:absolute;left:12px;top:12px;width:28px;height:21px">
 <svg viewBox="0 0 32 24" width="28" height="21"><path d="M3 9L16 2l13 7z" fill="${NAVY}"/><rect x="5" y="10" width="3" height="9" fill="${NAVY}"/><rect x="14.5" y="10" width="3" height="9" fill="${NAVY}"/><rect x="24" y="10" width="3" height="9" fill="${NAVY}"/><rect x="3" y="20" width="26" height="3" rx="1" fill="${NAVY}"/></svg></div>
 <div style="position:absolute;left:12px;top:40px;font:400 9px Inter,system-ui,sans-serif;color:${SUB}">Bank •• 6789</div>
 <div class="in" style="position:absolute;right:12px;top:14px;font:500 12px Inter,system-ui,sans-serif;color:#0A8A3A;opacity:0">+£3,200</div></div>
 <svg style="position:absolute;left:0;top:0" width="224" height="200"><path d="M72 92 C72 120 100 100 104 112" fill="none" stroke="#D9DEEA" stroke-dasharray="3 3"/>
 <path class="tr" d="M72 92 C72 120 100 100 104 112" fill="none" stroke="${PUR}" stroke-width="2" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
 <div class="dt" style="position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:${PUR};box-shadow:0 0 0 4px rgba(99,91,255,.18);opacity:0"></div>`;
 const tr=r.querySelector('.tr'),dt=r.querySelector('.dt'),bl=r.querySelector('.bl'),inn=r.querySelector('.in');
 return t=>{const d=R(t),k=P(t,.8,.9)*d;tr.style.strokeDashoffset=1-k;const pt=tr.getPointAtLength(k*tr.getTotalLength());
  dt.style.opacity=(k>0.02&&k<.98)?1:0;dt.style.transform=`translate(${pt.x}px,${pt.y}px)`;
  const on=t>1.7&&d>.5;bl.textContent=on?'£0.00':'£3,200';bl.style.color=on?SUB:NAVY;inn.style.opacity=P(t,1.7,.3)*d;}});

// 07 Failed -> retried
T.push(r=>{r.innerHTML=`<div style="${card(18,52,188,96)}"><div style="position:absolute;left:14px;top:16px;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">Payment · £86.00</div>
 <div style="position:absolute;left:14px;top:34px;font:300 20px Inter,system-ui,sans-serif;color:${NAVY}">Visa •• 0341</div>
 <div class="c1" style="position:absolute;left:14px;top:66px;padding:4px 8px;border-radius:4px;background:#FFE7EA;font:500 10px Inter,system-ui,sans-serif;color:#DF1B41">Failed</div>
 <div class="c2" style="position:absolute;left:14px;top:66px;padding:4px 8px;border-radius:4px;background:#D7F7E1;font:500 10px Inter,system-ui,sans-serif;color:#0A8A3A;opacity:0;display:flex;gap:4px;align-items:center">${tick('#0A8A3A',9)}Succeeded</div>
 <svg class="rt" style="position:absolute;right:16px;top:26px" width="38" height="38" viewBox="0 0 38 38"><path d="M30 19a11 11 0 1 1-4-8.5" fill="none" stroke="${PUR}" stroke-width="3" stroke-linecap="round"/><path d="M27 4v8h-8" fill="none" stroke="${PUR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
 const c1=r.querySelector('.c1'),c2=r.querySelector('.c2'),rt=r.querySelector('.rt');
 return t=>{const d=R(t),s=P(t,.8,.9);rt.style.transform=`rotate(${s*360*d}deg)`;const o=P(t,1.55,.3)*d;c1.style.opacity=1-o;c2.style.opacity=o;}});

// 08 Link -> shared
T.push(r=>{r.innerHTML=`<div style="${card(16,34,192,50)}"><div style="position:absolute;left:12px;top:9px;font:400 9px Inter,system-ui,sans-serif;color:${SUB}">Payment link</div>
 <div class="lk" style="position:absolute;left:12px;top:23px;font:500 14px Inter,system-ui,sans-serif;color:${NAVY}">pay.link/a8f2</div>
 <div class="cp" style="position:absolute;right:10px;top:12px;width:44px;height:26px;border-radius:5px;background:${PUR};font:500 10px/26px Inter,system-ui,sans-serif;color:#fff;text-align:center">Copy</div></div>
 <div class="bb" style="position:absolute;left:30px;top:108px;width:164px;padding:10px 12px;border-radius:14px 14px 14px 4px;background:#fff;box-shadow:${SH};opacity:0">
 <div style="font:400 11px Inter,system-ui,sans-serif;color:${NAVY}">Here's the link</div><div style="font:500 12px Inter,system-ui,sans-serif;color:${PUR};margin-top:3px">pay.link/a8f2</div></div>`;
 const cp=r.querySelector('.cp'),bb=r.querySelector('.bb');
 return t=>{const d=R(t),pr=P(t,.8,.12)*(1-P(t,.92,.15));cp.style.transform=`scale(${1-.08*pr})`;cp.textContent=t>.95&&d>.5?'Copied':'Copy';
  const b=P(t,1.1,.4)*d;bb.style.opacity=b;bb.style.transform=`translateY(${(1-b)*24}px)`;}});

// 09 Plan -> upgraded
T.push(r=>{r.innerHTML=`${['Starter','Scale'].map((n,i)=>`<div style="${card(22,28+i*72,180,60)}"><div style="position:absolute;left:14px;top:12px;font:500 12px Inter,system-ui,sans-serif;color:${NAVY}">${n}</div>
 <div style="position:absolute;left:14px;top:32px;font:400 10px Inter,system-ui,sans-serif;color:${SUB}">${['£19 / month','£79 / month'][i]}</div></div>`).join('')}
 <div class="rg" style="position:absolute;left:20px;top:26px;width:184px;height:64px;border-radius:8px;border:2px solid ${PUR};box-sizing:border-box"></div>
 <div class="up" style="position:absolute;right:30px;top:118px;padding:4px 8px;border-radius:4px;background:#D7F7E1;font:500 10px Inter,system-ui,sans-serif;color:#0A8A3A;display:flex;gap:4px;align-items:center;opacity:0">${tick('#0A8A3A',9)}Upgraded</div>`;
 const rg=r.querySelector('.rg'),up=r.querySelector('.up');
 return t=>{const d=R(t),s=P(t,.8,.35)*d;rg.style.transform=`translateY(${s*72}px)`;up.style.opacity=P(t,1.2,.3)*d;}});

// 10 Cart -> order
T.push(r=>{r.innerHTML=`<div class="bk" style="${card(42,92,140,84)}"><div class="o1" style="position:absolute;left:14px;top:14px;font:400 10px Inter,system-ui,sans-serif;color:${SUB}">Basket</div>
 <div class="o2" style="position:absolute;left:14px;top:12px;opacity:0"><div style="font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">Order confirmed</div><div style="font:300 22px Inter,system-ui,sans-serif;color:${NAVY};margin-top:4px">#2190</div></div></div>
 ${[0,1,2].map(i=>`<div class="it it${i}" style="position:absolute;left:${62+i*36}px;top:0;width:28px;height:28px;border-radius:6px;background:${['#635BFF','#FF6118','#EE30FB'][i]};opacity:.92"></div>`).join('')}`;
 const it=[...r.querySelectorAll('.it')],o1=r.querySelector('.o1'),o2=r.querySelector('.o2');
 return t=>{const d=R(t);it.forEach((e,i)=>{const k=P(t,.7+i*.25,.35);const m=P(t,1.75,.3);e.style.transform=`translateY(${mix(14,140,k)}px) scale(${1-m*.6})`;e.style.opacity=(k>0?1:.0)*(1-m)*d+(1-d)*0;if(t<.7+i*.25)e.style.opacity=0;});
  const m=P(t,1.85,.3)*d;o1.style.opacity=1-m;o2.style.opacity=m;}});

// 11 Refund -> done
T.push(r=>{r.innerHTML=`<div style="${card(20,46,184,108)}"><div style="position:absolute;left:14px;top:14px;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">Charge · ch_3Q8a</div>
 <div class="am" style="position:absolute;left:13px;top:30px;font:300 30px/1 Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}">£120.00</div>
 <div class="rb" style="position:absolute;left:14px;top:72px;width:72px;height:24px;border-radius:5px;border:1px solid #D9DEEA;font:500 10px/22px Inter,system-ui,sans-serif;color:${NAVY};text-align:center;box-sizing:border-box">Refund</div>
 <div class="rd" style="position:absolute;left:96px;top:72px;height:24px;padding:0 8px;border-radius:4px;background:#D7F7E1;font:500 10px/24px Inter,system-ui,sans-serif;color:#0A8A3A;display:flex;gap:4px;align-items:center;opacity:0">${tick('#0A8A3A',9)}Refunded</div></div>`;
 const am=r.querySelector('.am'),rb=r.querySelector('.rb'),rd=r.querySelector('.rd');
 return t=>{const d=R(t),pr=P(t,.8,.12)*(1-P(t,.92,.15));rb.style.transform=`scale(${1-.06*pr})`;const k=P(t,1.0,.4)*d;
  am.style.color=k>.5?SUB:NAVY;am.style.textDecoration=k>.5?'line-through':'none';am.style.transform=`translateX(${-k*4}px)`;rd.style.opacity=P(t,1.3,.3)*d;}});

// 12 Fraud -> blocked
T.push(r=>{let dots='';for(let y=0;y<9;y++)for(let x=0;x<18;x++){const cx=x-8.5,cy=y-4;if((cx*cx)/80+(cy*cy)/18<1&&((x*7+y*3)%5))dots+=`<circle cx="${18+x*11}" cy="${40+y*11}" r="1.8" fill="#C9D2E3"/>`}
 r.innerHTML=`<svg style="position:absolute;left:0;top:0" width="224" height="200">${dots}</svg>
 <div class="mk" style="position:absolute;left:134px;top:76px;width:12px;height:12px;border-radius:50%;background:#DF1B41;box-shadow:0 0 0 5px rgba(223,27,65,.18)"></div>
 <div class="sh" style="position:absolute;left:118px;top:52px;width:44px;height:50px;opacity:0"><svg viewBox="0 0 24 28" width="44" height="50"><path d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z" fill="${PUR}"/><path d="M7.5 13.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
 <div class="bl" style="position:absolute;left:62px;top:148px;width:100px;height:28px;border-radius:5px;background:#fff;box-shadow:${SH};font:500 12px/28px Inter,system-ui,sans-serif;color:${NAVY};text-align:center;opacity:0">Blocked</div>`;
 const sh=r.querySelector('.sh'),bl=r.querySelector('.bl'),mk=r.querySelector('.mk');
 return t=>{const d=R(t),s=P(t,.9,.4)*d;sh.style.opacity=s;sh.style.transform=`translateY(${(1-s)*-16}px) scale(${.7+.3*s})`;mk.style.opacity=1-.7*s;
  const b=P(t,1.3,.3)*d;bl.style.opacity=b;bl.style.transform=`translateY(${(1-b)*8}px)`;}});

// 13 Tax -> added
T.push(r=>{r.innerHTML=`<div style="${card(38,20,148,160)}"><div style="position:absolute;left:14px;top:14px;font:500 11px Inter,system-ui,sans-serif;color:${NAVY}">Receipt</div>
 <div style="position:absolute;left:14px;right:14px;top:38px;display:flex;justify-content:space-between;font:400 10px Inter,system-ui,sans-serif;color:${SUB}"><span>Subtotal</span><span>£100</span></div>
 <div class="vt" style="position:absolute;left:14px;right:14px;top:56px;display:flex;justify-content:space-between;font:400 10px Inter,system-ui,sans-serif;color:${PUR};opacity:0"><span>VAT 20%</span><span>£20</span></div>
 <div style="position:absolute;left:14px;right:14px;top:78px;height:1px;background:#E3E8EE"></div>
 <div style="position:absolute;left:14px;top:88px;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">Total</div>
 <div style="position:absolute;left:13px;top:104px;height:40px;overflow:hidden;width:120px"><div class="tt" style="font:300 34px/40px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}"><div>£100</div><div>£120</div></div></div></div>`;
 const vt=r.querySelector('.vt'),tt=r.querySelector('.tt');
 return t=>{const d=R(t),v=P(t,.8,.3)*d;vt.style.opacity=v;vt.style.transform=`translateX(${(1-v)*-14}px)`;tt.style.transform=`translateY(${-P(t,1.1,.4)*d*40}px)`;}});

// 14 Signup -> active
T.push(r=>{const av=['#635BFF','#FF6118','#EE30FB','#0A8A3A','#7232F1'];r.innerHTML=`<div style="${card(22,30,180,140)}"><div style="position:absolute;left:14px;top:14px;font:400 9.5px Inter,system-ui,sans-serif;color:${SUB}">Active subscribers</div>
 <div style="position:absolute;left:13px;top:30px;height:40px;overflow:hidden;width:150px"><div class="nn" style="font:300 34px/40px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY}"><div>1,204</div><div>1,205</div></div></div>
 <div class="p1" style="position:absolute;left:120px;top:38px;padding:3px 6px;border-radius:4px;background:#EEEBFF;font:500 10px Inter,system-ui,sans-serif;color:${PUR};opacity:0">+1</div>
 ${av.map((c,i)=>`<div class="${i==4?'nw':''}" style="position:absolute;left:${14+i*24}px;top:92px;width:30px;height:30px;border-radius:50%;background:${c};border:2.5px solid #fff;box-sizing:border-box;opacity:${i==4?0:1}"></div>`).join('')}</div>`;
 const nw=r.querySelector('.nw'),nn=r.querySelector('.nn'),p1=r.querySelector('.p1');
 return t=>{const d=R(t),k=P(t,.8,.35)*d;nw.style.opacity=k;nw.style.transform=`scale(${.4+.6*k})`;nn.style.transform=`translateY(${-P(t,1.0,.4)*d*40}px)`;p1.style.opacity=P(t,1.15,.3)*d;}});

// 15 Currency -> converted
T.push(r=>{r.innerHTML=`<div style="${card(26,26,172,148)}">
 <div style="position:absolute;left:14px;top:14px;display:flex;align-items:center;gap:6px;font:500 10px Inter,system-ui,sans-serif;color:${NAVY}">
 <span style="padding:3px 6px;border-radius:4px;background:#F0F3F8">USD</span>
 <svg width="22" height="8" viewBox="0 0 22 8"><path class="ar" d="M1 4h18m-4-3l4 3-4 3" fill="none" stroke="${PUR}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
 <span class="gb" style="padding:3px 6px;border-radius:4px;background:#F0F3F8">GBP</span></div>
 <div style="position:absolute;left:14px;top:46px;width:144px;height:80px;perspective:300px">
 <div class="fa" style="position:absolute;inset:0;border-radius:6px;background:${SURF};font:300 46px/80px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY};text-align:center;backface-visibility:hidden">$100</div>
 <div class="fb" style="position:absolute;inset:0;border-radius:6px;background:${SURF};font:300 46px/80px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY};text-align:center;backface-visibility:hidden;transform:rotateX(180deg)">£79</div></div></div>`;
 const fa=r.querySelector('.fa'),fb=r.querySelector('.fb'),ar=r.querySelector('.ar'),gb=r.querySelector('.gb');
 return t=>{const d=R(t),f=P(t,.9,.5)*d;fa.style.transform=`rotateX(${f*180}deg)`;fb.style.transform=`rotateX(${180+f*180}deg)`;ar.style.strokeDashoffset=1-P(t,.7,.3)*d;
  gb.style.background=f>.5?'#EEEBFF':'#F0F3F8';gb.style.color=f>.5?PUR:NAVY;}});

// 16 Dashboard -> live
T.push(r=>{const nm=['Volume','Customers','Success'],vv=['£48.2k','1,205','99.2%'];r.innerHTML=`<div style="${card(16,26,192,148)}"><div style="position:absolute;left:12px;top:12px;font:500 11px Inter,system-ui,sans-serif;color:${NAVY}">Dashboard</div>
 <div class="lv" style="position:absolute;right:12px;top:11px;display:flex;align-items:center;gap:5px;font:500 9.5px Inter,system-ui,sans-serif;color:#0A8A3A;opacity:0"><i class="pu" style="width:7px;height:7px;border-radius:50%;background:${GRN};display:block"></i>Live</div>
 ${nm.map((n,i)=>`<div class="tl" style="position:absolute;left:${12+i*58}px;top:40px;width:52px;height:94px;border-radius:5px;background:${SURF};border:1px solid #EDF0F5;box-sizing:border-box">
 <div style="position:absolute;left:7px;top:9px;font:400 8px Inter,system-ui,sans-serif;color:${SUB}">${n}</div>
 <div class="tv" style="position:absolute;left:6px;top:26px;font:400 13px Inter,system-ui,sans-serif;letter-spacing:-.02em;color:${NAVY};opacity:.25">${vv[i]}</div>
 <svg style="position:absolute;left:6px;bottom:8px" width="40" height="30"><rect class="bar" x="0" y="0" width="40" height="30" rx="2" fill="${PUR}" opacity=".12" transform="scale(1 0)" transform-origin="0 30"/></svg></div>`).join('')}</div>`;
 const tl=[...r.querySelectorAll('.tl')],tv=[...r.querySelectorAll('.tv')],bars=[...r.querySelectorAll('.bar')],lv=r.querySelector('.lv'),pu=r.querySelector('.pu');
 return t=>{const d=R(t);tl.forEach((e,i)=>{const k=P(t,.8+i*.3,.35)*d;e.style.background=k>.01?'#fff':SURF;e.style.boxShadow=k>.01?`0 6px 12px -8px rgba(50,50,93,${.35*k})`:'none';
  tv[i].style.opacity=.25+.75*k;bars[i].setAttribute('transform',`scale(1 ${k*[.6,.85,1][i]})`);bars[i].setAttribute('opacity',.12+.5*k);});
  const l=P(t,1.9,.3)*d;lv.style.opacity=l;pu.style.boxShadow=`0 0 0 ${3+3*((t*1.4)%1)}px rgba(0,217,36,${.25*(1-((t*1.4)%1))*l})`;}});

// mount into each .tile, with the soft Stripe gradient shape behind
const seeks=[],locals=[];
document.querySelectorAll('.tile').forEach((el,i)=>{
 const wrap=document.createElement('div');wrap.className='tile';wrap.style.cssText=el.style.cssText;
 css(wrap,{background:'#fff',overflow:'hidden'});
 const blob=document.createElement('div');css(blob,{position:'absolute',width:'170px',height:'120px',borderRadius:'50%',background:GRAD,filter:'blur(30px)',opacity:'.22',left:'60px',top:'40px'});
 const root=document.createElement('div');css(root,{position:'absolute',inset:'0',fontFeatureSettings:'"ss01" on',fontFamily:'"Inter,system-ui,sans-serif","SF Pro Display",sans-serif'});
 wrap.appendChild(blob);wrap.appendChild(root);el.replaceWith(wrap);
 const f=((window.T2&&window.T2[i])||T[i])(root),off=0;locals.push(f);
 seeks.push(t=>{const lt=((t+6-off)%6);blob.style.transform=`translate(${Math.sin(t*Math.PI/3+i)*10}px,${Math.cos(t*Math.PI/3+i*1.3)*8}px)`;f(lt);});
});
window.seekTiles=t=>seeks.forEach(s=>s(t));
window.seekAllLocal=lt=>locals.forEach(f=>f(lt));
window.seekEachLocal=a=>locals.forEach((f,i)=>f(a[i]));
const old=window.setT;window.setT=ms=>{old&&old(ms);window.seekTiles(ms/1000)};
window.seekTiles(0);
})();
