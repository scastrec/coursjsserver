import * as dao from '../dao.js'

const COLLECTION = "MESSAGES";

export const addMessage = async (message, username) => {
    if (!message) throw new Exception({ status: 400, message: 'message empty' });
    var message = {
        id: username + "_" + new Date().getTime(),
        username: username,
        date: new Date().getTime(),
        message: message
    }
    try {
        await dao.insertDocument(COLLECTION, message)
    } catch (e) {
        throw new Error({ status: 500, message: "Error happened" })
    }
    //messages.push(message);
}

export const getMessages = async () => {
    try {
        return await dao.findDocuments(COLLECTION, {})
    } catch (e) {
        throw new Exception({ status: 500, message: "Error happened" })
    }
}