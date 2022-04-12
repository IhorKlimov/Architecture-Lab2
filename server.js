const express = require('express')
const app = express()
const port = process.env.PORT || 80
fs = require('fs')
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/', (req, res) => {
    res.send("Hey")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



app.use(express.static(__dirname));