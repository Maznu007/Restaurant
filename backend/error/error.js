class ErrorHnadler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;}

}

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message= err.message || "Internal Server Error";

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
} ;
export default ErrorHnadler;