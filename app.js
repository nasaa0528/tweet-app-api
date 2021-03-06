const express = require("express");
const usersRouter = require('./users/router');
const postsRouter = require('./posts/router');
const followRouter = require('./users/follows/router');
const cors = require('cors');

const app = express(); 
const PORT = process.env.PORT || 3000; 
const router = express.Router();

/* Middlewares */
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/follows', followRouter);

app.listen(PORT, console.log(`Server is listening on ${PORT}`)); 

module.exports = app; 
