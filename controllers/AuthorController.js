const Author = require("../models/AuthorModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Author Schema
function AuthorData(data) {
	this.id = data._id;
	this.firstName= data.firstName;
	this.lastName = data.lastName;
}

/**
 * Author List.
 * 
 * @returns {Object}
 */
exports.AuthorList = [
	function (req, res) {
		try {
			Author.find().then((authors)=>{
				if(authors.length > 0){
					return apiResponse.successResponseWithData(res, "Success", authors);
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
 * Author Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.AuthorDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Success", {});
		}
		try {
			Author.findOne({_id: req.params.id},"_id firstName lastName").then((author)=>{                
				if(author !== null){
					let authorData = new AuthorData(author);
					return apiResponse.successResponseWithData(res, "Success", authorData);
				}else{
					return apiResponse.successResponseWithData(res, "Success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Author store/Create.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.AuthorStore = [
	body("lastName", "lastName must not be empty.").isLength({ min: 1 }).trim(),
	body("firstName", "firstName must not be empty.").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Author.findOne({lastName : value,firstName: req.body.firstName}).then(author => {
			if (author) {
				return Promise.reject("Author already exist with firstName");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var author = new Author(
				{ firstName: req.body.firstName,
					lastName: req.body.lastName
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Author.
				author.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let authorData = new AuthorData(author);
					return apiResponse.successResponseWithData(res,"Author add Success.", authorData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Author update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.AuthorUpdate = [
	body("lastName", "lastName must not be empty.").isLength({ min: 1 }).trim(),
	body("firstName", "firstName must not be empty.").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Author.findOne({firstName : req.body.firstName,lastName: value, _id: { "$ne": req.params.id }}).then(author => {
			if (author) {
				return Promise.reject("Author already exist with this firstName");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var author = new Author(
				{ firstName: req.body.firstName,
					lastName: req.body.lastName,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					// finding author by the id provided in request. 
					Author.findById(req.params.id, function (err, foundAuthor) {
						if(foundAuthor === null){
							return apiResponse.notFoundResponse(res,"Author not exists with this id");
						}else{
							//update Author.
							Author.findByIdAndUpdate(req.params.id, author, {},function (err) {
								if (err) { 
									return apiResponse.ErrorResponse(res, err); 
								}else{
									let authorData = new AuthorData(author);
									return apiResponse.successResponseWithData(res,"Author update Success.", authorData);
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
