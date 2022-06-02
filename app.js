const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt")
const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();
const port = 3000;

let users = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get("/", (req, res) => {
    if ("Name" in req.cookies) {
        console.log(users)
        console.log(req.cookies)
    }
    if ("Name" in req.cookies && users.find(user => user.email = req.cookies["Name"])) {
        res.redirect("/utils")
    } else if ("Name" in req.cookies && !(users.find(user => user.email = req.cookies["Name"]))) {
        res.clearCookie("Name").redirect("/login")
    } else {
        res.redirect("/login")
    }
})

app.get("/utils", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", "utils.html"))
})

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'test.html'))
})

app.post('/test', (req, res) => {
    const correct = req.body.correct;
    res.cookie("Correct", correct, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12
    })
})

app.post('/users/delete', (req, res) => {
    users = users.filter((value, index, arr) => {
        return value != users.find(user => user.email = req.cookies["Name"]);
    })
    res.clearCookie("Name").send(true)
})

app.post('/users/logout', (req, res) => {
    res.clearCookie("Name").send(true);
    console.log(users)
})

app.post('/users/create', async (req, res) => {
    try {
        if (users.find(user => user.email = req.body.email)) {
            return res.send(false)
        }
        const hashedPassword = await bcrypt.hash(req.body.pass, 10)
        console.log(req.body.email)
        const user = {"email": req.body.email, "password": hashedPassword}
        users.push(user);
        console.log(users)
        res.cookie("Name", user.email, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 24 * 30 * 12
            }).send(true)
        console.log("Cookie Added")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
});

app.get('/three', (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", "three.html"))
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.email = req.body.email)
    if (user == null) {
        return res.send(false)
    }
    try{
        if (await bcrypt.compare(req.body.pass, user.password)) {
            console.log("Correct!")
            res.cookie("Name", user.email, {
                http: false,
                maxAge: 1000 * 60 * 60 * 24 * 30 * 12
            }).send(true)
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