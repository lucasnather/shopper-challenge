export class MeasureNotFoundError extends Error {
    constructor() {
        super("Leitura não encontrada")
    }
}