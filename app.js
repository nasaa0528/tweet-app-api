const express = require("express");
const usersRouter = require('./users/router');
const postsRouter = require('./posts/router');

const app = express(); 
const PORT = process.env.PORT || 3000; 
const router = express.Router();

/* Middlewares */
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(PORT, console.log(`Server is listening on ${PORT}`)); 

module.exports = app; 
