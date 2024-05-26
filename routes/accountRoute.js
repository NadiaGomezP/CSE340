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

//Route for the path that will be sent when the "Login" link is clicked
router.get("",
utilities.checkLogin,
accountController.buildAccManag);

//Registration POST
router.post('/registration/',
validate.registationRules(),
validate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login/",
utilities.handleErrors(accountController.loginAccount))

//Error route
router.get("errors/error/:errorStatus", baseController.buildError);

// Process update page
router.get("/update/:account_id",
utilities.checkLogin,
utilities.handleErrors(accountController.buildAccUpdate)); 

//Route to update account information post
router.post("/update",
validate.updateInfoRules(),
validate.checkUpdInformation,
utilities.handleErrors(accountController.updateAccInfo));


//Route to password change post
router.post("/update/password",
utilities.checkLogin,
validate.updatePassRules(),
validate.checkPassInformation,
utilities.handleErrors(accountController.updatePassword));

//Route to log out post
router.post("/logout/", 
utilities.handleErrors(accountController.logoutAcc));


module.exports = router;