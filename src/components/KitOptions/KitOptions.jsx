import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KitOptions.css";
import KitCard from "../KitCard/KitCard";

const THUMB = "/assets/albbox.png";

const KITS = [
  {
    id: "iniciante",
    title: "Kit Iniciante",
    desc: "1 Álbum Capa Dura + 30 Pacotes",
    chips: [
      { text: "150 figurinhas", tone: "green" },
      { text: "Frete Gratis", tone: "blue" },
    ],
    discountText: "-33%",
    oldPrice: "R$ 147,00",
    price: "R$ 98,90",
    saveText: "Voce economiza R$ 48,00",
    emphasized: true, // ✅ verde (igual print certo)
    tag: null,
  },
  {
    id: "campeao",
    title: "Kit Campeão",
    desc: "1 Álbum Capa Dura + 60 Pacotes",
    chips: [
      { text: "300 figurinhas", tone: "green" },
      { text: "Frete Gratis", tone: "blue" },
    ],
    discountText: "-34%",
    oldPrice: "R$ 227,00",
    price: "R$ 148,90",
    saveText: "Voce economiza R$ 78,00",
    emphasized: false, // ✅ cinza (igual print certo)
    tag: { text: "MAIS VENDIDO", tone: "green" },
  },
  {
    id: "colecionador",
    title: "Kit Colecionador",
    desc: "1 Álbum Capa Dura + 90 Pacotes",
    chips: [
      { text: "450 figurinhas", tone: "green" },
      { text: "Frete Gratis", tone: "blue" },
    ],
    discountText: "-43%",
    oldPrice: "R$ 347,00",
    price: "R$ 198,90",
    saveText: "Voce economiza R$ 148,00",
    emphasized: true,
    tag: { text: "MELHOR CUSTO", tone: "orange" },
  },
];

export default function KitOptions() {
  const nav = useNavigate();

  const [selected, setSelected] = useState(() => {
    return localStorage.getItem("albumcopa_kitId") || "colecionador";
  });

  useEffect(() => {
    localStorage.setItem("albumcopa_kitId", selected);
  }, [selected]);

  const goCheckout = () => {
    nav("/checkout", { state: { kitId: selected } });
  };

  return (
    <div className="kitOptions">
      <div className="kitOptions__list">
        {KITS.map((k) => (
          <KitCard
            key={k.id}
            checked={selected === k.id}
            onSelect={() => setSelected(k.id)}
            tag={k.tag}
            discountText={k.discountText}
            title={k.title}
            desc={k.desc}
            chips={k.chips}
            oldPrice={k.oldPrice}
            price={k.price}
            payLabel="via PIX"
            saveText={k.saveText}
            thumbnailSrc={THUMB}
            emphasized={k.emphasized}
            selectedBg={selected === k.id}
          />
        ))}
      </div>

      <button className="kitOptions__cta" type="button" onClick={goCheckout}>
        <div className="kitOptions__ctaTitle">GARANTIR MEU KIT AGORA</div>
        <div className="kitOptions__ctaSub">Frete Grátis para Todo Brasil</div>
      </button>
    </div>
  );
}
