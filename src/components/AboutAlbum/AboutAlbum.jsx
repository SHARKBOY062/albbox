import "./AboutAlbum.css";

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="aaIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 4h10a3 3 0 0 1 3 3v13a1 1 0 0 1-1 1H8a3 3 0 0 0-3 3V6a2 2 0 0 1 2-2Zm2 2a1 1 0 0 0-1 1v12.1c.3-.06.66-.1 1-.1h9V7a1 1 0 0 0-1-1H8Z"
      />
    </svg>
  );
}

function IconCard() {
  return (
    <svg viewBox="0 0 24 24" className="aaIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3v9h16V8H4Zm3 2h6v2H7v-2Zm0 4h10v2H7v-2Z"
      />
    </svg>
  );
}

function IconCube() {
  return (
    <svg viewBox="0 0 24 24" className="aaIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 3 6.5V17.5L12 22l9-4.5V6.5L12 2Zm0 2.2 6.7 3.3L12 10.8 5.3 7.5 12 4.2ZM5 9.2l6 3v7.1l-6-3V9.2Zm8 10.1v-7.1l6-3v7.1l-6 3Z"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="aaIcon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 11a4 4 0 1 0-3.6-6 4 4 0 0 0 3.6 6ZM8 12a4 4 0 1 0-3.6-6A4 4 0 0 0 8 12Zm0 2c-3.3 0-6 1.7-6 4v2h8v-2c0-1.6.7-3 1.9-4H8Zm8 0c-3.3 0-6 1.7-6 4v2h12v-2c0-2.3-2.7-4-6-4Z"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="aaStar" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2Z"
      />
    </svg>
  );
}

function InfoCard({ color, icon, title, subtitle }) {
  return (
    <div className="aaInfoCard">
      <div className={`aaBadge aaBadge--${color}`}>{icon}</div>
      <div className="aaInfoText">
        <div className="aaInfoTitle">{title}</div>
        <div className="aaInfoSub">{subtitle}</div>
      </div>
    </div>
  );
}

export default function AboutAlbum() {
  return (
    <section className="aboutAlbum">
      <div className="container aboutAlbum__inner">
        <h2 className="aboutAlbum__title">Sobre o Álbum Oficial</h2>
        <p className="aboutAlbum__subtitle">
          O maior álbum da história da Copa do Mundo
        </p>

        <div className="aboutAlbum__stack">
          <InfoCard
            color="red"
            icon={<IconBook />}
            title="112 Páginas"
            subtitle="O maior álbum já produzido"
          />
          <InfoCard
            color="orange"
            icon={<IconCard />}
            title="980 Figurinhas"
            subtitle="Coleção completa mais extensa"
          />
          <InfoCard
            color="yellow"
            icon={<IconCube />}
            title="7 Figurinhas por Pacote"
            subtitle="Maior chance de figurinhas cromadas"
          />
          <InfoCard
            color="green"
            icon={<IconUsers />}
            title="48 Seleções"
            subtitle="Todas as equipes classificadas"
          />

          <div className="aaHistory">
            <div className="aaHistory__head">
              <Star />
              <div className="aaHistory__headText">Edição Histórica</div>
            </div>

            <div className="aaHistory__list">
              <div className="aaHistory__item">
                <Star />
                <span>Primeira Copa do Mundo com 48 seleções</span>
              </div>
              <div className="aaHistory__item">
                <Star />
                <span>Álbum com 112 páginas - recorde histórico</span>
              </div>
              <div className="aaHistory__item">
                <Star />
                <span>Três países-sede: EUA, Canadá e México</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
