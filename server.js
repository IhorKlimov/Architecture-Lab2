const express = require('express')
const app = express()
const port = process.env.PORT || 80
fs = require('fs')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({extended: false})

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const {credential} = require("firebase-admin");

const serviceAccount = require('./serviceAccountKey.json');
app.use(express.urlencoded());
app.use(express.json());

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/v1/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    const snapshot = await db.collection('users').doc(userId).get();
    res.send(snapshot.data());
})

app.post('/v1/editProfile', async (req, res) => {
    const userId = req.headers["userid"];
    console.log(userId, req.headers, req.body);
    const snapshot = await db.collection('users').doc(userId).update(req.body);
    res.send({"result": "Success"});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.static(__dirname));


// http://localhost/v1/profile/VGkotC32IMFVvdIpC3Yn
// curl -X POST -H "Content-Type: application/json" -H "UserId: VGkotC32IMFVvdIpC3Yn" -d '{"name": "Ihor Klimov", "profileImage": "https://avatars.githubusercontent.com/u/13784275?v=4"}' localhost/v1/editProfile