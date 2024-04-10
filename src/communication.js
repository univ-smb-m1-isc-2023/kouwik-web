import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let socket = new SockJS('http://localhost:8080/ws'); // Assurez-vous que cette URL est correcte

let stompClient = Stomp.over(socket);

console.log('Connecting to WS...');
stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/tickets', function(ticket) {
        console.log("Received data:", ticket.body);
        console.log(JSON.parse(ticket.body).content);
    });
});
// Utiliser stompClient.send() pour envoyer des messages au serveur
