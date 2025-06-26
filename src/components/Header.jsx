// src/components/Header.jsx
import React from "react";

function Header({ location }) {
  return (
    <header>
      <h1>SafeBite {location}</h1>
    </header>
  );
}

export default Header; // ✅ Must exist
