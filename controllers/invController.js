const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}


//a controller function (DETAIL CONTROLLER)
invCont.buildByCarId  = async function (req, res, next) {
 const car_id = req.params.carId
 const data = await invModel.getDetailsByVehicle(car_id)
 let nav = await utilities.getNav()
 const grid = await utilities.buildDetailsGrid(data)
 const title = `${data[0].inv_make} ${data[0].inv_model} Details`;
 res.render("./inventory/details",{
  nav,
  detail: grid,
  title,
  errors: null,
 });
}

module.exports = invCont