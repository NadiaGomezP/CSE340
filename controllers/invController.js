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


/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement =async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add classifcation view
* *************************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildNewCarForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const defaultImagePath = '/images/vehicles/no-image.png';
  const defaultThumbnailPath = '/images/vehicles/no-image-tn.png';
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    defaultImagePath,
    defaultThumbnailPath,
    classificationList,
  })
}



/* ****************************************
*  Process Add clasification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const addClassificationResult = await invModel.addNewClassification(
    classification_name
  )

  let nav = await utilities.getNav()

  if (addClassificationResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${classification_name}.`
    )

    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding the new name failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}


/* ****************************************
*  Process Add vehicle
* *************************************** */
invCont.addVehicle = async function (req, res, next) {
  const {inv_make, inv_model,inv_year,inv_description, inv_image,
    inv_thumbnail,inv_price,inv_miles,inv_color, classification_id} = req.body
  const addVehicleResult = await invModel.addNewVehicle(
    inv_make, inv_model,inv_year,inv_description, inv_image,
    inv_thumbnail,inv_price,inv_miles,inv_color, classification_id
  )

  let nav = await utilities.getNav()

  if (addVehicleResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${inv_make} ${inv_model} ${inv_year} .`
    )

    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding the new vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}


module.exports = invCont