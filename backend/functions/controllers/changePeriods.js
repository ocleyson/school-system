const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {

        const {uid} = req.decodedToken;

        var schoolChangePeriodsData = await db.firestore().collection('schoolChangePeriods')
        .where('schoolUid', '==', `${uid}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changePeriodsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolChangePeriodsData})
    },

    show: async (req, res) => {

        const { uid } = req.decodedToken;
        const { classId } = req.query;

        var schoolChangePeriodsData = await db.firestore().collection('schoolChangePeriods')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changePeriodsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({schoolChangePeriodsData})
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        data.schoolUid = `${uid}`;

        try {
            var changePeriodsId = await db.firestore().collection('schoolChangePeriods')
            .add(data)
            .then(ref => {
                return ref.id
            });

            return res.send({changePeriodsId})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {data} = req.body;

        const {changePeriodsId, ...resOfData} = data;

        try {
            await db.firestore().collection('schoolChangePeriods')
            .doc(`${changePeriodsId}`)
            .update(resOfData);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {changePeriodsId} = req.body;

        try {
            await db.firestore().collection('schoolChangePeriods')
            .doc(`${changePeriodsId}`)
            .delete()

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    },
}