// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/")
const messageController = require("../controllers/messageController");
const baseController = require("../controllers/baseController");
const validate = require('../utilities/message-validation');


//Route for the path that will be sent when the "Inbox" link is clicked
router.get("/",
utilities.checkLogin,
messageController.buildInbox);

//Route for the path that will be sent when the "Create" link is clicked
router.get("/create",
utilities.checkLogin,
messageController.buildCreate);

//Route for the path that will be sent when the "Reply" link is clicked
router.get("/reply/:message_id",
utilities.checkLogin,
messageController.buildCreate);

//Route for the path that will be sent when the "View Archive" link is clicked
router.get("/archive",
utilities.checkLogin,
messageController.buildArchive);

//Route for the path that will be sent when the "View Mail" link is clicked
router.get("/view/:message_id",
utilities.checkLogin,
messageController.buildView);

//Route for the path that will be sent when the "Archive" link is clicked
router.post("/archive/:message_id",
utilities.checkLogin,
messageController.processArchive);

//Route for the path that will be sent when the "Mark as read" link is clicked
router.post("/mark-read/:message_id",
utilities.checkLogin,
messageController.processMarkRead);

//Route for the path that will be sent when the "Delete" link is clicked
router.post("/delete/:message_id",
utilities.checkLogin,
messageController.processDeleteMessage);

//New Message POST
router.post('/create',
utilities.checkLogin,
validate.createMessageValidation(),
validate.checkMessageData,
utilities.handleErrors(messageController.createNewMessage));


//New Message POST
router.post('/reply',
utilities.checkLogin,
validate.createMessageValidation(),
validate.checkMessageData,
utilities.handleErrors(messageController.createNewMessage));





module.exports = router;