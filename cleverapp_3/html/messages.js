function getHeaders() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("JWT"));

    return myHeaders;
}


function addMessage() {
    var form = `username=${document.getElementById('message').value}`;
    fetch('/messages', {
        method: 'POST',
        headers: getHeaders(),
        body: form
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then((response) => {
            console.log(response);
            loadMessages();
        }).catch(e => {
            console.log("Error happened", e);
            alert(`Error: Status ${e}`)
        })
}


function loadMessages() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", sessionStorage.getItem("JWT"));

    fetch('/messages', {
        method: 'GET',
        headers: getHeaders(),
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log("Loaded messages " + response.length);
            clearMessages();
            for (const message of response) {
                displayMessage(message);
            }
        }).catch(e => {
            console.log("Error happened", e);
        })
}

function clearMessages() {
    document.getElementById("messages").innerHTML = "";
}

function displayMessage(message) {
    var ul = document.getElementById("messages");
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(message.message))
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createTextNode(message.username))
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createTextNode(message.date))
    li.appendChild(div);
    ul.appendChild(li);
}

loadMessages();
