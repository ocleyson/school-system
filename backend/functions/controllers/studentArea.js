const db = require('../lib/db');
const getStudentState = require('../controllers/getStudentState');

module.exports = {
    index: async (req, res) => {
        var {studentUid} = req.query

        const {uid, isStudent} = req.decodedToken;

        if(isStudent) {
            studentUid = uid;
        }

        try {
            // GET STUDENT INFORMATION
            var studentRef = db.firestore().collection('schoolStudents')
            .doc(`${studentUid}`);

            var student = await studentRef
            .get()
            .then(doc => {
                return doc.data();
            })

            // GET SCHOOL INFORMATION

            var schoolInfo = await db.firestore().collection('schools')
            .doc(`${student.schoolUid}`)
            .get()
            .then(doc => {
                var data = doc.data()
                delete data.email
                delete data.schoolTeacher
                return data
            })

            var grades = await getGrades(studentUid);

            var subjectsOfOneClass = await getSubjects(`${student.schoolUid}`, `${student.classId}`);

            var subjectsOfAllClasses = await getSubjects(`${student.schoolUid}`);

            var periodsOfOneClass = await getPeriods(`${student.schoolUid}`, `${student.classId}`);

            var periodsOfAllClasses = await getPeriods(`${student.schoolUid}`);

            // GET STUDENT STATES
            var periods = [...periodsOfOneClass, ...periodsOfAllClasses];
            var subjects = [...subjectsOfOneClass, ...subjectsOfAllClasses];
            var states = await getStudentState(periods, subjects, grades, student.schoolUid, student.classId);
            //

            var classInfo = await db.firestore().collection('schoolClasses')
            .doc(`${student.classId}`)
            .get()
            .then(doc => {
                return doc.data()
            })

            var studentInfo = {
                ...student,
                className: classInfo.className, 
                classSeries: classInfo.series,
            }

            return res.send({
                schoolInfo, 
                studentInfo,
                grades,
                periods, 
                subjects,
                states
            })

        } catch (err) {
            return res.status(400).send({error: 'Erro ao carregar as informações. Tente novamente mais tarde.'})
        }

        async function getGrades(studentUid) {

            var data = await db.firestore().collection('studentGrades')
            .where('studentUid', '==', studentUid)
            .get()
            .then(snapshot => {
                var resultArray = [];
                snapshot.forEach(doc => {
                    resultArray.push(doc.data())
                })
                return resultArray;
            }).catch(() => {
                throw new Error
            })

            return data

        }

        async function getSubjects(schoolUid, classId = "") {

            var data = await db.firestore().collection('schoolSubjects')
            .where('schoolUid', '==', schoolUid)
            .where('classId', '==', classId)
            .get()
            .then(snapshot => {
                var resultArray = [];
                snapshot.forEach(doc => {
                    var data = doc.data();
                    data.subjectId = doc.id;
                    resultArray.push(data)
                })
                return resultArray
            }).catch(() => {
                throw new Error
            })

            return data

        }

        async function getPeriods(schoolUid, classId = "") {

            var data = await db.firestore().collection('schoolPeriods')
            .where('schoolUid', '==', schoolUid)
            .where('classId', '==', classId)
            .get()
            .then(snapshot => {
                var resultArray = [];
                snapshot.forEach(doc => {
                    var data = doc.data();
                    data.periodId = doc.id;
                    resultArray.push(data)
                })
                return resultArray
            }).catch(() => {
                throw new Error
            })

            return data

        }
        
    }
}