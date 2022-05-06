const http = require("http");
const fs = require('fs')

const hostname = "127.0.0.1";
const port = "80";

const server = http.createServer((req, res) => {
    fs.readFile('./HTML/login.html', 'utf8', function (err, data) {
        if (err) {
            return console.log("Something went wrong: " + err)
        }
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
    });
})

server.listen(port, hostname, (err) => {
    if (err) {
        console.log(`Something went wrong: ${err}`)
    } else {
        console.log(`Process running on http://${hostname}:${port}`)
    }
})