const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//use cors middleware for app
app.use(cors());

//create a new server using express
const server = http.createServer(app);

//allow get a post requests
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
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
    //console.log(con.connections);
    console.log("DB connection succesfull");
  });

//start the server
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`running on port ${port}...`);
});
