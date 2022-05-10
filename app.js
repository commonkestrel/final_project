const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/school', (req, res) => {
    console.log(req.method)
    res.sendFile(path.join(__dirname, 'HTML', 'school.html'))
})

app.post('/school', (req, res) => {
    console.log(req.method)
    console.log(req.body.email)
    console.log(req.body.pass)
    console.log(req.body.pass == req.body.confirm ? 'YES' : 'no')
})

app.listen(port, () => {
    console.log(`App listening on  http://localhost:${port}`)
})