async function registerUser(firstname, lastname, email, password, confirm_password) {
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            confirm_password,
        }),
    });

    if (response.ok) {
        console.log('User registered successfully');
    } else {
        console.error('Failed to register user');
    }
}

async function getUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    console.log(users);
}

async function getUser(id) {
    const response = await fetch(`http://localhost:3000/user/${id}`);
    const user = await response.json();
    console.log(user);
}

registerUser('Cole', 'Bennet', 'Cole@gmail.com', '1234', '1234');
getUsers();
getUser(1);
