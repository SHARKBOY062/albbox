import { useNavigate } from "react-router-dom";

import OfferBar from "../../components/OfferBar/OfferBar";
import CopaHero from "../../components/CopaHero/CopaHero";
import KitSection from "../../components/KitSection/KitSection";
import AboutAlbum from "../../components/AboutAlbum/AboutAlbum";
import WhyKit from "../../components/WhyKit/WhyKit";
import Reviews from "../../components/Reviews/Reviews";
import FAQ from "../../components/FAQ/FAQ";
import "./Home.css";

export default function Home() {
  const nav = useNavigate();

  const goCheckout = () => {
    const kitId = localStorage.getItem("albumcopa_kitId") || "colecionador";
    nav("/checkout", { state: { kitId } });
  };

  return (
    <div className="home">
      <OfferBar
        logoSrc="/assets/logo.png"
        initialSeconds={15 * 60}
        initialUnits={115}
        minUnits={1}
      />

      <CopaHero heroImgSrc="/assets/hero.png" />

      <KitSection imgSrc="/assets/albbox.png" />

      <AboutAlbum />

      <WhyKit onCta={goCheckout} />

      <Reviews />

      <FAQ logoSrc="/assets/logo.png" onCta={goCheckout} />
    </div>
  );
}
