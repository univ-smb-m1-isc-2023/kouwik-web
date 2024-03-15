import React, { useState } from 'react';
import Column from '../column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './board.css';

const Board = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: "Positive", tickets: [
      { id: 1, content: "Ticket 1", votes: 0 },
      { id: 2, content: "Ticket 2", votes: 0 },
    ]},
    { id: 2, title: "Could be better", tickets: [
      { id: 3, content: "Ticket 3", votes: 0 },
      { id: 4, content: "Ticket 4", votes: 0 },
    ]},
    { id: 3, title: "Actions", tickets: [
      { id: 5, content: "Ticket 5", votes: 0 },
      { id: 6, content: "Ticket 6", votes: 0 },
    ]}
  ]);

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
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Board;