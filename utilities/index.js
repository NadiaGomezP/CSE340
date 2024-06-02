const invModel = require("../models/inventory-model")
const messModel = require("../models/message-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function(data){
  let innerHTML = "";

  if (data.length > 0) {
    innerHTML += "<ul id='inv-display'>";
    data.forEach(vehicle => {
      innerHTML += `
        <li>
          <a class="imgVehicle" href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
            <hr/>
          <h2 class = "nameVehicle">
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span class="priceVehicle">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </li>`;
    });
    innerHTML += "</ul>";
  } else { 
    innerHTML += "<p class='notice'>Sorry, no matching vehicles could be found.</p>";
  }

  const view = innerHTML;
  return view;
};

//Build a custom function in the utilities > index.js file that will take the specific vehicle's information and wrap it HTML DETAIL
Util.buildDetailsGrid = async function(data){
  let pageTitle = `<h2 class="h2TitleDetail"> ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}</h2>`;
  let innerHTML = `
  <article class="detailsArticle">

    <div class="detailImg">
      <img src="${data[0].inv_image}" alt="Car image" />
    </div>

    <div class="detailsName">
      <h2> ${data[0].inv_make} ${data[0].inv_model} Details </h2>
    </div>
    
    <div class="details_Characteristics">
      <span>
          <b>Price:</b>
          <strong>$${new Intl.NumberFormat("en-US").format(data[0].inv_price)}</strong>
      </span>
      <span><time datetime="${data[0].inv_year}"><b>Year:</b> 
        ${data[0].inv_year}
      </time></span>
      <span><b>Description:</b> ${data[0].inv_description}</span>
      <span><b>Color:</b> ${data[0].inv_color}</span>
      <span><b>Brand:</b> ${data[0].inv_make}</span>
      <span><b>Model:</b> ${data[0].inv_model}</span>
      <span><b>Miles travelled:</b> ${new Intl.NumberFormat("en-Us").format(
        data[0].inv_miles
      )}</span>
    </div>
  </article>
  `;
  const view = pageTitle + innerHTML;
  return view;
};


/* ****************************************
 * Build classification list 
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }



/* ****************************************
 * Build to list
 **************************************** */
Util.buildToList = async function (account_id = null) {
  let data = await messModel.getAccount();
  let toList =
    '<select name="message_to" id="toList" required>';
  toList += "<option value=''>Choose a To:</option>";
  data.rows.forEach((row) => {
    toList += '<option value="' + row.account_id + '"';
    if (
      account_id != null &&
      row.account_id == account_id
    ) {
      toList += " selected ";
    }
    toList += ">" + row.account_email + "</option>";
  });
  toList += "</select>";
  return toList;
};


/* ****************************************
 * Build personal messages view
 **************************************** */
Util.buildPersonalMessages = async function (account_id) {
  try {
      let messages = await messModel.getMessages(account_id);
      let tableBody = '';
      messages.forEach(message => {
          // Append HTML structure for each message
          const date = message.message_created;
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          tableBody += `
              <tr class="message-row">
                  <td class="message-data">${formattedDate}</td>
                  <td class="message-data"><a href="/inbox/view/${message.message_id}" class="message-link">${message.message_subject}</a></td>
                  <td class="message-data">${message.account_firstname} ${message.account_lastname}</td>
                  <td class="message-data">${message.message_read ? 'Read' : 'Unread'}</td>
              </tr>
          `;
      });
      return tableBody;
  } catch (error) {
      console.error("Error building personal messages:", error);
      return ''; // Return empty string in case of error
  }
};


/* ****************************************
 * Build personal messages view
 **************************************** */
Util.buildArchiveMessages = async function (account_id) {
  try {
      let messages = await messModel.getArchiveMessages(account_id);
      let tableBody = '';
      messages.forEach(message => {
          // Append HTML structure for each message
          const date = message.message_created;
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          tableBody += `
              <tr class="message-row">
                  <td class="message-data">${formattedDate}</td>
                  <td class="message-data"><a href="/inbox/view/${message.message_id}" class="message-link">${message.message_subject}</a></td>
                  <td class="message-data">${message.account_firstname} ${message.account_lastname}</td>
                  <td class="message-data">${message.message_read ? 'Read' : 'Unread'}</td>
              </tr>
          `;
      });
      return tableBody;
  } catch (error) {
      console.error("Error building personal messages:", error);
      return ''; // Return empty string in case of error
  }
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildMessagesView = async function(data){
  let innerHTML = "";
  if (data.length > 0) {
    data.forEach(message => {
      innerHTML +=`
      <div class="message">
      <div id="paragraps">
        <p><strong>Subject:</strong> ${message.message_subject}</p>
        <p><strong>From:</strong> ${message.account_firstname} ${message.account_lastname}</p>
        <p><strong>Message:</strong> ${message.message_body}</p>
        </div>
        <hr>

        <div class="links">
          <a href="/inbox">Return to Inbox</a>
        </div>

        <form action="/inbox/reply/${message.message_id}" class="message-action-form">
          <input type="submit" value="Reply" class="message-action-button">
        </form>

        <form action="/inbox/archive/${message.message_id}" method="post" class="message-action-form">
          <input type="submit" value="Archive" class="message-action-button">
        </form>

        <form action="/inbox/mark-read/${message.message_id}" method="post" class="message-action-form">
          <input type="submit" value="Mark as Read" class="message-action-button">
        </form>

        <form action="/inbox/delete/${message.message_id}" method="post" class="message-action-form">
          <input type="submit" value="Delete" class="message-action-button">
        </form>
      </div>
      `;
    });
  } else { 
    innerHTML += "<p class='notice'>Sorry, no matching vehicles could be found.</p>";
  }
  const view = innerHTML;
  return view;
}


/* ****************************************
 * Messages unread
 **************************************** */
Util.getUnreadMessagesCount = async function (account_id) {
  // Implement your database query to count unread messages for the user
  const unreadMessagesCount = await messModel.getMessageUnread(account_id);
  return unreadMessagesCount;
}



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  }  else {
    res.locals.loggedin = 0;
    next();
  }
 }


/* ****************************************
* Middleware to check account type
**************************************** */
 Util.checkAccountType = (req, res, next) => {
  const userAllowed =
    res.locals.accountData?.account_type === "Admin" ||
    res.locals.accountData?.account_type === "Employee";
  if (userAllowed) {
    next();
  } else {
    req.flash("notice", "You are not authorized to view this page.");
    res.redirect("/account");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util