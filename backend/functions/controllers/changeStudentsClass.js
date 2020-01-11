const db = require('../lib/db');

// Move Students From One Class To Another
module.exports = async (req, res) => {
    const {currentClassId, nextClassId} = req.body;

    const {uid: schoolUid} = req.decodedToken;

    try {
        await db.firestore().collection('schoolStudents')
        .where('classId', '==', `${currentClassId}`)
        .where('schoolUid', '==', `${schoolUid}`)
        .get()
        .then(snapshot => {
            var batch = db.firestore().batch();
            snapshot.docs.forEach(doc => {
                batch.set(doc.ref, {classId: `${nextClassId}`}, {merge: true});
            });
            batch.commit();
        })

        return res.sendStatus(200)
    } catch (error) {
        return res.status(400).send({error})
    }

}