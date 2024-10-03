import React, { useState, useEffect } from "react";
import "../styles/ChatRoom.css"; // Import CSS file
import axios from "axios"; // For sending messages or fetching users/messages

const ChatRoom = () => {
  const [username, setUsername] = useState("John Doe"); // Example username
  const [selectedUser, setSelectedUser] = useState(null); // User selected for chat
  const [messages, setMessages] = useState([]); // Messages between current user and selected user
  const [newMessage, setNewMessage] = useState(""); // Message typed in input
  const [users, setUsers] = useState([
    { username: "Alice", unread_count: 2 },
    { username: "Bob", unread_count: 0 },
  ]); // List of users

  // Function to handle selecting a user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Here you can load messages with that user
    // fetchMessages(user.username);
  };

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      sender: username,
      receiver: selectedUser.username,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Send message to the server
    try {
      // Example POST request
      // await axios.post("/api/send-message", messageData);
      setMessages([...messages, messageData]); // Update messages locally
      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // Formatting timestamp
  const formatTimestamp = (timestamp) => {
    const currentTime = new Date();
    const messageTime = new Date(timestamp);

    const isToday = currentTime.toDateString() === messageTime.toDateString();
    if (isToday) {
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date();
    yesterday.setDate(currentTime.getDate() - 1);
    if (yesterday.toDateString() === messageTime.toDateString()) {
      return "Yesterday";
    }

    return messageTime.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="chat-container">
      <header>
        <div className="header-left">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJrfOVb7CkbNIqKC0GU6AYyl-bzSctGwsYEw&s"
            alt="Ardur Technologies"
            id="companyLogo"
          />
        </div>
        <h4>Chat Room</h4>
        <div className="header-right">
          <div className="dropdown">
            <img src="/static/logo/user.png" alt="User Icon" id="userIcon" />
            <span id="username">{username}</span>
            <div className="dropdown-content">
              <button id="logoutButton" className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="chat-content">
        {/* User List */}
        <div id="user-list">
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.username} onClick={() => handleUserSelect(user)}>
                <span className="username" data-username={user.username}>
                  {user.username}
                  {user.unread_count > 0 && (
                    <span className="unread-count">({user.unread_count})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Box */}
        <div id="chat-box">
          <div id="chat-header">
            <h2>{selectedUser ? selectedUser.username : "Select a user"}</h2>
          </div>

          <div id="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === username ? "sent" : "received"
                }
              >
                <p>{message.message}</p>
                <span>{formatTimestamp(message.timestamp)}</span>
              </div>
            ))}
          </div>

          {selectedUser ? (
            <form id="message-form" onSubmit={handleSendMessage}>
              <textarea
                name="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <button type="submit">Send</button>
            </form>
          ) : (
            <p>Please select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
