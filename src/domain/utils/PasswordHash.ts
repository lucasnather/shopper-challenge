import { compare, hash } from "bcrypt"

export class PasswordHash {

    async hashPassword(password: string) {
        const salt = 8
        return await hash(password, salt)
    }

    async comparePassword(password: string, databasePassword: string) {
        return await compare(password, databasePassword)
    }
}