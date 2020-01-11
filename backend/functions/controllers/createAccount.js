const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = async (req, res) => {
    const {email, password, name, tokenObject} = req.body;

    try {

        var userUid = await db.auth().createUser({
            email,
            password
        }).then(userRecord => {
            return userRecord.uid
        })

        var customerId = await createCustomer(email, tokenObject.token.id, name)
        
        var subscriptionId = await createSubscription(customerId);

        await db.auth().setCustomUserClaims(userUid, {
            isAdmin: true
        })

        await db.firestore().collection('schools')
        .doc(`${userUid}`)
        .set({
            schoolName: '',
            extraInfo: [],
            email,
            numberOfStudents: 0,
            planId: 'plan_GM4skisVw7WeDq',
            customerId,
            subscriptionId,
            active: true
        })

        return res.sendStatus(200)
  
    } catch (err) {

        if(userUid) await db.auth().deleteUser(userUid);

        if(customerId) await stripe.customers.del(customerId);

        return res.status(400).send({error: err.code || 'Erro ao criar a conta. Tente novamente mais tarde.'})
    }

    async function createCustomer(email, source, name) {
        try {
            const customer = await stripe.customers.create({
                email,
                source,
                name
            });
    
            return customer.id
        } catch (err) {
            throw new Error
        }
    }

    async function createSubscription(customer) {
        try {
            const subscription = await stripe.subscriptions.create({
                customer,
                items: [
                    {
                        plan: 'plan_GM4skisVw7WeDq',
                        quantity: 0,
                    }
                ],
                expand: ['latest_invoice.payment_intent'],
            });
    
            return subscription.id
        } catch (err) {
            throw new Error
        }
    }
}