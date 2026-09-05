import { ImagePlus, MousePointerClick, WandSparkles, type LucideIcon } from "lucide-react";

interface Step {
  n: string;
  title: string;
  Icon: LucideIcon;
  desc: string;
}

export default function HowItWorks(){
  const steps: Step[] = [
    { n: "01", title: "Upload your image", Icon: ImagePlus, desc: "Drop in a JPG, PNG, or WEBP." },
    { n: "02", title: "Choose your vibe", Icon: MousePointerClick, desc: "Pick a platform, style, tone, and length." },
    { n: "03", title: "Let AI craft it", Icon: WandSparkles, desc: "Vision AI understands the image before writing." }
  ];
  return <section id="how-it-works" className="info-section shell"><div className="section-title"><div className="eyebrow"><span className="pulse-dot"/> Simple by design</div><h2>From image to <span>post-ready</span> in seconds.</h2></div><div className="steps">{steps.map(({n,title,Icon,desc})=><div className="step-card" key={n}><div className="step-num">{n}</div><Icon size={22}/><h3>{title}</h3><p>{desc}</p></div>)}</div></section>
}
