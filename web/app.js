const express = require("express");
// const ejs = require("ejs");

const app = express();

app.use(express.static('public'))
require('dotenv').config();  // loading environment variables
const port = process.env.PORT;


app.get('/', (req, res) => {
    res.sendFile(__dirname+"/views/index.html");
});

app.get('/super-admin', (req, res) => {
    res.sendFile(__dirname+"/views/super_admin_page.html");
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname+"/views/admin_page.html");
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname+"/views/user_page.html");
});

  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})