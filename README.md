# README для лабораторной работы

---

# Лабораторная работа: Разработка REST API на Express.js

## Содержание

1. [Задание](#задание)
2. [Цель работы](#цель-работы)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Реализация базового REST API](#реализация-базового-rest-api)
5. [Дополнительные задания](#дополнительные-задания)
   - [Задание 1: Rate Limiting для защиты API](#задание-1-rate-limiting-для-защиты-api)
   - [Задание 2: Метод PUT для полного обновления ресурса](#задание-2-метод-put-для-полного-обновления-ресурса)
   - [Задание 3: Валидация входных данных](#задание-3-валидация-входных-данных)
6. [Тестирование API](#тестирование-api)
7. [Структура проекта](#структура-проекта)
8. [Запуск приложения](#запуск-приложения)

---

## Задание

Разработать REST API сервис для управления карточками акций (Stock) с использованием фреймворка Express.js. Сервис должен реализовывать следующие методы:

- `GET /stocks` — получение всех карточек с возможностью фильтрации по названию
- `GET /stocks/:id` — получение карточки по идентификатору
- `POST /stocks` — создание новой карточки
- `PATCH /stocks/:id` — частичное обновление карточки
- `DELETE /stocks/:id` — удаление карточки

Данные должны храниться в JSON-файле. Архитектура приложения должна быть построена по принципу Layered Architecture (слоистая архитектура) с разделением на маршруты, контроллеры и сервисы.

---

## Цель работы

1. Изучить основы создания веб-серверов на Node.js с использованием фреймворка Express.js
2. Освоить принципы построения REST API
3. Понять концепцию middleware в Express.js
4. Научиться организовывать код с разделением ответственности (routes, controllers, services)
5. Реализовать дополнительные механизмы защиты и валидации API

---

## Вариант и референсы

**Вариант**: Управление карточками акций (Stock)

**Референсы**:
- [Express.js Official Documentation](https://expressjs.com/)
- [MDN Web Docs: HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [REST API Tutorial](https://restfulapi.net/)

---

## Реализация базового REST API

### Архитектура приложения

Проект построен на слоистой архитектуре, что обеспечивает разделение ответственности и упрощает поддержку кода:

```
Request → Middleware → Routes → Controller → Service → Data (JSON)
```

### Основные компоненты

#### 1. Сервис для работы с файлами (`fileService.js`)

Отвечает за чтение и запись данных в JSON-файл:

```javascript
const fs = require('fs');

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = { readData, writeData };
```

#### 2. Сервис бизнес-логики (`stocksService.js`)

Содержит основную логику работы с карточками:

```javascript
const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(stock => 
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return stocks;
};

const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(stock => stock.id === id);
};

const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const newId = stocks.length > 0 
        ? Math.max(...stocks.map(s => s.id)) + 1 
        : 1;
    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);
    return newStock;
};

const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);
    if (index === -1) return null;
    stocks[index] = { ...stocks[index], ...stockData };
    fileService.writeData(dataFilePath, stocks);
    return stocks[index];
};

const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filteredStocks = stocks.filter(s => s.id !== id);
    if (filteredStocks.length === stocks.length) return false;
    fileService.writeData(dataFilePath, filteredStocks);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
```

#### 3. Контроллер (`stocksController.js`)

Обрабатывает HTTP-запросы и вызывает соответствующие методы сервиса:

```javascript
const stocksService = require('../services/stocksService');

const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

const getStockById = (req, res) => {
    const id = parseInt(req.params.id);
    const stock = stocksService.findOne(id);
    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(stock);
};

const createStock = (req, res) => {
    const { src, title, text } = req.body;
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

const updateStock = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedStock = stocksService.update(id, req.body);
    if (!updatedStock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(updatedStock);
};

const deleteStock = (req, res) => {
    const id = parseInt(req.params.id);
    const success = stocksService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.status(204).send();
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};
```

#### 4. Маршруты (`stocks.js`)

Определяет эндпоинты API и связывает их с контроллерами:

```javascript
const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

router.get('/', stocksController.getAllStocks);
router.get('/:id', stocksController.getStockById);
router.post('/', stocksController.createStock);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);

module.exports = router;
```

#### 5. Точка входа (`index.js`)

Настраивает middleware, подключает маршруты и запускает сервер:

```javascript
const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;
const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');

stocksService.init(DATA_FILE_PATH);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/stocks', stocksRouter);

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
```

---

## Дополнительные задания

### Задание 1: Rate Limiting для защиты API

**Постановка**: Реализовать механизм ограничения количества запросов для защиты API от DDoS-атак и злоупотреблений.

**Реализация**:

Для защиты API от чрезмерного количества запросов был использован пакет `express-rate-limit`. Реализованы два уровня ограничений:

```javascript
// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Глобальный ограничитель для всех маршрутов
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: {
        error: 'Слишком много запросов',
        message: 'Превышен лимит запросов. Пожалуйста, повторите через 15 минут.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Строгий ограничитель для изменяющих запросов (POST, PATCH, DELETE)
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 20, // максимум 20 запросов на изменение
    message: {
        error: 'Слишком много запросов на изменение данных',
        message: 'Превышен лимит. Пожалуйста, повторите через час.'
    }
});

module.exports = { globalLimiter, strictLimiter };
```

Интеграция в основное приложение:

```javascript
// src/index.js
const { globalLimiter, strictLimiter } = require('./middleware/rateLimiter');

// Глобальный rate limiting для всех маршрутов
app.use(globalLimiter);

// Дополнительный строгий лимит для изменяющих запросов
app.use('/stocks', (req, res, next) => {
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        return strictLimiter(req, res, next);
    }
    next();
});
```

**Результат**: При превышении лимита (более 100 запросов за 15 минут) клиент получает ответ с кодом 429 и информативным сообщением. Запросы на изменение данных дополнительно ограничены 20 запросами в час.

---

### Задание 2: Метод PUT для полного обновления ресурса

**Постановка**: Добавить поддержку HTTP метода PUT для полного обновления карточки, в отличие от PATCH (частичное обновление).

**Реализация**:

В маршруты добавлен новый эндпоинт для PUT:

```javascript
// src/routes/stocks.js
router.put('/:id', stocksController.putStock);
```

В контроллере реализован метод `putStock` с валидацией всех полей:

```javascript
// src/controllers/stocksController.js
const putStock = (req, res) => {
    const id = parseInt(req.params.id);
    const { src, title, text } = req.body;
    
    // Валидация - все поля обязательны (в отличие от PATCH)
    if (!src || !title || !text) {
        return res.status(400).json({ 
            error: 'Для PUT запроса все поля (src, title, text) обязательны' 
        });
    }
    
    // Полностью заменяем карточку новыми данными
    const updatedStock = stocksService.update(id, { src, title, text });
    
    if (!updatedStock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.json(updatedStock);
};

module.exports = {
    // ... другие методы
    putStock,
    // ...
};
```

**Отличие PUT от PATCH**:

| Метод | Особенности |
|-------|-------------|
| **PUT** | Требует все поля, выполняет полную замену ресурса |
| **PATCH** | Принимает частичные данные, обновляет только указанные поля |

**Результат**: API теперь поддерживает два типа обновления:
- `PATCH /stocks/:id` — для частичного обновления (например, только title)
- `PUT /stocks/:id` — для полной замены карточки (все поля обязательны)

---

### Задание 3: Валидация входных данных

**Постановка**: Реализовать централизованную валидацию входных данных для всех методов, изменяющих данные.

**Реализация**:

Создан модуль валидации с общими правилами:

```javascript
// src/middleware/validation.js
const validateStockData = (req, res, next) => {
    const { src, title, text } = req.body;
    const errors = [];

    if (!src) errors.push('Поле "src" обязательно');
    if (!title) errors.push('Поле "title" обязательно');
    if (!text) errors.push('Поле "text" обязательно');
    
    if (title && title.length < 3) {
        errors.push('Название должно содержать минимум 3 символа');
    }
    
    if (text && text.length < 10) {
        errors.push('Текст должен содержать минимум 10 символов');
    }
    
    if (src && !src.match(/^https?:\/\/.+\..+/)) {
        errors.push('Некорректный URL изображения');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

const validatePartialStock = (req, res, next) => {
    const { src, title, text } = req.body;
    const errors = [];
    
    if (title && title.length < 3) {
        errors.push('Название должно содержать минимум 3 символа');
    }
    
    if (text && text.length < 10) {
        errors.push('Текст должен содержать минимум 10 символов');
    }
    
    if (src && !src.match(/^https?:\/\/.+\..+/)) {
        errors.push('Некорректный URL изображения');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

module.exports = { validateStockData, validatePartialStock };
```

Интеграция валидации в маршруты:

```javascript
// src/routes/stocks.js
const { validateStockData, validatePartialStock } = require('../middleware/validation');

router.post('/', validateStockData, stocksController.createStock);
router.put('/:id', validateStockData, stocksController.putStock);
router.patch('/:id', validatePartialStock, stocksController.updateStock);
```

**Результат**: Все входящие данные проходят валидацию:
- POST и PUT требуют все поля и проверяют их корректность
- PATCH проверяет только переданные поля
- При ошибках валидации возвращается детализированный ответ с кодом 400

---

## Тестирование API

### Тестирование в Postman

#### Базовые операции:

| Метод | URL | Описание | Тело запроса |
|-------|-----|----------|--------------|
| GET | `/stocks` | Получение всех карточек | - |
| GET | `/stocks?title=Акция` | Поиск по названию | - |
| GET | `/stocks/1` | Получение карточки по ID | - |
| POST | `/stocks` | Создание карточки | `{"src":"url","title":"...","text":"..."}` |
| PUT | `/stocks/1` | Полное обновление | `{"src":"url","title":"...","text":"..."}` |
| PATCH | `/stocks/1` | Частичное обновление | `{"title":"Новое название"}` |
| DELETE | `/stocks/1` | Удаление карточки | - |

#### Тестирование Rate Limiting:

Для проверки ограничения запросов был использован Collection Runner в Postman:
- Количество итераций: 150
- Задержка: 50 мс

Результаты:
- Запросы 1-100: статус 200 OK
- Запросы 101-150: статус 429 Too Many Requests

#### Тестирование валидации:

**Некорректный POST запрос:**
```json
{
    "title": "Короткий",
    "text": "Текст"
}
```
Ответ:
```json
{
    "errors": [
        "Поле \"src\" обязательно",
        "Текст должен содержать минимум 10 символов"
    ]
}
```

---

## Структура проекта

```
example-express/
├── src/
│   ├── index.js                 # Точка входа
│   ├── routes/
│   │   └── stocks.js            # Маршруты
│   ├── controllers/
│   │   └── stocksController.js  # Контроллеры
│   ├── services/
│   │   ├── stocksService.js     # Бизнес-логика
│   │   └── fileService.js       # Работа с файлами
│   ├── middleware/
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validation.js        # Валидация данных
│   └── data/
│       └── stocks.json          # Хранилище данных
├── package.json
└── README.md
```

---

## Запуск приложения

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Запуск в production режиме

```bash
npm start
```

### Проверка работы

После запуска сервер будет доступен по адресу: `http://localhost:3000`

Пример запроса через curl:

```bash
# Получение всех карточек
curl http://localhost:3000/stocks

# Создание новой карточки
curl -X POST http://localhost:3000/stocks \
  -H "Content-Type: application/json" \
  -d '{"src":"https://example.com/image.jpg","title":"Новая акция","text":"Описание акции"}'

# Полное обновление карточки
curl -X PUT http://localhost:3000/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"src":"https://example.com/new.jpg","title":"Обновленная акция","text":"Новое описание"}'

# Частичное обновление
curl -X PATCH http://localhost:3000/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Измененное название"}'

# Удаление карточки
curl -X DELETE http://localhost:3000/stocks/1
```

---

**Автор**: [Ваше имя]  
**Дата выполнения**: Март 2026  
**Технологии**: Node.js, Express.js, JavaScript
