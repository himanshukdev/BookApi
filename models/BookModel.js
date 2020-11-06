var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	name: {type: String, required: true},
	isbn: {type: String, required: true},
	author: { type: Schema.ObjectId, ref: "Author", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Book", BookSchema);