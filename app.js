const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt")
const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get("/", (req, res) => {
    res.redirect("/login")
})

app.post('/users/delete', (req, res) => {
    const email = req.body.email;
    users = users.filter((value, index, arr) => {
        return value != users.find(user => user.email = req.body.email);
    })
})

app.post('/users/create', async (req, res) => {
    try {
        if (users.find(user => user.email = req.body.email)) {
            return res.send(false)
        }
        const hashedPassword = await bcrypt.hash(req.body.pass, 10)
        const user = {"email": req.body.email, "password": hashedPassword}
        users.push(user);
        res.send(true)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
});

app.post('/users/login', (req, res) => {
    const user = users.find(user => user.email = req.body.email)
    if (user == null) {
        return res.status(400).send('User not found')
    }
    try{
        if (bcrypt.compare(req.body.pass, user.password)) {
            res.send(true)
        } else {
            res.send(false)
        }
    } catch {
        res.status(500).send()
    }
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'school.html'))
})

app.listen(port, () => {
    console.log(`App listening on  http://localhost:${port}`)
})