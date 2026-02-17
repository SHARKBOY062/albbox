import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__brand">
          albumcopa<span className="dot">.</span>
        </Link>

        <nav className="header__nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Início
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
