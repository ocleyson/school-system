const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {
        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        var periodRef = db.firestore().collection('schoolPeriods')
        .where('schoolUid', '==', `${uid}`);

        
        var allPeriods = await periodRef.get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.periodId = doc.id;
                resultArray.push(data)
            })
            return resultArray
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })
        

        return res.send({allPeriods})
    },

    show: async (req, res) => {
        var { classId } = req.query;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) uid = schoolUid

        var periodRef = db.firestore().collection('schoolPeriods')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`)
        
        var allPeriods = await periodRef.get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.periodId = doc.id;
                resultArray.push(data)
            })
            return resultArray
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })

        return res.send({ allPeriods })
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        delete data.periodId
        data.schoolUid = `${uid}`;

        try {
            var periodId = await db.firestore().collection('schoolPeriods')
            .add(data)
            .then(ref => {
                return ref.id
            })

        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }

        return res.send({periodId})

    },

    update: async (req, res) => {
        const {periodId, data} = req.body;

        delete data.periodId

        try {
            await db.firestore().collection('schoolPeriods')
            .doc(`${periodId}`)
            .update(data);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {periodId} = req.body;

        try {
            await db.firestore().collection('schoolPeriods')
            .doc(`${periodId}`)
            .delete();

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    },
}