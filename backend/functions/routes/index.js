const routes = require('express').Router();

const schoolInfo = require('../controllers/schoolInfo');
const schoolClasses = require('../controllers/schoolClasses');
const schoolPeriods = require('../controllers/schoolPeriods');
const schoolSubjects = require('../controllers/schoolSubjects');
const schoolStudents = require('../controllers/schoolStudents');
const studentsGrades = require('../controllers/studentsGrades');
const studentArea = require('../controllers/studentArea');
const changeSubjects = require('../controllers/changeSubjects');
const schoolTeacher = require('../controllers/schoolTeacher');
const changePeriods = require('../controllers/changePeriods');
const changeStudentsClass = require('../controllers/changeStudentsClass');
const deleteAllGrades = require('../controllers/deleteAllGrades');
const cancelSubscription = require('../controllers/cancelSubscription');
const schoolStudentsStates = require('../controllers/schoolStudentsStates');
const checkSubscription = require('../controllers/checkSubscription');
const changeCreditCard = require('../controllers/changeCreditCard');
const changeCustomerEmail = require('../controllers/changeCustomerEmail');

// THE SCHOOL'S MAIN INFO

routes.post('/schoolinfo', schoolInfo.store);

routes.get('/schoolinfo', schoolInfo.index);

// THE SCHOOL'S CLASSES

routes.post('/schoolclasses', schoolClasses.store);

routes.get('/schoolclasses', schoolClasses.index);

routes.put('/schoolclasses', schoolClasses.update);

routes.delete('/schoolclasses', schoolClasses.delete);

// THE SCHOOL'S PERIODS

routes.post('/schoolperiods', schoolPeriods.store);

routes.get('/schoolperiods', schoolPeriods.index);

routes.get('/schoolperiod', schoolPeriods.show);

routes.put('/schoolperiods', schoolPeriods.update);

routes.delete('/schoolperiods', schoolPeriods.delete);

// THE SCHOOL'S SUBJECTS

routes.post('/schoolsubjects', schoolSubjects.store);

routes.get('/schoolsubjects', schoolSubjects.index);

routes.get('/schoolsubject', schoolSubjects.show);

routes.put('/schoolsubjects', schoolSubjects.update);

routes.delete('/schoolsubjects', schoolSubjects.delete);

// THE SCHOOL'S STUDENTS

routes.post('/schoolstudents', schoolStudents.store);

routes.get('/schoolstudents', schoolStudents.index);

routes.put('/schoolstudents', schoolStudents.update);

routes.delete('/schoolstudents', schoolStudents.delete);

// THE STUDENTS' GRADES

routes.post('/studentsgrades', studentsGrades.store);

routes.get('/studentsgrades', studentsGrades.index);

routes.put('/studentsgrades', studentsGrades.update);

/*doesnt make sense for now => routes.delete('/studentsgrades', studentsGrades.delete);*/

// THE STUDENTS' AREA

routes.get('/studentarea', studentArea.index);

// THE CHANGESUBJECTS WILL CHANGE THE SUBJECTS USING OTHERS SUBJECTS

routes.post('/changesubjects', changeSubjects.store);

routes.get('/changesubjects', changeSubjects.index);

routes.get('/changesubject', changeSubjects.show);

routes.put('/changesubjects', changeSubjects.update);

routes.delete('/changesubjects', changeSubjects.delete);

// THE TEACHER ACCOUNT

routes.post('/schoolteacher', schoolTeacher.store);

routes.get('/schoolteacher', schoolTeacher.index);

routes.put('/schoolteacher', schoolTeacher.update);

// THE CHANGEPERIODS WILL CHANGE THE PERIODS USING OTHERS PERIODS

routes.post('/changeperiods', changePeriods.store);

routes.get('/changeperiods', changePeriods.index);

routes.get('/changeperiod', changePeriods.show);

routes.put('/changeperiods', changePeriods.update);

routes.delete('/changeperiods', changePeriods.delete);

// MOVE ALL STUDENTS FROM ONE CLASS TO ANOTHER CLASS

routes.post('/changestudentsclass', changeStudentsClass);

// DELETE ALL GRADES OF THE STUDENTS OF ONE SCHOOL

routes.post('/deleteallgrades', deleteAllGrades);

// CANCEL SCHOOL SUBSCRIPTION

routes.post('/cancelsubscription', cancelSubscription);

// THE SCHOOLSTUDENTSSTATE WILL CHANGE THE STATE OF THE STUDENT USING THE GRADES OF THEM

routes.post('/studentsstates', schoolStudentsStates.store);

routes.get('/studentsstates', schoolStudentsStates.index);

routes.get('/studentsstate', schoolStudentsStates.show);

routes.put('/studentsstates', schoolStudentsStates.update);

routes.delete('/studentsstates', schoolStudentsStates.delete);

// CHECK SUBSCRIPTION

routes.get('/checksubscription', checkSubscription);

// CHANGE SCHOOL'S CREDIT CARD

routes.post('/changecreditcard', changeCreditCard);

// CHANGE CUSTOMER EMAIL

routes.post('/changecustomeremail', changeCustomerEmail)

module.exports = routes;