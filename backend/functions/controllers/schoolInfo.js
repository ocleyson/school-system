const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = {
    index: async (req, res) => {

        const {uid} = req.decodedToken;

        try {
            var schoolData = await db.firestore().collection('schools')
            .doc(`${uid}`)
            .get()
            .then(doc => {
                return doc.data()
            })

            var customerData = await stripe.customers.retrieve(schoolData.customerId);

            schoolData = {...schoolData, creditCardInfo: customerData.sources.data[0]}

            return res.send({schoolData})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao ler as informações. Tente novamente mais tarde.'})
        }

    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        try {
            db.firestore().collection('schools')
            .doc(`${uid}`)
            .set(data, { merge: true });

            return res.sendStatus(200);
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    }

}