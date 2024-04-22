import React from 'react';
import HeaderLogo from "../../ressources/pictures/Kouwik2.png";
import './header.css';

function Header() {
  return (
    <header className="header">
      <img src={HeaderLogo} alt="Logo" className="logo" />

    </header>
  );
}

export default Header;
