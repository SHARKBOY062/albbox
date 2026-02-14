import "./KitSection.css";
import KitOptions from "../KitOptions/KitOptions";

export default function KitSection({ imgSrc = "/assets/albbox.png" }) {
  return (
    <section className="kitSection">
      <div className="container kitSection__inner">
        {/* IMAGEM GRANDE EM CIMA (igual ao print 1) */}
        <img className="kitSection__image" src={imgSrc} alt="Kit do álbum" />

        <h2 className="kitSection__title">Escolha seu Kit</h2>
        <p className="kitSection__subtitle">
          Quanto mais pacotes, mais chances de completar o álbum!
        </p>

        <KitOptions />
      </div>
    </section>
  );
}
