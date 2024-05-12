// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//an appropriate route as part of the inventory route file (DETAIL)
router.get("/detail/:carId", invController.buildByCarId);

//Error route
router.get("errors/error/:errorStatus", baseController.buildError);

module.exports = router;