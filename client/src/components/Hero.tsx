import { ArrowDown, Sparkles, WandSparkles } from "lucide-react";

export default function Hero({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section id="home" className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse-dot"/> AI-powered image captions</div>
        <h1>Turn Your Images Into <span>Captions People Remember.</span></h1>
        <p>Upload an image and let AI create engaging captions tailored to your style, platform, and mood.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={onGenerate}>Generate a Caption <Sparkles size={17}/></button>
          <a className="secondary-btn" href="#how-it-works">How It Works <ArrowDown size={16}/></a>
        </div>
        <div className="hero-trust"><span>✦</span> Context-aware · No database · Instant copy</div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orb orb-one"/><div className="orb orb-two"/>
        <div className="mock-image">
          <div className="mock-sky"/>
          <div className="mock-sun"/>
          <div className="mock-mountains"/>
          <div className="mock-water"/>
        </div>
        <div className="floating-card card-top"><WandSparkles size={15}/><span>Understanding the vibe...</span></div>
        <div className="floating-card caption-preview">
          <div className="mini-label">AI GENERATED</div>
          <p>Somewhere between chasing sunsets and making memories. 🌅✨</p>
          <div className="mini-actions"><span>Instagram Fun</span><span>Copy</span></div>
        </div>
      </div>
    </section>
  );
}
