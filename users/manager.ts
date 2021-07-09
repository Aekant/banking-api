import {Base} from './../base/base'
import {USER_TYPE_COUNTER, USER_TYPE_KEY_PREFIX, USER_TYPE} from './../constants/index'
import {User} from './../interfaces/index'

class Users extends Base {

    getCounterKey() {
        return USER_TYPE_COUNTER
    }

    getKeyPrefix() {
        return USER_TYPE_KEY_PREFIX
    }

    getType() {
        return USER_TYPE
    }

    async createUser(user: User): Promise<User> {
        const result = await super.create(user, `${user.identityNo}`)
        return Promise.resolve(result)
    }
}

export const UsersManager = new Users()