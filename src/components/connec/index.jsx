import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function MyComponent() {
    /*
    useEffect(() => {
        let socket = new SockJS('http://localhost:8080/ws');
        let stompClient = Stomp.over(socket);

        console.log('Connecting to WS...');
        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/topic/tickets', function(ticket) {
                console.log("top top top");
            });
        });

        // Cleanup on unmount
        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []); // Empty array means this effect runs once on mount and clean up on unmount
*/
useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
  
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/message', (message) => {
        if (message.body === 'ok') {
          console.log('Message received from WebSocket: ', message.body);
          // Gérez la réception du message ici
        }
      });
    });
  
    return () => {
      stompClient.disconnect();
    };
  }, []);
  
  const handleButtonClick = () => {
    fetch('/trigger-websocket', { method: 'POST' })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error triggering WebSocket:', error));
  };
  
  return (
    <button onClick={handleButtonClick}>Trigger WebSocket</button>
  );
  
}

export default MyComponent;


