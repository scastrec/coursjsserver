import bcrypt from 'bcryptjs';

const users = []

const getUser = (username) => {
    return users.find(u => u.username = username);
}

export const getUsers = function (req, res) {
    return users;
}

export const signup = (username, pwd, image) => {
    if (!username || !pwd) {
        throw new Error(400, "missing username or password");
    }
    if (getUser(username)) {
        throw new Error(400, "User already exist");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt);
    users.push({
        username,
        password: hash,
        image
    })
}

/**
 * Return user if succeed
 * @param {*} username 
 * @param {*} pwd 
 */
export const signin = (username, pwd) => {
    console.log(`-- ${username} - ${pwd}`)
    if (!username || !pwd) {
        console.log('signin username||pwd null ' + username + ' || ' + pwd);
        throw new Error({"message": "User or password empty", status: 401})
    } else {
        var u = getUser(username);
        if (!u || bcrypt.compareSync(pwd, u.password)) {
            console.log('Authentication OK' + username);
            return u;
        } else {
            return null;
        }
    }
}