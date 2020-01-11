const db = require('../lib/db');
const stripe = require('stripe')('');

module.exports = {
    index: async (req, res) => {
        const {classId} = req.query;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        var allStudents = await db.firestore().collection('schoolStudents')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.studentId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({allStudents})
    },

    store: async (req, res) => {
        const {studentData} = req.body;

        const {uid: schoolUid} = req.decodedToken;

        async function updateSubscription(subscriptionId, planId, qty) {
            try {
                const subscription = await stripe.subscriptions.retrieve(`${subscriptionId}`);
    
                await stripe.subscriptions.update(`${subscriptionId}`, {
                    items: [{
                        id: subscription.items.data[0].id,
                        plan: `${planId}`,
                        quantity: qty,
                    }],
                    prorate: false,
                });
            } catch (err) {
                throw new Error
            }
        }

        try {
            var schoolInfo = await db.firestore().collection('schools')
            .doc(`${schoolUid}`)
            .get()
            .then(doc => {
                return doc.data()
            })

            await updateSubscription(schoolInfo.subscriptionId, schoolInfo.planId, Number(schoolInfo.numberOfStudents) + 1);

            var studentUid = await db.auth().createUser({
                email: studentData.email,
                password: studentData.registration
            }).then(userRecord => {
                return userRecord.uid
            })

            await db.auth().setCustomUserClaims(studentUid, {
                isStudent: true,
                schoolUid,
            })

            await db.firestore().collection('schoolStudents')
            .doc(`${studentUid}`)
            .set({
                schoolUid,
                ...studentData
            })

            await db.firestore().collection('schools')
            .doc(`${schoolUid}`)
            .set({
                numberOfStudents: Number(schoolInfo.numberOfStudents) + 1
            }, {merge: true})

            return res.send({studentUid})
        } catch (err) {
            return res.status(400).send({error: err.code || 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }

    },

    update: async (req, res) => {
        const {studentUid, studentData} = req.body;

        const {uid: schoolUid} = req.decodedToken;

        try {
            await db.auth().updateUser(`${studentUid}`, {
                email: studentData.email,
                disabled: studentData.disabled
            })

            await db.firestore().collection('schoolStudents')
            .doc(`${studentUid}`)
            .set({
                schoolUid,
                ...studentData
            }, { merge: true })
            
            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: err.code})
        }

    },

    delete: async (req, res) => {
        const {studentUid} = req.body;

        const {uid: schoolUid} = req.decodedToken;

        async function updateSubscription(subscriptionId, planId, qty) {
            try {
                const subscription = await stripe.subscriptions.retrieve(`${subscriptionId}`);
    
                await stripe.subscriptions.update(`${subscriptionId}`, {
                    items: [{
                        id: subscription.items.data[0].id,
                        plan: `${planId}`,
                        quantity: qty,
                    }],
                    prorate: false,
                });
            } catch (err) {
                throw new Error
            }
        }

        try {
            var schoolInfo = await db.firestore().collection('schools')
            .doc(`${schoolUid}`)
            .get()
            .then(doc => {
                return doc.data()
            })

            await updateSubscription(schoolInfo.subscriptionId, schoolInfo.planId, Number(schoolInfo.numberOfStudents) - 1);

            await db.firestore().collection('studentGrades')
            .where('studentUid', '==', `${studentUid}`)
            .where('schoolUid', '==', `${schoolUid}`)
            .get()
            .then(snapshot => {
                var batch = db.firestore().batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                })
                batch.commit().then(() => {
                    db.firestore().collection('schoolStudents').doc(`${studentUid}`).delete();
                    db.auth().deleteUser(`${studentUid}`);
                })
            })

            await db.firestore().collection('schools')
            .doc(`${schoolUid}`)
            .set({
                numberOfStudents: Number(schoolInfo.numberOfStudents) - 1
            }, {merge: true})

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: err.code})
        }
    }
}