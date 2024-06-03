class CustomError extends Error {
    constructor(message, { cause, code = 1 }) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;