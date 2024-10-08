// post to api endpoint to sign in
export default async function signIn(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    console.log(response);
    return response;
}
