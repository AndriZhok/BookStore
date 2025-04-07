import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import BookCard from "./BookCard";

const Catalog = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});
  const [books, setBooks] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  // Зчитування книг з Firestore
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "books"));
        const booksArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksArray);
      } catch (error) {
        console.error("Помилка при завантаженні книг:", error);
      }
    };

    fetchBooks();
  }, []);

  // Автоматичне збереження кошика
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (book) => {
    const updatedCart = { ...cart };
    const timestamp = Date.now();
    if (!updatedCart[book.id]) {
      updatedCart[book.id] = {
        id: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        timestamp
      };
    } else {
      updatedCart[book.id].quantity += 1;
      updatedCart[book.id].timestamp = timestamp;
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const authors = [...new Set(books.map(b => b.author))];
  const genres = [...new Set(books.map(b => b.genre || "Невідомо"))];

  const filteredBooks = books
    .filter(book => {
      const matchAuthor = filterAuthor === "all" || book.author === filterAuthor;
      const matchGenre = filterGenre === "all" || (book.genre || "Невідомо") === filterGenre;
      const matchPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && book.price <= 100) ||
        (priceFilter === "medium" && book.price > 100 && book.price <= 300) ||
        (priceFilter === "high" && book.price > 300);
      return matchAuthor && matchGenre && matchPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div>
      <h1>Каталог книг</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Фільтрувати за автором: </label>
        <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)}>
          <option value="all">Усі</option>
          {authors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Фільтрувати за жанром: </label>
        <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
          <option value="all">Усі</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Фільтрувати за ціною: </label>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">Усі</option>
          <option value="low">До 100</option>
          <option value="medium">100–300</option>
          <option value="high">Понад 300</option>
        </select>

        <label style={{ marginLeft: "1rem" }}>Сортувати ціну: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Без сортування</option>
          <option value="asc">Від дешевих до дорогих</option>
          <option value="desc">Від дорогих до дешевих</option>
        </select>
      </div>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAdd={addToCart}
            isAdded={!!cart[book.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default Catalog;