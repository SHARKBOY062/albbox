import { useMemo, useState } from "react";
import "./FAQ.css";

function Chevron({ open }) {
  return (
    <svg
      className={`faqChevron ${open ? "faqChevron--open" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.2l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="faqLock" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z"
      />
    </svg>
  );
}

export default function FAQ({ logoSrc = "/assets/logo.png", onCta }) {
  const items = useMemo(
    () => [
      {
        q: "Quando meu pedido será entregue?",
        a: "Todos os pedidos da pré-venda serão enviados em até 7-15 dias úteis após a confirmação do pagamento. Você receberá o código de rastreamento por email assim que o pedido for despachado.",
      },
      {
        q: "As figurinhas e o álbum são originais?",
        a: "Sim! Trabalhamos diretamente com distribuidores oficiais. Todos os produtos são 100% originais Panini, lacrados de fábrica com selo de autenticidade.",
      },
      {
        q: "Posso escolher quais figurinhas vou receber?",
        a: "Os pacotes de figurinhas vêm lacrados e são aleatórios, assim como nas bancas e lojas. Cada pacote contém 5 figurinhas sortidas da coleção oficial da Copa do Mundo 2026.",
      },
      {
        q: "E se eu receber figurinhas repetidas?",
        a: "Isso faz parte da experiência de colecionar! Você pode trocar com amigos, familiares ou em grupos de colecionadores. E quanto mais pacotes, maior a chance de completar o álbum mais rápido.",
      },
      {
        q: "O frete é realmente grátis?",
        a: "Sim! O frete é 100% grátis para todo o Brasil em todos os nossos kits. Não há taxas escondidas ou custos adicionais.",
      },
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos pagamento via PIX com aprovação instantânea. O PIX é a forma mais rápida e segura de pagar, e seu pedido é confirmado imediatamente após o pagamento.",
      },
      {
        q: "Posso cancelar meu pedido?",
        a: "Sim, você pode solicitar o cancelamento em até 7 dias após a compra, desde que o pedido ainda não tenha sido enviado. Entre em contato conosco pelo WhatsApp para solicitar.",
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq">
      <div className="container faq__inner">
        <h2 className="faq__title">Dúvidas Frequentes</h2>

        <div className="faq__list">
          {items.map((it, idx) => {
            const open = idx === openIndex;
            return (
              <div key={it.q} className="faqItem">
                <button
                  type="button"
                  className="faqQ"
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                >
                  <span className="faqQ__text">{it.q}</span>
                  <Chevron open={open} />
                </button>

                <div className="faqA" style={{ maxHeight: open ? 240 : 0 }}>
                  <div className="faqA__inner">{it.a}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq__bottomDivider" />

        <div className="faq__brand">
          <img className="faq__logo" src={logoSrc} alt="Logo" />
          <div className="faq__secure">
            <LockIcon />
            <span>Compra 100% Segura</span>
          </div>
        </div>

        <button className="faq__cta" type="button" onClick={onCta}>
          GARANTIR MEU KIT AGORA
        </button>
      </div>
    </section>
  );
}
