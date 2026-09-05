import { useState } from "react";
import { Check, Copy, Pencil, RefreshCw, Sparkles } from "lucide-react";
import type { Caption } from "../types";

interface Props { caption: Caption; index: number; onRegenerate: (index:number)=>void; }

export default function CaptionCard({caption,index,onRegenerate}: Props) {
  const [text,setText] = useState(caption.text);
  const [editing,setEditing] = useState(false);
  const [copied,setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText([text,...caption.hashtags].filter(Boolean).join("\n\n"));
    setCopied(true); setTimeout(()=>setCopied(false),1400);
  };

  return <article className="caption-card">
    <div className="caption-card-top"><span className="caption-number">CAPTION #{index+1}</span><span className="ai-badge"><Sparkles size={12}/> AI Generated</span></div>
    {editing ? <textarea className="edit-area" value={text} onChange={e=>setText(e.target.value)} autoFocus/> : <p className="caption-text">{text}</p>}
    {!!caption.hashtags.length && <div className="hashtags">{caption.hashtags.map(h=><span key={h}>{h}</span>)}</div>}
    <div className="caption-actions">
      <button onClick={copy}>{copied?<><Check size={15}/> Copied ✓</>:<><Copy size={15}/> Copy</>}</button>
      <button onClick={()=>setEditing(x=>!x)}><Pencil size={15}/>{editing?"Done":"Edit"}</button>
      <button onClick={()=>onRegenerate(index)}><RefreshCw size={15}/> Regenerate</button>
    </div>
  </article>
}
