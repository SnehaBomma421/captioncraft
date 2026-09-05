import { useEffect, useRef, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ImageUploader from "./components/ImageUploader";
import SettingsPanel from "./components/SettingsPanel";
import Results from "./components/Results";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import { generateCaptions } from "./services/api";
import type { Caption, Settings } from "./types";

const initial: Settings = {
  style:"Instagram Fun", platform:"Instagram", count:3, length:"Medium",
  tone:"Casual", emoji:"Few", hashtags:"Relevant hashtags", customInstructions:""
};

export default function App(){
  const generatorRef=useRef<HTMLElement>(null);
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [settings,setSettings]=useState<Settings>(initial);
  const [captions,setCaptions]=useState<Caption[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{ if(!file){setPreview(null);return;} const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);

  const goGenerate=()=>generatorRef.current?.scrollIntoView({behavior:"smooth",block:"start"});

  const runGeneration=async()=>{ 
    if(!file){setError("Upload an image first.");goGenerate();return;}
    setError("");setLoading(true);
    try { const result=await generateCaptions(file,settings); setCaptions(result); setTimeout(()=>document.getElementById("results")?.scrollIntoView({behavior:"smooth",block:"start"}),50);}
    catch(e){setError(e instanceof Error?e.message:"Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const regenerate=(index:number)=>{ if(!file)return; runGeneration(); };
  const more=()=>runGeneration();

  return <div>
    <Navbar onGenerate={goGenerate}/>
    <main>
      <Hero onGenerate={goGenerate}/>
      <section ref={generatorRef} className="generator shell" aria-label="Caption generator">
        <div className="generator-header"><div><div className="eyebrow"><span className="pulse-dot"/> Caption studio</div><h2>Make the image <span>say more.</span></h2></div><div className="flow"><span>Upload</span><i>→</i><span>Style</span><i>→</i><span>Generate</span></div></div>
        {error && <div className="alert"><AlertCircle size={17}/><span>{error}</span></div>}
        <div className="generator-grid">
          <ImageUploader file={file} preview={preview} onChange={f=>{setFile(f);setCaptions([]);setError("");}}/>
          <SettingsPanel settings={settings} setSettings={setSettings} onGenerate={runGeneration} disabled={!file} loading={loading}/>
        </div>
      </section>
      {loading && <div className="loading-strip shell"><div className="loading-orb"><Sparkles size={20}/></div><div><strong>{["Analyzing your image...","Understanding the vibe...","Crafting your captions...","Adding the finishing touch..."][Math.floor(Date.now()/900)%4]}</strong><span>Vision AI is turning your image into context-aware copy.</span></div></div>}
      {captions.length>0 && <section id="results" className="results-shell shell"><Results captions={captions} onRegenerate={regenerate} onMore={more}/></section>}
      <HowItWorks/>
      <Features/>
      <section id="about" className="about shell"><div className="about-card"><div className="eyebrow"><span className="pulse-dot"/> CaptionCraft</div><h2>Less time writing.<br/><span>More time creating.</span></h2><p>A focused AI caption studio for turning the images you already love into copy worth posting.</p><button className="primary-btn" onClick={goGenerate}>Try CaptionCraft <Sparkles size={16}/></button></div></section>
    </main>
    <footer className="footer shell"><span>© 2026 CaptionCraft</span><span>Made for better posts ✦</span></footer>
  </div>
}
