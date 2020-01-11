import React, { useEffect, useState } from 'react';
import {DivContainer, H1TitleClass, DivNavButton, H1NavButton, H1TitleBody, DivTitleBody, Main, TableGrades, Tr, DivTitleClass, DivError, DivSpinner, DivCancel, DivSave, DivStudentModal} from './style';
import {FiCalendar, FiX, FiAlertTriangle} from 'react-icons/fi';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import PeriodsModal from '../../components/PeriodsModal';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';

export default function SetGrades(props) {
    const [studentsWithGrades, setStudentsWithGrades] = useState([]);
    const [periodSchema, setPeriodSchema] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({
        name: '',
        studentId: '',
        registration: '',
        grades: [],
    });
    const [orderOfPrecedence, setOrderOfPrecedence] = useState('');
    const [bgColor, setBgColor] = useState(null);
    const [error, setError] = useState( { target: '', message: '' } );
    const [isLoading, setIsLoading] = useState(true);
    const [showPeriodsModal, setShowPeriodsModal] = useState(false);
    const [showGradesModal, setShowGradesModal] = useState(false);
    const [updating, setUpdating] = useState('');

    const subjects = useSelector(state => state.subjects);
    const periods = useSelector(state => state.periods);
    const navigation = useSelector(state => state.navigation);

    useEffect(() => {
        fetchData();
    }, [periods.period.periodId])

    async function fetchData() {
        setIsLoading(true);

        getOrderOfPrecedence();
    
        await api.get('/studentsgrades', {
            params: {
                classId: navigation.oneclass.classId,
                subjectId: subjects.subject.subjectId,
                periodId: periods.period.periodId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setPeriodSchema(periods.period.gradesSchema);
            setStudentsWithGrades(res.data.allStudents);
            setBgColor(null);
        }).catch(err => {
            setError( { target: 'loading', message: err.response.data.error } )
        })

        setIsLoading(false);
    
    }

    function getOrderOfPrecedence() {

        function checkClass(subjectOrder, classId) {

            var found;
            var filterOrder;

            filterOrder = subjectOrder.filter(f => f.classId === classId);

            found = filterOrder.find(f => {
                return f.periodId === periods.period.periodId || f.periodId === ''
            })

            if(found) {
                setOrderOfPrecedence(found.orderOfPrecedence);
            } else {
                setOrderOfPrecedence(periods.period.orderOfPrecedence);
            }
        }

        var subjectOrder = subjects.subject.arrayOfOrdersOfPrecedence;

        if(subjectOrder.length > 0) {

            if(subjectOrder.some(s => s.classId === navigation.oneclass.classId)) {

                checkClass(subjectOrder, navigation.oneclass.classId);


            } else if(subjectOrder.some(s => s.classId === '')) {

                checkClass(subjectOrder, '');

            } else {
                setOrderOfPrecedence(periods.period.orderOfPrecedence);
            }

        } else {
            setOrderOfPrecedence(periods.period.orderOfPrecedence);
        }

    }

    function changeStudentState(e, schemaModal) {
        var newStudentState = {...selectedStudent};
    
        var schemaIndex = newStudentState.grades.findIndex(f => {
            return f.schemaId === schemaModal.schemaId
        })
    
        if(schemaIndex === -1) {
            newStudentState.grades.push({value: '', ...schemaModal})
            schemaIndex = newStudentState.grades.findIndex(f => {
                return f.schemaId === schemaModal.schemaId
            })
        }

        e = e.replace(',', '.');

        newStudentState = {...selectedStudent, grades: [
            ...selectedStudent.grades.slice(0,schemaIndex),
            Object.assign({}, selectedStudent.grades[schemaIndex], {value: e}),
            ...selectedStudent.grades.slice(schemaIndex+1)
        ]}
    
        if(e.match(/^[0-9.,]*$/)) {

            // verify if there is a resultField in the periodSchema
            var isThereResultField = periodSchema.some(s => {
                return s.resultField === true
            })

            if(isThereResultField && !!!schemaModal.resultField) {
                changeResultField(newStudentState);
            } else {
                setSelectedStudent(newStudentState)
            }
            
        } else {
            setSelectedStudent(newStudentState)
        }

    }

    function changeResultField(newStudentState) {
    
        var templateString = orderOfPrecedence.split(' ').reduce((finalString, item) => {
            if(item.match(/^[A-Z]*$/i) && item !== '') {
                return `${finalString} this.${item}`
                //return finalString + ' ' + 'this.'+item
            } else {
                return `${finalString} ${item}`
                //return finalString + ' ' + item
            }
        }, '')
    
        templateString = '${' + templateString + ' }'
    
        var templateVars = periodSchema.reduce((finalObject, item) => {
            var findSchemaObject = newStudentState.grades.find(f => {
                return f.schemaId === item.schemaId
            })
    
            if(findSchemaObject === undefined) {
                newStudentState.grades.push({value: '', ...item});
                findSchemaObject = newStudentState.grades.find(f => {
                    return f.schemaId === item.schemaId
                })
            }
    
            return Object.assign(finalObject, {[item.name]: Number(findSchemaObject.value) || 0})
        }, {})
    
        const fillTemplate = function(templateString, templateVars){
            // eslint-disable-next-line
            return new Function("return `"+templateString +"`;").call(templateVars);
        }
    
        var schemaResultField = newStudentState.grades.findIndex(f => {
            return f.resultField === true
        })
    
        var value;
    
        try {
            value = Number(fillTemplate(templateString, templateVars)).toFixed(1);
        } catch {
            value = '0';
            setError( { target: 'grade', message: 'Parece que houve um erro na Ordem de Precedência. Não altere as notas enquanto o problema não for resolvido. Entre em contato com o Administrador!' } )
        }

        if(Number(value) === Infinity) {
            value = '0';
            setError( { target: 'grade', message: 'Parece que houve uma tentativa de divisão por zero. Esse erro pode estar na Ordem de Precedência. Entre em contato com o Administrador!' } )
        }

        // pass the number to string
        value = `${value}`;

        setSelectedStudent(
            {...newStudentState, grades: [
                ...newStudentState.grades.slice(0,schemaResultField),
                Object.assign({}, newStudentState.grades[schemaResultField], {value: value}),
                ...newStudentState.grades.slice(schemaResultField+1)
            ]}
        )
    
    }

    function selectStudent(index) {
        var allStudents = [...studentsWithGrades];

        setBgColor(index);
        setSelectedStudent(allStudents[index]);
        setShowGradesModal(true);
    }

    async function saveInDatabase() {
        setUpdating('gradesmodal');

        var allStudents = [...studentsWithGrades];
    
        var studentId = selectedStudent.studentId;

        var studentIndex = allStudents.findIndex(f => {
            return f.studentId === studentId
        });

        var endDateMilliseconds = periods.period.endDate.seconds * 1000 + periods.period.endDate.nanoseconds / 1000000;
        var startDateMilliseconds = periods.period.startDate.seconds * 1000 + periods.period.startDate.nanoseconds / 1000000;
    
        if(!selectedStudent.gradeId) {
            await api.post('/studentsgrades', {
                studentUid: studentId,
                data: {
                    subjectId: subjects.subject.subjectId,
                    periodId: periods.period.periodId,
                    grades: selectedStudent.grades
                },
                classId: navigation.oneclass.classId,
                isBlocked: !(new Date(startDateMilliseconds) < new Date() && new Date(endDateMilliseconds) > new Date()),
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setStudentsWithGrades(
                    [
                        ...allStudents.slice(0,studentIndex),
                        Object.assign({}, allStudents[studentIndex], {gradeId: res.data.gradeId, ...selectedStudent}),
                        ...allStudents.slice(studentIndex+1)
                    ]
                );
                setError( { target: '', message: '' } );
                
                setShowGradesModal(false);
            }).catch(err => {
                setError( { target: 'grade', message: err.response.data.error } )
            })
    
        } else {
            await api.put('/studentsgrades', {
                gradeId: selectedStudent.gradeId,
                studentUid: studentId,
                data: {
                    subjectId: subjects.subject.subjectId,
                    periodId: periods.period.periodId,
                    grades: selectedStudent.grades
                },
                classId: navigation.oneclass.classId,
                isBlocked: !(new Date(startDateMilliseconds) < new Date() && new Date(endDateMilliseconds) > new Date()),
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(() => {
                setStudentsWithGrades(
                    [
                        ...allStudents.slice(0,studentIndex),
                        Object.assign({}, allStudents[studentIndex], selectedStudent),
                        ...allStudents.slice(studentIndex+1)
                    ]
                );
                setError( { target: '', message: '' } );
                
                setShowGradesModal(false);
            }).catch(err => {
                setError( { target: 'grade', message: err.response.data.error } )
            })
    
        }

        setUpdating('');
    }

    if(isLoading) {
        return <Loading />
    }

    if(error.target === 'loading') {
        return (
            <DivContainer>
                <Main>
                    <DivError show={true}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>
                </Main>
            </DivContainer>
        )
    }

    return (
        <DivContainer>
            <PeriodsModal idToken={props.idToken} show={showPeriodsModal} exit={() => setShowPeriodsModal(false)} />

            {/* Modal of selected student*/}
            <DivStudentModal show={showGradesModal}>
                <div className="main">
                    <FiX className="exit" size={30} onClick={() => setShowGradesModal(false)} />
                    <div className="title">
                        <h5>{selectedStudent.name}</h5>
                    </div>

                    <div className="body">
                        {periodSchema.map((item) => {
                            var schemaInStudent = selectedStudent.grades.find(f => {
                                return f.schemaId === item.schemaId
                            })

                            if(schemaInStudent === undefined) {
                                schemaInStudent = {value: ''}
                            }

                            return (
                                <div key={item.schemaId}>
                                    <h5>{item.name}</h5>
                                    <input
                                        type="text"
                                        value={schemaInStudent.value}
                                        onChange={(e) => changeStudentState(e.target.value, item)}
                                        className="inputGrades"
                                        readOnly={!(new Date(periods.period.startDate.seconds * 1000 + periods.period.startDate.nanoseconds / 1000000) < new Date() && new Date(periods.period.endDate.seconds * 1000 + periods.period.endDate.nanoseconds / 1000000) > new Date())}
                                    />
                                </div>
                            )
                        })}
                        
                        <h5>Matrícula: {selectedStudent.registration}</h5>

                        {!(new Date(periods.period.startDate.seconds * 1000 + periods.period.startDate.nanoseconds / 1000000) < new Date() && new Date(periods.period.endDate.seconds * 1000 + periods.period.endDate.nanoseconds / 1000000) > new Date()) &&
                            <h5 style={{color: '#ea4335'}}>O período está bloqueado!</h5>
                        }

                        <DivError show={error.target === 'grade'}>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>
                    </div>

                    <div className="bottom">

                        {updating ===  'gradesmodal' &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => saveInDatabase()}>
                            <h1>Salvar</h1>
                        </DivSave>

                        <DivCancel onClick={() => {
                            setShowGradesModal(false);
                            setError({ target: '', message: '' });
                        }}>
                            <h1>Cancelar</h1>
                        </DivCancel>
                    </div>
                </div>
            </DivStudentModal>

            <SubNavBar>
                    <DivTitleClass>
                        <H1TitleClass>
                            {navigation.oneclass.className}
                        </H1TitleClass>
                    </DivTitleClass>

                    {/*periods modal*/}

                    <DivNavButton onClick={() => setShowPeriodsModal(true)} >
                        <H1NavButton>Períodos</H1NavButton>
                        <FiCalendar size={20} />
                    </DivNavButton>
            </SubNavBar>

            <Main>

                <DivTitleBody>
                    <H1TitleBody>
                        {`${subjects.subject.subjectName} - ${periods.period.periodName}`}
                    </H1TitleBody>
                </DivTitleBody>

                <TableGrades>
                    <tbody>

                        <tr>

                            <th>Nome</th>

                            {periodSchema.map((item, index) => (
                                <th key={index}>{item.name}</th>
                            ))}
                            
                            <th>Matricula</th>

                        </tr>

                        {studentsWithGrades.map((item, index) => (

                            <Tr key={item.studentId} bgcolor={bgColor === index} onClick={() => selectStudent(index)}>

                                <td>{item.name}</td>

                                {periodSchema.map((subitem) => {
                                    var schemaInStudent = item.grades.find(f => {
                                        return f.schemaId === subitem.schemaId
                                    })

                                    if(schemaInStudent === undefined) {
                                        schemaInStudent = {value: ''}
                                    }

                                    return (
                                        <td key={subitem.schemaId}>
                                            <input
                                                type="text"
                                                value={schemaInStudent.value}
                                                onChange={(e) => changeStudentState(e.target.value, item.studentId, subitem)}
                                                readOnly={true}
                                            />
                                        </td>
                                    )
                                })}

                                <td>{item.registration}</td>

                            </Tr>

                        ))}

                    </tbody>
                </TableGrades>

            </Main>

        </DivContainer>
    )

}
