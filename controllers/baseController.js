const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.buildError = async function (req, res, next) {
  const errorStatus = req.params.errorStatus;
  const nav = await utilities.getNav();
  const errorData = {
    status: 500,
    message: "Server Error",
    nav: nav
  };
  res.status(500).send(errorData);
};

module.exports = baseController