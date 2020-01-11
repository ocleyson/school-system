const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {
        const {teacherUid} = req.query;

        // the teacher uid is in school document

        var schoolTeacher = await db.auth().getUser(teacherUid)
        .then(userRecord => {
            return userRecord.email
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolTeacher})
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid: schoolUid} = req.decodedToken;

        const {password, email} = data

        try {

            var teacherUid = await db.auth().createUser({
                email,
                password
            })
            .then(userRecord => {

                db.auth().setCustomUserClaims(userRecord.uid, {
                    isTeacher: true,
                    schoolUid: `${schoolUid}`,
                })

                db.firestore().collection('schools')
                .doc(`${schoolUid}`)
                .set({
                    schoolTeacher: `${userRecord.uid}`,
                }, {merge: true})

                return userRecord.uid
            })

            return res.send({teacherUid})
        } catch (err) {
            return res.status(400).send({error: err.code})
        }

    },
    
    update: async (req, res) => {
        const {teacherUid, data} = req.body;

        const {email, password} = data;

        try {
            if(password !== undefined) {
                await db.auth().updateUser(`${teacherUid}`, {
                    email,
                    password
                })
            } else {
                await db.auth().updateUser(`${teacherUid}`, {
                    email
                })
            }

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: err.code})
        }
    },

}