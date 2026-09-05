import { Sparkles } from "lucide-react";

export default function Navbar({ onGenerate }: { onGenerate: () => void }) {
  return (
    <header className="nav shell">
      <a className="brand" href="#home" aria-label="CaptionCraft home">
        <span className="brand-mark"><Sparkles size={17}/></span>
        <span>CaptionCraft</span>
      </a>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </nav>
      <button className="nav-cta" onClick={onGenerate}>Generate <Sparkles size={15}/></button>
    </header>
  );
}
