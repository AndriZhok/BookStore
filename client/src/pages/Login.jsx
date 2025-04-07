// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Вхід успішний!");
      navigate("/"); // Переходимо на головну
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ padding: "2rem" }}>
      <h2>Увійти</h2>
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
      <button type="submit">Увійти</button>
    </form>
  );
}