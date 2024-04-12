import React, { useState, useEffect } from 'react';
import Column from '../column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './board.css';

const Board = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: "Positive", tickets: [] },
    { id: 2, title: "Could be better", tickets: [] },
    { id: 3, title: "Actions", tickets: [] }
  ]);

  useEffect(() => {
    // Modifier l'URL si nécessaire pour correspondre à votre endpoint correct
    fetch('http://localhost:8080/tickets/tickets')
      .then(response => response.json())
      .then(data => {
        const newColumns = columns.map(column => ({
          ...column,
          tickets: data.filter(ticket => ticket.columnId === column.id),
        }));
        setColumns(newColumns);
      })
      .catch(error => console.error('Error fetching tickets:', error));
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'au montage

  
  const handleVote = (columnId, ticketId) => {
    setColumns(columns.map(column =>
      column.id === columnId ? {
        ...column,
        tickets: column.tickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, votes: ticket.votes + 1 } : ticket
        )
      } : column
    ));
  };
  
  const handleCreateTicket = (columnId) => {
    const newTicket = {
      id: Math.random(), // Générez un ID unique pour le nouveau ticket (à remplacer par une logique appropriée)
      content: "Nouveau Ticket",
      votes: 0,
    };
    setColumns(columns.map(column => 
      column.id === columnId ? {
        ...column,
        tickets: [...column.tickets, newTicket],
      } : column
    ));
  };
  
  const handleMoveTicket = (ticketId, newColumnId) => {
    // Trouver la colonne et le ticket source
    const sourceColumn = columns.find(col => col.tickets.some(tkt => tkt.id === ticketId));
    const ticket = sourceColumn.tickets.find(tkt => tkt.id === ticketId);

    // Vérifier si le ticket est déplacé dans une nouvelle colonne
    if (sourceColumn.id !== newColumnId) {
      setColumns(columns.map(column => {
        if (column.id === newColumnId) {
          // Ajouter le ticket à la nouvelle colonne
          return {
            ...column,
            tickets: [...column.tickets, ticket],
          };
        } else if (column.id === sourceColumn.id) {
          // Retirer le ticket de la colonne source
          return {
            ...column,
            tickets: column.tickets.filter(tkt => tkt.id !== ticketId),
          };
        } else {
          return column;
        }
      }));
    }
  };

  const handleEdit = (columnId, ticketId, newContent) => {
    setColumns(columns.map(column =>
      column.id === columnId ? {
        ...column,
        tickets: column.tickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, content: newContent } : ticket
        )
      } : column
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        {columns.map(column =>
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tickets={column.tickets}
            onVote={(ticketId) => handleVote(column.id, ticketId)}
            onEdit={(ticketId, newContent) => handleEdit(column.id, ticketId, newContent)}
            onMoveTicket={handleMoveTicket}
            onCreateTicket={handleCreateTicket}
          />
        )}
      </div>
    </DndProvider>
  );
};


export default Board;