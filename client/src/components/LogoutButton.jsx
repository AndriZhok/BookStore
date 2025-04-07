import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out");
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}