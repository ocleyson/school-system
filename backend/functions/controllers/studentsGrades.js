const db = require('../lib/db');
const changeOthersSubjects = require('./addOrUpdateSubjectsChanged');
const changeOthersPeriods = require('./addOrUpdatePeriodsChanged');

module.exports = {
    index: async (req, res) => {
        const {classId, subjectId, periodId} = req.query;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        try {
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
            })

            var allGrades = await db.firestore().collection('studentGrades')
            .where('schoolUid', '==', `${uid}`)
            .where('subjectId', '==', `${subjectId}`)
            .where('periodId', '==', `${periodId}`)
            .get()
            .then(snapshot => {
                var result = []
                snapshot.forEach(doc => {
                    result.push({gradeId: doc.id, grades: doc.data().grades, studentId: doc.data().studentUid});
                })
                return result;
            })

            allStudents = allStudents.map(student => {
                var gradeObject = allGrades.find(f => {
                    return f.studentId === student.studentId
                })

                gradeObject = gradeObject ? gradeObject : {gradeId: undefined, grades: []}

                return Object.assign(student, {gradeId: gradeObject.gradeId, grades: gradeObject.grades})
            })

            return res.send({allStudents})
        } catch (err) {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        }
    },

    store: async (req, res) => {
        const {studentUid, data, classId, isBlocked} = req.body;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        if(isBlocked) {
            return res.status(400).send({error: 'O período está bloqueado!'})
        }

        data.studentUid = `${studentUid}`;
        data.schoolUid = `${uid}`;

        try {

            // the function where we verify if the current period have to change others periods
            changeOthersPeriods(studentUid, uid, classId, data)

            // the function where we verify if the current subject have to change others subjects
            changeOthersSubjects(studentUid, uid, classId, data);

            // here we add the data(grade) we are sending
            var gradeId = await db.firestore().collection('studentGrades')
            .add(data)
            .then(ref => {
                return ref.id
            });

            await db.firestore().collection('schoolStudents')
            .doc(`${studentUid}`)
            .set({
                gradesLastUpdate: db.firestore.Timestamp.now()
            }, {merge: true})

            return res.send({gradeId})

        } catch (err) {
            return res.status(400).send({error: 'Erro ao gravar as informações. Tente novamente mais tarde.'})
        }
    },

    update: async (req, res) => {
        const {studentUid, gradeId, data, classId, isBlocked} = req.body;

        var {uid, isTeacher, schoolUid} = req.decodedToken;

        if(isTeacher) {
            uid = schoolUid
        }

        if(isBlocked) {
            return res.status(400).send({error: 'O período está bloqueado!'})
        }

        try {

            // the function where we verify if the current period have to change others periods
            changeOthersPeriods(studentUid, uid, classId, data)

            // the function where we verify if the current subject have to change others subjects
            changeOthersSubjects(studentUid, uid, classId, data);

            await db.firestore().collection('studentGrades')
            .doc(`${gradeId}`)
            .update(data);

            await db.firestore().collection('schoolStudents')
            .doc(`${studentUid}`)
            .set({
                gradesLastUpdate: db.firestore.Timestamp.now()
            }, {merge: true})

            return res.sendStatus(200)
        } catch (err) {
            return res.status(400).send({error: 'Erro ao atualizar as informações. Tente novamente mais tarde.'})
        }
    },
}