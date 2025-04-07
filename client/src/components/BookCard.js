import React from "react";

const BookCard = ({ book, onAdd, isAdded }) => {
  const styles = {
    card: {
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "10px",
      maxWidth: "240px",
      textAlign: "center",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease-in-out",
    },
    image: {
      width: "100%",
      height: "auto",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    button: {
      backgroundColor: isAdded ? "#4caf50" : "#007bff",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginTop: "1rem",
    },
  };

  return (
    <div className="book-card" style={styles.card}>
      <img
        src={book.image || "https://via.placeholder.com/200x300?text=No+Image"}
        alt={`Обкладинка книги: ${book.title}`}
        style={styles.image}
      />
      <h3>{book.title}</h3>
      <p><strong>Автор:</strong> {book.author}</p>
      <p><strong>Ціна:</strong> {book.price} грн</p>
      <button onClick={() => onAdd(book)} style={styles.button}>
        {isAdded ? "✅ Додано" : "➕ Додати до кошика"}
      </button>
    </div>
  );
};

export default BookCard;