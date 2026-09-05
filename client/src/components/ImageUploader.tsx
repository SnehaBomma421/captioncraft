import { useRef, useState } from "react";
import { ImagePlus, UploadCloud, X, CheckCircle2 } from "lucide-react";

interface Props {
  file: File | null;
  preview: string | null;
  onChange: (file: File | null) => void;
}

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX = 10 * 1024 * 1024;

export default function ImageUploader({ file, preview, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  const validate = (candidate: File) => {
    if (!ACCEPT.includes(candidate.type)) return "Please choose a JPG, PNG, or WEBP image.";
    if (candidate.size > MAX) return "Image must be 10 MB or smaller.";
    setError("");
    onChange(candidate);
  };

  return (
    <div className="upload-panel">
      <div className="section-heading"><div><span className="step">01</span><h2>Your image</h2></div><span className="hint">JPG · PNG · WEBP · max 10MB</span></div>
      {!file ? (
        <div
          className={`dropzone ${drag ? "dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f) validate(f); }}
          onClick={() => inputRef.current?.click()}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files?.[0] && validate(e.target.files[0])}/>
          <div className="upload-icon"><UploadCloud size={28}/></div>
          <strong>Drop your image here</strong>
          <span>or click to browse</span>
          <small>We'll only process it for this session.</small>
        </div>
      ) : (
        <div className="preview-box">
          <img src={preview ?? ""} alt={`Preview of ${file.name}`} />
          <div className="preview-overlay">
            <div><CheckCircle2 size={16}/> {file.name}</div>
            <button className="icon-btn" onClick={() => onChange(null)} aria-label="Remove image"><X size={17}/></button>
          </div>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      {file && <div className="file-meta"><ImagePlus size={15}/> Ready for caption generation</div>}
    </div>
  );
}
