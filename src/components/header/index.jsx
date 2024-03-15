import React from 'react';
import HeaderLogo from "../../ressources/pictures/tom.jpg"

function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#f5f5f5' }}>
      <img src={HeaderLogo} alt="Logo" style={{ height: '50px' }} />
      <h1 style={{ marginLeft: '10px' }}>Mon Application</h1>
    </header>
  );
}

export default Header;