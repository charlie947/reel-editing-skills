// v5 tiles (15/10/2026): premium push after Charlie compared v4 to Monday's Apple grid.
// Replaces 04 (decode -> globe), 07 (flat dots -> 3D wave surface), 11 (blur blob -> glossy liquid), wraps 05 in a glass widget.
(function(){
const T2=window.T2;
const NAVY='#0A2540',SUB='#425466';
const STOPS=['#FFD601','#FF6118','#EE30FB','#FB76FA','#7232F1'];
const F="Inter,system-ui,sans-serif,'SF Pro Display',sans-serif";
const cl=x=>Math.max(0,Math.min(1,x));
const IO=(t,a,d)=>{const x=cl((t-a)/d);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
const TAU=Math.PI*2;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const grad=u=>{u=cl(u)*(STOPS.length-1);const i=Math.min(STOPS.length-2,Math.floor(u)),f=u-i,a=hex(STOPS[i]),b=hex(STOPS[i+1]);return a.map((v,j)=>Math.round(v+(b[j]-v)*f))};
const rgb=(c,a=1)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
const cv=r=>{const c=document.createElement('canvas');c.width=448;c.height=400;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');x.scale(2,2);return x};

// 04 Globe -> arcs : a dotted globe turns once per loop while payment arcs fly between cities
T2[3]=r=>{r.style.background='radial-gradient(100% 90% at 50% 40%,#1B3A66,#0A2540 70%)';const x=cv(r);
 const N=4200,pts=[];const land=(la,lo)=>Math.sin(2.1*la+.6)*Math.cos(1.7*lo)+.75*Math.sin(3.3*lo+1.1*la)+.45*Math.cos(4.7*la-2.3*lo)>.42;
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,rr=Math.sqrt(1-y*y),th=i*2.399963;const la=Math.asin(y),lo=th%TAU;if(land(la,lo))pts.push([rr*Math.cos(th),y,rr*Math.sin(th)])}
 const ll=(la,lo)=>[Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo)];
 const C=[[.9,.1],[.6,1.9],[-.4,1.2],[.2,3.4],[-.6,4.4],[.75,5.3]].map(([a,b])=>ll(a,b));
 const A=[[0,1,0],[1,3,.5],[2,4,1.0],[3,5,1.5],[5,0,2.0],[4,2,2.5]];
 const R=74,CX=112,CY=100,TI=-.38;
 const prj=(p,rot)=>{const c=Math.cos(rot),s=Math.sin(rot);let X=p[0]*c+p[2]*s,Z=-p[0]*s+p[2]*c,Y=p[1];const ct=Math.cos(TI),st=Math.sin(TI);const Y2=Y*ct-Z*st,Z2=Y*st+Z*ct;return[CX+X*R,CY-Y2*R,Z2]};
 const slerp=(a,b,u)=>{const d=Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])));const s=Math.sin(d)||1;const k1=Math.sin((1-u)*d)/s,k2=Math.sin(u*d)/s;const h=1+.16*Math.sin(Math.PI*u);return[0,1,2].map(j=>(a[j]*k1+b[j]*k2)*h)};
 return t=>{x.clearRect(0,0,224,200);const rot=t*TAU/6;
  const g=x.createRadialGradient(CX-20,CY-24,8,CX,CY,R+18);g.addColorStop(0,'rgba(99,91,255,.28)');g.addColorStop(.8,'rgba(99,91,255,.06)');g.addColorStop(1,'rgba(99,91,255,0)');x.fillStyle=g;x.beginPath();x.arc(CX,CY,R+18,0,7);x.fill();const bd=x.createRadialGradient(CX-26,CY-30,6,CX,CY,R);bd.addColorStop(0,'rgba(60,90,160,.55)');bd.addColorStop(1,'rgba(14,40,80,.35)');x.fillStyle=bd;x.beginPath();x.arc(CX,CY,R,0,7);x.fill();x.strokeStyle='rgba(160,170,255,.35)';x.lineWidth=1;x.beginPath();x.arc(CX,CY,R,0,7);x.stroke();
  for(const p of pts){const [px,py,z]=prj(p,rot);if(z<-.05){x.fillStyle='rgba(150,170,230,.16)';x.fillRect(px-.5,py-.5,1,1);continue}
   const c=grad(.15+.7*(py-CY+R)/(2*R));x.fillStyle=rgb(c.map(v=>Math.round(v*.55+235*.45)),.45+.55*z);x.beginPath();x.arc(px,py,.75+.55*z,0,7);x.fill()}
  x.lineCap='round';
  A.forEach(([a,b,st])=>{for(const off of [0,3]){const lt=((t-st-off)%6+6)%6;if(lt>2.4)continue;const head=IO(lt,0,1.2),tail=IO(lt,.7,1.4);
   const seg=[];for(let k=0;k<=40;k++){const u=tail+(head-tail)*k/40;seg.push(prj(slerp(C[a],C[b],u),rot))}
   if(head-tail<.01)continue;x.lineWidth=2.2;x.shadowColor='#EE30FB';x.shadowBlur=6;for(let k=1;k<seg.length;k++){const z=Math.min(seg[k][2],seg[k-1][2]);if(z<-.15)continue;const cc=grad(.35+.5*k/40);x.strokeStyle=rgb(cc,.95*cl(z+.6));x.beginPath();x.moveTo(seg[k-1][0],seg[k-1][1]);x.lineTo(seg[k][0],seg[k][1]);x.stroke()}x.shadowBlur=0;
   const hp=seg[seg.length-1];if(hp[2]>-.1&&head<.999){x.fillStyle='#fff';x.shadowColor='#EE30FB';x.shadowBlur=10;x.beginPath();x.arc(hp[0],hp[1],2.4,0,7);x.fill();x.shadowBlur=0}
   if(head>.98&&lt<2.4){const e=prj(C[b],rot);if(e[2]>0){const k=cl((lt-1.2)/1.2);x.strokeStyle=`rgba(251,118,250,${.8*(1-k)})`;x.lineWidth=1.4;x.beginPath();x.arc(e[0],e[1],3+12*k,0,7);x.stroke()}}}});
  C.forEach(c=>{const p=prj(c,rot);if(p[2]>0){x.fillStyle=`rgba(255,255,255,${.5+.5*p[2]})`;x.beginPath();x.arc(p[0],p[1],2,0,7);x.fill()}});}};

// 07 Grid -> wave : a 3D surface of dots rolls like a sea, colour follows height
T2[6]=r=>{r.style.background='linear-gradient(175deg,#FFFFFF,#EFEDFA)';const x=cv(r);
 const NX=24,NZ=16;
 return t=>{x.clearRect(0,0,224,200);const w=t*TAU/6;
  for(let iz=0;iz<NZ;iz++){const z=iz/(NZ-1),sc=.45+.75*z;for(let ix=0;ix<NX;ix++){const u=ix/(NX-1)*2-1;
   const h=.55*Math.sin(3.2*u+2*z*3-w*2)+.35*Math.sin(2.4*z*4+u*1.5+w)+.2*Math.cos(5*u-w*3+z*2);
   const px=112+u*118*sc,py=36+z*128-h*20*sc;const c=grad(cl(.5+.45*h));const m=cl(.25+.6*(h+1)/2);
   x.fillStyle=rgb(c.map(v=>Math.round(205+(v-205)*m)),.55+.45*z);x.beginPath();x.arc(px,py,(.7+1.5*sc)*(.8+.35*(h+1)/2),0,7);x.fill()}}}};

// 11 Liquid -> merge : glossy liquid metal, lit from top left, drops merge and split
T2[10]=r=>{r.style.background='radial-gradient(100% 90% at 50% 35%,#FFFFFF,#EEEBFA)';
 r.insertAdjacentHTML('beforeend','<div class="z-sd" style="position:absolute;left:52px;top:164px;width:120px;height:16px;border-radius:50%;background:rgba(50,50,93,.22);filter:blur(7px)"></div>');
 const c=document.createElement('canvas');c.width=224;c.height=200;c.style.cssText='position:absolute;left:0;top:0;width:224px;height:200px';r.appendChild(c);const x=c.getContext('2d');const img=x.createImageData(224,200);const sd=r.querySelector('.z-sd');
 const B=[[112,96,30,48,26,1,0],[112,96,24,54,32,-1,1.7],[112,96,20,36,40,2,3.1],[112,96,16,60,20,-2,4.4]];
 const LS=['#7232F1','#9B4BFF','#EE30FB','#FB76FA'].map(hex);const lut=[...Array(256)].map((_,i)=>{const u=i/255*3,j=Math.min(2,Math.floor(u)),f=u-j;return LS[j].map((v,k)=>Math.round(v+(LS[j+1][k]-v)*f))});const L=[-.45,-.6,.66],Hh=(()=>{const h=[L[0],L[1],L[2]+1],n=Math.hypot(...h);return h.map(v=>v/n)})();
 return t=>{const pull=.3+.7*(.5+.5*Math.cos(t*TAU/6));const bs=B.map(([cx,cy,rr,ax,ay,n,ph])=>[cx+ax*pull*Math.cos(t*TAU/6*n+ph),cy+ay*pull*Math.sin(t*TAU/6*n+ph),rr*rr]);
  const d=img.data;for(let yy=0;yy<200;yy++)for(let xx=0;xx<224;xx++){let f=0,gx=0,gy=0;for(const [bx,by,r2] of bs){const dx=xx-bx,dy=yy-by,q=dx*dx+dy*dy+1;f+=r2/q;const k=2*r2/(q*q);gx-=k*dx;gy-=k*dy}
   const i=(yy*224+xx)*4;const a=cl((f-.95)/.12);if(a<=0){d[i+3]=0;continue}
   const dh=1.6*Math.exp(-(f-.95)*1.6)*38;let nx=gx*dh,ny=gy*dh;let nz=1;const nn=Math.hypot(nx,ny,nz);nx/=nn;ny/=nn;nz/=nn;nx=-nx;ny=-ny;
   const dif=cl(nx*L[0]+ny*L[1]+nz*L[2]),spec=Math.pow(cl(nx*Hh[0]+ny*Hh[1]+nz*Hh[2]),38),rim=Math.pow(1-nz,2.5);
   const col=lut[Math.round(cl((xx*.55+yy*.45-40)/190)*255)];const sh=.62+.45*dif;
   d[i]=Math.min(255,col[0]*sh+255*(spec*.95+rim*.15));d[i+1]=Math.min(255,col[1]*sh+255*(spec*.95+rim*.15));d[i+2]=Math.min(255,col[2]*sh+255*(spec*.95+rim*.2));d[i+3]=a*255}
  x.putImageData(img,0,0);sd.style.transform=`scaleX(${.75+.35*pull})`;}};

// 05 Line -> draw : same drawing line, now inside a frosted revenue widget with a live figure
const L5=T2[4];T2[4]=r=>{const f=L5(r);
 r.insertAdjacentHTML('afterbegin',`<div style="position:absolute;left:10px;top:10px;right:10px;bottom:10px;border-radius:14px;background:rgba(255,255,255,.92);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 14px 28px -14px rgba(50,50,93,.35),0 0 0 1px rgba(50,50,93,.06)"></div>`);
 r.insertAdjacentHTML('beforeend',`<div style="position:absolute;left:22px;top:22px;font:400 10px ${F};color:${SUB}">Monthly revenue</div><div class="z-v" style="position:absolute;left:22px;top:36px;font:500 22px/1 ${F};letter-spacing:-.03em;color:${NAVY};font-feature-settings:'tnum' on">£0</div>`);
 const v=r.querySelector('.z-v');
 return t=>{f(t);const k=IO(t,.2,1.7)*(1-IO(t,4.9,.8));v.textContent='£'+Math.round(48240*k).toLocaleString('en-GB');}};
})();
