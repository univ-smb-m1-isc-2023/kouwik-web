import React, { useState } from 'react';
import Ticket from '../ticket';
import { useDrop } from 'react-dnd';
import './column.css';

const Column = ({ id, title, tickets, onVote, onEdit, onMoveTicket, onCreateTicket, onDelete }) => {
  const [, drop] = useDrop({
    accept: 'ticket',
    drop: (item) => onMoveTicket(item.id, id),
  });

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
          onVote={onVote}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};


export default Column;
