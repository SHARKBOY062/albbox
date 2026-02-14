import "./ImageSlot.css";

export default function ImageSlot({
  src,
  alt = "imagem",
  className = "",
  label = "COLOQUE SUA IMAGEM AQUI",
}) {
  const hasImg = Boolean(src);

  return (
    <div className={`imageSlot ${className}`}>
      {hasImg ? (
        <img className="imageSlot__img" src={src} alt={alt} />
      ) : (
        <div className="imageSlot__placeholder">
          <div className="imageSlot__phBox" />
          <div className="imageSlot__phText">{label}</div>
        </div>
      )}
    </div>
  );
}
