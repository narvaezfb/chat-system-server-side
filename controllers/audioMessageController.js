const multer = require("multer");
const streamBuffers = require("stream-buffers");
const Grid = require("gridfs-stream");
const AudioMessage = require("../models/audioMessageModel");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
//Mongo URI
const mongoURI =
	"mongodb+srv://capstoneTeam:Capstone2022.@cluster0.9ohzw.mongodb.net/CapstoneDB?retryWrites=true&w=majority";

//Init gfs
let gfs;

const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

conn.once("open", function () {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("audioMessages");
	console.log("open");
});

//create storage engine

var storage = new GridFsStorage({
	db: conn,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename =
					buf.toString("hex") +
					"-audio-message" +
					path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: "audioMessages",
				};
				resolve(fileInfo);
			});
		});
	},
});

const upload = multer({ storage });
exports.uploadAudioHandler = upload.single("audio");

exports.createAudioMessage = async (req, res, next) => {
	req.file.fromUser = req.body.fromUser;
	req.file.chatRoom = req.body.chatRoom;
	const audioMessage = await AudioMessage.create(req.file);
	console.log(req.file);
	res.json({ audio: req.file, audioMessage: audioMessage });
};

exports.getAllAudioMessages = (req, res, next) => {
	gfs.files.find().toArray((err, files) => {
		if (!files || files.length === 0) {
			return res.status(404).json({
				err: "no files exist",
			});
		}

		return res.json({ status: "success", files: files });
	});
};

exports.getOneAudioMessage = (req, res, next) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		if (!file)
			return res.status(404).json({
				err: "no files exist",
			});

		return res.json(file);
	});
};

exports.reproduceOneAudioMessage = (req, res, next) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		if (!file)
			return res.status(404).json({
				err: "no filess exist",
			});

		//check if file is audio
		if (file.contentType === "audio/mpeg" || file.contentType === "audio/mp3") {
			res.set("Content-Type", "audio/mpeg");
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			return res.status(404).json({
				err: "no an audio",
			});
		}
	});
};

exports.getAllAudioMessagesToClient = (req, res, next) => {
	gfs.files.find().toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			res.json({ files: false });
		} else {
			files.map((file) => {
				if (
					file.contentType === "audio/mp3" ||
					file.contentType === "audio/mpeg"
				) {
					file.isAudio = true;
				} else {
					file.isAudio = false;
				}
			});
			return res.json({ status: "success", files: files });
		}
	});
};

exports.audioMessages = async (req, res, next) => {
	const audioMessages = await AudioMessage.find({
		chatRoom: req.params.chatRoom,
	});

	if (!audioMessages || audioMessages.length === 0) {
		return res.json({ status: "failed" });
	}

	res.json({
		status: "success",
		audioMessages: audioMessages,
	});
};
