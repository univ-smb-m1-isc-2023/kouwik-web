import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './ticket.css';

const Ticket = ({ id, content, votes, columnId, onVote, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ticket',
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  // Appel à onVote avec le paramètre indiquant si on ajoute ou retire un vote
  const handleAddVote = () => {
    onVote(id, true);  // true pour ajouter un vote
  };

  const handleRemoveVote = () => {
    onVote(id, false);  // false pour retirer un vote
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedTicket = { id, content: editedContent, columnId, votes };
  
    fetch(`https://api.kouwik.oups.net/tickets/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTicket),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      onEdit(id, editedContent);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <div ref={drag} className="ticket" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {isEditing ? (
        <input
          type="text"
          value={editedContent}
          onChange={handleChange}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <>
          <p>{content}</p>
          <p>Vote: {votes}</p>
          <button onClick={handleAddVote}>Add Vote</button>
          <button onClick={handleRemoveVote}>Remove Vote</button>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Ticket;
