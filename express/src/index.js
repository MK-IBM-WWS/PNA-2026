const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');
const { globalLimiter, strictLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');

stocksService.init(DATA_FILE_PATH);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(globalLimiter);

app.use('/stocks', stocksRouter);
app.use('/stocks', (req, res, next) => {
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        return strictLimiter(req, res, next);
    }
    next();
});

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});