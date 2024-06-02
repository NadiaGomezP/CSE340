// Needed Resources 
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const messageModel = require("../models/message-model")
const validate = {}

// Custom validation function new vehicle
  validate.createMessageValidation = () => {
    return [
      body("message_to")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a valid email"),
      body("message_subject")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a subject"),
      body("message_body")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a valid message"), 
      ]
    }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
  const { message_to, message_subject, message_body } = req.body
  let errors = []
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const toList = await utilities.buildToList();
    res.render("message/create", {
      errors,
      title: "New Message",
      nav,
      message_to,
      toList,
      message_subject,
      message_body,
    })
    return
  }
  next()
}

module.exports = validate