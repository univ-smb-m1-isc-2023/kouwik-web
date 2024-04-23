import React, { useState } from 'react';
import Ticket from '../ticket';
import { useDrop } from 'react-dnd';
import './column.css';

const Column = ({ id, title, tickets, onVote, onEdit, onMoveTicket, onCreateTicket, onDelete }) => {
  const [, drop] = useDrop({
    accept: 'ticket',
    drop: (item) => onMoveTicket(item.id, id),
  });
   const handleVote = (ticketId, addVote) => {
    onVote(ticketId, addVote);  // Propager l'appel au parent avec les détails nécessaires
  };

  return (
    <div ref={drop} className="column">
      <h2>{title} <button onClick={() => onCreateTicket(id)}>Créer Ticket</button></h2>
      {tickets.map(ticket =>
        <Ticket
          key={ticket.id}
          id={ticket.id}
          content={ticket.content}
          votes={ticket.votes}
          columnId={id}
          onVote={handleVote}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};


export default Column;
