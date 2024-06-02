const pool = require("../database/")
 
 /* *****************************
* Return message data using account id
* ***************************** */
async function getMessageById(message_to) {
    try {
      const result = await pool.query(
        'SELECT message_created, message_subject, message_from, message_read FROM public.message WHERE message_to = $1',
        [account_email])
      return result.rows[0]
    } catch (error) {
      return new Error("No matching email found")
    }
  }


/* ***************************
 *  Get all accounts
 * ************************** */
async function getAccount(){
    return await pool.query("SELECT * FROM public.account ORDER BY account_id")
  }


  /* *****************************
*   Send New Email
* *************************** */
async function sendNewMessage(message_subject,message_body,message_to,message_from) {
    try {
        const sql =
            "INSERT INTO public.message (message_subject,message_body,message_to,message_from) VALUES ($1, $2, $3, $4) RETURNING *";
        const email = await pool.query(sql, [
            message_subject,
            message_body,
            message_to,
            message_from
        ]);
        return email.rowCount
    } catch (error) {
        return error.message;
    }
  }



/* ***************************
 *  Get all accounts
 * ************************** */
async function getMessageUnread(account_id) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) FROM public.message WHERE message_read = false AND message_to = $1`,
        [account_id]
      );
      return result.rows[0].count; // Return the count
    } catch (error) {
      throw new Error("Error fetching unread message count: " + error.message);
    }
  }
 

/* ***************************
 *  Get personal emails
 * ************************** */
async function getMessages(account_id) {
    try {   
        const result = await pool.query(
            `SELECT
            a.account_firstname,
            a.account_lastname,
            m.message_created,
            m.message_subject,
            m.message_read,
            m.message_id
        FROM
            public.message AS m
        JOIN
            public.account AS a ON m.message_to = a.account_id
        WHERE a.account_id = $1 AND message_archived = false ;`,
            [account_id]
        );
        return result.rows; // Return all rows matching the account_id
    } catch (error) {
        throw new Error("Error fetching messages: " + error.message);
    }
}


/* ***************************
 *  Get personal emails
 * ************************** */
async function getArchiveMessages(account_id) {
    try {   
        const result = await pool.query(
            `SELECT
            a.account_firstname,
            a.account_lastname,
            m.message_created,
            m.message_subject,
            m.message_read,
            m.message_id
        FROM
            public.message AS m
        JOIN
            public.account AS a ON m.message_to = a.account_id
        WHERE a.account_id = $1 AND message_archived = true ;`,
            [account_id]
        );
        return result.rows; // Return all rows matching the account_id
    } catch (error) {
        throw new Error("Error fetching messages: " + error.message);
    }
}

/* ***************************
 *  Get personal emails
 * ************************** */
async function getMessagesInfo(message_id) {
    try {   
        const result = await pool.query(
            `SELECT  
            a.account_firstname,
            a.account_lastname,
            m.message_subject,
            m.message_body,
            m.message_id 
            FROM
            public.message AS m
            JOIN
            public.account AS a ON m.message_to = a.account_id
            WHERE m.message_id = $1;`,
            [message_id]
        );
        return result.rows; 
    } catch (error) {
        throw new Error("Error fetching messages: " + error.message);
    }
}

  /* *****************************
*   update Archive
* *************************** */
async function updateArchive(message_id) {
    try {
        const sql =
        "UPDATE public.message SET message_archived = true WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [
            message_id,
        ]);
        return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }


  
  /* *****************************
*   update Mark AS Read
* *************************** */
async function updateRead(message_id) {
    try {
        const sql =
        "UPDATE public.message SET message_read = true WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [
            message_id,
        ]);
        return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }

  }


 /* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage(message_id) {
    try {
        const sql = 'DELETE FROM public.message WHERE message_id = $1';
        const { rowCount } = await pool.query(sql, [message_id]);
        if (rowCount === 1) {
            return true;
        } else {
    throw new Error("No message with the specified ID found.");
        }
    } catch (error) {
    console.error("Error deleting message:", error);
        throw error;
    }
  } 

module.exports = {getMessageById,getAccount,sendNewMessage,getMessageUnread,getMessages,getMessagesInfo,getArchiveMessages,updateArchive, updateRead, deleteMessage}