const Book = require("../models/BookModel");
const Author = require("../models/AuthorModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
function BookData(data) {
	this.id = data._id;
	this.name= data.name;
	this.isbn = data.isbn;
}

/**
 * Book List.
 * 
 * @returns {Object}
 */
exports.bookList = [
	function (req, res) {
		try {
			Book.find().then((books)=>{
				if(books.length > 0){
					return apiResponse.successResponseWithData(res, "Success", books);
				}else{
					return apiResponse.successResponseWithData(res, "Success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book searched List.
 * 
 * @returns {Object}
 */
exports.bookSearchList = [
	function (req, res) {
		try {
			const searchString = req.body.searchParam
			Book.find({$text: {$search: searchString}}).exec(function(err, books) { 
				if(books.length>0){
					return apiResponse.successResponseWithData(res, "Success", books);	
				}else{
					return apiResponse.successResponseWithData(res, "Success", []);
				}
			});
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.bookDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Success", {});
		}
		try {
			Book.findOne({_id:req.params.id}).populate("author").exec(function (err, book) {
				if (err){
					return apiResponse.successResponseWithData(res, "Success", {});
				} 
				if(book){
					return apiResponse.successResponseWithData(res, "Success", book);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book store.
 * 
 * @param {string}      name 
 * @param {string}      isbn
 * @param {string}      author
 * 
 * @returns {Object}
 */
exports.bookStore = [
	body("name", "name must not be empty.").isLength({ min: 1 }).trim(),
	body("author", "author must not be empty."),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({isbn : value}).then(book => {
			if (book) {
				return Promise.reject("A Book already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{ name: req.body.name,
					isbn:  req.body.isbn,
					author: req.body.author
				});
			Author.findOne({_id : req.body.author}).then(author => {
				if (!author) {
					return Promise.reject("This author doest not exist.");
				}
			});
			
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save book.
				book.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let bookData = new BookData(book);
					return apiResponse.successResponseWithData(res,"Book add Success.", bookData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book update.
 * 
 * @param {string}      name 
 * @param {string}      isbn
 * @param {string}      author
 * 
 * @returns {Object}
 */
exports.bookUpdate = [
	body("name", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("author", "author must not be empty."),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({isbn : value, _id: { "$ne": req.params.id }}).then(book => {
			if (book) {
				return Promise.reject("Book exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = 
				{ name: req.body.name,
                    isbn:  req.body.isbn,
                    author:req.body.author
				};
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Book.findById(req.params.id, function (err, foundBook) {
						if(foundBook === null){
							return apiResponse.notFoundResponse(res,"Book not exists with this id");
						}else{
							Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
								if (err) { 
									return apiResponse.ErrorResponse(res, err); 
								}else{
									let bookData = new BookData(book);
									return apiResponse.successResponseWithData(res,"Author update Success.", bookData);
								}
							});
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

