import "./CopaHero.css";
import ImageSlot from "../ImageSlot/ImageSlot";

export default function CopaHero({ heroImgSrc = "/assets/hero.png" }) {
  return (
    <section className="copaHero">
      <div className="container copaHero__inner">
        <div className="copaHero__pill">COMPRA ÚNICA POR CPF</div>

        <div className="copaHero__markSolo">
          <ImageSlot
            src={heroImgSrc}
            alt="Sua imagem"
            label="SUA IMAGEM"
            className="copaHero__heroOnly"
          />
        </div>

        <div className="copaHero__meta1">ÁLBUM OFICIAL</div>
        <div className="copaHero__meta2">EUA • Canadá • México</div>

        <h1 className="copaHero__title">COPA 2026</h1>

        <p className="copaHero__p">
          O maior evento do futebol mundial está chegando!
          <br />
          Garanta seu álbum de capa dura com 30, 60 ou 90 pacotes de figurinhas inclusos.
        </p>

        <div className="copaHero__bold">
          Apenas 5.000 unidades disponíveis para o Brasil!
        </div>
      </div>
    </section>
  );
}
