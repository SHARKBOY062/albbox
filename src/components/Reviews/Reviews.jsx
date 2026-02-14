import "./Reviews.css";

function Star({ filled }) {
  return (
    <svg
      className={`rvStar ${filled ? "rvStar--on" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2Z"
      />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg className="rvCheck" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .01 20.01A10 10 0 0 0 12 2Zm-1.1 14.6-3.6-3.6 1.4-1.4 2.2 2.2 4.9-4.9 1.4 1.4-6.3 6.3Z"
      />
    </svg>
  );
}

function StarsRow({ rating = 5 }) {
  return (
    <div className="rvStars" aria-label={`${rating} estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rating} />
      ))}
    </div>
  );
}

function ReviewCard({ name, city, title, text, daysAgo, avatar, rating = 5 }) {
  return (
    <div className="rvCard">
      <div className="rvTop">
        <div className="rvUser">
          <img className="rvAvatar" src={avatar} alt={name} />
          <div className="rvUserMeta">
            <div className="rvName">{name}</div>
            <div className="rvCity">{city}</div>
          </div>
        </div>

        <StarsRow rating={rating} />
      </div>

      <div className="rvTitle">{title}</div>
      <div className="rvText">{text}</div>

      <div className="rvBottom">
        <div className="rvVerified">
          <VerifiedIcon />
          <span>Compra verificada</span>
        </div>
        <div className="rvAgo">{daysAgo} dias atrás</div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const items = [
    {
      name: "Carlos Silva",
      city: "São Paulo - SP",
      title: "Chegou super rápido!",
      text:
        "Comprei na pré-venda da Copa passada e foi incrível. Chegou antes do lançamento oficial e consegui começar a coleção antes de todo mundo. Super recomendo!",
      daysAgo: 2,
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
      name: "Amanda Costa",
      city: "Rio de Janeiro - RJ",
      title: "Melhor preço que encontrei",
      text:
        "Pesquisei em vários lugares e aqui foi onde encontrei o melhor preço. Ainda veio com frete grátis! Meu filho ficou muito feliz com o álbum.",
      daysAgo: 3,
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    {
      name: "Roberto Almeida",
      city: "Belo Horizonte - MG",
      title: "Produto original garantido",
      text:
        "Tinha medo de comprar online e vir produto falsificado, mas veio tudo original com selo da Panini. Álbum de excelente qualidade e figurinhas perfeitas.",
      daysAgo: 4,
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=68",
    },
    {
      name: "Fernanda Lima",
      city: "Curitiba - PR",
      title: "Ótima experiência",
      text:
        "Comprei o kit completo e valeu muito a pena. Com 90 pacotes consegui avançar bastante na coleção. Atendimento excelente e entrega dentro do prazo.",
      daysAgo: 5,
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=5",
    },
    {
      name: "Marcos Santos",
      city: "Porto Alegre - RS",
      title: "Vou comprar de novo",
      text:
        "Já é a segunda vez que compro aqui. Sempre chega tudo certinho e bem embalado. Preço justo e frete grátis fazem toda a diferença. Recomendo!",
      daysAgo: 6,
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=9",
    },
  ];

  return (
    <section className="reviews">
      <div className="container reviews__inner">
        <h2 className="reviews__title">O que nossos clientes dizem</h2>

        <div className="reviews__stack">
          {items.map((r, idx) => (
            <ReviewCard key={idx} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
