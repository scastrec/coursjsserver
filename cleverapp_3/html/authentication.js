
function signin() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var form = `username=${document.getElementById('username').value}&password=${document.getElementById('password').value}`;
    fetch('/signin', {
        method: 'POST',
        headers: myHeaders,
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
            // save data in session storage
            sessionStorage.setItem('JWT', response.jwt);
            // Navigate to new page
            window.location.href = './chat.html';
        }).catch(e => {
            console.log("Error happened", e);
            alert(`Error: Status ${response.status}`)
        })
}

function signup() {
    //TODO
}