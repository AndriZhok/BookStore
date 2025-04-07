import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Помилка при завантаженні книг:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Завантаження каталогу...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Каталог книг</h2>
      {books.length === 0 ? (
        <p>Книг поки немає.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> — {book.author} ({book.price} грн)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}