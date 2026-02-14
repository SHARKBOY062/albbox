import "./KitCard.css";

export default function KitCard({
  checked,
  onSelect,
  tag,
  discountText,
  title,
  desc,
  chips = [],
  oldPrice,
  price,
  payLabel = "via PIX",
  saveText,
  thumbnailSrc = "/assets/albbox.png",
  emphasized = false,
  selectedBg = false,
}) {
  return (
    <button
      type="button"
      className={[
        "kitCard",
        emphasized ? "kitCard--emph" : "",
        selectedBg ? "kitCard--selected" : "",
      ].join(" ")}
      onClick={onSelect}
    >
      {tag ? (
        <div className={`kitCard__tag kitCard__tag--${tag.tone}`}>
          {tag.text}
        </div>
      ) : null}

      {discountText ? <div className="kitCard__discount">{discountText}</div> : null}

      <div className="kitCard__row">
        <div className="kitCard__radio">
          <span className={`radio ${checked ? "radio--on" : ""}`} />
        </div>

        <div className="kitCard__thumbWrap">
          <img className="kitCard__thumb" src={thumbnailSrc} alt="Kit" />
        </div>

        <div className="kitCard__mid">
          <div className="kitCard__title">{title}</div>
          <div className="kitCard__desc">{desc}</div>

          <div className="kitCard__chips">
            {chips.map((c, idx) => (
              <span key={idx} className={`chip chip--${c.tone}`}>
                {c.text}
              </span>
            ))}
          </div>
        </div>

        <div className="kitCard__priceCol">
          <div className="kitCard__old">{oldPrice}</div>
          <div className="kitCard__price">{price}</div>
          <div className="kitCard__pay">{payLabel}</div>
        </div>
      </div>

      <div className="kitCard__save">{saveText}</div>
    </button>
  );
}
