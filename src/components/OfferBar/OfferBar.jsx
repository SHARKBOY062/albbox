import { useEffect, useMemo, useState } from "react";
import "./OfferBar.css";
import ImageSlot from "../ImageSlot/ImageSlot";

const pad2 = (n) => String(n).padStart(2, "0");
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function formatMMSS(totalSeconds) {
  const s = clamp(Math.floor(totalSeconds), 0, 24 * 60 * 60);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${pad2(mm)}:${pad2(ss)}`;
}

export default function OfferBar({
  logoSrc = "/assets/logo.png",

  // DEMO: sempre reinicia quando a página abre
  initialSeconds = 15 * 60, // 15:00
  initialUnits = 115,       // 115 unidades

  // Ajuste fino: quantas unidades no mínimo você quer mostrar (DEMO)
  minUnits = 1,
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);

    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [initialSeconds]);

  // DEMO: unidades caem proporcionalmente ao tempo (vai de initialUnits -> minUnits)
  const unitsLeft = useMemo(() => {
    const elapsed = initialSeconds - secondsLeft;
    const progress = initialSeconds === 0 ? 1 : elapsed / initialSeconds; // 0..1

    const drop = Math.floor(progress * (initialUnits - minUnits));
    return clamp(initialUnits - drop, minUnits, initialUnits);
  }, [secondsLeft, initialSeconds, initialUnits, minUnits]);

  return (
    <div className="offerBarWrap">
      <div className="offerBar container">
        <div className="offerBar__left">
          <div className="offerBar__logo">
            <ImageSlot
              src={logoSrc}
              alt="Sua logo"
              label="SUA LOGO"
              className="offerBar__logoSlot"
            />
          </div>
        </div>

        <div className="offerBar__right">
          <div className="offerCard">
            <div className="offerCard__label">Oferta garantida por:</div>
            <div className="offerCard__value">{formatMMSS(secondsLeft)}</div>
          </div>

          <div className="offerCard">
            <div className="offerCard__label">Restam apenas:</div>
            <div className="offerCard__value">
              <span className="offerCard__big">{unitsLeft}</span> unidades
            </div>
          </div>
        </div>
      </div>

      <div className="offerBarDivider" />
    </div>
  );
}
