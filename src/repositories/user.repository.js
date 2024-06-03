// userRepository.js

const { UserDto } = require('../dto/userDto');


class UserRepository {
    constructor(userDao) {
        this.dao = userDao; // Instancia de UserDao según la configuración
    }

    async createUser({ first_name, last_name, age, email, password }) {
        const newUser = new UserDto({
            first_name,
            last_name,
            age,
            email,
            password
        });

        return this.dao.createUser(newUser);
    }

    async getUsersPaginate({ page = 1, limit = 10 }) {
        try {
            const options = { page, limit };
            const result = await this.dao.getUsersPaginate(options);

            return result;
        } catch (error) {
            console.error('Error al obtener el listado paginado de usuarios:', error);
            throw new Error('Error al obtener el listado paginado de usuarios');
        }
    }


    async getUsersBy(query) {
        return this.dao.getUsersBy(query);
    }

    async updateUser(uid, userToUpdate) {
        return this.dao.updateUser(uid, userToUpdate);
    }

    async deleteUser(uid) {
        return this.dao.deleteUser(uid);
    }

    async getUserById(id) {
        return this.dao.getUserById(id);
    }
}

module.exports = UserRepository;
