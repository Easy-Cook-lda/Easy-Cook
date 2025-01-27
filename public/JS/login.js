async function login() {
    // const guid = crypto.randomUUID();
    
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('pass').value
    
    const userData = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
    }

    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }) 

        if(response.ok) {
            const usersResponse = await fetch('/users')
            let users = await usersResponse.json()
            let user = users.find(user => user.Name == name)
            let userId = user.Id

            const listData = {
                id: crypto.randomUUID(),
                userId
            }

            try {
                const response = await fetch('/lists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(listData)
                }) 

                if(response.ok) {
                    window.location.replace('/signin')
                }
            } catch (error) {
                console.log('An error occurred')
            }
        }
    } catch (error) {
        console.log('An error occurred')
    }
}