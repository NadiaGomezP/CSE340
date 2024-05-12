const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.buildError = async function (req, res, next) {
  try {
    // Simulate an error by dividing by zero
    const result = 10 / 0;
    res.send(result); // This won't execute due to the error
  } catch (error) {
    // Pass the error to the next middleware
    next(error);
  }
};

module.exports = baseController