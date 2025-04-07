import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const response = await fetch(`http://localhost:5001/api/orders/${currentUser.uid}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          const transformedOrders = data.map((order) => ({
            ...order,
            createdAt: order.createdAt?.seconds
              ? new Date(order.createdAt.seconds * 1000)
              : null,
          }));
          transformedOrders.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));

          setOrders(transformedOrders);
        } catch (error) {
          console.error("Помилка при завантаженні замовлень:", error);
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h1>Мій акаунт</h1>
      <h2>Історія замовлень</h2>
      {!user ? (
        <p>Будь ласка, увійдіть, щоб переглянути замовлення.</p>
      ) : orders.length === 0 ? (
        <p>Замовлень ще немає.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={order.id || idx} className="order">
            <h3>
              Замовлення #{idx + 1} — {order.createdAt?.toLocaleString?.()}
            </h3>
            <ul>
              {order.items &&
                Object.entries(order.items).map(([key, item]) => (
                  <li key={key}>
                    {item.title} x {item.quantity} = {item.price * item.quantity} грн
                  </li>
                ))}
            </ul>
            <p>
              <strong>Разом:</strong>{" "}
              {order.items
                ? Object.values(order.items).reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )
                : 0}{" "}
              грн
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Account;
