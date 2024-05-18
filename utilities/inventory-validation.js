const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

// Custom validation function to check if the name contains spaces or special characters
validate.namecharacteristics = () => {
    return [
        body("classificacion_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A valid email is required.")
        .custom(async (classificacion_name) => {
            const nameExists = await invModel.checkExistingClassificationName(classificacion_name)
            if (nameExists){
              throw new Error("Classification name already exists. Please use a different one")
            }
        })
        .custom(async (classificacion_name) => {
                if (/\s/.test(classificacion_name) || /[^\w]/.test(classificacion_name)) {
        throw new Error('Name must not contain spaces or special characters');
}})
]
}

/* ******************************
 * Check data and return errors or continue to adding new classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Clasification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

module.exports = validate