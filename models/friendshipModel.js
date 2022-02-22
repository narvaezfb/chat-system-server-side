const mongoose = require('mongoose');
const validator = require('validator');

const friendshipSchema = new mongoose.Schema(
	{
		firstUser: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
		secondUser: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
