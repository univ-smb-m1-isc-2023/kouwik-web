import React from 'react';
import HeaderLogo from "../../ressources/pictures/tom.jpg";
import './header.css';

function Header() {
  return (
    <header className="header">
      <img src={HeaderLogo} alt="Logo" className="logo" />
      <h1 className="title">Mon Application</h1>
    </header>
  );
}

export default Header;
