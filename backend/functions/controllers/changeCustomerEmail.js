const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = async (req, res) => {
    const {uid: schoolUid} = req.decodedToken;

    const { email } = req.body;

    var schoolInfo = await db.firestore().collection('schools')
    .doc(`${schoolUid}`)
    .get()
    .then(doc => {
        return doc.data()
    })

    await stripe.customers.update(`${schoolInfo.customerId}`, {
        email
    });

    return res.sendStatus(200)
}