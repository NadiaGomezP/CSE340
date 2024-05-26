// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController");
const validate = require('../utilities/inventory-validation');
const { route } = require("./static");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//an appropriate route as part of the inventory route file (DETAIL)
router.get("/detail/:carId", invController.buildByCarId);

//Error route
router.get("errors/error/:errorStatus", baseController.buildError);

//Management route
router.get("/", utilities.checkLogin, invController.buildManagement);

//Add classification route
router.get("/add-classification", utilities.checkAccountType, invController.buildClassificationForm);

//Add new car route
router.get("/add-inventory", utilities.checkAccountType, invController.buildNewCarForm);

//Add new route for get inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Add path to modify 
router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.editController))

// Add path to delete
router.get("/delete/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildConfirmDelete))

router.post("/delete/:inventory_id",
utilities.checkAccountType,
utilities.handleErrors(invController.deleteInventory))

//Add route to post update
router.post("/edit-inventory",
utilities.checkAccountType,
validate.addInventoryValidation(),
validate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))


//Add classification POST
router.post('/add-classification/',
utilities.checkAccountType,
validate.namecharacteristics(),
validate.checkClassData, 
utilities.handleErrors(invController.addClassification));

//Add vehicle POST
router.post('/add-inventory',
utilities.checkAccountType,
validate.addInventoryValidation(),
validate.checkInvData,
utilities.handleErrors(invController.addVehicle));



module.exports = router;