const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

// Custom validation function to check if the name contains spaces or special characters
validate.namecharacteristics = () => {
  return [
      body("classification_name")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 1 })
          .withMessage("A valid name is required.")
          .custom(async (classificacion_name, { req }) => {
              const nameExists = await invModel.checkExistingClassificationName(classificacion_name);
              if (nameExists) {
                  throw new Error("Classification name already exists. Please use a different one");
              }
              if (/[\s!@#$%^&*(),.?":{}|<>]/.test(classificacion_name)) {
                throw new Error('Name must not contain spaces or special characters');
            }
          })
  ];
};

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


// Custom validation function new vehicle
  validate.addInventoryValidation = () => {
    return [
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a company"),
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .matches("^[a-zA-Z]*$")
        .withMessage("Please provide a model, only letters allowed"),
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid year"),
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a valid description"),
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a valid image URL"),
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a valid image URL"),
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid price"),
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid mileage"),
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .matches("^[a-zA-Z]*$")
        .withMessage("Please provide a color, only letters allowed"),
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid classification"),
    ];
  };


  /* ******************************
 * Check data and return errors or continue to adding new vehicle
 * ***************************** */
  validate.checkInvData = async (req, res, next) => {
    const {
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
    } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList();
      res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
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
      })
      return
    }
    next()
  }

// Custom validation function new vehicle
  validate.addInventoryValidation = () => {
    return [
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a company"),
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .matches("^[a-zA-Z]*$")
        .withMessage("Please provide a model, only letters allowed"),
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid year"),
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a valid description"),
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a valid image URL"),
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a valid image URL"),
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid price"),
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid mileage"),
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .matches("^[a-zA-Z]*$")
        .withMessage("Please provide a color, only letters allowed"),
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid classification"),
    ];
  };


  /* ******************************
 * Check data and return errors or continue to adding new vehicle
 * ***************************** */
  validate.checkUpdateData = async (req, res, next) => {
    const {
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
    } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList();
      res.render("inventory/edit-inventory", {
      errors,
      title: "Add Inventory",
      nav,
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
      })
      return
    }
    next()
  }



module.exports = validate