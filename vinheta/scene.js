const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const ss=(a,b,t)=>{t=clamp((t-a)/(b-a));return t*t*(3-2*t);};
const eo=t=>1-Math.pow(1-clamp(t),3), ei=t=>Math.pow(clamp(t),3);
const eio=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const back=t=>{t=clamp(t);const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};

// ---------- layout ----------
const S=3.6, LW=286*S, L=(1920-LW)/2, Y0=318;
const TX=L+74*S, TB=Y0+45*S, TS=34*S/1000;
const fx=(x,y)=>[TX+x*TS, TB+y*TS];
const FINAL={x:L+11.04*S,y:Y0+49.59*S,a:-40,k:.95*S}; /* ponta da stylus do logo novo (3.2,32) após rotate(-40) scale(.95) */

// ---------- background grid ----------
(function(){const g=$('grid');const defs=document.querySelector('defs');
 const rg=el('radialGradient',{id:'gm',cx:'50%',cy:'42%',r:'55%'},defs);el('stop',{offset:'0','stop-color':'#fff','stop-opacity':'1'},rg);el('stop',{offset:'.6','stop-color':'#fff','stop-opacity':'.35'},rg);el('stop',{offset:'1','stop-color':'#fff','stop-opacity':'0'},rg);
 const m=el('mask',{id:'gmask'},defs);el('rect',{width:1920,height:1080,fill:'url(#gm)'},m);g.setAttribute('mask','url(#gmask)');
 let d='';for(let x=-20;x<1920;x+=56)d+=`M${x} 0V1080`;for(let y=8;y<1080;y+=56)d+=`M0 ${y}H1920`;
 el('path',{d,stroke:'#9B6BFF','stroke-opacity':'.09','stroke-width':1.2,fill:'none'},g);})();

// ---------- glyphs ----------
const glyphG=$('glyphs');glyphG.setAttribute('transform',`translate(${TX} ${TB}) scale(${TS})`);
GLYPHS.glyphs.forEach(g=>el('path',{d:g.d},glyphG));
// centerline strokes (font units), in writing order
/* VFXSTUDIO em Montserrat (VFX 800, STUDIO 500), como no logo horizontal; centerlines em unidades da fonte, na ordem da escrita */
const STROKES=[
 'M20,-700 L383,0 L746,-700',
 'M916,-700 L916,0', 'M916,-625 L1385,-625', 'M916,-335 L1340,-335',
 'M1430,-700 L2125,0', 'M2125,-700 L1430,0',
 'M2680,-600 C2630,-650 2560,-660 2460,-660 C2320,-660 2240,-600 2240,-520 C2240,-430 2320,-395 2460,-365 C2600,-335 2680,-290 2680,-195 C2680,-90 2590,-38 2450,-38 C2340,-38 2250,-75 2205,-120',
 'M2775,-655 L3345,-655', 'M3059,-655 L3059,0',
 'M3497,-700 L3497,-290 C3497,-110 3580,-38 3748,-38 C3916,-38 3999,-110 3999,-290 L3999,-700',
 'M4294,-700 L4294,0', 'M4294,-655 L4530,-655 C4760,-655 4877,-520 4877,-350 C4877,-180 4760,-45 4530,-45 L4294,-45',
 'M5125,-700 L5125,0',
 'M5700,-659 C5520,-659 5373,-520 5373,-350 C5373,-180 5520,-41 5700,-41 C5880,-41 6027,-180 6027,-350 C6027,-520 5880,-659 5700,-659',
];
const mG=$('mstrokes');mG.setAttribute('transform',`translate(${TX} ${TB}) scale(${TS})`);
const SEG=[];let tot=0;
STROKES.forEach((d,i)=>{const p=el('path',{d},mG);const len=p.getTotalLength();p.style.strokeDasharray=`${len+1} ${len+400}`;
 if(i>0){const a=SEG[SEG.length-1].end, b=p.getPointAtLength(0);const ul=Math.hypot(b.x-a.x,b.y-a.y)*.55;SEG.push({up:true,a,b,len:ul,start:tot});tot+=ul;}
 SEG.push({p,len:len,start:tot,end:p.getPointAtLength(len)});tot+=len;});
const TOT=tot;
function writeState(u){ // u 0..1 -> tip pos font units, sets mask
 const d=u*TOT;let pos=null,lift=0;
 for(const s of SEG){const local=clamp(d-s.start,0,s.len);
  if(s.up){if(d>=s.start&&d<=s.start+s.len){const t=local/s.len;pos={x:lerp(s.a.x,s.b.x,eio(t)),y:lerp(s.a.y,s.b.y,eio(t))};lift=Math.sin(Math.PI*t);}}
  else{s.p.style.strokeDashoffset=(s.len+1)-local; if(d>=s.start&&d<=s.start+s.len) pos=s.p.getPointAtLength(local);}
 }
 if(!pos){pos=d<=0?SEG[0].p.getPointAtLength(0):SEG[SEG.length-1].end;}
 const down=d>0&&d<TOT&&lift===0;
 return {x:pos.x,y:pos.y,lift,down};
}

// ---------- pen ----------
const GIZ='#ECEAE4',AMB='#E0A84E',DARK='#15131c';
const pen=$('pen');
/* stylus do logo vfxstudio (ponta em 3.2,32) */
const penBody=el('g',{fill:DARK,stroke:GIZ,'stroke-width':2.2,'stroke-linejoin':'round','stroke-linecap':'round'},pen);
el('path',{d:'M8 31.3 L18 28.1 Q26 27.5 34 28.1 L56 28.6 Q60.6 28.8 60.6 32 Q60.6 35.2 56 35.4 L34 35.9 Q26 36.5 18 35.9 L8 32.7 Z'},penBody);
el('path',{d:'M18 28.4 V35.6 M34 28.4 V35.6 M47 28.8 V35.2',fill:'none','stroke-width':1,opacity:.55},penBody);
el('path',{d:'M11 32 H58',fill:'none','stroke-width':.9,opacity:.45},penBody);
el('rect',{x:21.6,y:29.2,width:4,height:1.6,rx:.8,'stroke-width':1},penBody);el('rect',{x:27,y:29.2,width:4,height:1.6,rx:.8,'stroke-width':1},penBody);
const tipG=el('g',{},pen);
const tip=el('path',{d:'M3.2 32 L8 31.3 L8 32.7 Z',fill:'#8B8E96',stroke:'#8B8E96','stroke-width':1.5,'stroke-linejoin':'round'},tipG);
const litG=el('g',{filter:'url(#glow)',opacity:0},pen);
el('path',{d:'M3.2 32 L8 31.3 L8 32.7 Z',fill:AMB,stroke:AMB,'stroke-width':1.5,'stroke-linejoin':'round'},litG);
const rays=el('g',{stroke:AMB,'stroke-width':2.6,'stroke-linecap':'round',fill:'none'},litG);
const rayEls=[['M-0.6 32 H-4'],['M0.8 27.2 L-1.8 24.4'],['M0.8 36.8 L-1.8 39.6']].map(r=>el('path',{d:r[0]},rays));

// ---------- hand (pen-local units; tip at 8,32, pen axis +x) ----------
const HS={fill:DARK,stroke:GIZ,'stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'};
const hb=$('handBack'), hf=$('handFront');
const palm=el('path',Object.assign({d:'M23 38 C21 29 33 21 48 24 C59 26 67 35 69 48 L76 92 L39 99 L35 72 C27 63 24 51 23 38 Z'},HS),hb);
const sleeve=el('path',Object.assign({},HS,{d:'M37 90 L76 84 L150 640 L98 650 Z',fill:'#3B2A52'}),hb);
el('path',{d:'M36 90 L77 83 L80 102 L39 109 Z',fill:DARK,stroke:GIZ,'stroke-width':3,'stroke-linejoin':'round'},hb);
el('path',{d:'M62 34 C58 42 52 48 44 52',fill:'none',stroke:GIZ,'stroke-width':2,opacity:.45,'stroke-linecap':'round'},hb);
const indexF=el('path',Object.assign({d:'M52 27 C42 20 30 20 21 24 C16 26 16 31 21 31.5 C30 32 40 32 49 37 Z'},HS),hf);
const thumbF=el('path',Object.assign({d:'M44 58 C37 51 29 44 22.5 39 C18.5 36 15.5 41 19.5 44 C26 49 31 56 36 64 Z'},HS),hf);

function penTransform(p){return `translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.k}) translate(-3.2 -32)`;}

// ---------- timeline ----------
const T={appear:[0.0,.32],write:[.32,1.12],ret:[1.12,1.42],lit:1.45,iris:[1.72,2.25]};
window.TRANSITION=false;
window.LESSON={code:'',title:''};
function setLesson(code,title){$('lcode').textContent=code;$('ltitle').textContent=title;window.LESSON={code,title};}
window.setLesson=setLesson;
window.setTransition=v=>{window.TRANSITION=!!v;};
window.setBg=v=>{$('bg').style.display=v?'':'none';const b=document.getElementById('bgLayer');if(b)b.style.display=v?'':'none';const fh=document.getElementById('fluidHost');if(fh)fh.querySelector('canvas').style.mixBlendMode=v?'screen':'normal';};

const start=(()=>{const p=SEG[0].p.getPointAtLength(0);const [x,y]=fx(p.x,p.y);return {x,y};})();
const XH=700*TS, WX0=TX-30, WX1=TX+GLYPHS.adv*TS+40, WY=TB-XH*0.55;
function sweepPos(u){const x=lerp(WX0,WX1,u);const y=WY+Math.sin(u*Math.PI*2.5)*XH*0.28*(1-u*0.3);return {x,y};}
let WIPE=0;
function poseAt(t){
 const u=eio(clamp((t-T.write[0])/(T.write[1]-T.write[0])));
 const sp=sweepPos(u); const sp2=sweepPos(Math.min(1,u+0.01));
 const tilt=Math.atan2(sp2.y-sp.y,sp2.x-sp.x)*180/Math.PI*0.25;
 const w={u};
 let pose=Object.assign({},FINAL);
 if(t<T.write[0]){const s0=sweepPos(0);const c=(t-T.appear[0])/(T.appear[1]-T.appear[0]);
   pose={x:s0.x,y:s0.y-(1-eo(c))*50,a:-45-(1-eo(c))*70,k:FINAL.k*Math.max(0.0001,back(c))};}
 else if(t<T.write[1]) pose={x:sp.x,y:sp.y,a:-45+tilt,k:FINAL.k};
 else if(t<T.ret[1]){const c=eio((t-T.ret[0])/(T.ret[1]-T.ret[0]));const e=sweepPos(1);
   pose={x:lerp(e.x,FINAL.x,c),y:lerp(e.y,FINAL.y,c),a:-45,k:FINAL.k};}
 if(t>=T.ret[1]){const b=(t-T.ret[1]);pose.k=FINAL.k*(1+Math.exp(-b*30)*Math.sin(b*60)*.03);}
 return {pose,w};
}

let fLast=-1, fTip=null, GL=null;
function drawGlow(){
 const host=document.getElementById('fluidHost'); const src=host&&host.querySelector('canvas.fx-fluid'); if(!src) return;
 if(!GL){GL=[['g1',8,.6],['g2',28,.45]].map(([id,b,o])=>{const c=document.createElement('canvas');c.width=960;c.height=540;c.id=id;c.className='glow';c.style.cssText=`position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:screen;opacity:${o};pointer-events:none`;host.insertBefore(c,src);return {c,b,x:c.getContext('2d')};});}
 for(const g of GL){g.x.clearRect(0,0,960,540);g.x.filter=`blur(${g.b}px)`;g.x.globalCompositeOperation='lighter';g.x.drawImage(src,0,0,960,540);}
}
const FCOL=[[255,181,71],[155,107,255],[236,234,228],[255,181,71],[92,200,255],[236,234,228]];
function fcol(i,k){const c=FCOL[i%FCOL.length];const s=0.085/255*k;return {r:c[0]*s,g:c[1]*s,b:c[2]*s};}
function fluidTo(t){
 if(!window.FLUID) return;
 if(t<fLast||fLast<0){FLUID.config.SUNRAYS=false;FLUID.config.BLOOM_INTENSITY=0.12;FLUID.config.DENSITY_DISSIPATION=1.0;FLUID.reset(7);fLast=0;fTip=null;}
 const H=1/120; let n=0;
 while(fLast+H<=t+1e-6){
  const tt=fLast+H; const p=poseAt(tt).pose;
  const moving=tt>=T.appear[0]+0.04 && tt<=T.ret[1];
  if(moving&&fTip){const dx=p.x-fTip.x, dy=p.y-fTip.y;
    const ddx=dx/1920, ddy=-(dy/1080)/(16/9);
    const k=Math.max(0.35,Math.min(1,Math.hypot(ddx,ddy)*45))*1.15;
    FLUID.splat(p.x/1920,1-p.y/1080,ddx*5000,ddy*5000,fcol(Math.floor(tt*6),k));}
  if(Math.abs(tt-T.lit)<H/2){for(let i=0;i<6;i++){const a=i/6*Math.PI*2+0.4;FLUID.splat(FINAL.x/1920,1-FINAL.y/1080,Math.cos(a)*320,Math.sin(a)*320,fcol(i%2?2:0,1.8));}}
  fTip={x:p.x,y:p.y}; FLUID.advance(H); fLast=tt; n++;
 }
 FLUID.draw();
 drawGlow();
}
const wipeRect=el('rect',{y:0,height:1080,x:0,fill:'url(#wipeG)'},document.getElementById('wmask'));
(function(){const g=el('linearGradient',{id:'wipeG',gradientUnits:'userSpaceOnUse',x1:0,y1:0,x2:1,y2:0},document.querySelector('defs'));
 el('stop',{offset:0,'stop-color':'#fff'},g);el('stop',{id:'ws1',offset:.9,'stop-color':'#fff'},g);el('stop',{offset:1,'stop-color':'#fff','stop-opacity':0},g);})();
mG.style.display='none';
function setWipe(x){const e=Math.max(1,x+10);wipeRect.setAttribute('width',e);const g=document.getElementById('wipeG');g.setAttribute('x2',e);document.getElementById('ws1').setAttribute('offset',Math.max(0,(e-70)/e));}
function render(t){
 fluidTo(t);
 const P=poseAt(t), pose=P.pose, w=P.w;
 pen.setAttribute('transform',penTransform(pose));
 const wx=(t<T.write[0])?WX0-100:(t>=T.write[1]?WX1+200:pose.x); setWipe(wx);
 window.INFO={x:pose.x,y:pose.y,down:(t>=T.write[0]&&t<T.write[1])};
 hb.style.display='none';hf.style.display='none';
 // iris transition into the lesson
 {const root=document.getElementById('root'),r1=document.getElementById('ring'),r2=document.getElementById('ring2');
  if(root&&window.TRANSITION&&t>=T.iris[0]){const c=clamp((t-T.iris[0])/(T.iris[1]-T.iris[0]));const e=Math.pow(c,2.2);
   const R=e*1700, F=30+e*120;
   const m=`radial-gradient(circle at ${FINAL.x}px ${FINAL.y}px, transparent ${R}px, #000 ${R+F}px)`;
   root.style.webkitMaskImage=m;root.style.maskImage=m;
   for(const [el,off,col,wd] of [[r1,F*0.5,'#FFB547',3+10*(1-c)],[r2,F*0.5+26,'#9B6BFF',2+14*(1-c)]]){el.setAttribute('cx',FINAL.x);el.setAttribute('cy',FINAL.y);el.setAttribute('r',Math.max(0.1,R+off));el.setAttribute('stroke-width',wd);el.setAttribute('opacity',c<1?Math.min(1,c*8):0);}
  } else if(root){root.style.webkitMaskImage='';root.style.maskImage='';if(r1){r1.setAttribute('opacity',0);r2.setAttribute('opacity',0);}}}
 // light
 const lt=t-T.lit;
 const on=lt>=0?1:0;
 litG.setAttribute('opacity',on);tip.setAttribute('opacity',1-on);
 rayEls.forEach((r,i)=>{const s=lt<0?0:back((lt-i*0.025)/0.16);r.setAttribute('transform',`translate(3.2 32) scale(${s}) translate(-3.2 -32)`);});
 const tipPx={x:FINAL.x,y:FINAL.y};
 const fl=$('flareC');fl.setAttribute('cx',tipPx.x);fl.setAttribute('cy',tipPx.y);
 const fo=lt<0?0:(Math.min(1,lt/0.04)*(0.45+0.55*Math.exp(-lt*6)));
 fl.setAttribute('opacity',fo);fl.setAttribute('r',lt<0?0:220+380*Math.exp(-lt*5)*0+180*eo(lt/0.25));
 // lesson

 const lg=$('lesson');lg.setAttribute('opacity',1);lg.removeAttribute('transform');
 $('lcode').setAttribute('y',705);$('ltitle').setAttribute('y',790);
}
window.render=render;
setLesson('NK101 · AULA 01','Como instalar o Nuke');
document.fonts.ready.then(()=>{render(0);window.READY=true;});
