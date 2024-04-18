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
  const [boardUuid, setBoardUuid] = useState('');

  const fetchTickets = () => {
    // Assuming the backend endpoint now also takes a board UUID
    fetch(`http://localhost:8080/tickets/tickets?boardUuid=${boardUuid}`)
      .then(response => response.json())
      .then(data => {
        const newColumns = columns.map(column => ({
          ...column,
          tickets: data.filter(ticket => ticket.columnId === column.id),
        }));
        setColumns(newColumns);
      })
      .catch(error => console.error('Error fetching tickets:', error));
  };

  useEffect(() => {
    // Extract the board UUID from URL or set a new one if not available
    const uuid = window.location.pathname.split('/')[2] || 'new-uuid-from-backend'; // Adjust logic to fetch from backend
    setBoardUuid(uuid);
    fetchTickets(); // Fetch immediately on mount
    const intervalId = setInterval(fetchTickets, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleShareBoard = () => {
    const url = `${window.location.origin}/boards/${boardUuid}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Board URL copied to clipboard!');
    }, (err) => {
      console.error('Could not copy board URL: ', err);
    });
  };

  
  
  const handleVote = (columnId, ticketId) => {
    console.log(ticketId); 
    fetch(`http://localhost:8080/tickets/${ticketId}/vote`, {
      method: 'PUT'
    })
    .then(response => response.json())
    .then(updatedTicket => {
      setColumns(columns.map(column =>
        column.id === columnId ? {
          ...column,
          tickets: column.tickets.map(ticket =>
            ticket.id === ticketId ? updatedTicket : ticket
          )
        } : column
      ));
    })
    .catch(error => console.error('Error voting ticket:', error));
  };
  
  
  const handleCreateTicket = (columnId, content = "Nouveau Ticket") => {
    fetch('http://localhost:8080/tickets/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        columnId: columnId
      })
    })
    .then(response => response.json())
    .then(newTicket => {
      setColumns(columns.map(column => 
        column.id === columnId ? {
          ...column,
          tickets: [...column.tickets, newTicket],
        } : column
      ));
    })
    .catch(error => console.error('Failed to create ticket:', error));
  };
  
  const handleMoveTicket = (ticketId, newColumnId) => {
    // URL de l'API pour déplacer le ticket
    const url = `http://localhost:8080/tickets/tickets/${ticketId}/move?newPosition=${newColumnId}`;

    // Effectuer la requête PUT pour déplacer le ticket
    fetch(url, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            // Si la réponse n'est pas OK, lance une erreur pour être capturée par le bloc catch
            throw new Error(`Failed to move ticket with status: ${response.status}`);
        }
        // Après un succès, mettez à jour l'état pour refléter le changement
        return fetchTickets();  // Recharger tous les tickets pour mettre à jour l'affichage
    })
    .then(() => {
        console.log('Ticket moved successfully and state updated.');
    })
    .catch(error => {
        console.error('Error moving ticket:', error);
        alert('Failed to move ticket: ' + error.message); // Afficher l'erreur à l'utilisateur
    });
};


  
  const handleEdit = (columnId, ticketId, newContent) => {
    fetch(`http://localhost:8080/tickets/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newContent })
    })
    .then(response => response.json())
    .then(updatedTicket => {
      setColumns(columns.map(column =>
        column.id === columnId ? {
          ...column,
          tickets: column.tickets.map(ticket =>
            ticket.id === ticketId ? updatedTicket : ticket
          )
        } : column
      ));
    })
    .catch(error => console.error('Error updating ticket:', error));
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        <button onClick={handleShareBoard}>Share This Board</button>
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