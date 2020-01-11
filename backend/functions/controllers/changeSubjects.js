const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {

        const {uid} = req.decodedToken;

        var schoolChangeSubjectsData = await db.firestore().collection('schoolChangeSubjects')
        .where('schoolUid', '==', `${uid}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changeSubjectsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolChangeSubjectsData})
    },

    show: async (req, res) => {

        const { uid } = req.decodedToken;
        const { classId } = req.query;

        var schoolChangeSubjectsData = await db.firestore().collection('schoolChangeSubjects')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changeSubjectsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolChangeSubjectsData})
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        data.schoolUid = `${uid}`;

        try {
            var changeSubjectsId = await db.firestore().collection('schoolChangeSubjects')
            .add(data)
            .then(ref => {
                return ref.id
            });

            return res.send({changeSubjectsId})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {data} = req.body;

        const {changeSubjectsId, ...resOfData} = data;

        try {
            await db.firestore().collection('schoolChangeSubjects')
            .doc(`${changeSubjectsId}`)
            .update(resOfData);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {changeSubjectsId} = req.body;

        try {
            await db.firestore().collection('schoolChangeSubjects')
            .doc(`${changeSubjectsId}`)
            .delete()

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    },
}