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

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByVehicle,addNewClassification, checkExistingClassificationName};

