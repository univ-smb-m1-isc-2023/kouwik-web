import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Ajout de useParams
import Column from '../column';
import Header from '../header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import './board.css';

const Board = () => {
  const { boardUuid } = useParams(); // Utilisation de useParams pour obtenir le UUID du tableau
  const { uuid } = useParams();
  const [columns, setColumns] = useState([
    { id: 1, title: "Positive", tickets: [] },
    { id: 2, title: "Could be better", tickets: [] },
    { id: 3, title: "Actions", tickets: [] }
  ]);

    // Ensure that each user has a unique ID
    const ensureUserId = () => {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      return userId;
    };
    const [draft, setDraft] = useState({ content: '', columnId: null, isVisible: false });
    const userId = ensureUserId();
    const [voteCount, setVoteCount] = useState(5); // Chaque utilisateur commence avec 5 votes disponibles.

    const sortTicketsByVotes = (tickets) => {
      return tickets.sort((a, b) => b.votes - a.votes); // Tri décroissant par votes
    };

  const fetchTickets = () => {
    fetch(`https://api.kouwik.oups.net/tickets/tickets?boardUuid=${uuid}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  // Directly parse as JSON
      })
      .then(data => {
        const newColumns = columns.map(column => ({
          ...column,
          tickets: sortTicketsByVotes(data.filter(ticket => ticket.columnId === column.id)),        }));
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

  const handleVote = (columnId, ticketId, addVote) => {
    if (addVote && voteCount <= 0) {
      alert("Vous avez utilisé tous vos votes.");
      return; // Sortie anticipée si l'utilisateur n'a plus de votes à utiliser
    }
  
    const url = `https://api.kouwik.oups.net/tickets/${ticketId}/vote?userId=${userId}&addVote=${addVote}`;
    fetch(url, {
      method: 'PUT',
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
      setVoteCount(prev => prev + (addVote ? -1 : 1)); // Decrease if adding a vote, increase if removing
    })
    .catch(error => console.error('Error voting on ticket:', error));
  };

  const handleCreateDraft = (columnId) => {
    setDraft({ content: '', columnId, isVisible: true });
  };

  const handleChangeDraft = (event) => {
    setDraft({ ...draft, content: event.target.value });
  };

  const handleCancelDraft = () => {
    setDraft({ content: '', columnId: null, isVisible: false });
  };

  const handlePublishDraft = () => {
    if (!draft.content.trim()) return alert('Content cannot be empty');
    const url = `https://api.kouwik.oups.net/tickets/tickets?boardId=${uuid}&columnId=${draft.columnId}`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft.content, columnId: draft.columnId })
    })
      .then(response => response.json())
      .then(newTicket => {
        setColumns(columns.map(column =>
          column.id === draft.columnId ? { ...column, tickets: [...column.tickets, newTicket] } : column
        ));
        handleCancelDraft();
      })
      .catch(console.error);
  };

  const handleCreateTicket = (columnId, boardId, content = "Nouveau Ticket") => {
    // Assurez-vous que l'URL inclut le paramètre de requête pour boardId
    const url = `https://api.kouwik.oups.net/tickets/tickets?boardId=${boardId}`;

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
    fetch(`https://api.kouwik.oups.net/tickets/tickets/${ticketId}/move?newPosition=${newColumnId}`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) throw new Error(`Failed to move ticket with status: ${response.status}`);
        return fetchTickets();  // Refresh tickets to reflect changes
      })
      .catch(error => console.error('Error moving ticket:', error));
  };

  const handleEdit = (columnId, ticketId, newContent) => {
    fetch(`https://api.kouwik.oups.net/tickets/tickets/${ticketId}`, {
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

  const handleDeleteTicket = (columnId, ticketId) => {
    fetch(`https://api.kouwik.oups.net/tickets/tickets/${ticketId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Filtrez le ticket supprimé de l'état local pour actualiser l'UI
        const newColumns = columns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              tickets: column.tickets.filter(ticket => ticket.id !== ticketId)
            };
          }
          return column;
        });
        setColumns(newColumns);
      } else {
        console.error('Failed to delete the ticket');
      }
    })
    .catch(error => console.error('Error deleting ticket:', error));
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <Header votesLeft={voteCount} />
      <div className="board">
        
        {columns.map(column =>
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tickets={column.tickets}
            onVote={(ticketId, addVote) => handleVote(column.id,ticketId, addVote)}
            onEdit={(ticketId, newContent) => handleEdit(column.id, ticketId, newContent)}
            onMoveTicket={handleMoveTicket}
            onCreateTicket={handleCreateDraft}
            onDelete={(ticketId) => handleDeleteTicket(column.id, ticketId)} // Ajout de la fonction de suppression
          />
        )}
        {draft.isVisible && (
          <div className='draft-container'>
            <h2>New ticket</h2>
            <textarea value={draft.content} onChange={handleChangeDraft} />
            <button onClick={handlePublishDraft}>Publish</button>
            <button onClick={handleCancelDraft}>Cancel</button>
          </div>
        )}
      </div>
      <div className="share-button-container">
      <button id="shareButton" onClick={handleShareBoard}>Share This Board</button>
    </div>
      </DndProvider>
  );
};

export default Board;
