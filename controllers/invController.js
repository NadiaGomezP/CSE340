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
*  Deliver add classifcation view
* *************************************** */
invCont.buildNewCarForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
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

invCont.getAddInventory = async (req, res) => {
  try {
      // Build classification list using utilities
      const classificationList = await utilities.buildClassificationList();
      // Render the add inventory view
      res.render('inventory/add-inventory', { classificationList });
  } catch (error) {
      console.error('Error rendering add inventory view:', error);
      // Render error message or handle it as required
      res.status(500).send('Internal Server Error');
  }
};


module.exports = invCont