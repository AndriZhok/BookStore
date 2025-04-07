import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart"; // ⬅️ Імпортуємо Cart
import Account from "./components/Account"; // ⬅️ ДОДАНО
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute"; // ← додаємо захист

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Ласкаво просимо до книжкового магазину!</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} /> {/* ⬅️ ДОДАНО */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;