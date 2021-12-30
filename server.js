const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("Welcome to the Ichigo BackEnd!!!");
});

const userRouter = require('./routes/users');

app.use('/users', userRouter);

app.listen(3000);