import { useEffect, useMemo, useState } from "react";
import "./PixModal.css";

export default function PixModal({
  open,
  qrText,
  qrImg,
  logoSrc = "/assets/logo.png",
  externalId,
  onClose,
  onPaid,
}) {
  const [canConfirm, setCanConfirm] = useState(false);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  // libera "JÁ PAGUEI" 60s após abrir e ter qrText
  useEffect(() => {
    if (!open || !qrText) return;
    setCanConfirm(false);
    setPaid(false);
    setCopied(false);

    const t = setTimeout(() => setCanConfirm(true), 60_000);
    return () => clearTimeout(t);
  }, [open, qrText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrText || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // nada
    }
  };

  const handlePaid = () => {
    setPaid(true);
    onPaid?.();
  };

  const visible = open && !!qrText;

  const title = useMemo(() => (paid ? "Compra confirmada ✅" : "Pague com PIX"), [paid]);

  if (!visible) return null;

  return (
    <div className="pixOverlay" role="dialog" aria-modal="true">
      <div className="pixCard">
        <button className="pixCloseX" type="button" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {/* topo com logo */}
        <div className="pixTop">
          <img className="pixLogo" src={logoSrc} alt="Logo" />
          <div className="pixTitle">{title}</div>
          {!paid ? (
            <div className="pixSub">Escaneie o QR Code ou copie e cole no app do seu banco</div>
          ) : (
            <div className="pixSub">
              Obrigado pela compra! Em até <b>7 dias úteis</b> seu pedido chegará no endereço preenchido.
            </div>
          )}
        </div>

        {!paid ? (
          <>
            {/* QR */}
            <div className="pixQrWrap">
              {qrImg ? <img className="pixQr" src={qrImg} alt="QR Code PIX" /> : null}
            </div>

            {/* copia e cola */}
            <div className="pixCodeBox">
              <textarea className="pixTextarea" readOnly value={qrText} />
            </div>

            <button className="pixCopyBtn" type="button" onClick={handleCopy}>
              {copied ? "Copiado ✓" : "COPIAR CÓDIGO PIX"}
            </button>

            {/* meta */}
            {externalId ? <div className="pixMeta">Pedido: {externalId}</div> : null}

            {/* botão aparece depois de 60s */}
            <button
              className={`pixPaidBtn ${canConfirm ? "isOn" : ""}`}
              type="button"
              onClick={handlePaid}
              disabled={!canConfirm}
              title={!canConfirm ? "Aguarde 1 minuto para confirmar" : ""}
            >
              {canConfirm ? "JÁ PAGUEI" : "LIBERA EM 1 MINUTO"}
            </button>

            <button className="pixCloseBtn" type="button" onClick={onClose}>
              Fechar
            </button>
          </>
        ) : (
          <>
            <div className="pixThanksBox">
              <div className="pixThanksTitle">Obrigado pela Compra 🎉</div>
              <div className="pixThanksText">
                Em até <b>7 dias úteis</b> seu pedido chegará no endereço preenchido.
              </div>
            </div>

            <button className="pixCloseBtn pixCloseBtn--primary" type="button" onClick={onClose}>
              OK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
