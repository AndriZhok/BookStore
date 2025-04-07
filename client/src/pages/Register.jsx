// src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Реєстрація успішна!");
      navigate("/"); // Переходимо на головну
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: "2rem" }}>
      <h2>Реєстрація</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br /><br />
      <input
        type="password"
        placeholder="Пароль"
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br /><br />
      <button type="submit">Зареєструватися</button>
    </form>
  );
}