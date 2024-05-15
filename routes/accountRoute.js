// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController");
const baseController = require("../controllers/baseController");
const validate = require('../utilities/account-validation');


//Route for the path that will be sent when the "My Account" link is clicked
router.get("/login/",accountController.buildLogin);

//Route for the path that will be sent when the "Registration" link is clicked
router.get("/registration/",accountController.buildRegistration);

//Registration POST
router.post('/registration/',
validate.registationRules(),
validate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
)

//Error route
router.get("errors/error/:errorStatus", baseController.buildError);

module.exports = router;