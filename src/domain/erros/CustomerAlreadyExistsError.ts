export class CustomerAlreadyExistsError extends Error {
    constructor() {
        super("Usuário já existente.")
    }
}