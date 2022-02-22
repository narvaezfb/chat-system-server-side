const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.json());

app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		key: 'userId',
		secret: 'secretkeyawesome',
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: 60 * 60 * 24,
		},
	})
);

app.use('/', userRoutes);
app.use('/', friendshipRoutes);

module.exports = app;
