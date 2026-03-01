import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   WEB AUDIO BINAURAL ENGINE
   True stereo: left ear baseHz, right ear baseHz+beatHz
═══════════════════════════════════════════════════════════════ */
class BinauralEngine {
  constructor() {
    this.ctx = null; this.masterGain = null;
    this.leftOsc = null; this.rightOsc = null;
    this.leftGain = null; this.rightGain = null;
    this.merger = null; this.noiseNode = null; this.noiseGain = null;
    this.running = false;
  }
  _init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }
  _makeNoise(type) {
    const sr = this.ctx.sampleRate, len = sr * 5;
    const buf = this.ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    if (type === "rain")   for (let i=0;i<len;i++) d[i] = (Math.random()*2-1)*0.18;
    else if (type==="ocean") for (let i=0;i<len;i++) d[i] = Math.sin(i*.0002)*Math.sin(i*.000025)*.35*(0.5+Math.random()*.5);
    else if (type==="fire")  for (let i=0;i<len;i++) d[i] = (Math.random()*2-1)*.1*(0.3+Math.abs(Math.sin(i*.0008)));
    else if (type==="wind")  for (let i=0;i<len;i++) d[i] = (Math.random()-.5)*.22*Math.abs(Math.sin(i*.00005));
    else for (let i=0;i<len;i++) d[i] = Math.sin(i*.0008+Math.sin(i*.00004)*8)*.06+(Math.random()-.5)*.04;
    return buf;
  }
  startBinaural({baseHz=200, beatHz=10, vol=0.4}) {
    this._init(); this.stopBinaural();
    const merger = this.ctx.createChannelMerger(2);
    merger.connect(this.masterGain);
    const lo = this.ctx.createOscillator(), ro = this.ctx.createOscillator();
    const lg = this.ctx.createGain(), rg = this.ctx.createGain();
    lo.type = ro.type = "sine";
    lo.frequency.value = baseHz; ro.frequency.value = baseHz + beatHz;
    lg.gain.value = rg.gain.value = vol;
    lo.connect(lg); lg.connect(merger,0,0);
    ro.connect(rg); rg.connect(merger,0,1);
    lo.start(); ro.start();
    this.leftOsc=lo; this.rightOsc=ro; this.leftGain=lg; this.rightGain=rg; this.merger=merger;
    this.running = true;
  }
  startAmbient(type, vol=0.44) {
    this._init(); this.stopAmbient();
    const src = this.ctx.createBufferSource();
    src.buffer = this._makeNoise(type); src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type="lowpass"; f.frequency.value = type==="rain"?8000:type==="ocean"?500:3000;
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.masterGain); src.start();
    this.noiseNode=src; this.noiseGain=g;
  }
  stopBinaural() {
    try{this.leftOsc?.stop();this.rightOsc?.stop();this.merger?.disconnect();}catch(e){}
    this.leftOsc=this.rightOsc=this.leftGain=this.rightGain=this.merger=null;
  }
  stopAmbient() {
    try{this.noiseNode?.stop();this.noiseGain?.disconnect();}catch(e){}
    this.noiseNode=this.noiseGain=null;
  }
  setBinauralVol(v){if(this.leftGain){this.leftGain.gain.value=v;this.rightGain.gain.value=v;}}
  setAmbientVol(v){if(this.noiseGain)this.noiseGain.gain.value=v;}
  stopAll(){this.stopBinaural();this.stopAmbient();this.running=false;}
}
const engine = new BinauralEngine();

/* ═══ DATA ═══════════════════════════════════════════════════ */
const PRESETS = [
  {id:1,name:"Stage King",   icon:"👑",beat:10,base:200,ambient:"forest",color:"#e8a030",desc:"Alpha 10Hz · Forest Dawn",   free:true },
  {id:2,name:"Deep Calm",    icon:"🌊",beat:6, base:180,ambient:"ocean", color:"#00c9a7",desc:"Theta 6Hz · Ocean Waves",    free:true },
  {id:3,name:"Fire Focus",   icon:"🔥",beat:14,base:220,ambient:"fire",  color:"#f97316",desc:"Alpha 14Hz · Crackling Fire",free:false},
  {id:4,name:"Rain Reset",   icon:"🌧️",beat:4, base:160,ambient:"rain",  color:"#818cf8",desc:"Delta 4Hz · Rain on Leaves", free:false},
  {id:5,name:"Crown Surge",  icon:"⚡",beat:12,base:210,ambient:"wind",  color:"#c084fc",desc:"Alpha 12Hz · Wind Chimes",   free:true },
  {id:6,name:"Zen Ground",   icon:"🧘",beat:7, base:192,ambient:"forest",color:"#4ade80",desc:"Theta 7Hz · Nature",         free:false},
];
const FREQUENCIES = [
  {hz:396,name:"Fear Release",  color:"#f87171",science:"Cortisol reduction · Root activation"},
  {hz:432,name:"Earth Harmony", color:"#fb923c",science:"Schumann resonance · Natural tuning"},
  {hz:528,name:"Confidence",    color:"#e8a030",science:"DNA repair · Dopamine pathway"},
  {hz:639,name:"Connection",    color:"#34d399",science:"Oxytocin release · Social bonding"},
  {hz:741,name:"Expression",    color:"#60a5fa",science:"Vocal confidence · Throat chakra"},
  {hz:852,name:"Intuition",     color:"#a78bfa",science:"Heightened awareness · Third eye"},
  {hz:963,name:"Crown State",   color:"#f0abfc",science:"Peak state access · Pineal gland"},
];
const AMBIENTS = [
  {id:"forest",label:"Forest Dawn",   icon:"🌲",hue:"#4ade80"},
  {id:"ocean", label:"Ocean Waves",   icon:"🌊",hue:"#22d3ee"},
  {id:"rain",  label:"Rain on Leaves",icon:"🌧️",hue:"#818cf8"},
  {id:"fire",  label:"Crackling Fire",icon:"🔥",hue:"#f97316"},
  {id:"wind",  label:"Wind Chimes",   icon:"🎐",hue:"#c084fc"},
];
const BADGES=[
  {id:"first", icon:"🌱",name:"First Breath",   desc:"First session complete"},
  {id:"three", icon:"🔥",name:"Triple Ignition",desc:"3 sessions done"},
  {id:"stage", icon:"👑",name:"Crowd Conqueror",desc:"Stage King × 5"},
  {id:"mixer", icon:"🎛️",name:"Sound Alchemist",desc:"Custom mix saved"},
  {id:"calm",  icon:"🌊",name:"Deep Water",     desc:"20+ min calm"},
  {id:"week",  icon:"💎",name:"Diamond Week",   desc:"7-day streak"},
];
const AFFIRMATIONS=["I own this stage","My voice carries power","The crowd is with me","I am calm. I am limitless.","Every breath centers me","I radiate confident energy","I was born for this moment"];
const BREATH_PHASES=[
  {phase:"inhale",dur:4,label:"Inhale", scale:1.18,color:"#e8a030"},
  {phase:"hold",  dur:4,label:"Hold",   scale:1.18,color:"#c084fc"},
  {phase:"exhale",dur:6,label:"Exhale", scale:0.85,color:"#00c9a7"},
  {phase:"rest",  dur:2,label:"Rest",   scale:0.85,color:"#60a5fa"},
];
const MOODS=["😰","😟","😐","🙂","😎"];
const MOOD_LABELS=["Panicked","Anxious","Neutral","Confident","Unstoppable"];
const fmt=(s)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

/* ═══ MICRO COMPONENTS ═══════════════════════════════════════ */
function Ripple({onClick,children,style={},disabled=false}){
  const [ripples,setRipples]=useState([]);
  const go=(e)=>{
    if(disabled)return;
    const r=e.currentTarget.getBoundingClientRect();
    const id=Date.now()+Math.random();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(rr=>rr.id!==id)),800);
    onClick?.(e);
  };
  return(
    <div onClick={go} style={{position:"relative",overflow:"hidden",cursor:disabled?"default":"pointer",...style}}>
      {ripples.map(r=>(
        <span key={r.id} style={{position:"absolute",left:r.x-50,top:r.y-50,width:100,height:100,borderRadius:"50%",
          background:"rgba(255,255,255,0.12)",animation:"ripple .8s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
      ))}
      {children}
    </div>
  );
}

function WaveBar({active,color="#e8a030",bars=28}){
  const [hts,setH]=useState(()=>Array(bars).fill(3));
  useEffect(()=>{
    if(!active){setH(Array(bars).fill(3));return;}
    const id=setInterval(()=>{
      setH(Array(bars).fill(0).map((_,i)=>{
        const c=bars/2,dist=Math.abs(i-c)/c;
        return 3+Math.random()*(1-dist*.6)*32;
      }));
    },80);
    return()=>clearInterval(id);
  },[active,bars]);
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,height:40}}>
      {hts.map((h,i)=>(
        <div key={i} style={{width:3,height:h,borderRadius:4,background:`linear-gradient(to top,${color}44,${color})`,transition:"height .08s ease"}}/>
      ))}
    </div>
  );
}

function AuroraField({color="#e8a030"}){
  const pts=useMemo(()=>Array(16).fill(0).map(()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*3+1.5,dur:Math.random()*7+5,delay:Math.random()*4,op:Math.random()*.2+.04})),[]);
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {pts.map((p,i)=>(
        <div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,borderRadius:"50%",background:color,opacity:p.op,animation:`floatP ${p.dur}s ${p.delay}s ease-in-out infinite alternate`}}/>
      ))}
      <div style={{position:"absolute",top:"5%",left:"15%",width:"70%",height:"50%",background:`radial-gradient(ellipse,${color}07 0%,transparent 70%)`,animation:"auroraG 6s ease-in-out infinite alternate",pointerEvents:"none"}}/>
    </div>
  );
}

function Card({children,style={},glow=""}){
  return(
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,...style,boxShadow:glow?`0 0 30px ${glow}22`:undefined}}>
      {children}
    </div>
  );
}
function Pill({children,active,color="#e8a030",onClick}){
  return(
    <Ripple onClick={onClick} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"7px 14px",borderRadius:20,background:active?`${color}22`:"rgba(255,255,255,0.04)",border:`1px solid ${active?color+"55":"rgba(255,255,255,0.07)"}`,color:active?color:"#666",fontSize:12,fontWeight:active?700:500,transition:"all .2s",userSelect:"none",whiteSpace:"nowrap"}}>
      {children}
    </Ripple>
  );
}
function Toggle({on,onChange}){
  return(
    <div onClick={()=>onChange(!on)} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?"#e8a030":"rgba(255,255,255,0.1)",position:"relative",transition:"background .2s"}}>
      <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
    </div>
  );
}

/* ═══ ONBOARDING ═════════════════════════════════════════════ */
const QUIZ=[
  {icon:"🧠",q:"What's your biggest challenge?",sub:"We calibrate your neural pathway activation",opts:[{l:"Public speaking — large crowds",v:"crowds"},{l:"Social anxiety & introversion",v:"social"},{l:"Pre-performance stage fright",v:"stage"},{l:"Daily stress & overwhelm",v:"daily"}]},
  {icon:"⏰",q:"When do you need the boost most?",sub:"Sets your session timing algorithm",opts:[{l:"Moments before going on stage",v:"pre"},{l:"30 min pre-event",v:"30min"},{l:"Daily morning ritual",v:"morning"},{l:"On-demand, any time",v:"anytime"}]},
  {icon:"🎵",q:"Choose your sanctuary sound",sub:"Sets your default ambient layer",opts:[{l:"🌲  Forest Dawn — birds & leaves",v:"forest"},{l:"🌊  Ocean Waves — tidal calm",v:"ocean"},{l:"🔥  Crackling Fire — warm focus",v:"fire"},{l:"🌧️  Rain on Leaves — deep reset",v:"rain"}]},
];
function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [answers,setAnswers]=useState([]);
  const [leaving,setLeaving]=useState(false);
  const q=QUIZ[step];
  const pick=(v)=>{
    setChosen(v);setLeaving(true);
    setTimeout(()=>{
      const next=[...answers,v];setAnswers(next);
      if(step<QUIZ.length-1){setStep(step+1);setChosen(null);setLeaving(false);}
      else onDone(next);
    },340);
  };
  return(
    <div style={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px 40px",background:"radial-gradient(ellipse at 40% 10%,#1a0f2e,#05050f)",position:"relative",overflow:"hidden"}}>
      <AuroraField color="#8b5cf6"/>
      <div style={{position:"relative",width:"100%",maxWidth:390,opacity:leaving?0:1,transform:leaving?"translateY(-18px)":"translateY(0)",transition:"all .32s ease"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:11,letterSpacing:5,color:"#ffffff33",textTransform:"uppercase",marginBottom:12}}>AURABOOST</div>
          <div style={{display:"flex",justifyContent:"center",gap:7}}>
            {QUIZ.map((_,i)=>(
              <div key={i} style={{width:i===step?26:7,height:7,borderRadius:4,background:i<=step?"#e8a030":"rgba(255,255,255,0.1)",transition:"all .3s ease"}}/>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:52,marginBottom:16}}>{q.icon}</div>
          <h2 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8,lineHeight:1.35,fontFamily:"'Playfair Display',Georgia,serif"}}>{q.q}</h2>
          <p style={{fontSize:13,color:"#555",letterSpacing:.3}}>{q.sub}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((o,i)=>(
            <Ripple key={i} onClick={()=>pick(o.v)} style={{padding:"16px 20px",borderRadius:14,background:chosen===o.v?"rgba(232,160,48,0.14)":"rgba(255,255,255,0.04)",border:`1px solid ${chosen===o.v?"#e8a03055":"rgba(255,255,255,0.08)"}`,color:chosen===o.v?"#e8a030":"#ccc",fontSize:14,fontWeight:500,transition:"all .18s",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:chosen===o.v?"#e8a030":"rgba(255,255,255,0.18)",flexShrink:0,transition:"all .2s"}}/>
              {o.l}
            </Ripple>
          ))}
        </div>
        {step>0&&<div style={{textAlign:"center",marginTop:20}}><span onClick={()=>{setStep(step-1);setChosen(null);}} style={{color:"#555",fontSize:13,cursor:"pointer"}}>← back</span></div>}
      </div>
    </div>
  );
}

/* ═══ EMERGENCY BOOST MODAL ══════════════════════════════════ */
function EmergencyModal({onClose,addLog}){
  const [phase,setPhase]=useState("countdown");
  const [count,setCount]=useState(3);
  const [elapsed,setElapsed]=useState(0);
  const [breathIdx,setBreathIdx]=useState(0);
  const [affIdx,setAffIdx]=useState(0);
  const TOTAL=300;
  const timerRef=useRef();const breathRef=useRef();

  useEffect(()=>{
    if(phase!=="countdown")return;
    const t=setInterval(()=>setCount(c=>{
      if(c<=1){clearInterval(t);beginSession();return 0;}
      return c-1;
    }),1000);
    return()=>clearInterval(t);
  },[phase]);

  const beginSession=()=>{
    engine.startBinaural({baseHz:200,beatHz:10,vol:0.45});
    engine.startAmbient("forest",.42);
    setPhase("running");
  };

  useEffect(()=>{
    if(phase!=="running")return;
    timerRef.current=setInterval(()=>setElapsed(e=>{
      if(e>=TOTAL-1){engine.stopAll();setPhase("done");addLog?.({preset:"Emergency Boost",duration:5,mood:null,ts:Date.now()});return TOTAL;}
      return e+1;
    }),1000);
    const aff=setInterval(()=>setAffIdx(a=>(a+1)%AFFIRMATIONS.length),8000);
    let idx=0,prog=0;
    breathRef.current=setInterval(()=>{
      prog+=100;
      if(prog>=BREATH_PHASES[idx].dur*1000){idx=(idx+1)%BREATH_PHASES.length;prog=0;setBreathIdx(idx);}
    },100);
    return()=>{clearInterval(timerRef.current);clearInterval(aff);clearInterval(breathRef.current);};
  },[phase]);

  const bp=BREATH_PHASES[breathIdx];
  const prog=elapsed/TOTAL;
  const C=2*Math.PI*60;

  return(
    <div style={{position:"absolute",inset:0,background:"#03030a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",zIndex:200}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,#1a0f2e99,transparent 70%)",pointerEvents:"none"}}/>
      <AuroraField color="#c084fc"/>
      {phase==="countdown"&&(
        <div style={{textAlign:"center",position:"relative"}}>
          <div style={{fontSize:100,fontWeight:900,color:"#e8a030",fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1,textShadow:"0 0 80px #e8a03055",animation:"zoomIn .3s ease"}}>{count||"GO"}</div>
          <div style={{color:"#444",fontSize:13,marginTop:14,letterSpacing:2.5,textTransform:"uppercase"}}>Put on your headphones</div>
        </div>
      )}
      {phase==="running"&&(
        <div style={{width:"100%",padding:"0 28px",textAlign:"center",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:28}}>
            <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",width:172,height:172,borderRadius:"50%",border:`1px solid ${bp.color}18`,transform:`scale(${bp.scale+.1})`,transition:`transform ${bp.dur}s ease-in-out`}}/>
              <div style={{width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle at 38% 38%,${bp.color}55,${bp.color}15)`,border:`1.5px solid ${bp.color}44`,boxShadow:`0 0 60px ${bp.color}33,inset 0 0 30px ${bp.color}11`,transform:`scale(${bp.scale})`,transition:`transform ${bp.dur}s ease-in-out,background .5s,box-shadow .5s`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:10,letterSpacing:3,color:bp.color,textTransform:"uppercase",fontWeight:700}}>{bp.label}</div>
                <div style={{fontSize:32,fontWeight:900,color:"#fff",lineHeight:1.2}}>{bp.dur}</div>
              </div>
            </div>
          </div>
          <div style={{fontSize:19,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:10,letterSpacing:.3,textShadow:"0 0 30px rgba(232,160,48,.35)",minHeight:52}}>"{AFFIRMATIONS[affIdx]}"</div>
          <WaveBar active={true} color="#e8a030" bars={30}/>
          <div style={{display:"flex",justifyContent:"center",marginTop:22,position:"relative"}}>
            <svg width={130} height={130} style={{transform:"rotate(-90deg)"}}>
              <circle cx={65} cy={65} r={60} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4}/>
              <circle cx={65} cy={65} r={60} fill="none" stroke="#e8a030" strokeWidth={4} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C-prog*C} style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(90deg)",textAlign:"center"}}>
              <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{fmt(TOTAL-elapsed)}</div>
              <div style={{fontSize:9,color:"#555",letterSpacing:1.5}}>REMAINING</div>
            </div>
          </div>
          <div style={{fontSize:11,color:"#444",marginTop:10,letterSpacing:1.5,textTransform:"uppercase"}}>Alpha 10Hz · Stage King · Headphones on</div>
        </div>
      )}
      {phase==="done"&&(
        <div style={{textAlign:"center",padding:"0 28px",position:"relative"}}>
          <div style={{fontSize:72,marginBottom:20}}>👑</div>
          <h2 style={{fontSize:30,fontWeight:900,color:"#e8a030",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:12}}>You are ready.</h2>
          <p style={{color:"#888",fontSize:15,lineHeight:1.7,marginBottom:32}}>Alpha waves activated.<br/>Cortisol suppressed. Go claim that stage.</p>
          <Ripple onClick={()=>{engine.stopAll();onClose();}} style={{background:"linear-gradient(135deg,#e8a030,#c084fc)",borderRadius:14,padding:"15px 40px",fontSize:15,fontWeight:800,color:"#000",display:"inline-block"}}>
            Close & Conquer ✦
          </Ripple>
        </div>
      )}
      {phase!=="done"&&(
        <button onClick={()=>{engine.stopAll();onClose();}} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"#555",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✕</button>
      )}
    </div>
  );
}

/* ═══ HOME SCREEN ════════════════════════════════════════════ */
function HomeScreen({onEmergency,addLog}){
  const [playing,setPlaying]=useState(false);
  const [presetId,setPresetId]=useState(1);
  const [duration,setDuration]=useState(10);
  const [elapsed,setElapsed]=useState(0);
  const [bVol,setBVol]=useState(0.42);
  const [aVol,setAVol]=useState(0.44);
  const timerRef=useRef();
  const preset=PRESETS.find(p=>p.id===presetId);
  const total=duration*60;

  const stopSession=(fin=false)=>{
    setPlaying(false);setElapsed(0);
    if(fin)addLog({preset:preset.name,duration,mood:null,ts:Date.now()});
  };

  useEffect(()=>{
    if(playing){
      engine.startBinaural({baseHz:preset.base,beatHz:preset.beat,vol:bVol});
      engine.startAmbient(preset.ambient,aVol);
      timerRef.current=setInterval(()=>setElapsed(e=>{
        if(e>=total-1){stopSession(true);return 0;}
        return e+1;
      }),1000);
    }else{clearInterval(timerRef.current);engine.stopAll();}
    return()=>clearInterval(timerRef.current);
  },[playing,presetId]);

  const prog=playing?elapsed/total:0;const C=2*Math.PI*58;

  return(
    <div>
      <div style={{padding:"0 20px 20px",position:"relative"}}>
        <AuroraField color={preset.color}/>
        <div style={{textAlign:"center",marginBottom:24,position:"relative"}}>
          <div style={{fontSize:11,letterSpacing:5,color:"#ffffff28",textTransform:"uppercase",marginBottom:3}}>AURABOOST</div>
          <div style={{fontSize:11,color:"#555"}}>{playing?`⚡ ${fmt(total-elapsed)} remaining`:"Tap to activate"}</div>
        </div>
        <div style={{textAlign:"center",marginBottom:22,position:"relative"}}>
          <div style={{fontSize:22,marginBottom:4}}>{preset.icon}</div>
          <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif"}}>{preset.name}</div>
          <div style={{fontSize:12,color:"#666",marginTop:2}}>{preset.desc}</div>
        </div>
        {/* Play ring */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20,position:"relative"}}>
          <div style={{position:"relative"}}>
            <svg width={136} height={136} style={{position:"absolute",transform:"rotate(-90deg)",zIndex:1}}>
              <circle cx={68} cy={68} r={58} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5}/>
              <circle cx={68} cy={68} r={58} fill="none" stroke={preset.color} strokeWidth={5} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C-prog*C} style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <Ripple onClick={()=>{if(playing)stopSession();else setPlaying(true);}} style={{width:136,height:136,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:playing?`radial-gradient(circle at 40% 40%,${preset.color}44,${preset.color}14)`:"rgba(255,255,255,0.04)",border:`1.5px solid ${playing?preset.color+"66":"rgba(255,255,255,0.08)"}`,boxShadow:playing?`0 0 60px ${preset.color}33`:"none",transition:"all .4s ease",position:"relative",zIndex:2}}>
              {playing&&<div style={{position:"absolute",inset:-10,borderRadius:"50%",border:`1px solid ${preset.color}22`,animation:"orbP1 2s ease-out infinite"}}/>}
              <div style={{fontSize:38,lineHeight:1}}>{playing?"⏸":"▶"}</div>
              {playing&&<div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:3}}>{fmt(total-elapsed)}</div>}
            </Ripple>
          </div>
        </div>
        {playing&&<WaveBar active={playing} color={preset.color} bars={30}/>}
      </div>
      {/* Duration */}
      <div style={{padding:"0 20px",marginBottom:18}}>
        <div style={{fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:10}}>Session Duration</div>
        <div style={{display:"flex",gap:8}}>
          {[5,10,15,20].map(d=>(
            <Pill key={d} active={duration===d} color={preset.color} onClick={()=>!playing&&setDuration(d)}>{d}m</Pill>
          ))}
        </div>
      </div>
      {/* Mix sliders */}
      <div style={{padding:"0 20px",marginBottom:18}}>
        <div style={{fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:12}}>Sound Mix</div>
        <Card style={{padding:16}}>
          {[{label:"⚡ Binaural Beats",v:bVol,set:setBVol,cb:v=>engine.setBinauralVol(v),color:preset.color},{label:`${AMBIENTS.find(a=>a.id===preset.ambient)?.icon||"🎵"} Ambient`,v:aVol,set:setAVol,cb:v=>engine.setAmbientVol(v),color:"#00c9a7"}].map((s,i)=>(
            <div key={i} style={{marginBottom:i===0?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontSize:13,color:"#bbb"}}>{s.label}</span>
                <span style={{fontSize:13,color:s.color,fontWeight:700}}>{Math.round(s.v*100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={.02} value={s.v} onChange={e=>{const v=+e.target.value;s.set(v);s.cb(v);}} style={{width:"100%",accentColor:s.color}}/>
            </div>
          ))}
        </Card>
      </div>
      {/* Presets carousel */}
      <div style={{marginBottom:20}}>
        <div style={{padding:"0 20px",fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:12}}>Quick Presets</div>
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"2px 20px 4px",scrollbarWidth:"none"}}>
          {PRESETS.map(p=>(
            <Ripple key={p.id} onClick={()=>!playing&&setPresetId(p.id)} style={{minWidth:86,padding:"12px 10px",borderRadius:16,background:presetId===p.id?`${p.color}22`:"rgba(255,255,255,0.03)",border:`1px solid ${presetId===p.id?p.color+"55":"rgba(255,255,255,0.06)"}`,textAlign:"center",transition:"all .2s",opacity:!p.free&&presetId!==p.id?.55:1}}>
              <div style={{fontSize:20,marginBottom:5}}>{p.icon}</div>
              <div style={{fontSize:11,fontWeight:800,color:presetId===p.id?p.color:"#ccc"}}>{p.name}</div>
              <div style={{fontSize:10,color:"#555",marginTop:2}}>{p.free?`${p.beat}Hz`:"🔒 Pro"}</div>
            </Ripple>
          ))}
        </div>
      </div>
      {/* Emergency CTA */}
      <div style={{padding:"0 20px 36px"}}>
        <Ripple onClick={onEmergency} style={{background:"linear-gradient(135deg,#b45309,#e8a030)",borderRadius:16,padding:"17px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 8px 32px rgba(232,100,48,.25)"}}>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#fff",marginBottom:3}}>⚡ EMERGENCY BOOST</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>Stage fright? 5-min rescue with guided breathing</div>
          </div>
          <div style={{fontSize:30,flexShrink:0,marginLeft:12}}>🎯</div>
        </Ripple>
      </div>
    </div>
  );
}

/* ═══ MIXER SCREEN ═══════════════════════════════════════════ */
function MixerScreen({savedMixes,setSavedMixes}){
  const [name,setName]=useState("My Power Mix");
  const [base,setBase]=useState(528);
  const [beat,setBeat]=useState(10);
  const [ambient,setAmbient]=useState("forest");
  const [bvol,setBvol]=useState(.42);
  const [avol,setAvol]=useState(.44);
  const [prev,setPrev]=useState(false);
  const [saved,setSaved]=useState(false);
  const preview=()=>{
    if(prev){engine.stopAll();setPrev(false);}
    else{engine.startBinaural({baseHz:base,beatHz:beat,vol:bvol});engine.startAmbient(ambient,avol);setPrev(true);}
  };
  const save=()=>{
    engine.stopAll();setPrev(false);
    setSavedMixes(m=>[...m,{name,base,beat,ambient,bvol,avol,id:Date.now()}]);
    setSaved(true);setTimeout(()=>setSaved(false),2500);
  };
  return(
    <div style={{padding:"24px 20px 48px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:4}}>Sound Alchemist</h2>
      <p style={{fontSize:13,color:"#666",marginBottom:22}}>Build your perfect neural mix</p>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:8}}>Mix Name</div>
        <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:15,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>
      </div>
      <Card style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:11,letterSpacing:2,color:"#e8a030",textTransform:"uppercase",marginBottom:14,fontWeight:700}}>⚡ Binaural Configuration</div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#bbb"}}>Base Frequency</span><span style={{fontSize:13,color:"#e8a030",fontWeight:700}}>{base}Hz</span></div>
          <input type="range" min={150} max={963} step={1} value={base} onChange={e=>setBase(+e.target.value)} style={{width:"100%",accentColor:"#e8a030"}}/>
          <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
            {FREQUENCIES.slice(0,5).map(f=><Pill key={f.hz} active={base===f.hz} color={f.color} onClick={()=>setBase(f.hz)}>{f.hz}Hz</Pill>)}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#bbb"}}>Brainwave Target</span><span style={{fontSize:13,color:"#e8a030",fontWeight:700}}>{beat}Hz</span></div>
          <input type="range" min={1} max={30} step={.5} value={beat} onChange={e=>setBeat(+e.target.value)} style={{width:"100%",accentColor:"#e8a030"}}/>
          <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
            {[{v:4,l:"Delta"},{v:7,l:"Theta"},{v:10,l:"Alpha"},{v:14,l:"Alpha+"},{v:20,l:"Beta"}].map(b=><Pill key={b.v} active={beat===b.v} color="#e8a030" onClick={()=>setBeat(b.v)}>{b.l} {b.v}Hz</Pill>)}
          </div>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#bbb"}}>Binaural Volume</span><span style={{fontSize:13,color:"#e8a030",fontWeight:700}}>{Math.round(bvol*100)}%</span></div>
          <input type="range" min={0} max={1} step={.02} value={bvol} onChange={e=>{setBvol(+e.target.value);prev&&engine.setBinauralVol(+e.target.value);}} style={{width:"100%",accentColor:"#e8a030"}}/>
        </div>
      </Card>
      <Card style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:11,letterSpacing:2,color:"#00c9a7",textTransform:"uppercase",marginBottom:14,fontWeight:700}}>🌿 Ambient Layer</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {AMBIENTS.map(a=>(
            <Ripple key={a.id} onClick={()=>setAmbient(a.id)} style={{padding:"11px 12px",borderRadius:12,background:ambient===a.id?`${a.hue}18`:"rgba(255,255,255,0.03)",border:`1px solid ${ambient===a.id?a.hue+"44":"rgba(255,255,255,0.06)"}`,display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}>
              <span style={{fontSize:18}}>{a.icon}</span>
              <span style={{fontSize:12,color:ambient===a.id?a.hue:"#aaa",fontWeight:600}}>{a.label}</span>
            </Ripple>
          ))}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#bbb"}}>Ambient Volume</span><span style={{fontSize:13,color:"#00c9a7",fontWeight:700}}>{Math.round(avol*100)}%</span></div>
          <input type="range" min={0} max={1} step={.02} value={avol} onChange={e=>{setAvol(+e.target.value);prev&&engine.setAmbientVol(+e.target.value);}} style={{width:"100%",accentColor:"#00c9a7"}}/>
        </div>
      </Card>
      {prev&&<div style={{marginBottom:14}}><WaveBar active={true} color="#e8a030" bars={34}/></div>}
      <div style={{display:"flex",gap:10,marginBottom:prev||savedMixes.length?24:0}}>
        <Ripple onClick={preview} style={{flex:1,padding:"14px 0",borderRadius:14,textAlign:"center",background:prev?"rgba(232,160,48,0.1)":"rgba(255,255,255,0.05)",border:`1px solid ${prev?"#e8a03044":"rgba(255,255,255,0.08)"}`,color:prev?"#e8a030":"#bbb",fontSize:14,fontWeight:700}}>
          {prev?"⏹ Stop":"▶ Preview"}
        </Ripple>
        <Ripple onClick={save} style={{flex:1,padding:"14px 0",borderRadius:14,textAlign:"center",background:saved?"rgba(0,201,167,.18)":"linear-gradient(135deg,#e8a030,#c084fc)",fontSize:14,fontWeight:800,color:saved?"#00c9a7":"#000",transition:"all .3s"}}>
          {saved?"✓ Saved!":"✦ Save Mix"}
        </Ripple>
      </div>
      {savedMixes.length>0&&(
        <div>
          <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:12}}>My Mixes ({savedMixes.length})</div>
          {savedMixes.map(m=>(
            <Card key={m.id} style={{padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{m.name}</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{m.base}Hz · {m.beat}Hz beat · {AMBIENTS.find(a=>a.id===m.ambient)?.label}</div></div>
              <div style={{fontSize:20}}>🎛️</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ TRACKS SCREEN ══════════════════════════════════════════ */
function TracksScreen(){
  const [activeHz,setActiveHz]=useState(null);
  const play=(f)=>{
    if(activeHz===f.hz){engine.stopAll();setActiveHz(null);}
    else{engine.startBinaural({baseHz:f.hz,beatHz:6,vol:.3});setActiveHz(f.hz);}
  };
  useEffect(()=>()=>engine.stopAll(),[]);
  return(
    <div style={{padding:"24px 20px 48px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:4}}>Sound Library</h2>
      <p style={{fontSize:13,color:"#666",marginBottom:22}}>Solfeggio · Binaural Packs · Soundscapes</p>
      <div style={{fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:14}}>Solfeggio Frequencies</div>
      {FREQUENCIES.map(f=>(
        <Ripple key={f.hz} onClick={()=>play(f)} style={{background:activeHz===f.hz?`${f.color}14`:"rgba(255,255,255,0.03)",border:`1px solid ${activeHz===f.hz?f.color+"44":"rgba(255,255,255,0.06)"}`,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,transition:"all .2s"}}>
          <div style={{width:50,height:50,borderRadius:12,flexShrink:0,background:`linear-gradient(145deg,${f.color}44,${f.color}18)`,border:`1px solid ${f.color}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:11,fontWeight:900,color:f.color,letterSpacing:-.5}}>{f.hz}</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{f.name}</div>
            <div style={{fontSize:11,color:"#555"}}>{f.science}</div>
          </div>
          <div style={{fontSize:20,flexShrink:0}}>{activeHz===f.hz?"⏸️":"▶️"}</div>
        </Ripple>
      ))}
      {activeHz&&<div style={{marginBottom:14}}><WaveBar active={true} color={FREQUENCIES.find(f=>f.hz===activeHz)?.color||"#e8a030"} bars={30}/></div>}
      <div style={{fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:14,marginTop:24}}>Binaural Packs</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
        {[{n:"Dopamine Surge",i:"⚡",h:"10Hz Alpha",c:"#e8a030",f:true},{n:"Social Ease",i:"🤝",h:"7Hz Theta",c:"#34d399",f:true},{n:"Deep Rest",i:"💤",h:"4Hz Delta",c:"#818cf8",f:false},{n:"Flow State",i:"🌊",h:"14Hz Alpha+",c:"#22d3ee",f:false},{n:"Confidence Peak",i:"👑",h:"12Hz Alpha",c:"#f97316",f:false},{n:"Anxiety Shield",i:"🛡️",h:"6Hz Theta",c:"#c084fc",f:true}].map(p=>(
          <Card key={p.n} style={{padding:"14px 12px",opacity:p.f?1:.7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{fontSize:24}}>{p.i}</div>
              {!p.f&&<div style={{fontSize:10,color:"#c084fc",background:"rgba(192,132,252,.1)",padding:"2px 7px",borderRadius:8,border:"1px solid rgba(192,132,252,.2)"}}>PRO</div>}
            </div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>{p.n}</div>
            <div style={{fontSize:11,color:"#555"}}>{p.h}</div>
          </Card>
        ))}
      </div>
      <div style={{fontSize:10,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:14}}>Ambient Soundscapes</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {AMBIENTS.map(a=>(
          <Card key={a.id} style={{padding:"14px 12px"}}>
            <div style={{fontSize:26,marginBottom:8}}>{a.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>{a.label}</div>
            <div style={{fontSize:11,color:"#555"}}>HD · Looped · Offline ready</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══ JOURNEY SCREEN ════════════════════════════════════════ */
function JourneyScreen({logs,setLogs}){
  const lastUnrated=logs.findLastIndex?.(l=>l.mood===null)??logs.reduceRight((a,l,i)=>a===-1&&l.mood===null?i:a,-1);
  const rated=logs.filter(l=>l.mood!==null);
  const avgMood=rated.length?Math.round(rated.reduce((s,l)=>s+l.mood,0)/rated.length):null;
  const totalMins=logs.reduce((s,l)=>s+l.duration,0);
  const earnedBadges=[logs.length>=1&&"first",logs.length>=3&&"three",logs.filter(l=>l.preset==="Stage King").length>=5&&"stage"].filter(Boolean);
  const chartData=rated.slice(-7);
  const rate=(v)=>{if(lastUnrated===-1)return;setLogs(ls=>ls.map((l,i)=>i===lastUnrated?{...l,mood:v}:l));};
  return(
    <div style={{padding:"24px 20px 48px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:4}}>Your Journey</h2>
      <p style={{fontSize:13,color:"#666",marginBottom:22}}>Track your confidence evolution</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
        {[{l:"Sessions",v:logs.length,i:"🎯"},{l:"Minutes",v:totalMins,i:"⏱️"},{l:"Avg Mood",v:avgMood!==null?MOODS[avgMood]:"–",i:"💎"}].map(s=>(
          <Card key={s.l} style={{padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:5}}>{s.i}</div>
            <div style={{fontSize:22,fontWeight:900,color:"#fff",lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:11,color:"#555",marginTop:4}}>{s.l}</div>
          </Card>
        ))}
      </div>
      {chartData.length>0&&(
        <Card style={{padding:16,marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:14}}>Mood Trend (last {chartData.length})</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:64}}>
            {chartData.map((l,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",borderRadius:"4px 4px 0 0",height:l.mood!==null?`${(l.mood+1)/5*56}px`:"4px",background:l.mood!==null?"linear-gradient(to top,#e8a03044,#e8a030bb)":"rgba(255,255,255,0.06)",transition:"height .5s ease"}}/>
                <div style={{fontSize:14}}>{l.mood!==null?MOODS[l.mood]:"⏳"}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {lastUnrated!==-1&&(
        <Card style={{padding:18,marginBottom:16,background:"rgba(232,160,48,0.06)",border:"1px solid rgba(232,160,48,0.2)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#e8a030",marginBottom:6}}>Rate your last session ✦</div>
          <div style={{fontSize:12,color:"#888",marginBottom:14}}>{logs[lastUnrated]?.preset} · {logs[lastUnrated]?.duration} min</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {MOODS.map((m,i)=>(
              <Ripple key={i} onClick={()=>rate(i)} style={{flex:1,textAlign:"center",padding:"8px 2px",borderRadius:10,background:"rgba(255,255,255,0.03)"}}>
                <div style={{fontSize:26}}>{m}</div>
                <div style={{fontSize:9,color:"#555",marginTop:3}}>{MOOD_LABELS[i]}</div>
              </Ripple>
            ))}
          </div>
        </Card>
      )}
      <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:12}}>Achievements</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,marginBottom:20,scrollbarWidth:"none"}}>
        {BADGES.map(b=>{
          const earned=earnedBadges.includes(b.id);
          return(
            <div key={b.id} style={{minWidth:82,padding:"12px 10px",borderRadius:14,textAlign:"center",background:earned?"rgba(232,160,48,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${earned?"rgba(232,160,48,0.25)":"rgba(255,255,255,0.05)"}`,filter:earned?"none":"grayscale(1) opacity(.3)",transition:"all .3s"}}>
              <div style={{fontSize:26,marginBottom:6}}>{b.icon}</div>
              <div style={{fontSize:10,fontWeight:700,color:earned?"#e8a030":"#666",lineHeight:1.3}}>{b.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:12}}>Session Log</div>
      {logs.length===0?(
        <div style={{textAlign:"center",padding:"40px 0",color:"#444"}}>
          <div style={{fontSize:40,marginBottom:12}}>🌱</div>
          <div style={{fontSize:14}}>No sessions yet. Start your first boost!</div>
        </div>
      ):[...logs].reverse().map((l,i)=>(
        <Card key={i} style={{padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{l.preset}</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{l.duration}min · {new Date(l.ts).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</div></div>
          <div style={{fontSize:24}}>{l.mood!==null?MOODS[l.mood]:"⏳"}</div>
        </Card>
      ))}
    </div>
  );
}

/* ═══ PROFILE SCREEN ════════════════════════════════════════ */
function ProfileScreen(){
  const [subliminal,setSubliminal]=useState(30);
  const [haptics,setHaptics]=useState(true);
  const [hrAdapt,setHrAdapt]=useState(false);
  const profileData=[{l:"Crowd Anxiety",v:80},{l:"Social Pressure",v:62},{l:"Performance Fear",v:75},{l:"Introversion Index",v:88}];
  return(
    <div style={{padding:"24px 20px 60px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:12}}>
          <div style={{width:74,height:74,borderRadius:"50%",background:"linear-gradient(145deg,#e8a030,#c084fc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:"0 0 0 3px #05050f,0 0 0 5px rgba(232,160,48,.35)"}}>🧠</div>
          <div style={{position:"absolute",bottom:0,right:-2,background:"#e8a030",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,border:"2px solid #05050f"}}>✦</div>
        </div>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif"}}>Stage Champion</div>
        <div style={{fontSize:12,color:"#666",marginTop:4}}>Introvert · Public Speaker · Level 2</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10}}>
          {["🏆 Level 2","🔥 Active"].map(t=><span key={t} style={{fontSize:11,background:"rgba(232,160,48,.09)",color:"#e8a030",padding:"4px 10px",borderRadius:20,border:"1px solid rgba(232,160,48,.2)"}}>{t}</span>)}
        </div>
      </div>
      <Card style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:11,letterSpacing:2,color:"#e8a030",textTransform:"uppercase",marginBottom:14,fontWeight:700}}>🧩 Neural Profile</div>
        {profileData.map(p=>(
          <div key={p.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#bbb"}}>{p.l}</span><span style={{fontSize:12,color:"#e8a030",fontWeight:700}}>{p.v}%</span></div>
            <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4}}><div style={{height:"100%",borderRadius:4,width:`${p.v}%`,background:"linear-gradient(90deg,#e8a030,#c084fc)",transition:"width 1s ease"}}/></div>
          </div>
        ))}
      </Card>
      <div style={{fontSize:10,letterSpacing:2.5,color:"#555",textTransform:"uppercase",marginBottom:12}}>Preferences</div>
      {[{l:"Haptic Calm Pulses",i:"📳",v:haptics,s:setHaptics},{l:"HR-Adaptive Intensity",i:"❤️",v:hrAdapt,s:setHrAdapt}].map(s=>(
        <Card key={s.l} style={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,color:"#bbb"}}>{s.i}  {s.l}</div>
          <Toggle on={s.v} onChange={s.s}/>
        </Card>
      ))}
      <Card style={{padding:"14px 16px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:"#bbb"}}>🔊 Subliminal Level</span><span style={{fontSize:13,color:"#e8a030",fontWeight:700}}>−{subliminal}dB</span></div>
        <input type="range" min={15} max={45} value={subliminal} onChange={e=>setSubliminal(+e.target.value)} style={{width:"100%",accentColor:"#e8a030"}}/>
        <div style={{fontSize:11,color:"#555",marginTop:8}}>Affirmations whispered subliminally beneath the music at this level</div>
      </Card>
      <div style={{padding:20,borderRadius:18,background:"linear-gradient(145deg,rgba(192,132,252,.1),rgba(232,160,48,.05))",border:"1px solid rgba(192,132,252,.2)",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>👑</div>
        <div style={{fontSize:17,fontWeight:800,color:"#c084fc",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:6}}>AuraBoost Pro</div>
        <div style={{fontSize:12,color:"#888",lineHeight:1.7,marginBottom:16}}>HR-adaptive sessions · 50+ tracks<br/>Unlimited mixes · Isochronic tones · Offline packs</div>
        <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:4}}>$4.99</div>
        <div style={{fontSize:12,color:"#666",marginBottom:16}}>per year · cancel anytime</div>
        <Ripple style={{background:"linear-gradient(135deg,#c084fc,#e8a030)",borderRadius:12,padding:"13px 32px",display:"inline-block",fontSize:14,fontWeight:800,color:"#000"}}>
          Unlock Pro ✦
        </Ripple>
      </div>
    </div>
  );
}

/* ═══ ROOT ═══════════════════════════════════════════════════ */
const TABS=[{id:"home",icon:"⚡",label:"Boost"},{id:"mixer",icon:"🎛️",label:"Mixer"},{id:"tracks",icon:"🎵",label:"Sounds"},{id:"journey",icon:"📊",label:"Journey"},{id:"profile",icon:"🧠",label:"Profile"}];

export default function AuraBoost(){
  const [onboarded,setOnboarded]=useState(false);
  const [tab,setTab]=useState("home");
  const [emergency,setEmergency]=useState(false);
  const [logs,setLogs]=useState([{preset:"Stage King",duration:10,mood:4,ts:Date.now()-86400000},{preset:"Deep Calm",duration:15,mood:3,ts:Date.now()-172800000}]);
  const [savedMixes,setSavedMixes]=useState([]);
  const addLog=useCallback(l=>setLogs(p=>[...p,l]),[]);
  useEffect(()=>()=>engine.stopAll(),[]);

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#05050f",color:"#fff",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",maxWidth:430,margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&family=Playfair+Display:wght@700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#05050f;overflow:hidden;}
        input[type=range]{appearance:none;-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,0.09);outline:none;cursor:pointer;display:block;}
        input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.4);}
        input{background:transparent;}
        ::-webkit-scrollbar{display:none;}
        @keyframes ripple{0%{transform:scale(0);opacity:.6;}100%{transform:scale(4.5);opacity:0;}}
        @keyframes orbP1{0%{transform:scale(1);opacity:.5;}100%{transform:scale(1.7);opacity:0;}}
        @keyframes floatP{0%{transform:translateY(0) scale(1);opacity:.12;}100%{transform:translateY(-18px) scale(1.25);opacity:.42;}}
        @keyframes auroraG{0%{opacity:.25;transform:scale(1) translateX(0);}100%{opacity:.6;transform:scale(1.18) translateX(4%);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes zoomIn{from{transform:scale(.65);opacity:0;}to{transform:scale(1);opacity:1;}}
        .screen{animation:fadeUp .32s ease;}
      `}</style>

      {!onboarded?(
        <div style={{flex:1,overflow:"hidden"}}>
          <Onboarding onDone={()=>setOnboarded(true)}/>
        </div>
      ):(
        <>
          {/* Header pill */}
          <div style={{textAlign:"center",padding:"12px 0 0",flexShrink:0}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"5px 14px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#e8a030",boxShadow:"0 0 8px #e8a030"}}/>
              <span style={{fontSize:11,letterSpacing:3,color:"#ffffff55",textTransform:"uppercase"}}>AuraBoost</span>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
            <div className="screen" key={tab}>
              {tab==="home"    &&<HomeScreen    onEmergency={()=>setEmergency(true)} addLog={addLog}/>}
              {tab==="mixer"   &&<MixerScreen   savedMixes={savedMixes} setSavedMixes={setSavedMixes}/>}
              {tab==="tracks"  &&<TracksScreen  />}
              {tab==="journey" &&<JourneyScreen logs={logs} setLogs={setLogs}/>}
              {tab==="profile" &&<ProfileScreen />}
            </div>
          </div>

          {/* Bottom nav */}
          <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,0.05)",background:"rgba(5,5,15,0.97)",backdropFilter:"blur(24px)",flexShrink:0,paddingBottom:"max(8px,env(safe-area-inset-bottom))"}}>
            {TABS.map(t=>(
              <Ripple key={t.id} onClick={()=>{engine.stopAll();setTab(t.id);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"9px 4px 6px"}}>
                <div style={{fontSize:19,filter:tab===t.id?"none":"grayscale(1) opacity(.3)",transition:"all .2s"}}>{t.icon}</div>
                <div style={{fontSize:10,color:tab===t.id?"#e8a030":"#444",fontWeight:tab===t.id?800:500,transition:"all .2s",letterSpacing:.3}}>{t.label}</div>
                {tab===t.id&&<div style={{width:18,height:2,background:"#e8a030",borderRadius:2}}/>}
              </Ripple>
            ))}
          </div>

          {/* Emergency overlay */}
          {emergency&&(
            <div style={{position:"absolute",inset:0,zIndex:100}}>
              <EmergencyModal onClose={()=>setEmergency(false)} addLog={addLog}/>
            </div>
          )}
        </>
      )}
    </div>
  );
}
