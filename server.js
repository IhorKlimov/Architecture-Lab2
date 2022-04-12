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
    const snapshot = await db.collection('users').doc(userId).update(req.body);
    res.send({"result": "Success"});
})

app.post('/v1/sendMessage', async (req, res) => {
    const userId = req.headers["userid"];

    const chatId = req.body.chatId;
    const message = req.body.message;

    const snapshot = await db.collection('chats').doc(chatId).collection("messages").add({userId, message, timestamp: Timestamp.now()});
    res.send({"result": "Success"});
})

app.get('/v1/getMessages/:chatId', async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.headers["userid"];

    console.log(chatId)

    const result = [];
    const snapshot = await db.collection('chats').doc(chatId).collection("messages").get();
    snapshot.forEach(data => {
        const d = data.data()
        d["id"] = data.id;
        result.push(d);
    });
    console.log(snapshot);
    res.send({"messages": result});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.static(__dirname));


// http://localhost/v1/profile/VGkotC32IMFVvdIpC3Yn
// curl -X POST -H "Content-Type: application/json" -H "UserId: VGkotC32IMFVvdIpC3Yn" -d '{"name": "Ihor Klimov", "profileImage": "https://avatars.githubusercontent.com/u/13784275?v=4"}' localhost/v1/editProfile
// curl -X POST -H "Content-Type: application/json" -H "UserId: VGkotC32IMFVvdIpC3Yn" -d '{"chatId": "EWEFGN@2n23mv", "message": "Hey there!"}' localhost/v1/sendMessage
// curl -X GET -H "Content-Type: application/json" -H "UserId: VGkotC32IMFVvdIpC3Yn" localhost/v1/getMessages/EWEFGN@2n23mv