document.getElementById('logout').addEventListener('click', async () => {
    await fetch('/logout', { method: 'GET' })
    window.location.replace('/')
});

async function userData() {
    try {
        const sessionResponse = await fetch('/user');
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        const response = await fetch(`/users/${userId}`);
        let user = await response.json();

        let username = document.querySelector('main section h1')      
        username.textContent = user.Name
        let email = document.querySelector('main section h3')      
        email.textContent = user.Email
    } catch (error) {
        console.error('Error fetching user data:', error);
        // redirectToSignin();
    }
}

userData()