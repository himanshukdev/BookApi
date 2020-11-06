var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Author", AuthorSchema);