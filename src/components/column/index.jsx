import React, { useState } from 'react';
import Ticket from '../ticket';
import { useDrop } from 'react-dnd';

const Column = ({ id, title, tickets, onVote, onEdit, onMoveTicket }) => {
  const [, drop] = useDrop({
    accept: 'ticket',
    drop: (item) => onMoveTicket(item.id, id),
  });

  return (
    <div ref={drop} className="column">
      <h2>{title}</h2>
      {tickets.map(ticket =>
        <Ticket
          key={ticket.id}
          id={ticket.id}
          content={ticket.content}
          votes={ticket.votes}
          columnId={id}
          onVote={onVote}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};


export default Column;
