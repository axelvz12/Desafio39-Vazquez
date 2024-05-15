
const textCapital = require('../utils/text.util')

class NewUserDto {
    constructor(newUser) {
        this.first_name = textCapital(newUser.first_name),
        this.last_name = textCapital(newUser.last_name),
        this.email = this.buildEmail(newUser)
        this.age = Number(newUser.age)
        this.password = newUser.password
    }

    buildEmail(newUser) {
        const emailRaw = newUser.email.split('@')
        const emailFinal = emailRaw[0] +'@commerce.com'
        return emailFinal
    }
} 

//password: createHash(password),

module.exports = NewUserDto