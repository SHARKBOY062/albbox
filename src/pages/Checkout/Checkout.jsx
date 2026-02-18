import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import PixModal from "../../components/PixModal/PixModal";
import "./Checkout.css";

/* ================== CONFIG GOOGLE SHEETS ==================
   ✅ Cole aqui a URL /exec do seu Apps Script (Web App)
   ⚠️ Se você usar "token" no Apps Script, mantenha aqui também (vai ficar visível no front).
*/
const SHEETS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbyXOg6FnIj_lZM2IvjmthbObh2Y0uAJ_z0PQ2wCNCQgsp0gcorPM_lxEkgRiSpDElwjGg/exec";

// Se o seu Apps Script NÃO exigir token, deixa vazio: ""
// Se exigir, coloque o mesmo token que você validou no Apps Script:
const SHEETS_TOKEN = ""; // ex: "Senha321."

/* ================== DADOS ================== */
const KITS = {
  iniciante: {
    id: "iniciante",
    title: "Kit Iniciante",
    desc: "1 Álbum Capa Dura + 30 Pacotes",
    price: "R$ 98,90",
  },
  campeao: {
    id: "campeao",
    title: "Kit Campeão",
    desc: "1 Álbum Capa Dura + 60 Pacotes",
    price: "R$ 148,90",
  },
  colecionador: {
    id: "colecionador",
    title: "Kit Colecionador",
    desc: "1 Álbum Capa Dura + 90 Pacotes",
    price: "R$ 198,90",
  },
};

const THUMB = "/assets/albbox.png";

/* ================= UTIL (máscaras) ================= */
const onlyDigits = (v = "") => String(v).replace(/\D/g, "");

const formatCEP = (v = "") => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

const formatCPF = (v = "") => {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

const formatPhone = (v = "") => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const parseBRL = (s) => {
  const clean = String(s || "")
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
};

const formatBRL = (n) =>
  `R$ ${(Number.isFinite(n) ? n : 0).toFixed(2).replace(".", ",")}`;

/* ================= ORDER BUMP ================= */
const BUMP_DISCOUNT_PCT = 30;
const BASE_BUMP_DISCOUNTED_2 = 69.0;

const bumpDiscountedPrice = (boxes) => BASE_BUMP_DISCOUNTED_2 * (boxes / 2);
const bumpFullPrice = (boxes) =>
  bumpDiscountedPrice(boxes) / (1 - BUMP_DISCOUNT_PCT / 100);
const bumpPacks = (boxes) => boxes * 30;
const bumpStickers = (boxes) => boxes * 210;

/* ================= META PIXEL helpers ================= */
const fb = (...args) => {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq(...args);
    }
  } catch {}
};

/* ================= SHEETS helper ================= */
const postToSheets = async (payload) => {
  if (!SHEETS_WEBAPP_URL) return { ok: false, error: "SHEETS_WEBAPP_URL vazio" };

  const body = { token: SHEETS_TOKEN || undefined, ...payload };

  // timeout simples pra não travar UI
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(SHEETS_WEBAPP_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) {
      return { ok: false, error: data?.error || "Sheets: erro ao salvar", raw: data };
    }
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: "Sheets: falha na comunicação" };
  } finally {
    clearTimeout(t);
  }
};

export default function Checkout() {
  const nav = useNavigate();
  const location = useLocation();

  const kitId = useMemo(() => {
    const fromState = location.state?.kitId;
    if (fromState) return fromState;
    const fromLs = localStorage.getItem("albumcopa_kitId");
    if (fromLs) return fromLs;
    return "colecionador";
  }, [location.state]);

  const kit = KITS[kitId] ?? KITS.colecionador;

  // Dados pessoais
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // Endereço
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const [cepStatus, setCepStatus] = useState({ loading: false, error: "" });
  const cepDigits = onlyDigits(cep);

  // Order bump
  const [bumpEnabled, setBumpEnabled] = useState(false);
  const [bumpBoxes, setBumpBoxes] = useState(2);

  // PIX
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState("");
  const [pixQrText, setPixQrText] = useState("");
  const [pixQrImg, setPixQrImg] = useState("");
  const [pixExternalId, setPixExternalId] = useState("");
  const [pixOpen, setPixOpen] = useState(false);

  // controle de disparos (pra não duplicar)
  const [sentInit, setSentInit] = useState(false);
  const [sentPayInfo, setSentPayInfo] = useState(false);

  const bumpPrice = bumpEnabled ? bumpDiscountedPrice(bumpBoxes) : 0;
  const kitPriceNum = parseBRL(kit.price);
  const totalNum = kitPriceNum + bumpPrice;

  const fetchCep = async (rawCep) => {
    const d = onlyDigits(rawCep).slice(0, 8);
    if (d.length !== 8) return;

    setCepStatus({ loading: true, error: "" });

    try {
      const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const data = await res.json();

      if (data?.erro) {
        setCepStatus({ loading: false, error: "CEP não encontrado." });
        return;
      }

      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.localidade || "");
      setUf(data.uf || "");
      setCepStatus({ loading: false, error: "" });
    } catch {
      setCepStatus({ loading: false, error: "Não foi possível consultar o CEP." });
    }
  };

  useEffect(() => {
    if (cepDigits.length === 8) fetchCep(cepDigits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepDigits]);

  const validate = () => {
    const cpfDigits = onlyDigits(cpf);
    const phoneDigits = onlyDigits(phone);

    if (fullName.trim().length < 3) return "Preencha o nome completo.";
    if (!email.includes("@")) return "Preencha um email válido.";
    if (cpfDigits.length !== 11) return "CPF inválido.";
    if (phoneDigits.length < 10) return "Telefone inválido.";

    if (onlyDigits(cep).length !== 8) return "CEP inválido.";
    if (!street.trim()) return "Preencha a rua.";
    if (!number.trim()) return "Preencha o número.";
    if (!neighborhood.trim()) return "Preencha o bairro.";
    if (!city.trim()) return "Preencha a cidade.";
    if (!uf.trim()) return "Selecione o estado.";

    return "";
  };

  const buildCheckoutPayload = (status, externalId) => ({
    status, // "initiate_checkout" | "pix_generated" | "paid_clicked"
    ts: new Date().toISOString(),
    external_id: externalId,

    // kit + total
    kit_id: kit.id,
    kit_title: kit.title,
    kit_price: Number(kitPriceNum.toFixed(2)),
    bump_enabled: bumpEnabled ? "yes" : "no",
    bump_boxes: bumpEnabled ? bumpBoxes : 0,
    bump_price: Number(bumpPrice.toFixed(2)),
    total: Number(totalNum.toFixed(2)),

    // cliente
    full_name: fullName.trim(),
    email: email.trim(),
    phone: onlyDigits(phone),
    cpf: onlyDigits(cpf),

    // endereço
    cep: onlyDigits(cep),
    street: street.trim(),
    number: String(number || "").trim(),
    complement: String(complement || "").trim(),
    neighborhood: neighborhood.trim(),
    city: city.trim(),
    uf: uf.trim(),

    // extras úteis
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    page: typeof window !== "undefined" ? window.location.href : "",
  });

  const handleGeneratePix = async () => {
    setPixError("");
    setPixQrText("");
    setPixQrImg("");
    setPixOpen(false);

    const err = validate();
    if (err) return setPixError(err);

    // gera externalId antes (pra usar em pixel + sheets)
    const externalId = `ALBUMCOPA-${Date.now()}`;
    setPixExternalId(externalId);

    // 🔥 Pixel: InitiateCheckout (uma vez por sessão/tentativa)
    if (!sentInit) {
      fb("track", "InitiateCheckout", {
        value: Number(totalNum.toFixed(2)),
        currency: "BRL",
        content_name: kit.title,
        content_ids: [kit.id],
        contents: [{ id: kit.id, quantity: 1, item_price: Number(kitPriceNum.toFixed(2)) }],
        num_items: 1,
        external_id: externalId,
        order_bump: bumpEnabled ? "yes" : "no",
        bump_boxes: bumpEnabled ? bumpBoxes : 0,
        bump_value: Number(bumpPrice.toFixed(2)),
      });
      setSentInit(true);
    }

    // ✅ Sheets: salva TUDO que o cliente digitou (sem backend seu)
    // (não bloqueia o pix, se falhar não impede a compra)
    postToSheets(buildCheckoutPayload("initiate_checkout", externalId)).catch(() => {});

    try {
      setPixLoading(true);

      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(totalNum.toFixed(2)),
          name: fullName.trim(),
          document: onlyDigits(cpf),
          phone: onlyDigits(phone),
          external_id: externalId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setPixError(data?.error || "Não foi possível gerar o PIX.");
        return;
      }

      const code = String(data.qr_code_text || "");
      if (!code) {
        setPixError("PIX gerado, mas sem qr_code_text na resposta.");
        return;
      }

      setPixQrText(code);

      // QR visual
      const img = await QRCode.toDataURL(code, { margin: 1, width: 260 });
      setPixQrImg(img);

      // 🔥 Pixel: AddPaymentInfo (quando PIX foi gerado de verdade)
      if (!sentPayInfo) {
        fb("track", "AddPaymentInfo", {
          value: Number(totalNum.toFixed(2)),
          currency: "BRL",
          payment_method: "pix",
          content_name: kit.title,
          content_ids: [kit.id],
          external_id: externalId,
          order_bump: bumpEnabled ? "yes" : "no",
          bump_boxes: bumpEnabled ? bumpBoxes : 0,
          bump_value: Number(bumpPrice.toFixed(2)),
        });
        setSentPayInfo(true);
      }

      // ✅ Sheets: marca que o pix foi gerado com sucesso
      postToSheets(buildCheckoutPayload("pix_generated", externalId)).catch(() => {});

      // abre modal
      setPixOpen(true);
    } catch {
      setPixError("Falha na comunicação. Tente novamente.");
    } finally {
      setPixLoading(false);
    }
  };

  const handlePaid = () => {
    // ⚠️ Isso NÃO confirma pagamento real. É “cliente clicou já paguei”.
    fb("track", "Purchase", {
      value: Number(totalNum.toFixed(2)),
      currency: "BRL",
      content_name: kit.title,
      content_ids: [kit.id],
      contents: [{ id: kit.id, quantity: 1, item_price: Number(kitPriceNum.toFixed(2)) }],
      external_id: pixExternalId,
      order_bump: bumpEnabled ? "yes" : "no",
      bump_boxes: bumpEnabled ? bumpBoxes : 0,
      bump_value: Number(bumpPrice.toFixed(2)),
    });

    postToSheets(buildCheckoutPayload("paid_clicked", pixExternalId)).catch(() => {});
  };

  return (
    <div className="co">
      {/* MODAL PIX */}
      <PixModal
        open={pixOpen}
        qrText={pixQrText}
        qrImg={pixQrImg}
        logoSrc="/assets/logo.png"
        externalId={pixExternalId}
        onClose={() => setPixOpen(false)}
        onPaid={handlePaid}
      />

      <div className="coTop">
        <button className="coBack" type="button" onClick={() => nav(-1)}>
          ← <span>Voltar</span>
        </button>
        <img className="coLogo" src="/assets/logo.png" alt="Logo" />
        <div className="coTop__spacer" />
      </div>

      <div className="container coInner">
        {/* Resumo */}
        <div className="coSummary">
          <div className="coSummary__row">
            <div className="coSummary__left">
              <div className="coThumbWrap">
                <img className="coThumb" src={THUMB} alt="" />
              </div>
              <div>
                <div className="coKitTitle">{kit.title}</div>
                <div className="coKitDesc">{kit.desc}</div>
              </div>
            </div>

            <div className="coSummary__right">
              <div className="coPrice">{formatBRL(kitPriceNum)}</div>
            </div>
          </div>

          <div className="coLine" />

          <div className="coTotals">
            <div className="coTotals__row">
              <div className="coTotals__label">Frete</div>
              <div className="coTotals__value coGreen">Grátis</div>
            </div>

            {bumpEnabled ? (
              <div className="coTotals__row">
                <div className="coTotals__label">Oferta Especial</div>
                <div className="coTotals__value coBold">{formatBRL(bumpPrice)}</div>
              </div>
            ) : null}

            <div className="coTotals__row coTotals__row--total">
              <div className="coTotals__label coBold">Total</div>
              <div className="coTotals__value">
                <div className="coTotalPrice">{formatBRL(totalNum)}</div>
                <div className="coPix">via PIX</div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="coTitle">Finalizar Pedido</h2>
        <p className="coSubtitle">Preencha seus dados para receber seu álbum</p>

        {/* Dados Pessoais */}
        <div className="coFormCard">
          <div className="coFormTitle">Dados Pessoais</div>

          <div className="coField">
            <label className="coLabel">
              Nome Completo <span className="coReq">*</span>
            </label>
            <input
              className="coInput"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={80}
              autoComplete="name"
            />
          </div>

          <div className="coField">
            <label className="coLabel">
              Email <span className="coReq">*</span>
            </label>
            <input
              className="coInput"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={80}
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div className="coGrid2">
            <div className="coField">
              <label className="coLabel">
                Telefone <span className="coReq">*</span>
              </label>
              <input
                className="coInput"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="numeric"
                autoComplete="tel"
                maxLength={15}
              />
            </div>

            <div className="coField">
              <label className="coLabel">
                CPF <span className="coReq">*</span>
              </label>
              <input
                className="coInput"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                inputMode="numeric"
                autoComplete="off"
                maxLength={14}
              />
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div className="coFormCard coFormCard--mt">
          <div className="coFormTitle">Endereço de Entrega</div>

          <div className="coField">
            <label className="coLabel">
              CEP <span className="coReq">*</span>
            </label>

            <div className="coCepRow">
              <input
                className="coInput"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(formatCEP(e.target.value))}
                onBlur={() => fetchCep(cep)}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
              />

              <button
                type="button"
                className="coCepBtn"
                onClick={() => fetchCep(cep)}
                disabled={cepDigits.length !== 8 || cepStatus.loading}
              >
                {cepStatus.loading ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {cepStatus.error ? <div className="coError">{cepStatus.error}</div> : null}
          </div>

          <div className="coField">
            <label className="coLabel">
              Rua/Logradouro <span className="coReq">*</span>
            </label>
            <input
              className="coInput"
              placeholder="Nome da rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              maxLength={80}
              autoComplete="address-line1"
            />
          </div>

          <div className="coGrid2">
            <div className="coField">
              <label className="coLabel">
                Número <span className="coReq">*</span>
              </label>
              <input
                className="coInput"
                placeholder="123"
                value={number}
                onChange={(e) => setNumber(onlyDigits(e.target.value).slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                autoComplete="address-line2"
              />
            </div>

            <div className="coField">
              <label className="coLabel">Complemento</label>
              <input
                className="coInput"
                placeholder="Apto, Bloco..."
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                maxLength={40}
                autoComplete="address-line2"
              />
            </div>
          </div>

          <div className="coField">
            <label className="coLabel">
              Bairro <span className="coReq">*</span>
            </label>
            <input
              className="coInput"
              placeholder="Nome do bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              maxLength={60}
              autoComplete="address-level3"
            />
          </div>

          <div className="coGrid2">
            <div className="coField">
              <label className="coLabel">
                Cidade <span className="coReq">*</span>
              </label>
              <input
                className="coInput"
                placeholder="Nome da cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={60}
                autoComplete="address-level2"
              />
            </div>

            <div className="coField">
              <label className="coLabel">
                Estado <span className="coReq">*</span>
              </label>

              <div className="coSelectWrap">
                <select
                  className="coSelect"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  autoComplete="address-level1"
                >
                  <option value="">UF</option>
                  {UF_LIST.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <svg className="coSelectChevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.2l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER BUMP (2/4/8) */}
        <div className="coBump">
          <div className="coBump__top">
            <div className="coBump__label">
              <span className="coBump__gift">🎁</span> OFERTA ESPECIAL
            </div>
            <div className="coBump__hint">Adicione ao seu pedido</div>
          </div>

          <div className="coBump__body">
            <label className="coBump__check" aria-label="Ativar oferta especial">
              <input
                type="checkbox"
                checked={bumpEnabled}
                onChange={(e) => setBumpEnabled(e.target.checked)}
              />
              <span className="coBump__box" />
            </label>

            <div className="coBump__thumbWrap">
              <img className="coBump__thumb" src={THUMB} alt="" />
            </div>

            <div className="coBump__mid">
              <div className="coBump__title">
                {bumpBoxes} Caixas de Figurinha
                <span className="coBump__badge">-{BUMP_DISCOUNT_PCT}%</span>
              </div>

              <div className="coBump__sub">
                {bumpPacks(bumpBoxes)} pacotes extras ({bumpStickers(bumpBoxes)} figurinhas) (Na compra de 2 caixas
                extras ou mais, vem Garantido 10 cartas douradas)
              </div>

              <div className="coBump__opts">
                {[2, 4, 8].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`coBump__opt ${bumpBoxes === n ? "isOn" : ""}`}
                    onClick={() => {
                      setBumpBoxes(n);
                      setBumpEnabled(true);
                    }}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="coBump__right">
              <div className="coBump__old">{formatBRL(bumpFullPrice(bumpBoxes))}</div>
              <div className="coBump__price">por {formatBRL(bumpDiscountedPrice(bumpBoxes))}</div>
            </div>
          </div>
        </div>

        {/* Botão final */}
        <button className="coFinish" type="button" onClick={handleGeneratePix} disabled={pixLoading}>
          {pixLoading ? "GERANDO PIX..." : "GERAR PIX E FINALIZAR"}
        </button>

        {pixError ? <div className="coError coError--center">{pixError}</div> : null}

        <div className="coSecureNote">Seus dados estão protegidos e não serão compartilhados.</div>
        <div className="coFooterNote">Panini - Todos os direitos reservados.</div>
      </div>
    </div>
  );
}
