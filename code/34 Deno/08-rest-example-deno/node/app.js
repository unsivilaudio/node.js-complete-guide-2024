const express = require('express');
const bodyParser = require('body-parser');

const todoRoutes = require('./routes/todos');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Some middleware!');
    next();
});

app.use(todoRoutes);

app.listen(3000);
