import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const { user } = useAuth();
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Завантажуємо кошик з localStorage
  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("focus", loadCart);
    return () => window.removeEventListener("focus", loadCart);
  }, []);

  // Оновлюємо загальну суму та зберігаємо кошик
  useEffect(() => {
    const newTotal = Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);

    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const updateQuantity = (id, quantity) => {
    if (isNaN(quantity)) return;

    const updatedCart = { ...cart };

    if (quantity <= 0) {
      delete updatedCart[id];
    } else {
      updatedCart[id].quantity = quantity;
      updatedCart[id].timestamp = Date.now();
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const checkout = async () => {
    if (!user) {
      alert("Будь ласка, увійдіть для оформлення замовлення.");
      return navigate("/login");
    }

    if (Object.keys(cart).length === 0) {
      alert("Кошик порожній.");
      return;
    }

    console.log("📤 Надсилаємо замовлення:", {
      userId: user.uid,
      items: cart,
    });

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          items: cart,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Помилка збереження замовлення.");
      }

      const result = await response.json();
      console.log("📥 Отримано відповідь від сервера:", result);
      console.log("✅ Замовлення збережено на сервері:", result);

      alert("Дякуємо! Ваше замовлення оформлено.");
      setCart({});
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("❌ Помилка оформлення замовлення:", error);
      alert("Помилка при оформленні замовлення: " + error.message);
    }
  };

  // Синхронізація кошика між вкладками
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        setCart(JSON.parse(e.newValue) || {});
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Таймер з очищенням через 15 сек
  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          setCart({});
          localStorage.removeItem("cart");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [cart]);

  return (
    <div>
      <h1>🛒 Ваш кошик</h1>

      {timeLeft !== null && (
        <p style={{ color: "red" }}>
          ⏳ Залишилось часу для оформлення: {timeLeft} сек.
        </p>
      )}

      {Object.keys(cart).length === 0 ? (
        <p>
          Кошик порожній. Перейдіть у <a href="/catalog">каталог</a>, щоб додати
          книги.
        </p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Кількість</th>
                <th>Ціна</th>
                <th>Сума</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cart).map(([id, item]) => (
                <tr key={id}>
                  <td>{item.title}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(id, parseInt(e.target.value, 10))
                      }
                    />
                  </td>
                  <td>{item.price} грн</td>
                  <td>{item.price * item.quantity} грн</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Разом: {total} грн</h3>
          {user ? (
            <button onClick={checkout}>✅ Оформити замовлення</button>
          ) : (
            <button onClick={() => navigate("/login")} style={{ backgroundColor: "#ccc" }}>
              🔐 Увійдіть, щоб оформити замовлення
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;