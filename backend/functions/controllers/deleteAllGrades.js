const db = require('../lib/db');

module.exports = async (req, res) => {

    const {uid: schoolUid} = req.decodedToken;

    try {
        await db.firestore().collection('studentGrades')
        .where('schoolUid', '==', `${schoolUid}`)
        .get()
        .then(snapshot => {
            
            var batch = db.firestore().batch();

            snapshot.docs.forEach(grade => {
                batch.delete(grade.ref);
            })

            batch.commit()
            
        })

        return res.sendStatus(200)
    } catch (err) {
        return res.status(400).send({error: 'Erro ao deletar as informações. Tente novamente mais tarde.'})
    }
}