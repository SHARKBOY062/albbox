import { useEffect, useMemo, useRef, useState } from "react";
import "./PrizeWheel.css";

const PRIZES = [
  { key: "boxes2", label: "2 Caixas de Figurinha" },
  { key: "goldbox1", label: "1 Caixa de Figurinha Dourada" },
  { key: "pix2000", label: "R$ 2.000 no PIX" },
  { key: "albumSpecial", label: "Álbum Edição Especial Todas as Copas" },
];

// Sempre cai nesses:
const FORCED_KEYS = ["boxes2", "goldbox1"];

const BRAND_LOGO = "/assets/logo.png";

export default function PrizeWheel({ onFinish }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [attempts, setAttempts] = useState(() => {
    const n = Number(localStorage.getItem("albumcopa_wheelAttempts") || "0");
    return Number.isFinite(n) ? n : 0;
  });
  const [resultKey, setResultKey] = useState(() => {
    return localStorage.getItem("albumcopa_wheelPrize") || "";
  });

  const timerRef = useRef(null);

  const result = useMemo(() => {
    return PRIZES.find((p) => p.key === resultKey)?.label || "";
  }, [resultKey]);

  useEffect(() => {
    localStorage.setItem("albumcopa_wheelAttempts", String(attempts));
  }, [attempts]);

  useEffect(() => {
    if (resultKey) localStorage.setItem("albumcopa_wheelPrize", resultKey);
  }, [resultKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const spin = () => {
    if (spinning || attempts >= 2) return;

    setSpinning(true);

    const forcedKey = Math.random() > 0.5 ? FORCED_KEYS[0] : FORCED_KEYS[1];
    const forcedIndex = PRIZES.findIndex((p) => p.key === forcedKey);

    const segments = PRIZES.length;
    const degreesPerSegment = 360 / segments;
    const centerOffset = degreesPerSegment / 2;

    const extraSpins = 6 * 360;
    const targetRotation =
      extraSpins + (360 - forcedIndex * degreesPerSegment - centerOffset);

    setRotation((prev) => prev + targetRotation);

    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setAttempts((prev) => prev + 1);
      setResultKey(forcedKey);
    }, 4600);
  };

  const handleContinue = () => {
    onFinish?.();
  };

  const canSpin = attempts < 2;

  return (
    <div className="pwOverlay" role="dialog" aria-modal="true">
      <div className="pwCard">
        <div className="pwHeader">
          <div className="pwLogoRow">
            <img className="pwLogo" src={BRAND_LOGO} alt="Logo" />
          </div>

          <div className="pwKicker">BÔNUS EXCLUSIVO ANTES DE FINALIZAR</div>

          <h2 className="pwTitle">
            Você pode ganhar até <span className="pwHighlight">R$ 2.000 no PIX</span>
          </h2>

          <p className="pwSubtitle">
            Gire a roleta e revele seu bônus. Você tem <strong>2 tentativas</strong>.
          </p>
        </div>

        <div className="pwWheelArea">
          <div className="pwWheelShell">
            <div className="pwPointer" aria-hidden="true" />
            <div
              className={`pwWheel ${spinning ? "isSpinning" : ""}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {PRIZES.map((p, idx) => (
                <div
                  key={p.key}
                  className="pwSegment"
                  style={{ transform: `rotate(${idx * 90}deg)` }}
                >
                  <span className="pwSegmentText">{p.label}</span>
                </div>
              ))}
            </div>

            <div className="pwCenter" aria-hidden="true">
              <div className="pwCenterDot" />
            </div>
          </div>
        </div>

        <div className="pwBottom">
          {result ? (
            <div className="pwResult">
              <div className="pwResultLabel">PRÊMIO DESBLOQUEADO</div>
              <div className="pwResultValue">{result}</div>
              <div className="pwHint">Seu bônus já está reservado. Continue para concluir.</div>
            </div>
          ) : (
            <div className="pwInfo">
              <div className="pwInfoLine">
                Tentativas restantes: <strong>{Math.max(0, 2 - attempts)}</strong>
              </div>
              <div className="pwInfoLine">O bônus é aplicado ao seu pedido no checkout.</div>
            </div>
          )}

          <div className="pwActions">
            {canSpin ? (
              <button
                className="pwBtn pwBtnPrimary"
                type="button"
                onClick={spin}
                disabled={spinning}
              >
                {spinning ? "Girando..." : "GIRAR ROLETA"}
              </button>
            ) : (
              <button className="pwBtn pwBtnPrimary" type="button" onClick={handleContinue}>
                Continuar para o Checkout
              </button>
            )}

            <button className="pwBtn pwBtnGhost" type="button" onClick={handleContinue}>
              Pular e continuar
            </button>
          </div>

          <div className="pwFootnote">
            Ao continuar, você confirma que deseja finalizar seu pedido via PIX.
          </div>
        </div>
      </div>
    </div>
  );
}
