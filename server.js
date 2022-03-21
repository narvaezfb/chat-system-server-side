const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const moment = require("moment");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Message = require("./models/messageModel");
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
		const date = new Date();
		const dateFormated = moment(date).format("MMMM Do YYYY, h:mm:ss a");
		const newMessageData = {
			chatRoom: data.chatRoom,
			fromUser: data.From,
			message: data.message,
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
	});

	// socket.on("force", function () {
	// 	console.log("disconnect user");
	// 	socket.close();
	// });
	//Whenever someone disconnects this piece of code executed
	socket.on("disconnect", function () {
		console.log("A user disconnected");
	});
});

server.listen(port, () => {
	console.log(`running on port ${port}...`);
});
