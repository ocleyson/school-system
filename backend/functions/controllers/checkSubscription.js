const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = async (req, res) => {
    var { uid, schoolUid, isAdmin } = req.decodedToken;

    if(isAdmin) {
        schoolUid = uid
    }

    var schoolInfo = await db.firestore().collection('schools')
    .doc(`${schoolUid}`)
    .get()
    .then(doc => {
        return doc.data()
    })

    const subscription = await stripe.subscriptions.retrieve(`${schoolInfo.subscriptionId}`);

    return res.send({subscription})
}