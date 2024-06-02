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
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationList,
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
*  Deliver add vehicle view
* *************************************** */
invCont.buildNewCarForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList,
  })
}



/* ****************************************
*  Process Add clasification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name, classification_id } = req.body
  const addClassificationResult = await invModel.addNewClassification(
    classification_name
  )

  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (addClassificationResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${classification_name}.`
    )

    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
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
  
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (addVehicleResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${inv_make} ${inv_model} ${inv_year} .`
    )

    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
    })
  } else {
    req.flash("notice", "Sorry, adding the new vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList,
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Deliver edit view
* *************************************** */
invCont.editController = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const [itemData] = await invModel.getDetailsByVehicle(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
    
  })
}

  /* ****************************************
*  Process Edit vehicle
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  const {inv_id, inv_make, inv_model,inv_year,inv_description, inv_image,
    inv_thumbnail,inv_price,inv_miles,inv_color,classification_id} = req.body
  const updateVehicleResult = await invModel.updateInventory(inv_id,
    inv_make, inv_model,inv_year,inv_description, inv_image,
    inv_thumbnail,inv_price,inv_miles,inv_color,classification_id
  )

  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (updateVehicleResult) {
    req.flash(
      "notice",
      `Congratulations, you updated ${inv_make} ${inv_model} ${inv_year} .`
    )

    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationList,
    })
  } else {
  const itemName = `${inv_make} ${inv_model}`
  req.flash("notice", "Sorry, the insert failed.")
  res.status(501).render("inventory/edit-inventory", {
  title: "Edit " + itemName,
  nav,
  classificationList,
  errors: null,
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
  })
}
}


//Delivering the delete confirmation page
invCont.buildConfirmDelete = async function (req, res) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const [itemData] = await invModel.getDetailsByVehicle(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Deleting " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};


//DELETE VEHICLE
invCont.deleteInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_price,
    inv_color,
    inv_description,
    classification_id,
    inv_thumbnail,
    inv_image,
  } = req.body;

  const vehicleUpdated = inv_id
  const itemName = `${inv_make} ${inv_model}`;
  const classificationList = await utilities.buildClassificationList(classification_id)

  try {
    const deleteResult = await invModel.deleteVehicle(vehicleUpdated);
    if (deleteResult) {
      req.flash("notice", `Vehicle ${itemName} deleted successfully.`);

      res.status(201).render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        classificationList,
      })
    }
  } catch (error) {
    req.flash("notice", "Sorry, the delete process failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: `Edit ${itemName}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    });
  }
};


module.exports = invCont