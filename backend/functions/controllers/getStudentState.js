const db = require('../lib/db');

module.exports = async (periods, subjects, grades, schoolUid, classId) => {

    //the template string that will generate a value to grade
    const fillTemplate = function(templateString, templateVars){
        return new Function("return `"+templateString +"`;").call(templateVars);
    }

    try {

        var currentPeriod = periods.find(period => {
            return getDate(period.startDate.seconds, period.startDate.nanoseconds) < new Date() && getDate(period.endDate.seconds, period.endDate.nanoseconds) > new Date()
        })

        if(!currentPeriod) return {}

        var statesOfStudentClass = await getData(schoolUid, currentPeriod.periodId, classId);
        var statesOfAllClasses = await getData(schoolUid, currentPeriod.periodId);

        var statesModels = [...statesOfStudentClass, ...statesOfAllClasses];
        statesModels = statesModels.sort((a, b) => a.priority - b.priority);

        var states = {}; // {subjectId: stateString}

        for(var subjectIndex in subjects) {

            var subjectGrades = grades.filter(grade => 
                grade.subjectId === subjects[subjectIndex].subjectId
            );

            var periodsWithoutGrades = periods.filter(period => 
                !subjectGrades.some(subjectGrade => subjectGrade.periodId === period.periodId) 
            );

            var statesModelsToRemove = periodsWithoutGrades.reduce((arr, period) => {
                return [...statesModels.filter(state => state["periodsUsedToChangeStateArrayToQuery"].includes(period.periodId)), ...arr]
            }, [])

            var statesModelsFiltered = statesModels.filter(state => !statesModelsToRemove.some(s => s.studentsStateId === state.studentsStateId))

            statesLoop: for(var statesIndex in statesModelsFiltered) {

                var templateString = '';
                var templateVars = {};

                var periodsUsedToChangeState = statesModelsFiltered[statesIndex].periodsUsedToChangeState;
                var orderOfPrecedence = statesModelsFiltered[statesIndex].orderOfPrecedence;
                var conditional = statesModelsFiltered[statesIndex].conditional;
                var numberToCompare = statesModelsFiltered[statesIndex].numberToCompare;
                var state = statesModelsFiltered[statesIndex].state;

                if(periodsUsedToChangeState.length === 1) {
                    templateString = 'this.' + periodsUsedToChangeState[0].letter + ' '
                } else {
                    // the templateString will generate something like ${ this.a + this.b }
                    templateString = orderOfPrecedence.split(' ').reduce((finalString, item) => {
                        if(item.match(/^[A-Z]*$/i) && item !== '') {
                            return finalString + ' ' + 'this.'+item
                        } else {
                            return finalString + ' ' + item
                        }
                    }, '')
                
                }

                for(var periodIndex in periodsUsedToChangeState) {

                    var periodGrades = subjectGrades.find(grade => {
                        return grade.periodId === periodsUsedToChangeState[periodIndex].periodId
                    })

                    if(!periodGrades) break statesLoop;

                    var grade = periodGrades.grades.find(grade => {
                        return grade.schemaId === periodsUsedToChangeState[periodIndex].gradeId
                    })

                    if(!grade) break statesLoop;

                    var letter = periodsUsedToChangeState[periodIndex].letter

                    Object.assign(templateVars, {[letter]: Number(grade.value)})

                }

                var result = fillTemplate(' ${ ' + templateString + conditional + numberToCompare + ' } ', templateVars);

                result = JSON.parse(result);

                if(result) {
                    states = {...states, [subjects[subjectIndex].subjectId]: state}

                    break;
                }

            }

            if( !states.hasOwnProperty(`${subjects[subjectIndex].subjectId}`) ) {
                states = {...states, [subjects[subjectIndex].subjectId]: 'EM AVALIAÇÃO'}
            }

        }

        return states

    } catch (err) {
        throw new Error
    }

    async function getData(schoolUid, periodId, classId = "") {
        var schoolStudentsStatesData = await db.firestore().collection('schoolStudentsStates')
        .where('schoolUid', '==', `${schoolUid}`)
        .where('classId', '==', `${classId}`)
        .where('periodsUsedToChangeStateArrayToQuery', 'array-contains', `${periodId}`)
        .get()
        .then(snapshot => {
            var resultArray = [];
            snapshot.forEach(doc => {
                var data = doc.data();
                data.studentsStateId = doc.id
                resultArray.push(data)
            })
            return resultArray;
        }).catch(() => {
            throw new Error
        })

        return schoolStudentsStatesData
    }

    function getDate(seconds, nanoseconds) {
        var milliseconds = seconds * 1000 + nanoseconds / 1000000;

        var date = new Date(milliseconds);

        return date
    }

}