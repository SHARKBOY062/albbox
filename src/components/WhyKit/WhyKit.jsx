import "./WhyKit.css";

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="wkIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.2 16.6 4.9 12.3l1.4-1.4 2.9 2.9 8.5-8.5 1.4 1.4-9.9 9.9Z"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="wkIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .01 20.01A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-13h-2v6l5 3 1-1.7-4-2.3V7Z"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="wkIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3Zm6 9c0 3.9-2.5 7.6-6 8.9C8.5 18.6 6 14.9 6 11V6.3L12 4l6 2.3V11Z"
      />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" className="wkIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3h2.5a2 2 0 0 1 1.7 1l.8 1.3a2 2 0 0 1 .3 1V17a2 2 0 0 1-2 2h-.2a2.5 2.5 0 0 1-4.8 0H10.7a2.5 2.5 0 0 1-4.8 0H5a2 2 0 0 1-2-2V6Zm2 0v11h.9a2.5 2.5 0 0 1 4.8 0h4.6a2.5 2.5 0 0 1 4.8 0h.2v-3.4L20.8 12H17V6H5Zm3.3 13a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm10 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
      />
    </svg>
  );
}

function ReasonCard({ icon, title, subtitle }) {
  return (
    <div className="wkCard">
      <div className="wkBadge">{icon}</div>
      <div className="wkText">
        <div className="wkTitle">{title}</div>
        <div className="wkSub">{subtitle}</div>
      </div>
    </div>
  );
}

export default function WhyKit({ onCta }) {
  return (
    <section className="whyKit">
      <div className="container whyKit__inner">
        <h2 className="whyKit__heading">Por que garantir seu kit agora?</h2>

        <div className="whyKit__stack">
          <ReasonCard
            icon={<IconCheck />}
            title="Desconto de 47% exclusivo"
            subtitle="Desconto exclusivo de pré-venda"
          />
          <ReasonCard
            icon={<IconClock />}
            title="Entrega prioritária"
            subtitle="Receba antes do lançamento oficial"
          />
          <ReasonCard
            icon={<IconShield />}
            title="Produto original Panini"
            subtitle="Álbum oficial 100% autêntico"
          />
          <ReasonCard
            icon={<IconTruck />}
            title="Frete Grátis"
            subtitle="Entrega grátis para todo o Brasil"
          />
        </div>

        <div className="whyKit__trust">
          <span>Compra 100% Segura</span>
          <span>Dados Protegidos</span>
          <span>Produto Original</span>
        </div>

        <div className="whyKit__divider" />

        <button className="whyKit__cta" type="button" onClick={onCta}>
          GARANTIR MEU KIT AGORA
        </button>
      </div>
    </section>
  );
}
