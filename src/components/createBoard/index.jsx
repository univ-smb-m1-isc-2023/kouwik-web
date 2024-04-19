import React from 'react';
import './createBoard.css'; 
import { useNavigate } from 'react-router-dom';
function CreateBoardButton() {
    const navigate = useNavigate(); // Utilisez le hook useNavigate de react-router-dom pour gérer la navigation.

    const createBoard = async () => {
        const response = await fetch('http://localhost:8080/boards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const board = await response.json();
        navigate(`/boards/${board.uuid}`); // Naviguez vers le nouveau tableau utilisant l'UUID généré.
    };

    return (
        <div className="create-board-container">
            <h1>Create a New Board</h1>  {/* Ajout d'un titre */}
            <button onClick={createBoard} className="create-board-button">Create New Board</button>
        </div>
    );
}
export default CreateBoardButton;