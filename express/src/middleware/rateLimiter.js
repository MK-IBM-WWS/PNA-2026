const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Слишком много запросов',
        message: 'Превышен лимит запросов. Пожалуйста, повторите через 15 минут.'
    },
    standardHeaders: true,
});

const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        error: 'Слишком много запросов на изменение данных',
        message: 'Превышен лимит. Пожалуйста, повторите через час.'
    }
});

module.exports = {
    globalLimiter,
    strictLimiter
};