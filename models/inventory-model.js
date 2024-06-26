const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }


//a function to retrieve the data for a specific vehicle in inventory (detail)
async function getDetailsByVehicle(car_id){
 try{
  const data = await pool.query(
    `SELECT * FROM public.inventory WHERE inv_id = $1`,
    [car_id]
  )
  return data.rows
 } catch (error) {
  console.error("getdetailsbyvehicle error" + error)
 }
}

  /* *****************************
*   add New Classification
* *************************** */
async function addNewClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


  /* **********************
 *   Check for existing classification_name
 * ********************* */
  async function checkExistingClassificationName(classification_name){
    try {
      const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
      const classification = await pool.query(sql, [classification_name])
      return classification.rowCount
    } catch (error) {
      return error.message
    }
  }


  /* *****************************
*   add New Vehicle
* *************************** */
async function addNewVehicle(inv_make, inv_model,inv_year,inv_description, inv_image,
  inv_thumbnail,inv_price,inv_miles,inv_color, classification_id) {
  try {
      const sql =
          "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
      const vehicles = await pool.query(sql, [
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
      ]);
      return vehicles.rowCount
  } catch (error) {
      return error.message;
  }
}

  /* *****************************
*   update New Vehicle
* *************************** */
async function updateInventory(inv_id, inv_make, inv_model,inv_year,inv_description, inv_image,
  inv_thumbnail,inv_price,inv_miles,inv_color, classification_id) {
  try {
      const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
          inv_id,
      ]);
      return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
      const sql = 'DELETE FROM public.inventory WHERE inv_id = $1';
      const { rowCount } = await pool.query(sql, [inv_id]);
      if (rowCount === 1) {
          return true;
      } else {
  throw new Error("No inventory item with the specified ID found.");
      }
  } catch (error) {
  console.error("Error deleting inventory item:", error);
      throw error;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByVehicle,addNewClassification, checkExistingClassificationName, addNewVehicle, updateInventory, deleteVehicle};

