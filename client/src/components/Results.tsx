import { Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Caption } from "../types";
import CaptionCard from "./CaptionCard";

export default function Results({captions,onRegenerate,onMore}:{captions:Caption[];onRegenerate:(i:number)=>void;onMore:()=>void}) {
  const [copied,setCopied]=useState(false);
  const copyAll=async()=>{await navigator.clipboard.writeText(captions.map((c,i)=>`Caption #${i+1}\n${c.text}${c.hashtags.length?`\n\n${c.hashtags.join(" ")}`:""}`).join("\n\n"));setCopied(true);setTimeout(()=>setCopied(false),1400)};
  return <section className="results">
    <div className="results-heading"><div><div className="eyebrow"><span className="pulse-dot"/> Your captions</div><h2>Ready to post.</h2><p>Pick one, make it yours, and share it anywhere.</p></div><button className="copy-all" onClick={copyAll}><Copy size={15}/> {copied?"Copied ✓":"Copy All"}</button></div>
    <div className="cards">{captions.map((c,i)=><CaptionCard key={`${i}-${c.text}`} caption={c} index={i} onRegenerate={onRegenerate}/>)}</div>
    <button className="more-btn" onClick={onMore}><Sparkles size={16}/> Generate More</button>
  </section>
}
