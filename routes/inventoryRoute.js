// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController");
const validate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//an appropriate route as part of the inventory route file (DETAIL)
router.get("/detail/:carId", invController.buildByCarId);

//Error route
router.get("errors/error/:errorStatus", baseController.buildError);

//Management route
router.get("/", invController.buildManagement);

//Add classification route
router.get("/add-classification", invController.buildClassificationForm);

//Add new car route
router.get("/add-inventory", invController.buildNewCarForm);

//Add classification POST
router.post('/add-classification/',
validate.namecharacteristics(),
validate.checkClassData, 
utilities.handleErrors(invController.addClassification));

//Add vehicle POST
router.post('/add-inventory',
validate.addInventoryValidation(),
validate.checkInvData,
utilities.handleErrors(invController.addVehicle));



module.exports = router;