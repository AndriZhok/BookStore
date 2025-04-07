import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/catalog">Каталог</Link></li>
          <li><Link to="/cart">Кошик</Link></li>
          {user ? (
            <>
              <li><Link to="/account">Мій акаунт</Link></li>
              <li><LogoutButton /></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Увійти</Link></li>
              <li><Link to="/register">Реєстрація</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;