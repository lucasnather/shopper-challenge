export class InvalidReadbleMonthError extends Error {
    constructor() {
        super("Leitura do mês já realizada")
    }
}