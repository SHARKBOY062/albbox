import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import "./PixModal.css";

export default function PixModal({ qrText, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrText) return;

    QRCode.toCanvas(canvasRef.current, qrText, {
      width: 260,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }, [qrText]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrText) return null;

  return (
    <div className="pixOverlay">
      <div className="pixCard">
        <h2>Pague com PIX</h2>

        <canvas ref={canvasRef} className="pixCanvas" />

        <div className="pixCodeBox">
          <textarea
            readOnly
            value={qrText}
            className="pixTextarea"
          />
        </div>

        <button className="pixCopyBtn" onClick={handleCopy}>
          {copied ? "Copiado ✓" : "Copiar código PIX"}
        </button>

        <button className="pixClose" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
