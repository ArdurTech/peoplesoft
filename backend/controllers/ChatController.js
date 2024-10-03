const db = require('../config/DBConn'); // Adjust the path as necessary

// Send a message
const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  if (!sender || !receiver || !message) {
    return res.status(400).json({ error: "Sender, receiver, and message are required." });
  }

  try {
    const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    await db.query(query, [sender, receiver, message]);
    res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Retrieve messages between two users
const getMessages = async (req, res) => {
  const { sender, receiver } = req.params;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender and receiver are required." });
  }

  try {
    const query = `
      SELECT * FROM messages 
      WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
      ORDER BY timestamp ASC
    `;
    const messages = await db.query(query, [sender, receiver, receiver, sender]);
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({ error: "Message ID is required." });
  }

  try {
    const query = 'UPDATE messages SET is_read = TRUE WHERE id = ?';
    await db.query(query, [messageId]);
    
    res.status(200).json({ message: "Message marked as read." });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead
};
