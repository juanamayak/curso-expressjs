const ErrorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrio un Error Inesperado';

    console.log(`[ERROR] - ${new Date().toISOString()} | ${statusCode} | ${message}]`);

    if (err.stack) {
        console.log(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
    });
}

module.exports = ErrorHandlerMiddleware;