const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const moment = require("moment");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Message = require("./models/messageModel");

const streamBuffers = require("stream-buffers");
const Grid = require("gridfs-stream");

dotenv.config({ path: "./.env" });

//use cors middleware for app
app.use(cors());

//create a new server using express
const server = http.createServer(app);

//allow get a post requests
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PATCH", "DELETE"],
	},
});

//connect database

//console.log(process.env);
const DB = process.env.DATABASE;
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connection succesfull");
	});

//Connect to socket io

//start the server
const port = process.env.PORT;

io.on("connection", function (socket) {
	//event when user enter the room number
	socket.on("joined", (data) => {
		socket.join(data);
		console.log(`User joined to : ${data} room `);
	});

	//event when user send data
	socket.on("send-message", async (data) => {
		//if message is text
		if (data.messageFormat == "text") {
			const newMessageData = {
				chatRoom: data.chatRoom,
				fromUser: data.From,
				message: data.message,
				messageFormat: data.messageFormat,
				// createdAt: dateFormated,
			};

			const message = await Message.create(newMessageData);

			const retrieveCurrentChatHistory = await Message.find({
				chatRoom: data.chatRoom,
			});
			console.log(retrieveCurrentChatHistory);
			socket
				.to(data.chatRoom)
				.emit("recieve-message", retrieveCurrentChatHistory);
		}

		if (data.messageFormat == "audio") {
			const newMessageData = {
				chatRoom: data.chatRoom,
				fromUser: data.fromUser,
				message: data.message,
				messageFormat: data.messageFormat,
				audio: data.audio,
				filename: data.filename,
				// createdAt: dateFormated,
			};

			const message = await Message.create(newMessageData);

			const retrieveCurrentChatHistory = await Message.find({
				chatRoom: data.chatRoom,
			});
			console.log(retrieveCurrentChatHistory);
			socket
				.to(data.chatRoom)
				.emit("recieve-message", retrieveCurrentChatHistory);
		}
	});

	//Whenever someone disconnects this piece of code executed
	socket.on("disconnect", function () {
		console.log("A user disconnected");
	});
});

server.listen(port, () => {
	console.log(`running on port ${port}...`);
});
