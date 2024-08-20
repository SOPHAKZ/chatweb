import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import connectWebSocket from './SocketService'; // Ensure this import is correctly pointing to the WebSocket service file
import './Chat.css';
import { format } from 'date-fns';
const Chat = () =>
{
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatAreaRef = useRef(null);

    // Fetch users when the component mounts or when the token changes
    useEffect(() =>
    {
        const fetchUsers = async () =>
        {
            try
            {
                const response = await axios.get("http://157.245.205.230:8080/api/v1/user/all-users", {
                    params: {
                        page: 0,
                        size: 50,
                        sortBy: 'id',
                        sortDir: 'DESC'
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(response.data.data.content);
            } catch (error)
            {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();



    }, [token]);


    // Fetch chat history and initialize WebSocket when a user is selected
    useEffect(() =>
    {
        if (selectedUser)
        {
            const fetchChatHistory = async () =>
            {
                try
                {
                    const response = await axios.get(`http://157.245.205.230:8080/messages/${username}/${selectedUser.username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setMessages(response.data.data || []);
                } catch (error)
                {
                    console.error('Failed to fetch chat history:', error);
                }
            };

            fetchChatHistory();

            const client = connectWebSocket(token, (msg) =>
            {
                // Ensure that messages are properly processed based on the current conversation
                if ((msg.senderId === username && msg.recipientId === selectedUser.username) ||
                    (msg.senderId === selectedUser.username && msg.recipientId === username))
                {
                    setMessages((prevMessages) =>
                    {
                        const updatedMessages = [...prevMessages, msg];
                        updatedMessages.sort((a, b) => new Date(a.date) - new Date(b.date));
                        return updatedMessages;
                    });
                }
            });

            setStompClient(client);

            return () =>
            {
                if (client) client.deactivate();
            };
        }
    }, [selectedUser, token, username]);

    // Scroll to the bottom of the chat area when messages change
    useEffect(() =>
    {
        if (chatAreaRef.current)
        {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUserSelect = (user) =>
    {
        setSelectedUser(user);
        setMessages([]); // Clear messages when a new user is selected
    };

    const sendMessage = () =>
    {
        if (stompClient && selectedUser && message.trim())
        {
            const chatMessage = {
                senderId: username,
                recipientId: selectedUser.username,
                content: message,
                date: new Date().toISOString(),
                status: 'SENT'
            };

            // // Display the message immediately in the chat window
            // setMessages((prevMessages) => [...prevMessages, chatMessage]);

            stompClient.publish({
                destination: '/app/private-message',
                body: JSON.stringify(chatMessage),
            });

            setMessage(''); // Clear the input field
        }
    };


    const displayMessage = (msg) =>
    {
        const isSent = msg.senderId === username;
        return (
            <div key={msg.id || msg.date} className={`message ${isSent ? 'sent' : 'received'}`}>
                <div className="message-header">
                    <strong>{isSent ? 'You' : msg.senderId}</strong>
                </div>
                <div className="message-content">
                    {msg.content}
                </div>
                <div className="message-timestamp">
                    {format(new Date(msg.date), 'MM-dd-yyyy h:mm a')}
                </div>
            </div>
        );


    };



    return (
        <div className="chat-container">
            <div className="user-list">
                <div className="logged-in-user">
                    <div className="profile-icon">
                        {username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="logged-in-username">{username}</span>
                </div>
                <ul>
                    {users
                        .filter(user => user.username !== username)
                        .map(user => (
                            <li
                                key={user.id}
                                className={`user-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className="profile-icon">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.username}</span>
                            </li>
                        ))}
                </ul>
            </div>
            <div className="chat-window">
                {selectedUser ? (
                    <>
                        <h3>Chat with {selectedUser.username}</h3>
                        <div className="messages" ref={chatAreaRef}>
                            {messages.map((msg) => displayMessage(msg))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="no-user-selected">Select a user to start chatting.</div>
                )}
            </div>
        </div>
    );
};

export default Chat;
