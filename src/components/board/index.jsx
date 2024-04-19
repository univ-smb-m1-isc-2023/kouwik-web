import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Ajout de useParams
import Column from '../column';
import Header from '../header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './board.css';

const Board = () => {
  const { boardUuid } = useParams(); // Utilisation de useParams pour obtenir le UUID du tableau
  const { uuid } = useParams();
  const [columns, setColumns] = useState([
    { id: 1, title: "Positive", tickets: [] },
    { id: 2, title: "Could be better", tickets: [] },
    { id: 3, title: "Actions", tickets: [] }
  ]);

  const fetchTickets = () => {
    fetch(`http://localhost:8080/tickets/tickets?boardUuid=${uuid}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  // Directly parse as JSON
      })
      .then(data => {
        const newColumns = columns.map(column => ({
          ...column,
          tickets: data.filter(ticket => ticket.columnId === column.id),
        }));
        setColumns(newColumns);  // Assume you have a useState hook to manage columns
      })
      .catch(error => console.error('Error fetching tickets:', error));
};


  useEffect(() => {
    fetchTickets(); // Fetch immediately on mount
    const intervalId = setInterval(fetchTickets, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [uuid]); // Ajout de boardUuid comme dépendance

  const handleShareBoard = () => {
    const url = `${window.location.origin}/boards/${uuid}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Board URL copied to clipboard!');
    }, (err) => {
      console.error('Could not copy board URL: ', err);
    });
  };

  const handleVote = (columnId, ticketId) => {
    fetch(`http://localhost:8080/tickets/${ticketId}/vote`, { method: 'PUT' })
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

  const handleCreateTicket = (columnId, boardId, content = "Nouveau Ticket") => {
    // Assurez-vous que l'URL inclut le paramètre de requête pour boardId
    const url = `http://localhost:8080/tickets/tickets?boardId=${boardId}`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        columnId
      })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to create ticket: ${response.statusText}`);
        }
        return response.json();
    })
    .then(newTicket => {
      setColumns(columns.map(column => 
        column.id === columnId ? { ...column, tickets: [...column.tickets, newTicket] } : column
      ));
    })
    .catch(error => {
        console.error('Failed to create ticket:', error);
        alert(`Failed to create ticket: ${error.message}`);
    });
  };

  const handleMoveTicket = (ticketId, newColumnId) => {
    fetch(`http://localhost:8080/tickets/tickets/${ticketId}/move?newPosition=${newColumnId}`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) throw new Error(`Failed to move ticket with status: ${response.status}`);
        return fetchTickets();  // Refresh tickets to reflect changes
      })
      .catch(error => console.error('Error moving ticket:', error));
  };

  const handleEdit = (columnId, ticketId, newContent) => {
    fetch(`http://localhost:8080/tickets/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      <Header />
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
            onCreateTicket={(content) => handleCreateTicket(column.id, uuid, content)} // Passer le contenu et le boardUuid
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Board;
