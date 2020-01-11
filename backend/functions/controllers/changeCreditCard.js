const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = async (req, res) => {
    const {uid: schoolUid} = req.decodedToken;

    const { tokenObject } = req.body;

    var schoolInfo = await db.firestore().collection('schools')
    .doc(`${schoolUid}`)
    .get()
    .then(doc => {
        return doc.data()
    })

    const subscription = await stripe.subscriptions.retrieve(`${schoolInfo.subscriptionId}`);

    await stripe.customers.update(`${schoolInfo.customerId}`, {
        source: tokenObject.token.id,
        name: tokenObject.token.card.name
    });

    if(subscription.status !== 'active') {
        stripe.invoices.pay(`${subscription.latest_invoice}`);
    }

    return res.sendStatus(200);
}