const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = async (req, res) => {
    const { teacherUid, customerId } = req.body;

    const {uid: schoolUid} = req.decodedToken;

    try {

        await stripe.customers.del(customerId);

        await db.firestore().collection('schoolStudents')
        .where('schoolUid', '==', `${schoolUid}`)
        .get()
        .then(snapshot => {
            
            snapshot.forEach(doc => {
                
                db.auth().deleteUser(`${doc.id}`);

            })
            
        }).then(() => {
            db.auth().deleteUser(`${schoolUid}`);

            if(teacherUid !== '') {
                db.auth().deleteUser(`${teacherUid}`);
            }
        })

        await db.firestore().collection('schools')
        .doc(`${schoolUid}`)
        .set({
            active: false
        }, {merge: true})

        return res.sendStatus(200)
    } catch (err) {
        return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
    }
}