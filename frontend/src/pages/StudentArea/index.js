import React, { useEffect, useState } from 'react';
import {DivContainer, H1TitleClass, DivNav, DivOthers, TableReport, TableReportHeader, DivTitleBody, H1TitleBody, DivTableReport, DivError, DivTitleClass} from './style';
import {FiBarChart2, FiFileText, FiAlertTriangle} from 'react-icons/fi';
import {colors} from '../../styles';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import Charts from '../../components/Charts';
import Loading from '../../components/Loading';

export default function StudentArea(props) {
    const [showChart, setShowChart] = useState(false);
    const [studentWithGrades, setStudentWithGrades] = useState({});
    const [periodsModelNames, setPeriodsModelNames] = useState([]);
    const [periodsModel, setPeriodsModel] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [schoolInformation, setSchoolInformation] = useState({});
    const [isStudent, setIsStudent] = useState(null);
    const [error, setError] = useState('');
    const [studentStates, setStudentStates] = useState([]);

    const student = useSelector(state => state.student);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {

        try {

            var isStudent = props.idToken.claims.isStudent;
        
            var data = await api.get('/studentarea', {
                params: {
                    studentUid: !!isStudent ? '' : student.studentObject.studentId,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                return res.data;
            })

            handleState(data.schoolInfo, data.periods, data.subjects, data.studentInfo, isStudent, data.grades, data.states)

        } catch (err) {
            setError(err.response.data.error);
        }
    
    }

    function getSchemaNames(periodsArray) {
        //Cria variavel com apenas os nomes das notas q serão usadas no boletim
        var names = periodsArray.reduce((arrayFinal, item) => {
    
            let gradesSchema = [];
    
            for(let i = 0; i < item.gradesSchema.length; i++) {
                if(item.gradesSchema[i].showOnReport === true) {
                    gradesSchema.push({name: `${item.gradesSchema[i].name}`, schemaId: `${item.gradesSchema[i].schemaId}`})
                }
            }
    
            arrayFinal.push({
                periodName: item.periodName,
                periodId: item.periodId,
                gradesSchema
            })
    
            return arrayFinal
        }, [])
    
        setPeriodsModelNames(names);
    }


    function handleState(schoolInfo, periodsModel, subjects, studentInfo, isStudent, grades, states) {

        periodsModel = periodsModel.sort((a, b) => a.index - b.index); // put the periods in order

        studentInfo = {...studentInfo, grades};

        setSchoolInformation(schoolInfo);
        setPeriodsModel(periodsModel);
        setSubjects(subjects);
        setStudentWithGrades(studentInfo);
        setIsStudent(isStudent);
        setStudentStates(states);

        getSchemaNames(periodsModel);
    }

    if(isStudent === null) {
        return (
            <Loading/>
        )
    }

    if(error !== '') {
        return (
            <DivContainer>
                <DivError>
                    <FiAlertTriangle size={20} color="white"/>
                    <p>{error}</p>
                </DivError>
            </DivContainer>
        )
    }

    return (
        <DivContainer>

            <DivNav>

                <div style={{display: 'flex'}}>                   
                    
                    <DivTitleClass>
                        <H1TitleClass>
                            {studentWithGrades.className}
                        </H1TitleClass>
                    </DivTitleClass>

                    <DivOthers bgcolor={!showChart} onClick={() => setShowChart(false)}>
                        <h1>Boletim</h1>
                        <FiFileText size={20} color={colors.secondary} />
                    </DivOthers>

                    <DivOthers bgcolor={showChart} onClick={() => setShowChart(true)}>
                        <h1>Gráfico</h1>
                        <FiBarChart2 size={20} color={colors.secondary} />
                    </DivOthers>
                </div>

            </DivNav>

            <DivTitleBody>
                <H1TitleBody>
                    {studentWithGrades.name}
                </H1TitleBody>
            </DivTitleBody>

            {(subjects.length !== 0 && periodsModel.length !== 0) &&
                <div style={{display: showChart ? 'block' : 'none', width: '100%'}}>
                    <Charts subjects={subjects} studentsubjects={studentWithGrades.grades} periodsModel={periodsModel}/>
                </div>
            }

            <DivTableReport show={!showChart}>

                <div id="divtable">

                    <TableReportHeader style={{overflow: "auto", display: "block"}}>
                        <tbody style={{display: "inline-table", width: "100%"}}>

                            <tr>
                                <td colSpan="2">
                                    <strong>{schoolInformation.schoolName}</strong>
                                </td>
                            </tr>

                            {schoolInformation.extraInfo.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td colSpan="2">
                                            <strong>{item.title}:</strong> {item.value}
                                        </td>
                                    </tr>
                                )
                            })}
                            
                            <tr>
                                <td style={{padding: 5, border: '1px solid black'}}>
                                    <strong>Nome:</strong> {studentWithGrades.name}
                                </td>
                                <td style={{padding: 5, border: '1px solid black'}}>
                                    <strong>Matrícula:</strong> {studentWithGrades.registration}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <strong>Série:</strong> {studentWithGrades.classSeries}
                                </td>
                                <td>
                                    <strong>Turma:</strong> {studentWithGrades.className}
                                </td>
                            </tr>

                            {studentWithGrades.studentExtraInfo.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td colSpan="2">
                                            <strong>{item.title}:</strong> {item.value}
                                        </td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>

                    </TableReportHeader>

                    <TableReport className="tablebody" style={{overflow: "auto", display: "block"}}>

                        <tbody style={{display: "inline-table", width: "100%"}}>

                            <tr>
                                <th rowSpan="2">Disciplinas</th>

                                {periodsModelNames.map((item) => {

                                    return (
                                        <th key={item.periodId} colSpan={item.gradesSchema.length} rowSpan="1">{item.periodName}</th>
                                    )
                                    
                                })}

                                <th rowSpan="2">Situação</th>

                            </tr>

                            <tr>

                                {periodsModelNames.map((item) => {
                                    return item.gradesSchema.map((x, index) => (
                                        <th key={index}>{x.name}</th>
                                    ))
                                })}

                            </tr>

                            {subjects.map((item) => {
                                var findSubjectInStudent = studentWithGrades.grades.filter(f => {
                                    return f.subjectId === item.subjectId
                                })
                                
                                return (
                                    <tr key={item.subjectId}>
                                        <td>{item.subjectName}</td>
                                        {periodsModelNames.map((perioditem) => {
                                            var findPeriodInStudent = findSubjectInStudent.find(f => {
                                                return f.periodId === perioditem.periodId;
                                            })
                                            
                                            if(findPeriodInStudent !== undefined) {

                                                return perioditem.gradesSchema.map((schemaitem, index) => {
                                                    
                                                    var filteredSchemaInPeriodStudent = findPeriodInStudent.grades.find(f => {
                                                        return f.schemaId === schemaitem.schemaId;
                                                    })

                                                    if(!filteredSchemaInPeriodStudent) {
                                                        filteredSchemaInPeriodStudent = {value: ""}
                                                    }
                                                    
                                                    return (
                                                        <td key={index}>{filteredSchemaInPeriodStudent.value}</td>
                                                    )
                                                })
                                            } else {
                                                return perioditem.gradesSchema.map((schemaitem, index) => (
                                                    <td key={index}>{null}</td>
                                                ))
                                            }
                                        })}

                                        <td style={{textTransform: "uppercase"}}>
                                            <strong>{studentStates[item.subjectId]}</strong>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>

                    </TableReport>

                </div>

            </DivTableReport>

        </DivContainer>
    )

}
