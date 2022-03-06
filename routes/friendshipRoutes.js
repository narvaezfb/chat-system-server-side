const express = require("express");
const friendshipController = require("./../controllers/friendshipController");

const router = express.Router();

router.post("/friendships", friendshipController.createFriendship);
router.get("/friendships", friendshipController.getAllFriendships);

router.get(
	"/users/:id/friendships",
	friendshipController.getAllFriendshipsOfUser
);

router.get("/friendships/:id", friendshipController.getOneFriendship);

router.get(
	"/friendships/firstUser/:firstUserId/secondUser/:secondUserId",
	friendshipController.test
);

module.exports = router;
