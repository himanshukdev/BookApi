var express = require("express");
const AuthorController = require("../controllers/AuthorController");

var router = express.Router();

router.get("/", AuthorController.AuthorList);
router.get("/:id", AuthorController.AuthorDetail);
router.post("/", AuthorController.AuthorStore);
router.put("/:id", AuthorController.AuthorUpdate);

module.exports = router;