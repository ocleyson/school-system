const db = require('../lib/db');
const changeOthersPeriods = require('./addOrUpdatePeriodsChanged');

module.exports = async (studentUid, schoolUid, classId, data) => {

    //the template string that will generate a value to grade
    const fillTemplate = function(templateString, templateVars){
        return new Function("return `"+templateString +"`;").call(templateVars);
    }

    try {
    
        // get all changeSubjects elements(documents) of all classes to change others
        var changeSubjectsOfAllClasses = await db.firestore().collection('schoolChangeSubjects')
        .where('schoolUid', '==', `${schoolUid}`)
        .where('classId', '==', "")
        .where('subjectsUsedToChangeArrayToQuery', 'array-contains', `${data.subjectId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changeSubjectsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        })

        // get all changeSubjects elements(documents) of student class to change others
        var changeSubjectsOfOneClass = await db.firestore().collection('schoolChangeSubjects')
        .where('schoolUid', '==', `${schoolUid}`)
        .where('classId', '==', `${classId}`)
        .where('subjectsUsedToChangeArrayToQuery', 'array-contains', `${data.subjectId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changeSubjectsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        })

        var changeSubjects = [...changeSubjectsOfAllClasses, ...changeSubjectsOfOneClass];
        

        // for each document we change the subjects
        for(var changeSubjectsIndex in changeSubjects) {
            var subjectsUsedToChange = changeSubjects[changeSubjectsIndex].subjectsUsedToChange;
            var subjectsToChange = changeSubjects[changeSubjectsIndex].subjectsToChange;
            var orderOfPrecedence = changeSubjects[changeSubjectsIndex].orderOfPrecedence;

            // if the subjectsUsedToChange has just one element, we dont need the orderOfPrecedence variable
            if(subjectsUsedToChange.length === 1) {
                var templateString = '${ this.' + subjectsUsedToChange[0].letter + ' }'
            } else {
                // the templateString will generate something like ${ this.a + this.b }
                var templateString = orderOfPrecedence.split(' ').reduce((finalString, item) => {
                    if(item.match(/^[A-Z]*$/i) && item !== '') {
                        return finalString + ' ' + 'this.'+item
                    } else {
                        return finalString + ' ' + item
                    }
                }, '')
            
                templateString = '${' + templateString + ' }'
            }

            // the templateVars will contain the variables like {a: 5, b: 7}
            var templateVars = {};

            //the subjectsUsedToChange object contain the subjects that we will use to change others subjects in subjectsToChange objects
            for(var subjectsUsedToChangeIndex in subjectsUsedToChange) {
                
                var subjectId = subjectsUsedToChange[subjectsUsedToChangeIndex].subjectId;

                // we dont need get the subject that is already in data
                if(subjectId !== `${data.subjectId}`) {
                    var gradeWithValue = await db.firestore().collection('studentGrades')
                    .where('studentUid', '==', `${studentUid}`)
                    .where('subjectId', '==', `${subjectId}`)
                    .where('periodId', '==', `${data.periodId}`)
                    .get()
                    .then(snapshot => {
                        var result = {}
                        snapshot.forEach(doc => {
                            result = doc.data().grades.find(f => {
                                return f.name === changeSubjects[changeSubjectsIndex].field
                            })
                        })
                        return result;
                    })

                    // verify if the object has grades, if doesnt we will put the variable with the grade 0(zero) in templateVars
                    // if the subject has grades, we will put it in templateVars with its value
                    if(gradeWithValue === undefined || Object.keys(gradeWithValue).length === 0) {
                        Object.assign(templateVars, {[subjectsUsedToChange[subjectsUsedToChangeIndex].letter]: 0})
                    } else {
                        Object.assign(templateVars, {[subjectsUsedToChange[subjectsUsedToChangeIndex].letter]: Number(gradeWithValue.value) || 0})
                    }

                } else {
                    // here we get the grades of the subject in data

                    // with this find we get the object with the same name as the key field in changeSubjects object
                    var valueOfDataSchema = data.grades.find(f => {
                        return f.name === changeSubjects[changeSubjectsIndex].field
                    })

                    // if the object exists we get the value and put it with the variable in templateVars
                    // if doesnt we put the variable with the value 0(zero)
                    if(valueOfDataSchema) {
                        Object.assign(templateVars, {[subjectsUsedToChange[subjectsUsedToChangeIndex].letter]: Number(valueOfDataSchema.value) || 0})
                    } else {
                        Object.assign(templateVars, {[subjectsUsedToChange[subjectsUsedToChangeIndex].letter]: 0})
                    }
                    
                }
            }

            // here we get all elements in subjectsToChange object and its grades to change or create
            for(var subjectsToChangeIndex in subjectsToChange) {
                var subjectId = subjectsToChange[subjectsToChangeIndex].subjectId;
                var conditional = subjectsToChange[subjectsToChangeIndex].conditional;

                var getSchemaToModifyWithGradeId = await db.firestore().collection('studentGrades')
                .where('studentUid', '==', `${studentUid}`)
                .where('subjectId', '==', `${subjectId}`)
                .where('periodId', '==', `${data.periodId}`)
                .get()
                .then(snapshot => {
                    var result = {}
                    snapshot.forEach(doc => {
                        result = {gradeId: doc.id, data: doc.data()}
                    })
                    return result;
                })

                // if grade already exists we will modify and update
                if(getSchemaToModifyWithGradeId.gradeId) {

                    // with this findIndex we get the index of the object with the same name as the key field in changeSubjects object
                    getSchemaIndex = getSchemaToModifyWithGradeId.data.grades.findIndex(f => {
                        return f.name === changeSubjects[changeSubjectsIndex].field
                    })

                    // if the object doenst exists we will get the object in schema of data just to use as a modal and change the value of this modal
                    if(getSchemaIndex === -1) {
                        var schemaElementOfData = data.grades.find(f => {
                            return f.name === changeSubjects[changeSubjectsIndex].field
                        })

                        // if the object doenst exist we cant use a conditional(==, <, >, etc...) to check, so we set as true just to pass in the update cinditional(if)
                        var conditionalResult = true;

                        // if there is a object with the same name as the key field in changeSubjects object
                        if(schemaElementOfData) {
                            schemaElementOfData = {...schemaElementOfData, value: Number(fillTemplate(templateString, templateVars)).toFixed(1)}

                            getSchemaToModifyWithGradeId.data.grades = [...getSchemaToModifyWithGradeId.data.grades, schemaElementOfData]
                        }

                    } else {
                        // just to pass in next if and update
                        var schemaElementOfData = true;

                        var oldValue = Number(getSchemaToModifyWithGradeId.data.grades[getSchemaIndex].value) || 0;

                        var newValue = Number(fillTemplate(templateString, templateVars)).toFixed(1);

                        if(conditional !== "") {

                            // this function return true or false according to the condition
                            var conditionalResult = fillTemplate('${ this.oldValue ' + conditional + ' this.newValue }', {oldValue, newValue})

                            // the conditionalResult get a string with the boolean, like 'true', so we have to pass it to a real boolean, like true
                            conditionalResult = JSON.parse(conditionalResult);

                        } else {
                            var conditionalResult = true
                        }

                        getSchemaToModifyWithGradeId.data.grades[getSchemaIndex].value = newValue;
                    }

                    // if there is a object with the same name as the key field in changeSubjects object
                    if(schemaElementOfData && conditionalResult) {
                        // update here
                        await db.firestore().collection('studentGrades')
                        .doc(`${getSchemaToModifyWithGradeId.gradeId}`)
                        .update(getSchemaToModifyWithGradeId.data)

                        // the function where we verify if the current period have to change others periods
                        // we do that here because this subject can change others periods
                        changeOthersPeriods(studentUid, schoolUid, classId, getSchemaToModifyWithGradeId.data)
                    }

                } else {
                    // if the grade doesnt exist we will get the object in schema of data just to use as a modal and change the value of this modal. after that, we will add the grade in database

                    var schemaElementOfData = data.grades.find(f => {
                        return f.name === changeSubjects[changeSubjectsIndex].field
                    })

                    // if there is a object with the same name as the key field in changeSubjects object
                    if(schemaElementOfData) {
                        schemaElementOfData = {...schemaElementOfData, value: Number(fillTemplate(templateString, templateVars)).toFixed(1)}

                        var newData = {
                            periodId: data.periodId, 
                            subjectId,
                            schoolUid,
                            studentUid,
                            grades: [schemaElementOfData]
                        };

                        await db.firestore().collection('studentGrades')
                        .add(newData);

                        // the function where we verify if the current period have to change others periods
                        // we do that here because this subject can change others periods
                        changeOthersPeriods(studentUid, schoolUid, classId, newData)
                    }
                    
                }

            }
        }

    } catch (err) {
        throw new Error
    }

}