import React from 'react';
import HeaderLogo from "../../ressources/pictures/Kouwik2.png";
import './header.css';

function Header({ votesLeft }) {
  return (
    <header className="header">
      <img src={HeaderLogo} alt="Logo" className="logo" />
      <div className="vote-counter">
        Votes Left: {votesLeft}
      </div>
    </header>
  );
}

export default Header;
