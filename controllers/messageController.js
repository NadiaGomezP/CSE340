const messModel = require("../models/message-model")
const utilities = require("../utilities/")

/* ****************************************
*  Deliver inbox view
* *************************************** */
async function buildInbox(req, res, next) {
    const accountId = res.locals.accountData.account_id;
    let nav = await utilities.getNav()
    const personalMessages = await utilities.buildPersonalMessages(accountId)
    res.render("message/inbox", {
      title: "Inbox",
      nav,
      errors: null,
      personalMessages
    })
  }


/* ****************************************
*  Deliver create message view
* *************************************** */
async function buildCreate(req, res, next) {
    let nav = await utilities.getNav()
    const toList = await utilities.buildToList()
    res.render("message/create", {
      title: "New Message",
      nav,
      errors: null,
      toList,
    })
  }
  

/* ****************************************
*  Deliver message view
* *************************************** */
async function buildView(req, res, next) {
    const message_id = req.params.message_id;
    const data = await messModel.getMessagesInfo(message_id)
    const messageData = await utilities.buildMessagesView(data)
    let nav = await utilities.getNav()
    const title = `${data[0].message_subject}`;
    res.render("message/view", {
      title,
      nav,
      errors: null,
      messageData
    })
  }


  /* ****************************************
*  Deliver archive view
* *************************************** */
async function buildArchive(req, res, next) {
    const accountId = res.locals.accountData.account_id;
    let nav = await utilities.getNav()
    const archiveMessages = await utilities.buildArchiveMessages(accountId)
    res.render("message/archive", {
      title: "Archive View",
      nav,
      errors: null,
      archiveMessages
    })
  }


/* ****************************************
*  Process New Message
* *************************************** */
async function createNewMessage (req, res, next) {
    const accountId = res.locals.accountData.account_id;
    const {message_subject,message_body,message_to,message_from} = req.body
    const sendMessageResult = await messModel.sendNewMessage(message_subject,message_body,message_to,message_from)
  
    let nav = await utilities.getNav()
    const toList = await utilities.buildToList()
    const personalMessages = await utilities.buildPersonalMessages(accountId)
    
    if (sendMessageResult) {
      req.flash(
        "notice",
        `Congratulations, you send a message.`
      )
  
      res.status(201).render("message/inbox", {
        title: "Inbox",
        nav,
        errors: null,
        personalMessages
      })
    } else {
      req.flash("notice", "Sorry, sending the message failed.")
      res.status(501).render("message/create", {
        title: "New Message",
        nav,
        errors: null,
        toList,
      })
    }
  }
  

  /* ****************************************
*  Process Archive
* *************************************** */
async function processArchive (req, res, next) {
    const accountId = res.locals.accountData.account_id;
    const message_id = req.params.message_id;
    const archiveMessageResult = await messModel.updateArchive(message_id)
    const data = await messModel.getMessagesInfo(message_id)
    const messageData = await utilities.buildMessagesView(data)
    const archiveMessages = await utilities.buildArchiveMessages(accountId)
    let nav = await utilities.getNav()
    const title = `${data[0].message_subject}`;    
    if (archiveMessageResult) {
      req.flash(
        "notice",
        `Congratulations, you archived a message.`
      )
  
      res.status(201).render("message/archive", {
        title: "Archive View",
        nav,
        errors: null,
        archiveMessages
      })
    } else {
      req.flash("notice", "Sorry, the process of archive failed.")
      res.status(501).render("message/view", {
      title,
      nav,
      errors: null,
      messageData
      })
    }
  }


    /* ****************************************
*  Process Archive
* *************************************** */
async function processMarkRead (req, res, next) {
    const accountId = res.locals.accountData.account_id;
    const message_id = req.params.message_id;
    const ReadMessageResult = await messModel.updateRead(message_id)
    const data = await messModel.getMessagesInfo(message_id)
    const messageData = await utilities.buildMessagesView(data)
    let nav = await utilities.getNav()
    const personalMessages = await utilities.buildPersonalMessages(accountId)
    const title = `${data[0].message_subject}`;    
    if (ReadMessageResult) {
      req.flash(
        "notice",
        `Congratulations, you marked as read a message.`
      )
  
      res.status(201).render("message/inbox", {
        title: "Inbox",
        nav,
        errors: null,
        personalMessages
      })
    } else {
      req.flash("notice", "Sorry, Mark as Read failed.")
      res.status(501).render("message/view", {
      title,
      nav,
      errors: null,
      messageData
      })
    }
  }


      /* ****************************************
*  Process Archive
* *************************************** */
async function processDeleteMessage (req, res, next) {
    const accountId = res.locals.accountData.account_id;
    const message_id = req.params.message_id;
    const DeleteMessageResult = await messModel.deleteMessage(message_id)
    let nav = await utilities.getNav()
    const personalMessages = await utilities.buildPersonalMessages(accountId) 
    if (DeleteMessageResult) {
      req.flash(
        "notice",
        `Congratulations, you delete a message.`
      )
  
      res.status(201).render("message/inbox", {
        title: "Inbox",
        nav,
        errors: null,
        personalMessages
      })
    } else {
    const data = await messModel.getMessagesInfo(message_id)
    const title = `${data[0].message_subject}`; 
    const messageData = await utilities.buildMessagesView(data)
      req.flash("notice", "Sorry, Deleting the message failed.")
      res.status(501).render("message/view", {
      title,
      nav,
      errors: null,
      messageData
      })
    }
  }


  module.exports = {buildInbox, buildCreate,createNewMessage, buildView, buildArchive,processArchive, processMarkRead,  processDeleteMessage}