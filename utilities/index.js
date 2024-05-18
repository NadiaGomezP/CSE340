const invModel = require("../models/inventory-model")
const Util = {}

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
  return cl
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util