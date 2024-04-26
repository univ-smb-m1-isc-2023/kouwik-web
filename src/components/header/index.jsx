import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import HeaderLogo from "../../ressources/pictures/Kouwik2.png";
import './header.css';

function Header({ votesLeft }) {
  const navigate = useNavigate(); // Utilisez le hook useNavigate pour la navigation

  // Fonction pour gérer le clic sur le logo
  const goToHome = () => {
    navigate('/'); // Navigue vers la page d'accueil
  };

  return (
    <header className="header">
      <img src={HeaderLogo} alt="Logo" className="logo" onClick={goToHome} /> 
      <div className="vote-counter">
        Votes Left: {votesLeft}
      </div>
    </header>
  );
}

export default Header;
