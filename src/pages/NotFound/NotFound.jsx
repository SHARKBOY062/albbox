import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <main className="container page">
      <h1 className="title">404</h1>
      <p className="muted">Essa página não existe (ainda).</p>
      <Link className="back" to="/">Voltar pro início</Link>
    </main>
  );
}
