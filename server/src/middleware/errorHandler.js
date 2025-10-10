export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate key error', details: err.keyValue });
    }
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message, details: err.details });
    }

    // Default to 500 server error
    res.status(500).json({ 
        message: 'Internal Server Error', 
        ...(process.env.Node_ENV === 'development' ? { stack: err.stack } : {})
    });
};
