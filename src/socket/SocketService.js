
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const connectWebSocket = (token, onMessageReceived) =>
{
    const socket = new SockJS('http://157.245.205.230:8080/ws');
    const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        onConnect: () =>
        {
            console.log('Connected to WebSocket');

            // Subscribe to public chatroom if applicable
            stompClient.subscribe('/chatroom/public', (message) =>
            {
                console.log('Received public message:', message.body); // Add logging
                onMessageReceived(JSON.parse(message.body));
            });

            // Subscribe to private messages queue
            stompClient.subscribe('/user/queue/private', (message) =>
            {
                console.log('Received private message:', message.body);
                onMessageReceived(JSON.parse(message.body));
            });
        },
        onDisconnect: () =>
        {
            console.log('Disconnected from WebSocket');
        },
        onStompError: (frame) =>
        {
            console.error(`WebSocket Error: ${frame.headers['message']}`);
        },
        onWebSocketError: (error) =>
        {
            console.error('WebSocket Error:', error);
        }
    });

    stompClient.activate();

    return stompClient;
};

export default connectWebSocket;
