const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const audioMessagesRoutes = require("./routes/audioMessageRoutes");
const imageMessagesRoutes = require("./routes/imageMessageRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(express.json());

app.use(
	cors({
		origin: [
			"https://tiny-creponne-e580b1.netlify.app",
			"https://tiny-creponne-e580b1.netlify.app/",
			"https://tiny-creponne-e580b1.netlify.app/login",
			"https://tiny-creponne-e580b1.netlify.app/chat",
			"https://tiny-creponne-e580b1.netlify.app/user/userProfile",
		],
		methods: ["GET", "POST", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		key: "userId",
		secret: "secretkeyawesome",
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: 600 * 600 * 24,
		},
	})
);

app.use("/", userRoutes);
app.use("/", friendshipRoutes);
app.use("/", chatRoomRoutes);
app.use("/", messageRoutes);
app.use("/", audioMessagesRoutes);
app.use("/", imageMessagesRoutes);

module.exports = app;
