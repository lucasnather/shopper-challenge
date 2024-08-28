export class CustomerMeasureNotFoundError extends Error {
    constructor() {
        super("Nenhuma leitura encontrada")
    }
}