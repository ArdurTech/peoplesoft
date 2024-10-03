const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/send', ChatController.sendMessage);
router.get('/messages/:sender/:receiver', ChatController.getMessages);
router.put('/messages/read/:messageId', ChatController.markAsRead);

module.exports = router;
