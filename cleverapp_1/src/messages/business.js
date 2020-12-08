var messages = [];

export const addMessage = (message, username) => {
    if (!message) throw new Exception({status: 400, message: 'message empty'});
    var message = {
        id: username + "_" + new Date().getTime(),
        username: username,
        date: new Date().getTime(),
        message: message
    }
    messages.push(message);
}

export const getMessages = () => {
    console.log(`return messages ` + messages.length);
    return messages;
}