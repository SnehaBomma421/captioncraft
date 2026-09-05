import type { Dispatch, SetStateAction } from "react";
import type { Settings, Platform, CaptionStyle } from "../types";
import { Sparkles } from "lucide-react";

const styles: CaptionStyle[] = ["Professional","Instagram Fun","Instagram Aesthetic","Travel","Funny","Motivational","Storytelling","Minimal","Gen Z / Trendy","Custom"];
const platforms: Platform[] = ["LinkedIn","Instagram","Facebook","X / Twitter","Pinterest","General"];

interface Props {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  onGenerate: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function SettingsPanel({settings,setSettings,onGenerate,disabled,loading}: Props) {
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(s => ({...s,[key]:value}));

  const choosePlatform = (platform: Platform) => {
    const presets: Record<Platform, Partial<Settings>> = {
      LinkedIn: {style:"Professional", tone:"Professional", length:"Medium", emoji:"None", hashtags:"Relevant hashtags"},
      Instagram: {style:"Instagram Fun", tone:"Casual", length:"Medium", emoji:"Few", hashtags:"Relevant hashtags"},
      Facebook: {style:"Storytelling", tone:"Friendly", length:"Medium", emoji:"Few", hashtags:"Few hashtags"},
      "X / Twitter": {style:"Minimal", tone:"Confident", length:"Short", emoji:"Few", hashtags:"Few hashtags"},
      Pinterest: {style:"Instagram Aesthetic", tone:"Friendly", length:"Medium", emoji:"None", hashtags:"Relevant hashtags"},
      General: {style:"Instagram Fun", tone:"Friendly", length:"Medium", emoji:"Few", hashtags:"Few hashtags"}
    };
    setSettings(s => ({...s, platform, ...presets[platform]}));
  };

  return (
    <div className="settings-panel">
      <div className="section-heading"><div><span className="step">02</span><h2>Caption settings</h2></div><span className="hint">Tune the vibe</span></div>

      <label className="field-label">Platform</label>
      <div className="platform-grid">
        {platforms.map(p => <button key={p} className={`chip ${settings.platform===p ? "active":""}`} onClick={() => choosePlatform(p)}>{p}</button>)}
      </div>

      <label className="field-label">Caption style</label>
      <select value={settings.style} onChange={e => update("style", e.target.value as CaptionStyle)}>
        {styles.map(s => <option key={s}>{s}</option>)}
      </select>

      {settings.style === "Custom" && <textarea value={settings.customInstructions} onChange={e => update("customInstructions",e.target.value)} placeholder="e.g. Make it poetic and luxurious..." rows={3}/>}

      <div className="field-row">
        <div><label className="field-label">Length</label><div className="segmented">{(["Short","Medium","Long"] as const).map(x=><button key={x} className={settings.length===x?"selected":""} onClick={()=>update("length",x)}>{x}</button>)}</div></div>
        <div><label className="field-label">Tone</label><select value={settings.tone} onChange={e=>update("tone",e.target.value as Settings["tone"])}>{["Casual","Professional","Friendly","Emotional","Funny","Confident"].map(x=><option key={x}>{x}</option>)}</select></div>
      </div>

      <div className="field-row">
        <div><label className="field-label">Emojis</label><select value={settings.emoji} onChange={e=>update("emoji",e.target.value as Settings["emoji"])}>{["None","Few","Creative"].map(x=><option key={x}>{x}</option>)}</select></div>
        <div><label className="field-label">Hashtags</label><select value={settings.hashtags} onChange={e=>update("hashtags",e.target.value as Settings["hashtags"])}>{["No hashtags","Few hashtags","Relevant hashtags"].map(x=><option key={x}>{x}</option>)}</select></div>
      </div>

      <div><label className="field-label">Number of captions</label><div className="count-row">{([1,3,5] as const).map(x=><button key={x} className={settings.count===x?"selected":""} onClick={()=>update("count",x)}>{x}</button>)}</div></div>

      <button className="generate-btn" disabled={disabled || loading} onClick={onGenerate}>
        {loading ? <><span className="spinner"/> Crafting your captions...</> : <>Generate Captions <Sparkles size={17}/></>}
      </button>
    </div>
  );
}
