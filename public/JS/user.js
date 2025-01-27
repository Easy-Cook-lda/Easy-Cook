function redirectToSignin() {
    window.location.replace('/signin');
}

async function userData() {
    try {
        const sessionResponse = await fetch('/user');
        // if (!sessionResponse.ok) {
        //     console.log('Utilizador não autenticado');
        //     redirectToSignin();
        //     return;
        // }
        const sessionData = await sessionResponse.json();
        const userId = sessionData.userId;

        let user
        if(userId != null) {
            const response = await fetch(`/users/${userId}`);
            user = await response.json();
        }

        const userProfile = document.createElement('div')
        userProfile.id = 'user-profile'
        const userLink = document.createElement('a')
        userLink.id = 'user-link'
        const userName = document.createElement('p')
        if(userId == null) {
            userName.textContent = 'login'
            userLink.href = '/signin'
        } else {
            userName.textContent = `${user.Name}`
            userLink.href = '/profile'
        }
        
        userProfile.appendChild(userLink)
        userProfile.appendChild(userName)

        document.querySelector('header').appendChild(userProfile)
    } catch (error) {
        console.error('Error fetching user data:', error);
        // redirectToSignin();
    }
}

userData()