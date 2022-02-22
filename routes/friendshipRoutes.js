const express = require('express');
const friendshipController = require('./../controllers/friendshipController');

const router = express.Router();

router.post('/friendships', friendshipController.createFriendship);

router.get('/users/:id/friendships', friendshipController.getAllFriendships);

module.exports = router;
