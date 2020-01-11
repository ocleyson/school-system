const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) uid = schoolUid

        var schoolClassesData = await db.firestore().collection('schoolClasses')
        .where('schoolUid', '==', `${uid}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.classId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({ schoolClassesData })
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        data.schoolUid = `${uid}`;

        try {
            var classId = await db.firestore().collection('schoolClasses')
            .add(data)
            .then(ref => {
                return ref.id
            });

            return res.send({classId})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {classId, data} = req.body;

        try {
            await db.firestore().collection('schoolClasses')
            .doc(`${classId}`)
            .update(data);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {classId} = req.body;

        try {
            await db.firestore().collection('schoolClasses')
            .doc(`${classId}`)
            .delete();

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    }
}