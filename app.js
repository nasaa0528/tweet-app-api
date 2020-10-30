const express = require("express"); 
const usersRouter = require('./routes/users');

const app = express(); 
const PORT = process.env.PORT || 3000; 
const router = express.Router();

/* Middlewares */
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/user', usersRouter); 

app.listen(PORT, console.log(`Server is listening on ${PORT}`)); 

module.exports = app; 
