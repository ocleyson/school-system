const admin = require('firebase-admin');
const serviceAccount = require('../credentials/credentialsOfFirebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
  
var db = admin;

module.exports = db;