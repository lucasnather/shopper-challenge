export class MeasureAlreadyConfirmedError extends Error {
    constructor() {
        super("Leitura do mês já realizada")
    }
}