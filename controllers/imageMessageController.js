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

	gfs.collection("imageMessages");
});

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
					"-image-message" +
					path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: "imageMessages",
				};
				resolve(fileInfo);
			});
		});
	},
});
const uploadImage = multer({ storage });

exports.uploadMessageHandler = uploadImage.single("image");

exports.createImageMessage = (req, res, next) => {
	res.json({ image: req.file });
};

exports.getAllImageMessages = (req, res, next) => {
	gfs.files.find().toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			res.render("index", { files: false });
		} else {
			files.map((file) => {
				if (
					file.contentType === "image/jpeg" ||
					file.contentType === "image/png"
				) {
					file.isImage = true;
				} else {
					file.isImage = false;
				}
			});
			return res.json({ status: "success", files: files });
		}
	});
};

exports.getOneImage = (req, res, next) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "No file exists",
			});
		}

		// Check if image
		if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
			// Read output to browser
			res.set("Content-Type", "image/png");
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: "Not an image",
			});
		}
	});
};
