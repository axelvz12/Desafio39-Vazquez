const users = [
    {
        first_name: 'Pepe',
        last_name: 'Perez',
        age: 25,
        email: 'pepe@email.com',        
    }
]

class UserDao {
    constructor() {}
    async checkUser(userData) {
        for (const user of users) {
            if (userData == user.email) {return 'El usuario existe'}
            break
        }
        return 'El usuario está disponible'
    }

}

module.exports = NewUserDao