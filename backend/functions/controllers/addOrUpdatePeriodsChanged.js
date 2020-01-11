const db = require('../lib/db');

const addOrUpdatePeriodsChanged = async (studentUid, schoolUid, classId, data) => {

    //the template string that will generate a value to grade
    const fillTemplate = function(templateString, templateVars){
        return new Function("return `"+templateString +"`;").call(templateVars);
    }

    try {

        // get all changePeriods elements(documents) of all classes to change others
        var changePeriodsOfAllClasses = await db.firestore().collection('schoolChangePeriods')
        .where('schoolUid', '==', `${schoolUid}`)
        .where('classId', '==', "")
        .where('periodsUsedToChangeArrayToQuery', 'array-contains', `${data.periodId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changePeriodsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        })

        // get all changePeriods elements(documents) of student class to change others
        var changePeriodsOfOneClass = await db.firestore().collection('schoolChangePeriods')
        .where('schoolUid', '==', `${schoolUid}`)
        .where('classId', '==', `${classId}`)
        .where('periodsUsedToChangeArrayToQuery', 'array-contains', `${data.periodId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.changePeriodsId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        })

        var changePeriods = [...changePeriodsOfAllClasses, ...changePeriodsOfOneClass];

        // for each document we change the periods
        for(var changePeriodsIndex in changePeriods) {
            var periodsUsedToChange = changePeriods[changePeriodsIndex].periodsUsedToChange;
            var periodsToChange = changePeriods[changePeriodsIndex].periodsToChange;
            var orderOfPrecedence = changePeriods[changePeriodsIndex].orderOfPrecedence;

            // if the periodsUsedToChange has just one element, we dont need the orderOfPrecedence variable
            if(periodsUsedToChange.length === 1) {
                var templateString = '${ this.' + periodsUsedToChange[0].letter + ' }'
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

            //the periodsUsedToChange object contain the periods that we will use to change others periods in periodsToChange objects
            for(var periodsUsedToChangeIndex in periodsUsedToChange) {
                
                var periodId = periodsUsedToChange[periodsUsedToChangeIndex].periodId;

                // we dont need get the period that is already in data
                if(periodId !== `${data.periodId}`) {
                    var gradeWithValue = await db.firestore().collection('studentGrades')
                    .where('studentUid', '==', `${studentUid}`)
                    .where('periodId', '==', `${periodId}`)
                    .where('subjectId', '==', `${data.subjectId}`)
                    .get()
                    .then(snapshot => {
                        var result = {}
                        snapshot.forEach(doc => {
                            result = doc.data().grades.find(f => {
                                return f.name === changePeriods[changePeriodsIndex].field
                            })
                        })
                        return result;
                    })

                    // verify if the object has grades, if doesnt we will put the variable with the grade 0(zero) in templateVars
                    // if the period has grades, we will put it in templateVars with its value
                    if(gradeWithValue === undefined || Object.keys(gradeWithValue).length === 0) {
                        Object.assign(templateVars, {[periodsUsedToChange[periodsUsedToChangeIndex].letter]: 0})
                    } else {
                        Object.assign(templateVars, {[periodsUsedToChange[periodsUsedToChangeIndex].letter]: Number(gradeWithValue.value) || 0})
                    }

                } else {
                    // here we get the grades of the period in data

                    // with this find we get the object with the same name as the key field in changePeriods object
                    var valueOfDataSchema = data.grades.find(f => {
                        return f.name === changePeriods[changePeriodsIndex].field
                    })

                    // if the object exists we get the value and put it with the variable in templateVars
                    // if doesnt we put the variable with the value 0(zero)
                    if(valueOfDataSchema) {
                        Object.assign(templateVars, {[periodsUsedToChange[periodsUsedToChangeIndex].letter]: Number(valueOfDataSchema.value) || 0})
                    } else {
                        Object.assign(templateVars, {[periodsUsedToChange[periodsUsedToChangeIndex].letter]: 0})
                    }
                    
                }
            }


            // here we get all elements in periodsToChange object and its grades to change or create
            for(var periodsToChangeIndex in periodsToChange) {
                var periodId = periodsToChange[periodsToChangeIndex].periodId;
                var conditional = periodsToChange[periodsToChangeIndex].conditional;

                var getSchemaToModifyWithGradeId = await db.firestore().collection('studentGrades')
                .where('studentUid', '==', `${studentUid}`)
                .where('periodId', '==', `${periodId}`)
                .where('subjectId', '==', `${data.subjectId}`)
                .get()
                .then(snapshot => {
                    var result = {}
                    snapshot.forEach(doc => {
                        result = {gradeId: doc.id, data: doc.data()}
                    })
                    return result;
                })

                var getSchemaModal = await db.firestore().collection('schoolPeriods')
                .doc(`${periodId}`)
                .get()
                .then(doc => {
                    return doc.data()
                })

                // if grade already exists we will modify and update
                if(getSchemaToModifyWithGradeId.gradeId) {

                    // with this findIndex we get the index of the object with the same name as the key field in changePeriods object
                    getSchemaIndex = getSchemaToModifyWithGradeId.data.grades.findIndex(f => {
                        return f.name === changePeriods[changePeriodsIndex].field
                    })

                    // if the object doenst exists we will get the object in schema of data just to use as a modal and change the value of this modal
                    if(getSchemaIndex === -1) {
                        var schemaElementOfData = getSchemaModal.gradesSchema.find(f => {
                            return f.name === changePeriods[changePeriodsIndex].field
                        })

                        // if the object doenst exist we cant use a conditional(==, <, >, etc...) to check, so we set as true just to pass in the update cinditional(if)
                        var conditionalResult = true;

                        // if there is a object with the same name as the key field in changePeriods object
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
                            var conditionalResult = fillTemplate('${ this.oldValue ' + conditional + ' this.newValue }', {oldValue: Number(oldValue), newValue: Number(newValue)})

                            // the conditionalResult get a string with the boolean, like 'true', so we have to pass it to a real boolean, like true
                            conditionalResult = JSON.parse(conditionalResult);

                        } else {
                            var conditionalResult = true
                        }

                        getSchemaToModifyWithGradeId.data.grades[getSchemaIndex].value = newValue;
                    }

                    // if there is a object with the same name as the key field in changePeriods object
                    if(schemaElementOfData && conditionalResult) {
                        // update here
                        await db.firestore().collection('studentGrades')
                        .doc(`${getSchemaToModifyWithGradeId.gradeId}`)
                        .update(getSchemaToModifyWithGradeId.data)

                        // recursion to change others periods
                        addOrUpdatePeriodsChanged(studentUid, schoolUid, classId, getSchemaToModifyWithGradeId.data)
                    }

                } else {
                    // if the grade doesnt exist we will get the object in schema of data just to use as a modal and change the value of this modal. after that, we will add the grade in database

                    var schemaElementOfData = getSchemaModal.gradesSchema.find(f => {
                        return f.name === changePeriods[changePeriodsIndex].field
                    })

                    // if there is a object with the same name as the key field in changePeriods object
                    if(schemaElementOfData) {
                        schemaElementOfData = {...schemaElementOfData, value: Number(fillTemplate(templateString, templateVars)).toFixed(1)}

                        var newData = {
                            subjectId: data.subjectId, 
                            periodId,
                            schoolUid,
                            studentUid,
                            grades: [schemaElementOfData]
                        }

                        await db.firestore().collection('studentGrades')
                        .add(newData);

                        // recursion to change others periods
                        addOrUpdatePeriodsChanged(studentUid, schoolUid, classId, newData)
                    }
                    
                }

            }
        }

    } catch (err) {
        throw new Error
    }

}

module.exports = addOrUpdatePeriodsChanged;