import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const Ticket = ({ id, content, votes, columnId, onVote, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ticket',
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleVote = () => {
    onVote(id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(id, editedContent);
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
          <p>Votes: {votes}</p>
          <button onClick={handleVote}>Vote</button>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </div>
  );
};

export default Ticket;
