
const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 0,
        message,
        data
    });
};

const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        status: statusCode === 401 ? 108 : (statusCode === 400 ? 102 : statusCode),
        message,
        data: null
    });
};

module.exports = { successResponse, errorResponse };