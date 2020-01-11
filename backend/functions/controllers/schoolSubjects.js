const db = require('../lib/db');

module.exports = {
    index: async (req, res) => {
        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        var periodRef = db.firestore().collection('schoolSubjects')
        .where('schoolUid', '==', `${uid}`);

        
        var allSubjects = await periodRef.get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.subjectId = doc.id;
                resultArray.push(data)
            })
            return resultArray
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })
        

        return res.send({allSubjects})
    },

    show: async (req, res) => {
        var { classId } = req.query;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        var periodRef = db.firestore().collection('schoolSubjects')
        .where('schoolUid', '==', `${uid}`)
        .where('classId', '==', `${classId}`);

        
        var allSubjects = await periodRef.get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.subjectId = doc.id;
                resultArray.push(data)
            })
            return resultArray
        }).catch(() => {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        })
        

        return res.send({ allSubjects })
    },

    store: async (req, res) => {
        const {data} = req.body;

        const {uid} = req.decodedToken;

        data.schoolUid = `${uid}`;

        try {
            var subjectId = await db.firestore().collection('schoolSubjects')
            .add(data)
            .then(ref => {
                return ref.id
            });

            return res.send({subjectId})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {subjectId, data} = req.body;

        try {
            await db.firestore().collection('schoolSubjects')
            .doc(`${subjectId}`)
            .update(data);

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },

    delete: async (req, res) => {
        const {subjectId} = req.body;

        try {
            await db.firestore().collection('schoolSubjects')
            .doc(`${subjectId}`)
            .delete();

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
        }
    }
}