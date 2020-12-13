import bcrypt from 'bcryptjs';
import * as dao from '../dao.js'

const COLLECTION = "CHAT_USERS";

const getUser = async (username) => {
    try {
        return await dao.findOne(COLLECTION, {username})
    } catch (e) {
        throw new Error({ status: 500, message: "Error happened" })
    }
}

export const getUsers = async function () {
    try {
        return await dao.findDocuments(COLLECTION, {})
    } catch (e) {
        throw new Error({ status: 500, message: "Error happened" })
    }
}

export const signup = async (username, pwd, image) => {
    if (!username || !pwd) {
        console.log("signup with username or pwd empty")
        throw new Error(400, "missing username or password");
    }
    if (await getUser(username)) {
        throw new Error(400, "User already exist");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt);
    try {
        return await dao.insertDocument(COLLECTION, {
            username,
            password: hash,
            image
        })
    } catch (e) {
        throw new Error({ status: 500, message: "Error happened" })
    }
}

/**
 * Return user if succeed
 * @param {*} username 
 * @param {*} pwd 
 */
export const signin = async (username, pwd) => {
    console.log(`-- ${username} - ${pwd}`)
    if (!username || !pwd) {
        console.log('signin username||pwd null ' + username + ' || ' + pwd);
        throw new Error({"message": "User or password empty", status: 401})
    } else {
        var u = await getUser(username);
        if (u || bcrypt.compareSync(pwd, u.password)) {
            console.log('Authentication OK ' + username, u);
            return u;
        } else {
            return null;
        }
    }
}