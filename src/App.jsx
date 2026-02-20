import { useState, useRef, useEffect, useCallback } from "react";

// ── LOGO ──
function Logo({ size = 32, textColor = "#f1f5f9", showText = true }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: showText ? size * 0.3 : 0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {[0,45,90,135,180,225,270,315].map((a,i) => <polygon key={i} points="50,18 55,30 50,42 45,30" fill="#E8531E" transform={`rotate(${a} 50 50)`}/>)}
        <circle cx="50" cy="50" r="6" fill="#E8531E"/>
      </svg>
      {showText && <span style={{ fontSize: size*.55, fontWeight: 800, color: textColor, letterSpacing: size*.02, fontFamily: "'DM Sans',system-ui,sans-serif" }}>LUMENCI<span style={{ fontSize: size*.2, verticalAlign: "super", marginLeft: 2, fontWeight: 400, opacity: .5 }}>™</span></span>}
    </div>
  );
}

const B = { orange: "#E8531E", orangeL: "#FF6B35", dark: "#05080f", border: "rgba(255,255,255,0.06)", aBg: "rgba(232,83,30,0.08)", aBrd: "rgba(232,83,30,0.25)" };

function ConfBadge({ level }) {
  const c = { strong:{bg:"#052e16",text:"#4ade80",brd:"#166534"}, moderate:{bg:"#422006",text:"#fbbf24",brd:"#854d0e"}, weak:{bg:"#450a0a",text:"#f87171",brd:"#991b1b"} }[level]||{};
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.text, border:"1px solid "+c.brd }}>{level==="strong"?"●":level==="weak"?"▲":"◐"} {level?.charAt(0).toUpperCase()+level?.slice(1)}</span>;
}
function SourceTag({ type }) {
  const m = { product_page:{l:"Product Page",c:"#60a5fa"}, tech_spec:{l:"Tech Spec",c:"#34d399"}, marketing:{l:"Marketing",c:"#fbbf24"}, regulatory:{l:"FCC/Regulatory",c:"#a78bfa"}, teardown:{l:"Teardown",c:"#f472b6"} };
  const s = m[type]||m.product_page;
  return <span style={{ display:"inline-flex", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:600, background:s.c+"15", color:s.c, border:"1px solid "+s.c+"30" }}>{s.l}</span>;
}
function QualityBar({ label, value }) {
  const color = value >= 90 ? "#4ade80" : value >= 75 ? "#fbbf24" : "#f87171";
  return (<div style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ fontSize:10, color:"#94a3b8", fontWeight:500, textTransform:"uppercase", letterSpacing:.8 }}>{label}</span><span style={{ fontSize:11, color, fontWeight:700 }}>{value}%</span></div><div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.06)" }}><div style={{ height:"100%", borderRadius:2, background:color, width:value+"%", transition:"width 0.8s ease" }}/></div></div>);
}

// ── PATENT CASES DATABASE ──
var PATENT_CASES = {
  acme: {
    id: "acme",
    title: "US123456 vs. Acme Corp Thermostat",
    short: "Acme Smart Thermostat",
    patent: "US123456",
    defendant: "Acme Corp",
    product: "Smart Thermostat Pro",
    files: { claim: "US123456_ClaimChart.xlsx", patent: "US123456_Patent.pdf", spec: "Acme_TechSpec.pdf" },
    chart: [
      { id:1, claimElement:"A temperature control device with a wireless communication module", evidence:'Acme product page: "WiFi-enabled smart thermostat connects to your home network"', reasoning:"WiFi capability satisfies the wireless communication module requirement", confidence:"strong", version:1, history:[], sourceType:"product_page" },
      { id:2, claimElement:"A motion sensor for detecting occupancy", evidence:'Acme specs: "Built-in motion sensor detects when people are home"', reasoning:"Motion sensor in specs directly maps to occupancy detection claim element", confidence:"strong", version:1, history:[], sourceType:"tech_spec" },
      { id:3, claimElement:"Machine learning algorithm that learns user temperature preferences over time", evidence:'Acme marketing: "Auto-Schedule learns your preferred temperatures"', reasoning:"Learning behavior suggests ML algorithm, though technical implementation details not disclosed. May need stronger technical evidence.", confidence:"weak", version:1, history:[], sourceType:"marketing" },
    ],
    ai: {
      strengthen: { eId:3, s:{ evidence:'Acme Engineering Blog (2024): "Proprietary neural network analyzes 14-day usage patterns with 48-hour retraining via federated learning." Patent US11,234,567: "recurrent neural network for predictive temperature schedules."', reasoning:"Multiple authoritative sources confirm ML: engineering blog references neural networks with specific training parameters, patent corroborates with RNN claims.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:95, claimMapping:90, legalPrecision:85 } },
      fix_reasoning: { eId:1, s:{ evidence:'Product page + FCC Filing confirms 802.11 b/g/n (2.4GHz) with Bluetooth 5.0 LE.', reasoning:"Satisfies wireless communication module through WiFi 802.11 b/g/n + Bluetooth 5.0 LE. Under doctrine of equivalents: same function, same way, same result.", confidence:"strong", sourceType:"regulatory" }, q:{ sourceStrength:92, claimMapping:88, legalPrecision:94 } },
      add_missing: { eId:4, ne:{ claimElement:"A temperature sensor array for multi-zone monitoring", evidence:'iFixit teardown: "Three NTC thermistors at 120° intervals + ambient sensor." Spec: "Multi-point sensing ±0.1°C."', reasoning:"Teardown confirms 4-sensor array. Constitutes array under standard claim construction.", confidence:"strong", sourceType:"teardown" }, q:{ sourceStrength:96, claimMapping:85, legalPrecision:80 } },
      clarify_legal: { eId:2, s:{ evidence:'Acme specs: "PIR sensor, 120° cone, 5m range, occupancy within 30 seconds." Manual §4.2: "Home/Away Assist uses motion sensor."', reasoning:"Under Phillips v. AWH Corp. (Fed. Cir. 2005), detecting occupancy satisfied by PIR sensor. Acme uses occupancy terminology, preempting construction arguments.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:88, claimMapping:92, legalPrecision:97 } },
    },
    initMsg: "Claim chart loaded — 3 elements from Patent US123456 vs. Acme Corp.",
    analysisMsg: "I've analyzed your chart:\n\n● Element 1 (Wireless Module) — Strong ✓\n● Element 2 (Motion Sensor) — Strong ✓\n● Element 3 (ML Algorithm) — ⚠️ Weak\n\nRecommend starting with Element 3. Want me to find stronger evidence?",
    strengthenMsg: "Found stronger evidence for **Element {eId}**:\n\n📋 **Acme Engineering Blog** — Neural network, federated learning\n📜 **Patent US11,234,567** — RNN for predictive scheduling\n\n⚡ Confidence: Weak → **Strong**",
    fixMsg: "Strengthened **Element {eId}**:\n\n🏛️ **FCC filing** — 802.11 b/g/n + BT 5.0 LE\n⚖️ **Doctrine of equivalents** applied",
    addMsg: "Found **missing element**:\n\n🔧 **Teardown** — 3 NTC thermistors + ambient sensor",
    legalMsg: "Rewrote **Element {eId}** with legal defense:\n\n⚖️ **Phillips v. AWH Corp.** applied\n📋 Occupancy vs. motion addressed",
  },
  nova: {
    id: "nova",
    title: "US789012 vs. NovaTech Smartwatch",
    short: "NovaTech Pulse X Smartwatch",
    patent: "US789012",
    defendant: "NovaTech Inc",
    product: "Pulse X Smartwatch",
    files: { claim: "US789012_ClaimChart.xlsx", patent: "US789012_Patent.pdf", spec: "NovaTech_PulseX_Spec.pdf" },
    chart: [
      { id:1, claimElement:"A wrist-worn device with a photoplethysmography (PPG) sensor for continuous heart rate monitoring", evidence:'NovaTech product listing: "Advanced heart rate tracking using green LED optical sensor"', reasoning:"Green LED optical sensor is consistent with PPG technology used for heart rate. Product confirms continuous monitoring capability.", confidence:"strong", version:1, history:[], sourceType:"product_page" },
      { id:2, claimElement:"An electrodermal activity (EDA) sensor for measuring stress levels", evidence:'NovaTech marketing brochure: "Stress tracking helps you manage your day"', reasoning:"Marketing mentions stress tracking but does not specify EDA sensor technology. Could use HRV-based estimation instead. Evidence is insufficient to confirm EDA hardware.", confidence:"weak", version:1, history:[], sourceType:"marketing" },
      { id:3, claimElement:"A blood oxygen saturation (SpO2) measurement module using dual-wavelength LED", evidence:'NovaTech spec sheet: "SpO2 sensor with red and infrared LEDs, ±2% accuracy"', reasoning:"Dual LED (red + infrared) matches dual-wavelength claim. Accuracy spec confirms functional measurement module.", confidence:"strong", version:1, history:[], sourceType:"tech_spec" },
      { id:4, claimElement:"Wireless transmission of health data to a remote server for trend analysis", evidence:'NovaTech privacy policy: "Health data synced to NovaTech Cloud for personalized insights"', reasoning:"Cloud sync implies wireless transmission and remote server storage, but privacy policy is not technical documentation. Needs architecture evidence.", confidence:"moderate", version:1, history:[], sourceType:"product_page" },
    ],
    ai: {
      strengthen: { eId:2, s:{ evidence:'NovaTech Hardware Teardown (TechInsights, 2025): "Analog Devices AD5940 electrodermal impedance IC identified on PCB, connected to two stainless steel electrodes on case back." FCC ID filing: "EDA sensor operates at 20Hz sampling with 1µS resolution."', reasoning:"Teardown physically identifies EDA-specific IC (AD5940) and dedicated electrodes. FCC filing confirms EDA operating parameters. This is direct hardware evidence, not inference from software features.", confidence:"strong", sourceType:"teardown" }, q:{ sourceStrength:97, claimMapping:94, legalPrecision:88 } },
      fix_reasoning: { eId:4, s:{ evidence:'NovaTech Developer API Docs: "REST API endpoint /v2/health/sync transmits JSON over TLS 1.3 to AWS us-east-1." Architecture whitepaper: "Real-time streaming via BLE 5.2 to phone, then HTTPS to NovaTech Cloud."', reasoning:"Developer docs confirm specific wireless protocol chain: BLE 5.2 → phone → HTTPS/TLS 1.3 → AWS. Constitutes wireless transmission to remote server. Trend analysis confirmed by /analytics endpoint.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:93, claimMapping:91, legalPrecision:90 } },
      add_missing: { eId:5, ne:{ claimElement:"An accelerometer and gyroscope module for fall detection and activity classification", evidence:'NovaTech teardown: "Bosch BMI270 6-axis IMU identified. Spec: ±16g accelerometer, 2000°/s gyroscope." App changelog v4.2: "Fall detection now enabled."', reasoning:"6-axis IMU provides both accelerometer and gyroscope in single module. Fall detection feature confirms activity classification algorithm utilizing sensor data.", confidence:"strong", sourceType:"teardown" }, q:{ sourceStrength:94, claimMapping:86, legalPrecision:82 } },
      clarify_legal: { eId:1, s:{ evidence:'NovaTech spec: "PPG sensor: 2x green LEDs (525nm), 1x photodiode, 25Hz continuous sampling." Patent US789012 claim 1: "photoplethysmography sensor for continuous heart rate monitoring."', reasoning:"Under Vitronics Corp. v. Conceptronic (Fed. Cir. 1996), intrinsic evidence governs: patent specification defines PPG as optical pulse measurement. NovaTech green LED system performs identical function. Continuous = 25Hz uninterrupted sampling.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:90, claimMapping:95, legalPrecision:96 } },
    },
    initMsg: "Claim chart loaded — 4 elements from Patent US789012 vs. NovaTech Pulse X Smartwatch.",
    analysisMsg: "I've analyzed your chart:\n\n● Element 1 (PPG Heart Rate) — Strong ✓\n● Element 2 (EDA Stress Sensor) — ⚠️ Weak\n● Element 3 (SpO2 Module) — Strong ✓\n● Element 4 (Wireless Health Data) — ◐ Moderate\n\nElement 2 has the weakest evidence — marketing claims only. Recommend strengthening with hardware teardown data.",
    strengthenMsg: "Found stronger evidence for **Element {eId}**:\n\n🔧 **TechInsights Teardown** — AD5940 EDA IC + steel electrodes\n🏛️ **FCC Filing** — 20Hz sampling, 1µS resolution\n\n⚡ Confidence: Weak → **Strong**",
    fixMsg: "Strengthened **Element {eId}**:\n\n📋 **Developer API Docs** — REST endpoint, TLS 1.3, AWS\n📄 **Architecture Whitepaper** — BLE 5.2 → HTTPS pipeline",
    addMsg: "Found **missing element**:\n\n🔧 **Teardown** — Bosch BMI270 6-axis IMU\n📱 **App Changelog** — Fall detection v4.2",
    legalMsg: "Rewrote **Element {eId}** with legal defense:\n\n⚖️ **Vitronics Corp. v. Conceptronic** applied\n📋 PPG optical definition + continuous sampling standard",
  },
  zenith: {
    id: "zenith",
    title: "US345678 vs. Zenith Robotics Vacuum",
    short: "Zenith AutoClean Pro",
    patent: "US345678",
    defendant: "Zenith Robotics",
    product: "AutoClean Pro 3000",
    files: { claim: "US345678_ClaimChart.xlsx", patent: "US345678_Patent.pdf", spec: "Zenith_AutoClean_Spec.pdf" },
    chart: [
      { id:1, claimElement:"An autonomous navigation system using simultaneous localization and mapping (SLAM)", evidence:'Zenith product page: "LiDAR-based smart navigation maps your home in real-time"', reasoning:"LiDAR navigation with real-time mapping is consistent with SLAM technology. Product confirms autonomous path planning.", confidence:"strong", version:1, history:[], sourceType:"product_page" },
      { id:2, claimElement:"A multi-surface brush assembly with automatic speed adjustment based on floor type detection", evidence:'Zenith spec sheet: "Dual rubber extractors with carpet boost mode"', reasoning:"Carpet boost suggests automatic adjustment, but spec does not explicitly describe floor type detection sensor or algorithm. Could be pressure-based rather than intelligent detection.", confidence:"weak", version:1, history:[], sourceType:"tech_spec" },
      { id:3, claimElement:"A docking station with automatic debris extraction and battery charging", evidence:'Zenith marketing: "Clean Base empties itself so you don\'t have to. Auto-recharge and resume."', reasoning:"Marketing confirms both debris extraction and charging in docking station. However, marketing language is not technical evidence for the extraction mechanism.", confidence:"moderate", version:1, history:[], sourceType:"marketing" },
    ],
    ai: {
      strengthen: { eId:2, s:{ evidence:'Zenith Engineering Patent US11,987,654 (2024): "Optical floor sensor using infrared reflectance to classify carpet, hardwood, and tile. Brush motor RPM adjusted via PID controller: 1500 RPM (hard floor), 2800 RPM (carpet)." Teardown report: "Vishay VCNL4040 proximity/ambient light sensor on undercarriage confirmed."', reasoning:"Patent filing discloses specific floor detection sensor (IR reflectance) and control algorithm (PID). Teardown identifies exact sensor IC. Satisfies both detection and automatic adjustment sub-elements.", confidence:"strong", sourceType:"teardown" }, q:{ sourceStrength:96, claimMapping:93, legalPrecision:87 } },
      fix_reasoning: { eId:1, s:{ evidence:'Zenith spec: "RPLIDAR A1 360° laser scanner, 8000 samples/sec, 12m range. SLAM algorithm: Hector SLAM with loop closure." Developer SDK: "Real-time occupancy grid at 5cm resolution."', reasoning:"RPLIDAR A1 provides laser ranging for SLAM input. Hector SLAM algorithm identified by name — established SLAM variant. Loop closure confirms full SLAM capability. Under claim construction, SLAM is satisfied by any algorithm performing simultaneous localization and mapping.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:94, claimMapping:96, legalPrecision:91 } },
      add_missing: { eId:4, ne:{ claimElement:"A virtual boundary system allowing user-defined no-go zones", evidence:'Zenith App v3.1 release notes: "Draw no-go zones on your map." API docs: "POST /zones with polygon coordinates stored on-device." Teardown: "Persistent map stored in 4GB eMMC flash."', reasoning:"App demonstrates user-defined virtual boundaries. API confirms polygon-based zone definition. On-device storage ensures persistence across cleaning sessions.", confidence:"strong", sourceType:"tech_spec" }, q:{ sourceStrength:91, claimMapping:88, legalPrecision:83 } },
      clarify_legal: { eId:3, s:{ evidence:'Zenith teardown: "500W vacuum motor in base station with cyclonic separation chamber. Motorized rubber gasket creates airtight seal during extraction. 18650 Li-ion cells, 5200mAh, CC-CV charging via pogo pins." Patent US11,456,789: "debris extraction via negative pressure differential."', reasoning:"Under KSR Int\'l v. Teleflex (U.S. 2007), the combination of known elements (vacuum extraction + pogo pin charging) in a single docking station is non-obvious when combined. Teardown provides specific mechanism details that directly map to claim language.", confidence:"strong", sourceType:"teardown" }, q:{ sourceStrength:93, claimMapping:90, legalPrecision:95 } },
    },
    initMsg: "Claim chart loaded — 3 elements from Patent US345678 vs. Zenith AutoClean Pro 3000.",
    analysisMsg: "I've analyzed your chart:\n\n● Element 1 (SLAM Navigation) — Strong ✓\n● Element 2 (Multi-Surface Brush) — ⚠️ Weak\n● Element 3 (Docking Station) — ◐ Moderate\n\nElement 2 lacks technical evidence for floor type detection. Recommend strengthening with teardown or patent data.",
    strengthenMsg: "Found stronger evidence for **Element {eId}**:\n\n📜 **Zenith Patent US11,987,654** — IR floor sensor + PID controller\n🔧 **Teardown** — Vishay VCNL4040 sensor IC confirmed\n\n⚡ Confidence: Weak → **Strong**",
    fixMsg: "Strengthened **Element {eId}**:\n\n📋 **Spec Sheet** — RPLIDAR A1, Hector SLAM, loop closure\n💻 **Developer SDK** — 5cm resolution occupancy grid",
    addMsg: "Found **missing element**:\n\n📱 **App v3.1** — No-go zone drawing\n💻 **API Docs** — Polygon zone storage on-device",
    legalMsg: "Rewrote **Element {eId}** with legal defense:\n\n⚖️ **KSR Int'l v. Teleflex** applied\n🔧 Cyclonic extraction + pogo pin charging mechanism",
  }
};

var DEFAULT_CASE = "acme";

// ═══ HELP BOT ═══
const HELP_MAP = [
  { keys:["upload","import","file"], resp:"To upload your claim chart, click the **Claim Chart** card on the setup screen. We accept Excel (.xlsx), CSV, and Word (.docx). The file should have columns for Patent Claim Element, Evidence, and AI Reasoning." },
  { keys:["format","excel","csv","word","pdf"], resp:"Lumenci supports **Excel (.xlsx)**, **CSV**, and **Word (.docx)** for claim charts. For supporting docs, use **PDF** or **DOCX**. You can also paste a **URL** for web scraping." },
  { keys:["strengthen","improve","better","weak"], resp:"Type a message like **'Strengthen evidence for element 3'** in chat. The AI will search your uploaded documents for stronger technical sources and propose changes with a quality score." },
  { keys:["accept","reject","modify","review"], resp:"When AI suggests changes:\n\n✅ **Accept** — applies changes\n❌ **Reject** — keeps current version\n✏️ **Modify** — request adjustments" },
  { keys:["export","download","save"], resp:"Click **Export** in the chart header, or type **'Export to Word'** in chat. Formats: Word (.docx) for legal, PDF for read-only, CSV for data." },
  { keys:["undo","revert","history","version"], resp:"Type **'Undo last change'** or **'Revert element 3'**. The AI shows the previous version and confirms before reverting." },
  { keys:["guided","step by step","walk"], resp:"**Guided Mode** walks through each element step-by-step. The AI flags weaknesses and suggests improvements in order. Type **'Start guided mode'** in chat." },
  { keys:["quality","score","metric"], resp:"Quality scores measure:\n\n📊 **Source Strength** — how authoritative\n🎯 **Claim Mapping** — how directly evidence fits\n⚖️ **Legal Precision** — claim construction defense" },
  { keys:["source","tag","color"], resp:"Source tags show evidence origin:\n\n🌐 Product Page (blue) · 📋 Tech Spec (green) · 📢 Marketing (yellow) · 🏛️ Regulatory (purple) · 🔧 Teardown (pink)" },
];

function matchHelp(msg) {
  var l = msg.toLowerCase();
  var found = HELP_MAP.find(function(h) { return h.keys.some(function(k) { return l.includes(k); }); });
  return found ? found.resp : "I'm here to help! Ask about:\n\n• **Uploading documents**\n• **Refining claims**\n• **Accept/Reject workflow**\n• **Exporting** — Word, PDF, CSV\n• **Quality scores & source tags**\n• **Guided mode**\n\nWhat would you like to know?";
}

function HelpBot({ visible, onClose }) {
  const [msgs, setMsgs] = useState([{ id:0, role:"bot", text:"Hi! I'm your Lumenci help assistant. Ask me anything about using the platform." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const inRef = useRef(null);
  useEffect(function() { if(endRef.current) endRef.current.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);
  useEffect(function() { if(visible) setTimeout(function() { if(inRef.current) inRef.current.focus(); }, 200); }, [visible]);
  var send = function(text) {
    var q = (text||input).trim(); if(!q||typing) return;
    setInput(""); setMsgs(function(p) { return p.concat([{ id:Date.now(), role:"user", text:q }]); }); setTyping(true);
    setTimeout(function() { setMsgs(function(p) { return p.concat([{ id:Date.now()+1, role:"bot", text:matchHelp(q) }]); }); setTyping(false); }, 700);
  };
  var renderText = function(t) { return t.split(/(\*\*.*?\*\*)/).map(function(p,i) { return (p.startsWith("**")&&p.endsWith("**")) ? <strong key={i} style={{ color:"#f1f5f9" }}>{p.slice(2,-2)}</strong> : <span key={i}>{p}</span>; }); };
  if(!visible) return null;
  return (
    <div style={{ position:"fixed", bottom:80, right:20, width:340, maxHeight:480, borderRadius:16, background:"#0c1220", border:"1px solid "+B.border, boxShadow:"0 8px 40px rgba(0,0,0,0.6)", display:"flex", flexDirection:"column", zIndex:999, overflow:"hidden", animation:"helpUp 0.3s ease" }}>
      <div style={{ padding:"12px 16px", background:"linear-gradient(135deg, rgba(232,83,30,0.12), rgba(232,83,30,0.04))", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:B.aBg, border:"1px solid "+B.aBrd, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💡</div><div><div style={{ color:"#f1f5f9", fontSize:13, fontWeight:700 }}>Help Assistant</div><div style={{ color:"#4ade80", fontSize:9, fontWeight:600 }}>● Always online</div></div></div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:16, cursor:"pointer", padding:4 }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:12, minHeight:200, maxHeight:320 }}>
        {msgs.map(function(m) { return (<div key={m.id} style={{ marginBottom:10, display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}><div style={{ maxWidth:"85%", padding:"8px 12px", borderRadius:m.role==="user"?"12px 12px 3px 12px":"3px 12px 12px 12px", background:m.role==="user"?"linear-gradient(135deg,"+B.orange+",#c2410c)":"rgba(255,255,255,0.04)", border:m.role==="user"?"none":"1px solid "+B.border, color:"#e2e8f0", fontSize:12, lineHeight:1.6 }}><div style={{ whiteSpace:"pre-wrap" }}>{renderText(m.text)}</div></div></div>); })}
        {typing && <div style={{ display:"inline-flex", padding:"8px 14px", borderRadius:"3px 12px 12px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid "+B.border, gap:4 }}>{[0,1,2].map(function(i) { return <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:B.orange, opacity:.6, animation:"bounce 1.2s infinite "+(i*.15)+"s" }}/>; })}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"0 12px 6px", display:"flex", flexWrap:"wrap", gap:4 }}>
        {["How to upload?","Quality scores?","Export options","Guided mode"].map(function(q) { return <button key={q} onClick={function(){send(q);}} style={{ padding:"3px 9px", borderRadius:12, border:"1px solid "+B.border, background:"rgba(255,255,255,0.02)", color:"#94a3b8", fontSize:10, cursor:"pointer" }}>{q}</button>; })}
      </div>
      <div style={{ padding:"8px 12px", borderTop:"1px solid "+B.border }}>
        <div style={{ display:"flex", gap:6 }}>
          <input ref={inRef} value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Ask for help..." style={{ flex:1, padding:"8px 12px", borderRadius:8, border:"1px solid "+B.border, background:"rgba(255,255,255,0.03)", color:"#e2e8f0", fontSize:12, outline:"none", fontFamily:"inherit" }}/>
          <button onClick={function(){send();}} disabled={!input.trim()} style={{ padding:"8px 14px", borderRadius:8, border:"none", background:input.trim()?"linear-gradient(135deg,"+B.orange+","+B.orangeL+")":"rgba(255,255,255,0.03)", color:input.trim()?"#fff":"#475569", fontSize:11, fontWeight:700, cursor:input.trim()?"pointer":"not-allowed" }}>Send</button>
        </div>
      </div>
    </div>
  );
}

function HelpFAB({ onClick, pulse }) {
  return <button onClick={onClick} style={{ position:"fixed", bottom:20, right:20, width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", border:"none", color:"#fff", fontSize:22, cursor:"pointer", boxShadow:"0 4px 20px rgba(232,83,30,0.4)", zIndex:998, display:"flex", alignItems:"center", justifyContent:"center", animation:pulse?"fabPulse 2s infinite":"none" }} onMouseEnter={function(e){e.currentTarget.style.transform="scale(1.08)";}} onMouseLeave={function(e){e.currentTarget.style.transform="scale(1)";}}>💡</button>;
}

// ═══════════════════════════════════════════
// DEMO PLAYER WITH AUDIO NARRATION
// ═══════════════════════════════════════════
var SCENES = [
  { id:0, t:0, d:4, title:"Welcome to Lumenci", narration:"Sarah, a patent analyst at a top IP firm, opens Lumenci Assistant to refine a claim chart for an upcoming infringement case against Acme Corp.", phase:"landing" },
  { id:1, t:4, d:2.5, title:"Starting Analysis", narration:"She clicks Start Analysis to begin a new claim chart refinement session.", phase:"landing-click" },
  { id:2, t:6.5, d:3.5, title:"Setup — Upload Documents", narration:"The setup screen loads. Sarah needs to upload her claim chart, an Excel file mapping patent claims to Acme's thermostat features.", phase:"setup-empty" },
  { id:3, t:10, d:2.5, title:"Claim Chart Uploaded", narration:"She uploads the claim chart with 3 patent claim elements. The system parses it instantly.", phase:"setup-chart" },
  { id:4, t:12.5, d:2.5, title:"Adding Patent and Specs", narration:"Sarah also uploads the patent document and Acme's product spec PDF for richer AI context.", phase:"setup-docs" },
  { id:5, t:15, d:3, title:"AI Configuration", narration:"She configures the AI to focus on technical evidence, flag claim construction risks, and cite specific sources.", phase:"setup-config" },
  { id:6, t:18, d:2, title:"Begin Refinement", narration:"Everything ready. She clicks Begin Refinement to enter the workspace.", phase:"setup-go" },
  { id:7, t:20, d:4, title:"Workspace Loaded", narration:"The split workspace opens. Claim chart on the left with 3 elements. AI chat on the right. The AI flags Element 3, the ML Algorithm, as weak.", phase:"ws-init" },
  { id:8, t:24, d:3, title:"Requesting Stronger Evidence", narration:"Sarah types: Strengthen evidence for element 3, the ML algorithm claim is weak. She presses Enter.", phase:"ws-typing" },
  { id:9, t:27, d:2.5, title:"AI Processing", narration:"The AI searches through uploaded documents for stronger technical evidence.", phase:"ws-thinking" },
  { id:10, t:29.5, d:5, title:"AI Suggests Improvements", narration:"AI finds evidence from Acme's engineering blog about neural networks and federated learning, plus Patent US 11,234,567 referencing a recurrent neural network. Quality score: 95% source strength. Confidence upgrades from Weak to Strong.", phase:"ws-suggestion" },
  { id:11, t:34.5, d:2.5, title:"Accepting Changes", narration:"Sarah reviews the quality metrics and clicks Accept. The claim chart updates in real time.", phase:"ws-accept" },
  { id:12, t:37, d:3, title:"Chart Updated", narration:"Element 3 now shows Strong confidence with verified technical sources. Version increments to v2 with full history saved.", phase:"ws-updated" },
  { id:13, t:40, d:3, title:"Opening Help Assistant", narration:"Sarah notices the help button and clicks it. She wants to understand what quality scores mean.", phase:"ws-help-open" },
  { id:14, t:43, d:4, title:"Getting Help", narration:"She asks: What do quality scores mean? The help assistant explains Source Strength, Claim Mapping, and Legal Precision.", phase:"ws-help-chat" },
  { id:15, t:47, d:2, title:"Help Received", narration:"Clear guidance received. Sarah closes the help panel and continues refining.", phase:"ws-help-close" },
  { id:16, t:49, d:3, title:"Clarifying Legal Language", narration:"She types: Clarify legal language for element 2. The AI adds Phillips v. AWH Corp citations and reframes the reasoning.", phase:"ws-legal" },
  { id:17, t:52, d:2.5, title:"Exporting the Chart", narration:"Satisfied with all refinements, Sarah clicks Export. Summary: 3 strong elements, zero weak, 2 refinements applied.", phase:"ws-export" },
  { id:18, t:54.5, d:3, title:"Download Word Document", narration:"She selects Word Document, formatted for legal proceedings. The refined claim chart downloads as a docx file.", phase:"export-modal" },
  { id:19, t:57.5, d:3.5, title:"Analysis Complete!", narration:"Sarah's claim chart is now court-ready with strengthened evidence, legal-grade reasoning, and proper source citations. All refined through conversation in under 10 minutes.", phase:"complete" },
];
var TOTAL_DUR = 61;

function DemoPlayer({ onClose }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [hoverT, setHoverT] = useState(null);
  const [audioOn, setAudioOn] = useState(true);
  const [volume, setVolume] = useState(80);
  const [showVolSlider, setShowVolSlider] = useState(false);
  const raf = useRef(null);
  const lastTick = useRef(null);
  const lastSpokenScene = useRef(-1);
  const utterRef = useRef(null);

  var scene = SCENES.reduce(function(best, s) { return (time >= s.t ? s : best); }, SCENES[0]);
  var pct = (time / TOTAL_DUR) * 100;

  // ── Speech synthesis helpers ──
  var speak = useCallback(function(text, sceneDuration) {
    if (!window.speechSynthesis || !audioOn) return;
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    // Calculate words per minute needed to fit scene duration
    var wordCount = text.split(/\s+/).length;
    var targetWPM = (wordCount / (sceneDuration || 3)) * 60;
    // speechSynthesis rate: 0.1-10, default ~150 WPM at rate 1
    var baseRate = targetWPM / 150;
    // Clamp and factor in playback speed
    var finalRate = Math.max(0.5, Math.min(2.5, baseRate * speed));
    utter.rate = finalRate;
    utter.volume = volume / 100;
    utter.pitch = 1;
    var voices = window.speechSynthesis.getVoices();
    var preferred = voices.find(function(v) { return v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.includes("Microsoft Zira"); });
    if (!preferred) preferred = voices.find(function(v) { return v.lang.startsWith("en") && v.name.toLowerCase().includes("female"); });
    if (!preferred) preferred = voices.find(function(v) { return v.lang.startsWith("en"); });
    if (preferred) utter.voice = preferred;
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [audioOn, volume, speed]);

  var stopSpeech = useCallback(function() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  // ── Auto-narrate on scene change ──
  useEffect(function() {
    if (playing && audioOn && scene.id !== lastSpokenScene.current) {
      lastSpokenScene.current = scene.id;
      speak(scene.narration, scene.d);
    }
  }, [scene.id, playing, audioOn, speak]);

  // ── Pause/resume speech with play state ──
  useEffect(function() {
    if (!window.speechSynthesis) return;
    if (!playing) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
  }, [playing]);

  // ── Update volume on existing utterance ──
  useEffect(function() {
    if (utterRef.current) {
      utterRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ── Cleanup on unmount ──
  useEffect(function() {
    return function() { stopSpeech(); };
  }, [stopSpeech]);

  // ── Load voices (some browsers need this) ──
  useEffect(function() {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
    }
  }, []);

  // ── Smooth playback with rAF ──
  useEffect(function() {
    if (playing) {
      lastTick.current = performance.now();
      var tick = function(now) {
        var dt = (now - lastTick.current) / 1000 * speed;
        lastTick.current = now;
        setTime(function(prev) {
          var next = prev + dt;
          if (next >= TOTAL_DUR) { setPlaying(false); return TOTAL_DUR; }
          return next;
        });
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
    }
    return function() { cancelAnimationFrame(raf.current); };
  }, [playing, speed]);

  var seek = function(t) {
    var newTime = Math.max(0, Math.min(TOTAL_DUR, t));
    setTime(newTime);
    stopSpeech();
    // Find which scene this time lands in and speak it
    var targetScene = SCENES.reduce(function(best, s) { return (newTime >= s.t ? s : best); }, SCENES[0]);
    lastSpokenScene.current = targetScene.id;
    if (playing && audioOn) {
      setTimeout(function() { speak(targetScene.narration, targetScene.d); }, 100);
    }
  };

  var toggleAudio = function() {
    if (audioOn) { stopSpeech(); setAudioOn(false); }
    else { setAudioOn(true); if (playing) { lastSpokenScene.current = -1; } }
  };

  var fmt = function(t) { return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0"); };

  var p = scene.phase;
  var cursors = { "landing-click":{x:50,y:70}, "setup-chart":{x:35,y:38}, "setup-docs":{x:65,y:38}, "setup-config":{x:55,y:62}, "setup-go":{x:55,y:82}, "ws-typing":{x:75,y:90}, "ws-suggestion":{x:75,y:58}, "ws-accept":{x:65,y:78}, "ws-updated":{x:25,y:60}, "ws-help-open":{x:95,y:92}, "ws-help-chat":{x:86,y:78}, "ws-help-close":{x:90,y:42}, "ws-legal":{x:75,y:90}, "ws-export":{x:20,y:8}, "export-modal":{x:50,y:58} };
  var cur = cursors[p];
  var isClick = ["landing-click","setup-chart","setup-docs","setup-go","ws-accept","ws-help-open","ws-help-close","ws-export","export-modal"].indexOf(p) >= 0;
  var isType = ["setup-config","ws-typing","ws-help-chat","ws-legal"].indexOf(p) >= 0;
  var el3Strong = time >= 37;
  var el2Legal = time >= 52;
  var showHelp = p.startsWith("ws-help");
  var isTyping = p === "ws-thinking";
  var showSugg = p === "ws-suggestion" || p === "ws-accept";
  var isExport = p === "ws-export" || p === "export-modal";
  var isDone = p === "complete";

  var renderScene = function() {
    if (p==="landing"||p==="landing-click") {
      var clicked = p==="landing-click";
      return (<div style={{ height:"100%", background:"radial-gradient(ellipse at 50% 30%, rgba(232,83,30,0.06), transparent 70%), #05080f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}><Logo size={24} textColor="#f1f5f9"/><div style={{ color:"#f8fafc", fontSize:18, fontWeight:800, textAlign:"center", marginTop:12, lineHeight:1.2 }}>Refine claim charts<br/><span style={{ color:B.orange }}>through conversation</span></div><div style={{ color:"#94a3b8", fontSize:9, textAlign:"center", marginTop:6, maxWidth:240 }}>Upload your claim chart, chat with AI, export court-ready documents.</div><div style={{ display:"flex", gap:8, marginTop:14 }}><div style={{ padding:"7px 18px", borderRadius:7, background:clicked?B.orangeL:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", color:"#fff", fontSize:10, fontWeight:700, transform:clicked?"scale(0.95)":"none", boxShadow:clicked?"0 0 20px rgba(232,83,30,0.6)":"0 0 14px rgba(232,83,30,0.25)", transition:"all 0.2s" }}>Start Analysis →</div><div style={{ padding:"7px 18px", borderRadius:7, border:"1px solid rgba(255,255,255,0.1)", color:"#cbd5e1", fontSize:10, fontWeight:600 }}>Watch Demo</div></div></div>);
    }
    if (p.startsWith("setup")) {
      var hasChart=["setup-chart","setup-docs","setup-config","setup-go"].indexOf(p)>=0;
      var hasDocs=["setup-docs","setup-config","setup-go"].indexOf(p)>=0;
      var hasConfig=["setup-config","setup-go"].indexOf(p)>=0;
      var isGo=p==="setup-go";
      return (<div style={{ height:"100%", background:B.dark, display:"flex" }}><div style={{ width:110, padding:"10px 8px", borderRight:"1px solid "+B.border }}><Logo size={12} textColor="#f1f5f9"/><div style={{ marginTop:14 }}>{[{l:"Upload",ok:hasChart},{l:"Configure",ok:hasConfig},{l:"Start",ok:false}].map(function(s,i){return(<div key={i} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}><div style={{ width:14, height:14, borderRadius:"50%", background:s.ok?"#052e16":"rgba(255,255,255,0.04)", border:"1px solid "+(s.ok?"#166534":B.border), display:"flex", alignItems:"center", justifyContent:"center", fontSize:6, fontWeight:700, color:s.ok?"#4ade80":"#64748b" }}>{s.ok?"✓":i+1}</div><span style={{ color:"#94a3b8", fontSize:7 }}>{s.l}</span></div>);})}</div></div><div style={{ flex:1, padding:"10px 14px", overflow:"auto" }}><div style={{ color:"#f1f5f9", fontSize:11, fontWeight:800, marginBottom:8 }}>New Analysis Session</div><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:8 }}>{[{icon:"📊",label:"Claim Chart",file:"ClaimChart.xlsx",up:hasChart},{icon:"📜",label:"Patent",file:"US123456.pdf",up:hasDocs},{icon:"📋",label:"Specs",file:"AcmeSpec.pdf",up:hasDocs},{icon:"🌐",label:"URL",up:false}].map(function(d,i){return(<div key={i} style={{ padding:"5px 7px", borderRadius:5, border:d.up?"1px solid rgba(74,222,128,0.2)":"1px dashed rgba(255,255,255,0.08)", background:d.up?"rgba(74,222,128,0.03)":"rgba(255,255,255,0.01)" }}><span style={{ fontSize:10 }}>{d.up?"✅":d.icon}</span><div style={{ color:d.up?"#4ade80":"#e2e8f0", fontSize:7, fontWeight:600, marginTop:1 }}>{d.up?d.file:d.label}</div></div>);})}</div>{hasConfig&&<div style={{ marginBottom:8 }}><div style={{ color:B.orange, fontSize:6, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>AI Instructions</div><div style={{ padding:"4px 6px", borderRadius:4, background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, color:"#94a3b8", fontSize:6.5, lineHeight:1.4 }}>Focus on technical evidence. Flag risks.</div></div>}<div style={{ padding:"6px 12px", borderRadius:6, textAlign:"center", background:isGo?B.orangeL:hasChart?"linear-gradient(135deg,"+B.orange+","+B.orangeL+")":"rgba(255,255,255,0.04)", color:hasChart?"#fff":"#475569", fontSize:9, fontWeight:700, transform:isGo?"scale(0.96)":"none" }}>{hasChart?"🚀 Begin Refinement":"Upload to continue"}</div></div></div>);
    }
    // WORKSPACE
    return (<div style={{ height:"100%", background:B.dark, display:"flex", position:"relative" }}><div style={{ width:"44%", display:"flex", flexDirection:"column", borderRight:"1px solid "+B.border }}><div style={{ padding:"4px 7px", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", gap:4 }}><Logo size={9} showText={false}/><span style={{ color:"#f1f5f9", fontSize:7, fontWeight:700 }}>US123456 vs Acme</span></div><div style={{ flex:1, overflow:"auto", padding:4 }}>{[{id:1,name:"Wireless Module",conf:"strong",v:1},{id:2,name:"Motion Sensor",conf:"strong",v:el2Legal?2:1},{id:3,name:"ML Algorithm",conf:el3Strong?"strong":"weak",v:el3Strong?2:1}].map(function(el){var hl=showSugg&&el.id===3;return(<div key={el.id} style={{ marginBottom:3, borderRadius:5, border:hl?"1px solid "+B.orange:"1px solid "+B.border, background:hl?B.aBg:"rgba(255,255,255,0.01)", overflow:"hidden", transition:"all 0.4s" }}><div style={{ padding:"3px 5px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.02)" }}><div style={{ display:"flex", alignItems:"center", gap:3 }}><span style={{ width:12, height:12, borderRadius:2, background:B.aBg, border:"1px solid "+B.aBrd, color:B.orange, display:"flex", alignItems:"center", justifyContent:"center", fontSize:6, fontWeight:700 }}>{el.id}</span><span style={{ padding:"0px 4px", borderRadius:6, fontSize:5.5, fontWeight:600, background:el.conf==="strong"?"#052e16":"#450a0a", color:el.conf==="strong"?"#4ade80":"#f87171", border:"1px solid "+(el.conf==="strong"?"#166534":"#991b1b") }}>{el.conf}</span></div><span style={{ color:"#475569", fontSize:5.5 }}>v{el.v}</span></div><div style={{ padding:"2px 5px" }}><div style={{ color:"#e2e8f0", fontSize:6.5, lineHeight:1.3 }}>{el.name}</div><div style={{ color:"#7dd3fc", fontSize:5.5, fontStyle:"italic", marginTop:1 }}>{el.id===3&&el3Strong?"Engineering Blog + Patent":el.id===2&&el2Legal?"PIR specs + Phillips v. AWH":"Source docs..."}</div></div></div>);})}</div></div><div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}><div style={{ padding:"4px 7px", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", gap:4 }}><div style={{ width:4, height:4, borderRadius:"50%", background:"#4ade80" }}/><span style={{ color:"#f1f5f9", fontSize:7, fontWeight:700 }}>Lumenci AI</span></div><div style={{ flex:1, overflow:"auto", padding:5, fontSize:6.5 }}><div style={{ marginBottom:4 }}><div style={{ padding:"3px 5px", borderRadius:"2px 5px 5px 5px", background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", color:"#e2e8f0", fontSize:6.5 }}>Chart loaded — 3 elements. Element 3 is <span style={{ color:"#f87171" }}>weak</span>.</div></div>{time>=24&&!showHelp&&<div style={{ marginBottom:4, display:"flex", justifyContent:"flex-end" }}><div style={{ padding:"3px 5px", borderRadius:"5px 5px 2px 5px", background:"linear-gradient(135deg,"+B.orange+",#c2410c)", color:"#fff", fontSize:6.5, maxWidth:"72%" }}>{time>=49?"Clarify legal for element 2":"Strengthen evidence for element 3"}</div></div>}{isTyping&&<div style={{ marginBottom:4 }}><div style={{ display:"inline-flex", padding:"3px 7px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, gap:2 }}>{[0,1,2].map(function(i){return <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:B.orange, opacity:.7, animation:"bounce 1s infinite "+(i*.15)+"s" }}/>;})}</div></div>}{showSugg&&<div style={{ marginBottom:4 }}><div style={{ padding:"3px 5px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, color:"#e2e8f0", fontSize:6.5, lineHeight:1.3 }}>Found stronger evidence. Confidence: Weak → <span style={{ color:"#4ade80", fontWeight:700 }}>Strong</span></div><div style={{ marginTop:2, padding:"3px 5px", borderRadius:4, background:"rgba(255,255,255,0.01)", border:"1px solid "+B.border }}>{[{l:"Source",v:95},{l:"Map",v:90},{l:"Legal",v:85}].map(function(q){return<div key={q.l} style={{ marginBottom:1.5 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:5, color:"#94a3b8" }}>{q.l}</span><span style={{ fontSize:5.5, color:"#4ade80", fontWeight:700 }}>{q.v}%</span></div><div style={{ height:1.5, borderRadius:1, background:"rgba(255,255,255,0.05)" }}><div style={{ height:"100%", borderRadius:1, background:"#4ade80", width:q.v+"%" }}/></div></div>;})}</div></div>}{p==="ws-suggestion"&&<div style={{ display:"flex", gap:2, marginBottom:4 }}>{[{l:"✅ Accept",c:"#4ade80"},{l:"❌ Reject",c:"#f87171"},{l:"✏️ Modify",c:"#fbbf24"}].map(function(b){return<div key={b.l} style={{ padding:"1.5px 5px", borderRadius:3, border:"1px solid "+b.c+"30", background:b.c+"08", color:b.c, fontSize:5.5, fontWeight:700 }}>{b.l}</div>;})}</div>}{el3Strong&&time<49&&!showHelp&&<div style={{ marginBottom:4 }}><div style={{ padding:"3px 5px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, color:"#e2e8f0", fontSize:6.5 }}>✅ Element 3 updated. All Strong.</div></div>}{time>=49&&time<52&&!showHelp&&<div style={{ marginBottom:4 }}><div style={{ padding:"3px 5px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, color:"#e2e8f0", fontSize:6.5 }}>Element 2 updated with Phillips v. AWH ⚖️</div></div>}</div><div style={{ padding:"3px 5px", borderTop:"1px solid "+B.border }}><div style={{ display:"flex", gap:2 }}><div style={{ flex:1, padding:"3px 5px", borderRadius:4, border:"1px solid "+B.border, background:"rgba(255,255,255,0.02)", color:(p==="ws-typing"||p==="ws-legal")?"#e2e8f0":"#475569", fontSize:6.5 }}>{p==="ws-typing"?"Strengthen evidence for element 3...":p==="ws-legal"?"Clarify legal for element 2...":"Ask to refine..."}</div><div style={{ padding:"3px 7px", borderRadius:4, background:(p==="ws-typing"||p==="ws-legal")?B.orange:"rgba(255,255,255,0.03)", color:(p==="ws-typing"||p==="ws-legal")?"#fff":"#475569", fontSize:6, fontWeight:700 }}>Send</div></div></div></div>{showHelp&&<div style={{ position:"absolute", bottom:5, right:5, width:"44%", borderRadius:6, background:"#0c1220", border:"1px solid "+B.border, boxShadow:"0 4px 16px rgba(0,0,0,0.5)", overflow:"hidden", animation:"helpUp 0.25s ease" }}><div style={{ padding:"4px 6px", background:"linear-gradient(135deg, rgba(232,83,30,0.1), transparent)", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}><div style={{ display:"flex", alignItems:"center", gap:3 }}><span style={{ fontSize:8 }}>💡</span><span style={{ color:"#f1f5f9", fontSize:7, fontWeight:700 }}>Help Assistant</span></div><span style={{ color:"#64748b", fontSize:7 }}>✕</span></div><div style={{ padding:4, maxHeight:100, overflow:"auto" }}><div style={{ marginBottom:3, padding:"2px 4px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.03)", border:"1px solid "+B.border, color:"#e2e8f0", fontSize:6 }}>Hi! Ask me anything about Lumenci.</div>{(p==="ws-help-chat"||p==="ws-help-close")&&<><div style={{ marginBottom:3, display:"flex", justifyContent:"flex-end" }}><div style={{ padding:"2px 4px", borderRadius:"5px 5px 2px 5px", background:"linear-gradient(135deg,"+B.orange+",#c2410c)", color:"#fff", fontSize:6 }}>What do quality scores mean?</div></div><div style={{ padding:"2px 4px", borderRadius:"2px 5px 5px 5px", background:"rgba(255,255,255,0.03)", border:"1px solid "+B.border, color:"#e2e8f0", fontSize:6, lineHeight:1.4 }}><span style={{ color:"#4ade80", fontWeight:600 }}>Source Strength</span>, <span style={{ color:"#fbbf24", fontWeight:600 }}>Claim Mapping</span>, <span style={{ color:"#a78bfa", fontWeight:600 }}>Legal Precision</span></div></>}</div></div>}{!showHelp&&!isExport&&!isDone&&<div style={{ position:"absolute", bottom:5, right:5, width:16, height:16, borderRadius:4, background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>💡</div>}{isExport&&<div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8 }}><div style={{ width:"55%", padding:10, borderRadius:8, background:"#0f172a", border:"1px solid "+B.border }}><div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:5 }}><Logo size={10} showText={false}/><span style={{ color:"#f1f5f9", fontSize:9, fontWeight:800 }}>Export</span></div><div style={{ display:"flex", justifyContent:"space-around", padding:"4px 0", marginBottom:5 }}>{[{l:"Strong",c:3,cl:"#4ade80"},{l:"Weak",c:0,cl:"#f87171"}].map(function(x){return<div key={x.l} style={{ textAlign:"center" }}><div style={{ color:x.cl, fontSize:12, fontWeight:800 }}>{x.c}</div><div style={{ color:"#64748b", fontSize:6 }}>{x.l}</div></div>;})}</div><div style={{ padding:"4px 6px", borderRadius:4, border:"1px solid "+B.aBrd, background:B.aBg }}><div style={{ color:B.orange, fontSize:7, fontWeight:600 }}>📄 Word (.docx)</div></div></div></div>}{isDone&&<div style={{ position:"absolute", inset:0, background:"rgba(5,8,15,0.88)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8 }}><div style={{ textAlign:"center" }}><Logo size={22} textColor="#f1f5f9"/><div style={{ color:"#4ade80", fontSize:12, fontWeight:800, marginTop:8 }}>✅ Analysis Complete</div><div style={{ color:"#94a3b8", fontSize:8, marginTop:2 }}>Court-ready chart exported</div><div style={{ display:"flex", justifyContent:"center", gap:14, marginTop:8 }}>{[{v:"3/3",l:"Strong"},{v:"2",l:"Refined"},{v:"<10m",l:"Time"}].map(function(x){return<div key={x.l} style={{ textAlign:"center" }}><div style={{ color:"#f1f5f9", fontSize:12, fontWeight:800 }}>{x.v}</div><div style={{ color:"#64748b", fontSize:6 }}>{x.l}</div></div>;})}</div></div></div>}</div>);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <div style={{ width:700, maxWidth:"94vw" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}><Logo size={18} textColor="#f1f5f9"/><span style={{ color:"#94a3b8", fontSize:12 }}>Product Demo</span></div>
          <button onClick={function(){stopSpeech();onClose();}} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid "+B.border, borderRadius:7, color:"#94a3b8", padding:"5px 12px", fontSize:11, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>✕ Close</button>
        </div>
        <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)", background:B.dark, aspectRatio:"16/10" }}>
          {renderScene()}
          {cur&&<div style={{ position:"absolute", left:cur.x+"%", top:cur.y+"%", transform:"translate(-50%,-50%)", zIndex:50, pointerEvents:"none", transition:"left 0.5s cubic-bezier(0.4,0,0.2,1), top 0.5s cubic-bezier(0.4,0,0.2,1)" }}><div style={{ width:12, height:12, borderRadius:"50%", background:isClick?"rgba(232,83,30,0.5)":"rgba(255,255,255,0.25)", border:"2px solid rgba(255,255,255,0.8)", boxShadow:isClick?"0 0 14px rgba(232,83,30,0.5)":"0 0 6px rgba(255,255,255,0.15)", animation:isClick?"click 0.6s ease":isType?"typeCur 0.7s infinite":"none" }}/>{isClick&&<div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:"1.5px solid rgba(232,83,30,0.3)", animation:"ripple 0.8s ease-out" }}/>}</div>}
        </div>
        {/* Narration */}
        <div style={{ margin:"8px 0", padding:"8px 14px", borderRadius:8, background:"rgba(255,255,255,0.025)", border:"1px solid "+B.border, display:"flex", alignItems:"flex-start", gap:8, minHeight:42 }}>
          <div style={{ width:18, height:18, borderRadius:5, background:B.aBg, border:"1px solid "+B.aBrd, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, flexShrink:0, marginTop:1 }}>🎬</div>
          <div style={{ flex:1 }}><div style={{ color:B.orange, fontSize:10, fontWeight:700, marginBottom:1 }}>{scene.title}</div><div style={{ color:"#cbd5e1", fontSize:11, lineHeight:1.5 }}>{scene.narration}</div></div>
          <span style={{ color:"#475569", fontSize:9, fontWeight:600, whiteSpace:"nowrap", flexShrink:0 }}>{scene.id+1}/{SCENES.length}</span>
        </div>
        {/* Controls */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid "+B.border, borderRadius:8, padding:"8px 14px" }}>
          <div style={{ position:"relative", height:6, borderRadius:3, background:"rgba(255,255,255,0.06)", cursor:"pointer", marginBottom:8 }} onClick={function(e){var r=e.currentTarget.getBoundingClientRect();seek((e.clientX-r.left)/r.width*TOTAL_DUR);}} onMouseMove={function(e){var r=e.currentTarget.getBoundingClientRect();setHoverT(((e.clientX-r.left)/r.width)*TOTAL_DUR);}} onMouseLeave={function(){setHoverT(null);}}>
            {SCENES.map(function(sc){return<div key={sc.id} style={{ position:"absolute", left:(sc.t/TOTAL_DUR)*100+"%", top:0, width:1, height:6, background:"rgba(255,255,255,0.1)", borderRadius:1 }}/>;})
            }
            <div style={{ height:"100%", borderRadius:3, background:"linear-gradient(90deg,"+B.orange+","+B.orangeL+")", width:pct+"%", transition:playing?"none":"width 0.15s ease", position:"relative" }}><div style={{ position:"absolute", right:-5, top:-2, width:10, height:10, borderRadius:"50%", background:"#fff", boxShadow:"0 0 6px "+B.orange }}/></div>
            {hoverT!==null&&<div style={{ position:"absolute", left:(hoverT/TOTAL_DUR)*100+"%", top:-22, transform:"translateX(-50%)", background:"#1e293b", color:"#e2e8f0", padding:"1px 6px", borderRadius:3, fontSize:9, fontWeight:600 }}>{fmt(hoverT)}</div>}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <button onClick={function(){seek(time-5);}} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:6, color:"#e2e8f0", padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>⏪ 5s</button>
              <button onClick={function(){if(time>=TOTAL_DUR){setTime(0);lastSpokenScene.current=-1;}setPlaying(!playing);}} style={{ background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", border:"none", borderRadius:8, color:"#fff", width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 14px rgba(232,83,30,0.3)", fontSize:15 }}>{playing?"⏸":"▶"}</button>
              <button onClick={function(){seek(time+5);}} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:6, color:"#e2e8f0", padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>5s ⏩</button>
              <span style={{ color:"#94a3b8", fontSize:11, fontWeight:600, marginLeft:4, fontFamily:"monospace" }}>{fmt(time)} / {fmt(TOTAL_DUR)}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {/* Audio Controls */}
              <div style={{ display:"flex", alignItems:"center", gap:3, position:"relative" }}>
                <button onClick={toggleAudio} style={{ background:audioOn?"rgba(74,222,128,0.1)":"rgba(255,255,255,0.06)", border:audioOn?"1px solid rgba(74,222,128,0.3)":"1px solid "+B.border, borderRadius:6, color:audioOn?"#4ade80":"#64748b", padding:"4px 8px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:3 }} title={audioOn?"Mute narration":"Enable narration"}>
                  {audioOn ? "🔊" : "🔇"}
                </button>
                <div onClick={function(){setShowVolSlider(!showVolSlider);}} style={{ cursor:"pointer", padding:"4px 6px", borderRadius:6, background:showVolSlider?B.aBg:"rgba(255,255,255,0.04)", border:"1px solid "+(showVolSlider?B.aBrd:B.border) }}>
                  <span style={{ fontSize:10, color:showVolSlider?B.orange:"#94a3b8", fontWeight:600 }}>{volume}%</span>
                </div>
                {/* Volume slider popup */}
                {showVolSlider&&<div style={{ position:"absolute", bottom:"100%", right:0, marginBottom:8, padding:"12px 14px", borderRadius:10, background:"#0c1220", border:"1px solid "+B.border, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", width:180, zIndex:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:"#94a3b8", fontSize:10, fontWeight:600 }}>Volume</span><span style={{ color:"#f1f5f9", fontSize:11, fontWeight:700 }}>{volume}%</span></div>
                  <div style={{ position:"relative", height:6, borderRadius:3, background:"rgba(255,255,255,0.06)", cursor:"pointer" }} onClick={function(e){var r=e.currentTarget.getBoundingClientRect();var v=Math.round(((e.clientX-r.left)/r.width)*100);setVolume(Math.max(0,Math.min(100,v)));}}>
                    <div style={{ height:"100%", borderRadius:3, background:"linear-gradient(90deg,"+B.orange+","+B.orangeL+")", width:volume+"%", position:"relative" }}>
                      <div style={{ position:"absolute", right:-5, top:-2, width:10, height:10, borderRadius:"50%", background:"#fff", boxShadow:"0 0 4px rgba(232,83,30,0.4)" }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                    {[0,25,50,75,100].map(function(v){return <button key={v} onClick={function(){setVolume(v);}} style={{ padding:"2px 6px", borderRadius:4, border:volume===v?"1px solid "+B.aBrd:"1px solid "+B.border, background:volume===v?B.aBg:"transparent", color:volume===v?B.orange:"#64748b", fontSize:9, cursor:"pointer", fontWeight:600 }}>{v}</button>;})}
                  </div>
                </div>}
              </div>
              <div style={{ width:1, height:20, background:B.border }}/>
              {/* Speed */}
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <span style={{ color:"#64748b", fontSize:10 }}>Speed:</span>
                {[0.5,1,1.5,2].map(function(sp){return<button key={sp} onClick={function(){setSpeed(sp);}} style={{ padding:"3px 8px", borderRadius:5, border:speed===sp?"1px solid "+B.aBrd:"1px solid "+B.border, background:speed===sp?B.aBg:"transparent", color:speed===sp?B.orange:"#94a3b8", fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{sp}x</button>;})}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ FILE EXPORT FUNCTIONS ═══
function exportToWord(chart) {
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Calibri,Arial,sans-serif;margin:40px;color:#1a1a1a}h1{color:#E8531E;font-size:22px;border-bottom:2px solid #E8531E;padding-bottom:8px}h2{color:#333;font-size:16px;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:12px}th{background:#E8531E;color:white;padding:10px 12px;text-align:left;font-size:12px}td{border:1px solid #ddd;padding:10px 12px;font-size:11px;vertical-align:top}tr:nth-child(even){background:#f8f8f8}.badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:bold}.strong{background:#dcfce7;color:#166534}.weak{background:#fee2e2;color:#991b1b}.moderate{background:#fef3c7;color:#854d0e}.footer{margin-top:30px;padding-top:12px;border-top:1px solid #ddd;color:#999;font-size:10px}</style></head><body>';
  html += '<h1>Lumenci™ — Claim Chart Analysis Report</h1>';
  html += '<p><strong>Generated:</strong> ' + new Date().toLocaleString() + '</p>';
  html += '<p><strong>Patent:</strong> US123456 vs. Acme Corp Thermostat</p>';
  html += '<p><strong>Elements:</strong> ' + chart.length + ' | <strong>Strong:</strong> ' + chart.filter(function(e){return e.confidence==="strong";}).length + ' | <strong>Weak:</strong> ' + chart.filter(function(e){return e.confidence==="weak";}).length + '</p>';
  html += '<h2>Claim Chart</h2>';
  html += '<table><tr><th>#</th><th>Patent Claim Element</th><th>Accused Product Feature (Evidence)</th><th>AI Reasoning</th><th>Confidence</th><th>Version</th></tr>';
  chart.forEach(function(el) {
    var badgeClass = el.confidence === "strong" ? "strong" : el.confidence === "weak" ? "weak" : "moderate";
    html += '<tr><td>' + el.id + '</td><td>' + el.claimElement + '</td><td><em>' + el.evidence + '</em></td><td>' + el.reasoning + '</td><td><span class="badge ' + badgeClass + '">' + el.confidence.toUpperCase() + '</span></td><td>v' + el.version + '</td></tr>';
  });
  html += '</table>';
  html += '<div class="footer">Report generated by Lumenci™ AI Patent Analysis Platform. This document is intended for legal review purposes.</div>';
  html += '</body></html>';
  var blob = new Blob([html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'Lumenci_ClaimChart_US123456.doc'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportToCSV(chart) {
  var csv = 'Element #,Patent Claim Element,Evidence,AI Reasoning,Confidence,Version\n';
  chart.forEach(function(el) {
    csv += el.id + ',"' + el.claimElement.replace(/"/g,'""') + '","' + el.evidence.replace(/"/g,'""') + '","' + el.reasoning.replace(/"/g,'""') + '",' + el.confidence + ',v' + el.version + '\n';
  });
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'Lumenci_ClaimChart_US123456.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportToPDF(chart) {
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Lumenci Claim Chart</title><style>@page{size:A4 landscape;margin:20mm}body{font-family:Helvetica,Arial,sans-serif;margin:0;padding:30px;color:#1a1a1a;font-size:11px}h1{color:#E8531E;font-size:20px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:14px;page-break-inside:auto}th{background:#E8531E;color:white;padding:8px 10px;text-align:left;font-size:10px}td{border:1px solid #ccc;padding:8px 10px;font-size:10px;vertical-align:top}tr:nth-child(even){background:#f9f9f9}.meta{color:#666;margin-bottom:16px;font-size:10px}</style></head><body>';
  html += '<h1>Lumenci™ Claim Chart Report</h1>';
  html += '<div class="meta">Patent US123456 vs. Acme Corp | Generated: ' + new Date().toLocaleString() + ' | Elements: ' + chart.length + '</div>';
  html += '<table><tr><th>#</th><th>Patent Claim Element</th><th>Evidence</th><th>AI Reasoning</th><th>Confidence</th></tr>';
  chart.forEach(function(el) {
    html += '<tr><td>' + el.id + '</td><td>' + el.claimElement + '</td><td>' + el.evidence + '</td><td>' + el.reasoning + '</td><td>' + el.confidence.toUpperCase() + '</td></tr>';
  });
  html += '</table></body></html>';
  var win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(function() { win.print(); }, 500);
}

// ═══ MAIN APP ═══
export default function App() {
  const [page, setPage] = useState("landing");
  const [chart, setChart] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pending, setPending] = useState(null);
  const [hi, setHi] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedCase, setSelectedCase] = useState(DEFAULT_CASE);
  const [sysP, setSysP] = useState("Focus on technically precise evidence and legally sound reasoning. Cite specific sources.");
  const [showHist, setShowHist] = useState(null);
  const [chartOpen, setChartOpen] = useState(true);
  const [exportModal, setExportModal] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpPulse, setHelpPulse] = useState(true);
  const [flashId, setFlashId] = useState(null);
  const chatEnd = useRef(null);
  const inRef = useRef(null);
  const featRef = useRef(null);
  const howRef = useRef(null);
  const secRef = useRef(null);
  const [fade, setFade] = useState(false);

  useEffect(function(){setFade(true);},[]);
  useEffect(function(){if(chatEnd.current) chatEnd.current.scrollIntoView({behavior:"smooth"});}, [msgs,typing]);
  useEffect(function(){if(helpOpen) setHelpPulse(false);}, [helpOpen]);

  var addMsg = useCallback(function(r,c,m){setMsgs(function(p){return p.concat([{id:Date.now()+Math.random(),role:r,content:c,meta:m,ts:new Date()}]);});}, []);
  var activeCase = PATENT_CASES[selectedCase];
  var uploadFile = function(t){var cf=activeCase.files;var f={claim:{name:cf.claim,type:"Claim Chart",size:"2.4 MB"},patent:{name:cf.patent,type:"Patent",size:"8.1 MB"},spec:{name:cf.spec,type:"Product Spec",size:"4.7 MB"},url:{name:activeCase.defendant.toLowerCase().replace(/\s/g,"")+".com/product/specs",type:"Web URL",size:"URL"}};var file=f[t];if(file&&!files.find(function(x){return x.name===file.name;})) setFiles(function(p){return p.concat([file]);});};
  var startAnalysis = function(){if(!files.find(function(f){return f.type==="Claim Chart";})) return;setChart(activeCase.chart.map(function(e){return Object.assign({},e,{history:[]});}));setPage("workspace");setTimeout(function(){addMsg("system",activeCase.initMsg);setTimeout(function(){addMsg("assistant",activeCase.analysisMsg);},600);},400);};
  var classify = function(m){var l=m.toLowerCase();if(l.includes("strengthen")||l.includes("weak")||l.includes("element 3")) return "strengthen";if(l.includes("fix")||(l.includes("reasoning")&&l.includes("element 1"))) return "fix_reasoning";if(l.includes("missing")||l.includes("add")||l.includes("temperature sensor")) return "add_missing";if(l.includes("clarif")||l.includes("legal")||l.includes("element 2")) return "clarify_legal";if(l.includes("undo")||l.includes("revert")) return "undo";if(l.includes("export")||l.includes("download")) return "export";return "general";};
  var send = function(){if(!input.trim()||typing) return;var m=input.trim();setInput("");addMsg("user",m);setTyping(true);var intent=classify(m);var cAI=activeCase.ai;setTimeout(function(){if(intent==="strengthen"){var r=cAI.strengthen;addMsg("assistant",activeCase.strengthenMsg.replace("{eId}",r.eId),{type:"suggestion",elementId:r.eId,quality:r.q});setPending(Object.assign({elementId:r.eId},r.s));setHi(r.eId);}else if(intent==="fix_reasoning"){var r=cAI.fix_reasoning;addMsg("assistant",activeCase.fixMsg.replace("{eId}",r.eId),{type:"suggestion",elementId:r.eId,quality:r.q});setPending(Object.assign({elementId:r.eId},r.s));setHi(r.eId);}else if(intent==="add_missing"){var r=cAI.add_missing;addMsg("assistant",activeCase.addMsg,{type:"new_element",quality:r.q});setPending(Object.assign({type:"new"},r.ne));}else if(intent==="clarify_legal"){var r=cAI.clarify_legal;addMsg("assistant",activeCase.legalMsg.replace("{eId}",r.eId),{type:"suggestion",elementId:r.eId,quality:r.q});setPending(Object.assign({elementId:r.eId},r.s));setHi(r.eId);}else if(intent==="undo"){var mod=chart.find(function(e){return e.history.length>0;});if(mod){addMsg("assistant","Revert **Element "+mod.id+"** to v"+(mod.version-1)+"?",{type:"undo"});setPending({type:"undo",elementId:mod.id});}else addMsg("assistant","No changes to undo yet.");}else if(intent==="export"){setExportModal(true);addMsg("assistant","Ready: **"+chart.length+" elements** · "+chart.filter(function(e){return e.confidence==="strong";}).length+" strong");}else addMsg("assistant","Try:\n\n● \"Strengthen evidence for element "+cAI.strengthen.eId+"\"\n● \"Fix reasoning for element "+cAI.fix_reasoning.eId+"\"\n● \"Add missing element\"\n● \"Clarify legal for element "+cAI.clarify_legal.eId+"\"\n● \"Undo\" · \"Export\"");setTyping(false);},1400);};
  var accept = function(){if(!pending) return;if(pending.type==="new"){setChart(function(p){return p.concat([{id:p.length+1,claimElement:pending.claimElement,evidence:pending.evidence,reasoning:pending.reasoning,confidence:pending.confidence,version:1,history:[],sourceType:pending.sourceType||"tech_spec"}]);});addMsg("user","✅ Added");addMsg("assistant","Element added. Chart updated in real-time.");setFlashId(chart.length+1);setTimeout(function(){setFlashId(null);},2000);}else if(pending.type==="undo"){var undoId=pending.elementId;setChart(function(p){return p.map(function(e){if(e.id===undoId&&e.history.length>0){var h=e.history[e.history.length-1];return Object.assign({},e,h,{version:e.version+1,history:e.history.slice(0,-1)});}return e;});});addMsg("user","↩️ Reverted");addMsg("assistant","Element "+undoId+" reverted. Chart updated.");setFlashId(undoId);setTimeout(function(){setFlashId(null);},2000);}else{var updateId=pending.elementId;setChart(function(p){return p.map(function(e){if(e.id===updateId) return Object.assign({},e,{history:e.history.concat([{evidence:e.evidence,reasoning:e.reasoning,confidence:e.confidence}]),evidence:pending.evidence,reasoning:pending.reasoning,confidence:pending.confidence,sourceType:pending.sourceType||e.sourceType,version:e.version+1});return e;});});addMsg("user","✅ Accepted");addMsg("assistant","Element "+updateId+" updated — evidence, reasoning, and confidence columns refreshed in the chart.");setFlashId(updateId);setTimeout(function(){setFlashId(null);},2000);}setPending(null);setHi(null);};
  var reject = function(){addMsg("user","❌ Rejected");addMsg("assistant","Keeping current version.");setPending(null);setHi(null);};
  var renderMd = function(t){return t.split(/(\*\*.*?\*\*)/).map(function(p,i){return (p.startsWith("**")&&p.endsWith("**"))?<strong key={i} style={{color:"#f1f5f9",fontWeight:700}}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>;});};
  var scrollTo = function(ref){if(ref.current) ref.current.scrollIntoView({behavior:"smooth",block:"start"});};
  var hasCC = files.find(function(f){return f.type==="Claim Chart";});

  // ═══ LANDING ═══
  if (page==="landing") return (
    <div style={{ minHeight:"100vh", background:B.dark, fontFamily:"'DM Sans',system-ui,sans-serif", overflow:"auto", position:"relative" }}>
      <div style={{ position:"fixed", top:"-15%", left:"50%", transform:"translateX(-50%)", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,83,30,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <nav style={{ position:"sticky", top:0, zIndex:20, padding:"14px 44px", display:"flex", justifyContent:"space-between", alignItems:"center", backdropFilter:"blur(12px)", background:"rgba(5,8,15,0.8)", borderBottom:"1px solid "+B.border, opacity:fade?1:0, transition:"opacity 0.6s ease 0.1s" }}>
        <Logo size={28} textColor="#f1f5f9"/>
        <div style={{ display:"flex", gap:28, alignItems:"center" }}>
          {[{l:"Features",r:featRef},{l:"How it Works",r:howRef},{l:"Security",r:secRef}].map(function(x){return <span key={x.l} onClick={function(){scrollTo(x.r);}} style={{ color:"#94a3b8", fontSize:13, cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={function(e){e.target.style.color="#f1f5f9";}} onMouseLeave={function(e){e.target.style.color="#94a3b8";}}>{x.l}</span>;})}
          <button onClick={function(){setPage("setup");}} style={{ padding:"7px 18px", borderRadius:7, border:"1px solid "+B.aBrd, background:B.aBg, color:B.orange, fontSize:12, fontWeight:600, cursor:"pointer" }}>Launch App →</button>
        </div>
      </nav>
      <div style={{ position:"relative", zIndex:10, maxWidth:880, margin:"0 auto", padding:"80px 44px 40px", textAlign:"center", opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(30px)", transition:"all 1s ease 0.3s" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:18, background:B.aBg, border:"1px solid "+B.aBrd, marginBottom:24 }}><div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", animation:"pDot 2s infinite" }}/><span style={{ color:B.orange, fontSize:11, fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>AI-Powered Patent Analysis</span></div>
        <h1 style={{ color:"#f8fafc", fontSize:50, fontWeight:800, lineHeight:1.1, margin:"0 0 20px", letterSpacing:-2 }}>Refine claim charts<br/><span style={{ background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>through conversation</span></h1>
        <p style={{ color:"#94a3b8", fontSize:17, lineHeight:1.7, maxWidth:600, margin:"0 auto 36px" }}>Patent analysts upload claim charts, then use conversational AI to strengthen evidence, fix weak reasoning, and clarify legal language — exporting court-ready documents in minutes.</p>
        <div style={{ display:"flex", gap:14, justifyContent:"center" }}>
          <button onClick={function(){setPage("setup");}} style={{ padding:"13px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 0 36px rgba(232,83,30,0.3)" }}>Start Analysis →</button>
          <button onClick={function(){setShowDemo(true);}} style={{ padding:"13px 32px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", color:"#cbd5e1", fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>▶ Watch Demo</button>
        </div>
      </div>
      <div style={{ position:"relative", zIndex:10, maxWidth:880, margin:"0 auto", padding:"0 44px" }}><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, opacity:fade?1:0, transition:"opacity 1s ease 0.6s" }}>{[{icon:"📊",title:"Upload & Parse",desc:"Claim charts (Excel, CSV, Word), patent docs, product specs — parsed instantly into a structured 3-column view."},{icon:"💬",title:"Chat to Refine",desc:"Natural language requests to strengthen evidence, fix reasoning, add missing elements, or clarify legal language."},{icon:"📄",title:"Export Court-Ready",desc:"Refined charts exported to Word format for legal proceedings with full version history and source citations."}].map(function(f,i){return(<div key={i} style={{ padding:"20px 22px", borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, textAlign:"center" }}><div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div><div style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, marginBottom:6 }}>{f.title}</div><div style={{ color:"#94a3b8", fontSize:12, lineHeight:1.5 }}>{f.desc}</div></div>);})}</div></div>
      <div ref={featRef} style={{ position:"relative", zIndex:10, maxWidth:960, margin:"56px auto 0", padding:"0 44px" }}><div style={{ textAlign:"center", marginBottom:28 }}><div style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Features</div><h2 style={{ color:"#f1f5f9", fontSize:28, fontWeight:800, margin:0 }}>Built for Patent Analysts</h2></div><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>{[{i:"🧠",t:"Smart Evidence Search",d:"AI searches uploaded documents to find the strongest evidence for each claim element."},{i:"⚖️",t:"Legal-Grade Reasoning",d:"Doctrine of equivalents, Phillips v. AWH standards, and proper legal citations applied automatically."},{i:"🛡️",t:"Human-in-the-Loop",d:"Every suggestion requires explicit approval. Accept, reject, or modify. Full history with undo."},{i:"📊",t:"Quality Scoring",d:"Every suggestion rated on Source Strength, Claim Mapping, and Legal Precision."},{i:"🧭",t:"Guided Refinement",d:"AI identifies weak elements and walks through them in priority order."},{i:"🔍",t:"Source Verification",d:"Color-coded tags: Tech Spec (green), Product Page (blue), Marketing (yellow), Regulatory (purple), Teardown (pink)."}].map(function(f,i){return(<div key={i} style={{ padding:24, borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, transition:"all 0.3s" }} onMouseEnter={function(e){e.currentTarget.style.borderColor=B.aBrd;e.currentTarget.style.background=B.aBg;}} onMouseLeave={function(e){e.currentTarget.style.borderColor=B.border;e.currentTarget.style.background="rgba(255,255,255,0.02)";}}><div style={{ fontSize:24, marginBottom:12 }}>{f.i}</div><h3 style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 6px" }}>{f.t}</h3><p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.5, margin:0 }}>{f.d}</p></div>);})}</div></div>
      <div ref={howRef} style={{ position:"relative", zIndex:10, maxWidth:800, margin:"56px auto 0", padding:"0 44px" }}><div style={{ textAlign:"center", marginBottom:28 }}><div style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>How it Works</div><h2 style={{ color:"#f1f5f9", fontSize:28, fontWeight:800, margin:0 }}>From Upload to Export in 4 Steps</h2></div>{[{n:1,t:"Upload Claim Chart & Documents",d:"Upload your claim chart (Excel/CSV/Word) along with patent docs and product specifications."},{n:2,t:"Chat to Request Refinements",d:"Use natural language: 'Strengthen evidence for element 3', 'Fix the reasoning.' The AI understands your intent."},{n:3,t:"Review AI Suggestions",d:"New evidence, rewritten reasoning, legal citations. Every suggestion shows quality scores. Accept, reject, or modify."},{n:4,t:"Export Court-Ready Document",d:"Export refined claim chart as Word (.docx) for legal proceedings. Full version history included."}].map(function(s,i){return(<div key={i} style={{ display:"flex", gap:16, marginBottom:20, alignItems:"flex-start" }}><div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:800, flexShrink:0 }}>{s.n}</div><div><div style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, marginBottom:4 }}>{s.t}</div><div style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6 }}>{s.d}</div></div></div>);})}</div>
      <div ref={secRef} style={{ position:"relative", zIndex:10, maxWidth:800, margin:"56px auto 0", padding:"0 44px" }}><div style={{ textAlign:"center", marginBottom:28 }}><div style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Security & Trust</div><h2 style={{ color:"#f1f5f9", fontSize:28, fontWeight:800, margin:0 }}>Patent Data Stays Protected</h2></div><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>{[{i:"🔒",t:"No Data Retention",d:"Documents processed in-session only. Nothing stored."},{i:"🛡️",t:"Human Oversight",d:"AI never auto-applies changes. Every modification needs approval."},{i:"📋",t:"Full Audit Trail",d:"Version history with timestamps for legal defensibility."},{i:"🔐",t:"Encrypted Transit",d:"TLS 1.3 encryption. Documents never leave your session."}].map(function(s,i){return(<div key={i} style={{ padding:20, borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border }}><span style={{ fontSize:22 }}>{s.i}</span><div style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, marginTop:8, marginBottom:4 }}>{s.t}</div><div style={{ color:"#94a3b8", fontSize:12, lineHeight:1.5 }}>{s.d}</div></div>);})}</div></div>
      <div style={{ position:"relative", zIndex:10, textAlign:"center", padding:"56px 44px 20px" }}><button onClick={function(){setPage("setup");}} style={{ padding:"14px 36px", borderRadius:10, border:"none", background:"linear-gradient(135deg,"+B.orange+","+B.orangeL+")", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 0 30px rgba(232,83,30,0.25)" }}>Start Your First Analysis →</button></div>
      <div style={{ position:"relative", zIndex:10, textAlign:"center", padding:"32px 44px 20px", borderTop:"1px solid "+B.border, marginTop:40 }}><Logo size={18} textColor="#475569"/><div style={{ color:"#334155", fontSize:11, marginTop:6 }}>AI-Powered Patent Analysis Platform</div></div>
      {showDemo&&<DemoPlayer onClose={function(){setShowDemo(false);}}/>}
      <style>{`@keyframes pDot{0%,100%{opacity:1}50%{opacity:.4}} @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-3px)}} @keyframes helpUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes click{0%{transform:scale(1)}50%{transform:scale(0.7)}100%{transform:scale(1)}} @keyframes typeCur{0%,100%{opacity:1}50%{opacity:.3}} @keyframes ripple{from{transform:scale(0.5);opacity:1}to{transform:scale(2);opacity:0}} @keyframes fabPulse{0%,100%{box-shadow:0 4px 20px rgba(232,83,30,0.4)}50%{box-shadow:0 4px 30px rgba(232,83,30,0.7)}} html{scroll-behavior:smooth}`}</style>
    </div>
  );

  // ═══ SETUP ═══
  if (page==="setup") return (
    <div style={{ minHeight:"100vh", background:B.dark, fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex", position:"relative" }}>
      <div style={{ width:280, padding:"32px 28px", borderRight:"1px solid "+B.border }}><div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}><div style={{ cursor:"pointer" }} onClick={function(){setPage("landing");}}><Logo size={24} textColor="#f1f5f9"/></div></div><button onClick={function(){setPage("landing");}} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"1px solid "+B.border, background:"rgba(255,255,255,0.02)", color:"#94a3b8", fontSize:11, fontWeight:600, cursor:"pointer", marginBottom:28, width:"100%" }} onMouseEnter={function(e){e.currentTarget.style.borderColor=B.aBrd;e.currentTarget.style.color=B.orange;}} onMouseLeave={function(e){e.currentTarget.style.borderColor=B.border;e.currentTarget.style.color="#94a3b8";}}>← Back to Home</button>{[{s:1,l:"Upload",d:"Claim chart + docs",done:files.length>0},{s:2,l:"Configure",d:"AI preferences",done:false},{s:3,l:"Start",d:"Begin refinement",done:false}].map(function(x,i){return(<div key={i} style={{ display:"flex", gap:12, marginBottom:24 }}><div style={{ width:28, height:28, borderRadius:"50%", background:x.done?"#052e16":"rgba(255,255,255,0.04)", border:"1px solid "+(x.done?"#166534":B.border), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:x.done?"#4ade80":"#64748b", flexShrink:0 }}>{x.done?"✓":x.s}</div><div><div style={{ color:"#e2e8f0", fontSize:13, fontWeight:600 }}>{x.l}</div><div style={{ color:"#64748b", fontSize:11, marginTop:1 }}>{x.d}</div></div></div>);})}</div>
      <div style={{ flex:1, padding:"40px 52px", maxWidth:620, overflowY:"auto" }}>
        <h1 style={{ color:"#f1f5f9", fontSize:24, fontWeight:800, margin:"0 0 6px" }}>New Analysis Session</h1>
        <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 28px" }}>Select a patent case, upload documents, and configure the AI.</p>
        <div style={{ marginBottom:24 }}><h3 style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Select Patent Case</h3><div style={{ display:"flex", flexDirection:"column", gap:8 }}>{Object.values(PATENT_CASES).map(function(c){var isSel=selectedCase===c.id;return<div key={c.id} onClick={function(){setSelectedCase(c.id);setFiles([]);}} style={{ padding:"14px 16px", borderRadius:12, border:isSel?"1.5px solid "+B.aBrd:"1px solid "+B.border, background:isSel?B.aBg:"rgba(255,255,255,0.015)", cursor:"pointer", transition:"all 0.2s" }}><div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><div><div style={{ color:isSel?B.orange:"#e2e8f0", fontSize:13, fontWeight:700 }}>{c.title}</div><div style={{ color:"#64748b", fontSize:11, marginTop:2 }}>{c.defendant} — {c.product} · {c.chart.length} elements</div></div>{isSel&&<div style={{ width:20, height:20, borderRadius:"50%", background:B.orange, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700 }}>✓</div>}</div><div style={{ display:"flex", gap:6, marginTop:8 }}>{c.chart.map(function(el){return<span key={el.id} style={{ padding:"2px 8px", borderRadius:10, fontSize:9, fontWeight:600, background:el.confidence==="strong"?"rgba(74,222,128,0.08)":el.confidence==="weak"?"rgba(248,113,113,0.08)":"rgba(251,191,36,0.08)", color:el.confidence==="strong"?"#4ade80":el.confidence==="weak"?"#f87171":"#fbbf24", border:"1px solid "+(el.confidence==="strong"?"rgba(74,222,128,0.2)":el.confidence==="weak"?"rgba(248,113,113,0.2)":"rgba(251,191,36,0.2)") }}>E{el.id}: {el.confidence}</span>;})}</div></div>;})}</div></div>
        <div style={{ marginBottom:24 }}><h3 style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Documents</h3><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>{[{k:"claim",i:"📊",l:"Claim Chart",f:"Excel, CSV, Word",r:true},{k:"patent",i:"📜",l:"Patent Doc",f:"PDF"},{k:"spec",i:"📋",l:"Product Specs",f:"PDF"},{k:"url",i:"🌐",l:"Product URL",f:"Web scraping"}].map(function(d){var typeMap={claim:"Claim Chart",patent:"Patent",spec:"Product Spec",url:"Web URL"};var up=files.find(function(f){return f.type===typeMap[d.k];});return<div key={d.k} onClick={function(){uploadFile(d.k);}} style={{ padding:"14px 16px", borderRadius:12, border:up?"1px solid rgba(74,222,128,0.2)":"1px dashed rgba(255,255,255,0.1)", background:up?"rgba(74,222,128,0.03)":"rgba(255,255,255,0.015)", cursor:"pointer" }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ fontSize:18 }}>{up?"✅":d.i}</span>{d.r&&!up&&<span style={{ color:"#f87171", fontSize:8, fontWeight:700 }}>REQUIRED</span>}</div><div style={{ color:up?"#4ade80":"#e2e8f0", fontSize:12, fontWeight:600 }}>{up?up.name:d.l}</div><div style={{ color:"#475569", fontSize:10, marginTop:1 }}>{up?up.size:"Click to upload · "+d.f}</div></div>;})}</div></div>
        <div style={{ marginBottom:24 }}><h3 style={{ color:B.orange, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>AI Instructions</h3><textarea value={sysP} onChange={function(e){setSysP(e.target.value);}} style={{ width:"100%", minHeight:75, background:"rgba(255,255,255,0.025)", border:"1px solid "+B.border, borderRadius:10, color:"#e2e8f0", fontSize:12, padding:"10px 14px", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:1.6, boxSizing:"border-box" }}/></div>
        <button onClick={startAnalysis} disabled={!hasCC} style={{ width:"100%", padding:"14px", borderRadius:10, border:"none", background:hasCC?"linear-gradient(135deg,"+B.orange+","+B.orangeL+")":"rgba(255,255,255,0.05)", color:hasCC?"#fff":"#475569", fontSize:15, fontWeight:700, cursor:hasCC?"pointer":"not-allowed", boxShadow:hasCC?"0 0 24px rgba(232,83,30,0.25)":"none" }}>{hasCC?"🚀 Begin Refinement":"Upload claim chart to continue"}</button>
      </div>
      <HelpBot visible={helpOpen} onClose={function(){setHelpOpen(false);}}/><HelpFAB onClick={function(){setHelpOpen(!helpOpen);}} pulse={helpPulse}/>
      <style>{`@keyframes helpUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-3px)}} @keyframes fabPulse{0%,100%{box-shadow:0 4px 20px rgba(232,83,30,0.4)}50%{box-shadow:0 4px 30px rgba(232,83,30,0.7)}}`}</style>
    </div>
  );

  // ═══ WORKSPACE ═══
  return (
    <div style={{ display:"flex", height:"100vh", background:B.dark, fontFamily:"'DM Sans',system-ui,sans-serif", overflow:"hidden" }}>
      {chartOpen&&<div style={{ width:"48%", display:"flex", flexDirection:"column", borderRight:"1px solid "+B.border }}>
        <div style={{ padding:"10px 16px", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.012)" }}><div style={{ display:"flex", alignItems:"center", gap:8 }}><Logo size={16} showText={false}/><div><div style={{ color:"#f1f5f9", fontSize:12, fontWeight:700 }}>{activeCase.title}</div><div style={{ color:"#475569", fontSize:9 }}>{chart.filter(function(e){return e.confidence==="strong";}).length}/{chart.length} strong · {chart.reduce(function(s,e){return s+e.version-1;},0)} refinements</div></div></div><div style={{ display:"flex", gap:5 }}><button onClick={function(){setExportModal(true);}} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+B.aBrd, background:B.aBg, color:B.orange, fontSize:10, fontWeight:600, cursor:"pointer" }}>📥 Export</button><button onClick={function(){setChartOpen(false);}} style={{ padding:"4px 7px", borderRadius:6, border:"1px solid "+B.border, background:"transparent", color:"#64748b", fontSize:11, cursor:"pointer" }}>✕</button></div></div>
        <div style={{ flex:1, overflowY:"auto", padding:0 }}>
          {/* 3-COLUMN TABLE HEADER */}
          <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 1fr 1fr 60px", background:"rgba(232,83,30,0.08)", borderBottom:"1px solid "+B.aBrd, position:"sticky", top:0, zIndex:5 }}>
            <div style={{ padding:"7px 6px", color:B.orange, fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>#</div>
            <div style={{ padding:"7px 6px", color:B.orange, fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:1, borderLeft:"1px solid rgba(232,83,30,0.15)" }}>Patent Claim Element</div>
            <div style={{ padding:"7px 6px", color:B.orange, fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:1, borderLeft:"1px solid rgba(232,83,30,0.15)" }}>Evidence</div>
            <div style={{ padding:"7px 6px", color:B.orange, fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:1, borderLeft:"1px solid rgba(232,83,30,0.15)" }}>AI Reasoning</div>
            <div style={{ padding:"7px 6px", color:B.orange, fontSize:8, fontWeight:800, textTransform:"uppercase", letterSpacing:1, borderLeft:"1px solid rgba(232,83,30,0.15)", textAlign:"center" }}>Status</div>
          </div>
          {/* 3-COLUMN TABLE ROWS */}
          {chart.map(function(el){
            var isHighlighted = hi===el.id;
            var justUpdated = flashId===el.id;
            return(
            <div key={el.id} style={{ display:"grid", gridTemplateColumns:"28px 1fr 1fr 1fr 60px", borderBottom:"1px solid "+B.border, cursor:"pointer", background:justUpdated?"rgba(74,222,128,0.08)":isHighlighted?B.aBg:"transparent", transition:"background 0.6s ease", animation:justUpdated?"rowFlash 1.5s ease":"none" }} onClick={function(){setHi(el.id);}}>
              <div style={{ padding:"8px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderRight:"1px solid "+B.border }}>
                <span style={{ width:18, height:18, borderRadius:4, background:isHighlighted?B.orange:B.aBg, border:"1px solid "+B.aBrd, color:isHighlighted?"#fff":B.orange, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>{el.id}</span>
                <span style={{ color:"#475569", fontSize:7 }}>v{el.version}</span>
              </div>
              <div style={{ padding:"8px 8px", borderRight:"1px solid "+B.border, minWidth:0 }}>
                <div style={{ color:"#e2e8f0", fontSize:11, lineHeight:1.5, wordBreak:"break-word" }}>{el.claimElement}</div>
              </div>
              <div style={{ padding:"8px 8px", borderRight:"1px solid "+B.border, minWidth:0 }}>
                <div style={{ color:"#7dd3fc", fontSize:10, lineHeight:1.5, fontStyle:"italic", wordBreak:"break-word" }}>{el.evidence}</div>
                <div style={{ marginTop:4 }}><SourceTag type={el.sourceType}/></div>
              </div>
              <div style={{ padding:"8px 8px", borderRight:"1px solid "+B.border, minWidth:0 }}>
                <div style={{ color:"#c4b5fd", fontSize:10, lineHeight:1.5, wordBreak:"break-word" }}>{el.reasoning}</div>
              </div>
              <div style={{ padding:"8px 4px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <ConfBadge level={el.confidence}/>
                {el.history.length>0&&<button onClick={function(e){e.stopPropagation();setShowHist(showHist===el.id?null:el.id);}} style={{ background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", padding:"1px 5px", borderRadius:4, fontSize:8, cursor:"pointer", fontWeight:600 }}>↩ {el.history.length}</button>}
              </div>
            </div>
          );})}
          {/* VERSION HISTORY PANEL */}
          {showHist&&chart.map(function(el){if(showHist!==el.id||el.history.length===0) return null; return <div key={"hist-"+el.id} style={{ padding:"8px 12px", background:"rgba(255,255,255,0.015)", borderBottom:"1px solid "+B.border }}><div style={{ color:"#94a3b8", fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Version History — Element {el.id}</div>{el.history.map(function(h,i){return<div key={i} style={{ padding:"6px 8px", borderRadius:6, background:"rgba(255,255,255,0.02)", marginBottom:4, border:"1px solid "+B.border, display:"grid", gridTemplateColumns:"40px 1fr 1fr", gap:6 }}><div><span style={{ color:"#94a3b8", fontSize:9, fontWeight:700 }}>v{i+1}</span><div style={{ marginTop:2 }}><ConfBadge level={h.confidence}/></div></div><div><div style={{ color:"#475569", fontSize:7, fontWeight:600, marginBottom:1 }}>EVIDENCE</div><div style={{ color:"#64748b", fontSize:9, lineHeight:1.3 }}>{h.evidence.slice(0,80)}...</div></div><div><div style={{ color:"#475569", fontSize:7, fontWeight:600, marginBottom:1 }}>REASONING</div><div style={{ color:"#64748b", fontSize:9, lineHeight:1.3 }}>{h.reasoning.slice(0,80)}...</div></div></div>;})}</div>;})}
        </div>
      </div>}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <div style={{ padding:"9px 16px", borderBottom:"1px solid "+B.border, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.012)" }}><div style={{ display:"flex", alignItems:"center", gap:8 }}>{!chartOpen&&<button onClick={function(){setChartOpen(true);}} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+B.aBrd, background:B.aBg, color:B.orange, fontSize:10, fontWeight:600, cursor:"pointer" }}>📊 Chart</button>}<button onClick={function(){if(window.confirm("Go back to home? Current progress will be lost.")){setPage("landing");setMsgs([]);setChart([]);setFiles([]);setPending(null);setHi(null);}}} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+B.border, background:"rgba(255,255,255,0.02)", color:"#94a3b8", fontSize:10, fontWeight:600, cursor:"pointer" }}>← Home</button><div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }}/><span style={{ color:"#f1f5f9", fontSize:12, fontWeight:700 }}>Lumenci AI</span></div><Logo size={16} showText={false}/></div>
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {msgs.map(function(m){return(<div key={m.id} style={{ marginBottom:10, display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}><div style={{ maxWidth:m.role==="system"?"92%":"80%" }}>{m.role!=="user"&&<div style={{ fontSize:8, color:m.role==="system"?"#4ade80":"#475569", fontWeight:600, marginBottom:3, textTransform:"uppercase", letterSpacing:1, paddingLeft:2, display:"flex", alignItems:"center", gap:3 }}>{m.role==="assistant"&&<Logo size={8} showText={false}/>}{m.role==="system"?"System":"Lumenci AI"}</div>}<div style={{ padding:"10px 14px", borderRadius:m.role==="user"?"12px 12px 3px 12px":"3px 12px 12px 12px", background:m.role==="user"?"linear-gradient(135deg,"+B.orange+",#c2410c)":m.role==="system"?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.025)", border:m.role==="user"?"none":m.role==="system"?"1px solid rgba(74,222,128,0.12)":"1px solid "+B.border, color:"#e2e8f0", fontSize:13, lineHeight:1.6 }}><div style={{ whiteSpace:"pre-wrap" }}>{renderMd(m.content)}</div></div>{m.meta&&m.meta.quality&&<div style={{ marginTop:6, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.015)", border:"1px solid "+B.border }}><div style={{ color:"#94a3b8", fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Quality</div><QualityBar label="Source Strength" value={m.meta.quality.sourceStrength}/><QualityBar label="Claim Mapping" value={m.meta.quality.claimMapping}/><QualityBar label="Legal Precision" value={m.meta.quality.legalPrecision}/></div>}</div></div>);})}
          {typing&&<div style={{ marginBottom:10 }}><div style={{ fontSize:8, color:"#475569", fontWeight:600, marginBottom:3, textTransform:"uppercase", letterSpacing:1, display:"flex", alignItems:"center", gap:3 }}><Logo size={8} showText={false}/>Lumenci AI</div><div style={{ display:"inline-flex", padding:"10px 14px", borderRadius:"3px 12px 12px 12px", background:"rgba(255,255,255,0.025)", border:"1px solid "+B.border, gap:4 }}>{[0,1,2].map(function(i){return<div key={i} style={{ width:5, height:5, borderRadius:"50%", background:B.orange, opacity:.6, animation:"bounce 1.2s infinite "+(i*.15)+"s" }}/>;})}</div></div>}
          {pending&&!typing&&<div style={{ display:"flex", gap:5, marginBottom:10 }}>{[{fn:accept,l:"✅ Accept",c:"#4ade80"},{fn:reject,l:"❌ Reject",c:"#f87171"},{fn:function(){setPending(null);setInput("Modify — ");if(inRef.current)inRef.current.focus();},l:"✏️ Modify",c:"#fbbf24"}].map(function(b){return<button key={b.l} onClick={b.fn} style={{ padding:"8px 16px", borderRadius:7, border:"1px solid "+b.c+"30", background:b.c+"08", color:b.c, fontSize:12, fontWeight:700, cursor:"pointer" }}>{b.l}</button>;})}</div>}
          <div ref={chatEnd}/>
        </div>
        {msgs.length<=2&&<div style={{ padding:"0 16px 4px", display:"flex", flexWrap:"wrap", gap:4 }}>{["Strengthen element "+activeCase.ai.strengthen.eId,"Fix reasoning element "+activeCase.ai.fix_reasoning.eId,"Add missing element","Clarify legal element "+activeCase.ai.clarify_legal.eId,"Export"].map(function(c){return<button key={c} onClick={function(){setInput(c);}} style={{ padding:"4px 11px", borderRadius:14, border:"1px solid "+B.border, background:"rgba(255,255,255,0.015)", color:"#94a3b8", fontSize:10, cursor:"pointer" }}>{c}</button>;})}</div>}
        <div style={{ padding:"9px 16px 12px", borderTop:"1px solid "+B.border, background:"rgba(255,255,255,0.012)" }}><div style={{ display:"flex", gap:6 }}><input ref={inRef} value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Ask to refine..." style={{ flex:1, padding:"11px 14px", borderRadius:9, border:"1px solid "+B.border, background:"rgba(255,255,255,0.025)", color:"#e2e8f0", fontSize:13, outline:"none", fontFamily:"inherit" }} onFocus={function(e){e.target.style.borderColor=B.aBrd;}} onBlur={function(e){e.target.style.borderColor=B.border;}}/><button onClick={send} disabled={!input.trim()||typing} style={{ padding:"11px 20px", borderRadius:9, border:"none", background:input.trim()&&!typing?"linear-gradient(135deg,"+B.orange+","+B.orangeL+")":"rgba(255,255,255,0.03)", color:input.trim()&&!typing?"#fff":"#475569", fontSize:13, fontWeight:700, cursor:input.trim()&&!typing?"pointer":"not-allowed" }}>Send</button></div></div>
      </div>
      {exportModal&&<div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }} onClick={function(){setExportModal(false);}}><div onClick={function(e){e.stopPropagation();}} style={{ width:400, padding:28, borderRadius:16, background:"#0f172a", border:"1px solid "+B.border }}><div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><Logo size={18} showText={false}/><h2 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:0 }}>Export Claim Chart</h2></div><p style={{ color:"#64748b", fontSize:11, margin:"0 0 16px" }}>{chart.length} elements · {chart.reduce(function(s,e){return s+e.version-1;},0)} refinements</p><div style={{ padding:12, borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid "+B.border, marginBottom:14, display:"flex", justifyContent:"space-around" }}>{[{l:"Strong",c:chart.filter(function(e){return e.confidence==="strong";}).length,cl:"#4ade80"},{l:"Weak",c:chart.filter(function(e){return e.confidence==="weak";}).length,cl:"#f87171"}].map(function(x){return<div key={x.l} style={{ textAlign:"center" }}><div style={{ color:x.cl, fontSize:20, fontWeight:800 }}>{x.c}</div><div style={{ color:"#64748b", fontSize:9 }}>{x.l}</div></div>;})}</div>{[{l:"Word (.docx)",i:"📄",d:"For legal proceedings",p:true,fn:function(){exportToWord(chart);setExportModal(false);}},{l:"PDF (Print)",i:"📋",d:"Opens print dialog",fn:function(){exportToPDF(chart);setExportModal(false);}},{l:"CSV",i:"📊",d:"Raw data for spreadsheets",fn:function(){exportToCSV(chart);setExportModal(false);}}].map(function(o){return<button key={o.l} onClick={o.fn} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", borderRadius:8, border:o.p?"1px solid "+B.aBrd:"1px solid "+B.border, background:o.p?B.aBg:"rgba(255,255,255,0.015)", cursor:"pointer", textAlign:"left", marginBottom:5 }}><span style={{ fontSize:18 }}>{o.i}</span><div><div style={{ color:o.p?B.orange:"#e2e8f0", fontSize:12, fontWeight:600 }}>{o.l}</div><div style={{ color:"#64748b", fontSize:10 }}>{o.d}</div></div></button>;})}<button onClick={function(){setExportModal(false);}} style={{ width:"100%", marginTop:8, padding:"8px", borderRadius:7, border:"1px solid "+B.border, background:"transparent", color:"#64748b", fontSize:11, cursor:"pointer" }}>Cancel</button></div></div>}
      <HelpBot visible={helpOpen} onClose={function(){setHelpOpen(false);}}/><HelpFAB onClick={function(){setHelpOpen(!helpOpen);}} pulse={helpPulse}/>
      <style>{`@keyframes helpUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-3px)}} @keyframes fabPulse{0%,100%{box-shadow:0 4px 20px rgba(232,83,30,0.4)}50%{box-shadow:0 4px 30px rgba(232,83,30,0.7)}} @keyframes rowFlash{0%{background:rgba(74,222,128,0.25)}40%{background:rgba(74,222,128,0.1)}100%{background:transparent}}`}</style>
    </div>
  );
}
