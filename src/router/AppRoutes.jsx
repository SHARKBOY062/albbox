import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Checkout from "../pages/Checkout/Checkout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
