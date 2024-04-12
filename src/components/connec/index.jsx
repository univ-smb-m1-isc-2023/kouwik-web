import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function MyComponent() {
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

    return <div>My Component</div>;
}

export default MyComponent;