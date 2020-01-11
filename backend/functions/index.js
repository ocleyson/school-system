const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./lib/db');

const createAccount = require('./controllers/createAccount');

const app = express();

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/createaccount', createAccount); // USED TO CREATE A NEW USER WITH ADMIN PRIVILEGES

app.use((req, res, next) => {
    const idToken = req.headers.authorization;

    db.auth().verifyIdToken(idToken).then(decodedToken => {
        req.decodedToken = decodedToken;

        return next()
    }).catch(error => {
        return res.status(401).send({error})
    })

})

app.use(require('./routes'));

exports.api = functions.https.onRequest(app);
