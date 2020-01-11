const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {

        const {uid} = req.decodedToken;

        var schoolStudentsStatesData = await db.firestore().collection('schoolStudentsStates')
        .where('schoolUid', '==', `${uid}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.studentsStateId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolStudentsStatesData})
    },

    show: async (req, res) => {

        const {uid} = req.decodedToken;
        const {classId} = req.query;

        var schoolStudentsStatesData = await db.firestore().collection('schoolStudentsStates')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.studentsStateId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolStudentsStatesData})
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        data.schoolUid = `${uid}`;

        try {
            var studentsStateId = await db.firestore().collection('schoolStudentsStates')
            .add(data)
            .then(ref => {
                return ref.id
            });

            return res.send({studentsStateId})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {data} = req.body;

        const {studentsStateId, ...resOfData} = data;

        try {
            await db.firestore().collection('schoolStudentsStates')
            .doc(`${studentsStateId}`)
            .update(resOfData);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {studentsStateId} = req.body;

        try {
            await db.firestore().collection('schoolStudentsStates')
            .doc(`${studentsStateId}`)
            .delete();

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    },
}