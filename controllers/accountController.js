const accModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccManag(req, res, next) {
  const accountId = res.locals.accountData.account_id;
  const unreadMessages = await utilities.getUnreadMessagesCount(accountId)
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
    unreadMessages,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
    const regResult = await accModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
      })
    }
  }


  /* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const {account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 /* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccUpdate(req, res, next) {
  const { account_id } = req.params;
  let nav = await utilities.getNav()
  const userData = await accModel.getAccountById(account_id);
  const { account_firstname, account_lastname, account_email } = userData;
  res.render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
  })
}

 /* ****************************************
*  Process account update 
* *************************************** */
async function updateAccInfo(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const accountData = {account_firstname, account_lastname,account_email,account_id,};
  try {
    const updateResult = await accModel.updateAccQuery(accountData);
    if (updateResult) {
      req.flash("notice", "Information successfully updated");
      res.status(201).render("account/accountManagement", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("account/accountManagement", {
        title: "Account Management",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    new Error(error);
  }
};

 /* ****************************************
*  Process password update 
* *************************************** */
async function updatePassword(req, res, next) {
let nav = await utilities.getNav();
const {account_id, account_password } = req.body;
const hashedPassword = await bcrypt.hash(account_password, 10);
const accountData = {account_id,account_password: hashedPassword,};
const updateResult = await accModel.updatePasswordQuery(accountData);
    if (updateResult) {
          req.flash("notice", "Password successfully update");
          res.status(201).render("account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
          })
        } else {
          req.flash("notice", "The password update failed");
          res.status(501).render("account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
          })
        }
      }

//Log Out account      
async function logoutAcc(req, res, next) {
res.clearCookie("jwt");
res.redirect("/");
};




module.exports = { buildLogin, buildRegistration, registerAccount, loginAccount, buildAccManag, buildAccUpdate, updateAccInfo, updatePassword, logoutAcc}