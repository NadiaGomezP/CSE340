/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute));
// File Not Found Route - must be last route in list
app.get("/errors/error/:errorStatus", async (req, res, next) => {
  const errorStatus = req.params.errorStatus;
  
  if (errorStatus === '500') {
    // Simulate a 500 Internal Server Error
    const error = new Error('Internal Server Error');
    error.status = 500;
    next(error);
  } else {
    // For other error statuses, return a generic error message
    next({
      status: errorStatus,
      message: "Unknown error occurred. Please try again.",
    });
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404 || err.status == 500)
  { message = err.message} 
  else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
