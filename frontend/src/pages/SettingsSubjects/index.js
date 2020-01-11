import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {DivContainer, H1TitleBody, Input, DivSave, DivDelete, DivScroll, DivScrollElement, DivInterference, DivTitleInterference, Main, H1Title, DivError, DivSpinner, DivWithBorder, DivAdd, DivRemoveAbsolute} from './style';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import { FiAlertTriangle, FiX, FiPlus } from 'react-icons/fi';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsSubjects(props) {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newSubject, setNewSubject] = useState({
        subjectName: '',
        arrayOfOrdersOfPrecedence: []
    });
    const [selectedClass, setSelectedClass] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState( { target: '', message: '' } );
    const [updating, setUpdating] = useState('');
    const [allPeriods, setAllPeriods] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            await api.get('/schoolsubject', {
                params: {
                    classId: selectedClass,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setSubjects(res.data.allSubjects);
            })
        
            await api.get('/schoolclasses', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setClasses(res.data.schoolClassesData);
            })

            await api.get('/schoolperiods', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setAllPeriods(res.data.allPeriods);
            })

        } catch (err) {
            setError( { target: 'loading', message: err.response.data.error } );
        }
    
        setIsLoading(false);
    }

    function handleChange(e, subjectIndex, orderIndex) {
        var updatedClass = [...subjects];
        var name = e.target.name;

        if(name === 'class') {
            updatedClass[subjectIndex].arrayOfOrdersOfPrecedence[orderIndex].classId = e.target.value;
            // when change the class, set to all periods
            updatedClass[subjectIndex].arrayOfOrdersOfPrecedence[orderIndex].periodId = "";
        } else if(name === 'period') {
            updatedClass[subjectIndex].arrayOfOrdersOfPrecedence[orderIndex].periodId = e.target.value;
        } else if(name === 'order') {
            updatedClass[subjectIndex].arrayOfOrdersOfPrecedence[orderIndex].orderOfPrecedence = e.target.value;
        } else {
            updatedClass[subjectIndex][name] = e.target.value;
        }

        setSubjects(updatedClass);
    }

    function addOrders(subjectIndex) {
        var changeSubject = [...subjects];

        changeSubject[subjectIndex].arrayOfOrdersOfPrecedence.push(
            {classId: '', periodId: '', orderOfPrecedence: ''}
        )

        setSubjects(changeSubject);
    }

    function removeOrders(subjectIndex, orderIndex) {
        var changeSubject = [...subjects];

        changeSubject[subjectIndex].arrayOfOrdersOfPrecedence.splice(orderIndex, 1);

        setSubjects(changeSubject);
    }

    function handleChangeNewSubject(e, orderIndex) {
        var changeSubject = {...newSubject};
        var name = e.target.name;

        if(name === 'class') {
            changeSubject.arrayOfOrdersOfPrecedence[orderIndex].classId = e.target.value;
            // when change the class, set to all periods
            changeSubject.arrayOfOrdersOfPrecedence[orderIndex].periodId = "";
        } else if(name === 'period') {
            changeSubject.arrayOfOrdersOfPrecedence[orderIndex].periodId = e.target.value;
        } else if(name === 'order') {
            changeSubject.arrayOfOrdersOfPrecedence[orderIndex].orderOfPrecedence = e.target.value;
        } else {
            changeSubject[name] = e.target.value;
        }

        setNewSubject(changeSubject);
    }

    function addOrdersInNewSubject() {
        var changeSubject = {...newSubject};

        changeSubject.arrayOfOrdersOfPrecedence.push(
            {classId: '', periodId: '', orderOfPrecedence: ''}
        )

        setNewSubject(changeSubject);
    }

    function removeOrdersInNewSubject(orderIndex) {
        var changeSubject = {...newSubject};

        changeSubject.arrayOfOrdersOfPrecedence.splice(orderIndex, 1);

        setNewSubject(changeSubject);
    }

    function verify(data) {
        if(data.subjectName === '') throw new Error('Nenhum campo pode ficar em branco!');

        data.arrayOfOrdersOfPrecedence.map(item => {
            if(item.orderOfPrecedence === '') throw new Error('Nenhum campo pode ficar em branco!');

            return ''
        })
    }

    async function saveInDataBase(newSubject) {
        setUpdating('subject');
    
        try {
            verify(newSubject);

            await api.post('/schoolsubjects', {
                data: {classId: selectedClass, ...newSubject}
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setSubjects([{subjectId: res.data.subjectId, ...newSubject}, ...subjects]);
                setNewSubject({
                    subjectName: '',
                    arrayOfOrdersOfPrecedence: []
                });
                setError( { target: '', message: '' } );
            })

        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError( { target: 'subject', message } );
        }

        setUpdating('');
    
    }

    async function handleUpdate({subjectId, ...data}) {
        setUpdating(subjectId);

        try {
            verify(data);

            await api.put('/schoolsubjects', {
                subjectId,
                data
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(() => {
                setError( { target: '', message: '' } );
            })

        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError( { target: subjectId, message } );
        }

        setUpdating('');
    }

    async function deleteInDataBase(subjectId) {
        setUpdating(subjectId);
    
        await api.delete('/schoolsubjects', {
            data: {
                subjectId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            var copySubjects = [...subjects]
            setSubjects(copySubjects.filter(subject => subject.subjectId !== subjectId))
            setError( { target: '', message: '' } );
        }).catch(err => {
            setError( { target: subjectId, message: err.response.data.error } );
        })

        setUpdating('');
    }

    async function selectClass(classId) {
        setSelectedClass(classId);
        setUpdating('newclass');
    
        await api.get('/schoolsubject', {
            params: {
              classId,
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setSubjects(res.data.allSubjects)
        }).catch(err => {
            setError( { target: 'newclass', message: err.response.data.error } );
        })
    
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
            
            <SubNavBar>
                <H1Title>Matérias</H1Title>
            </SubNavBar>

            <Main>

                {/*here we can access the changeSubjects screen and vice versa*/}
                <DivInterference>
                    <DivTitleInterference style={{borderRight: '1px solid white'}}>
                        <H1TitleBody>Geral</H1TitleBody>
                    </DivTitleInterference>

                    <Link to="/authenticated/settings/changesubjects">
                        <DivTitleInterference>
                            <H1TitleBody>Interferência</H1TitleBody>
                        </DivTitleInterference>
                    </Link>

                </DivInterference>

                {/*scroll of classes*/}
                <H1TitleBody style={{color: '#000'}}>Turmas</H1TitleBody>

                <DivScroll>

                    <ul>

                        <li>
                            <DivScrollElement bgcolor={selectedClass === ''} onClick={() => selectClass('')}>
                                <h1>Todas</h1>
                            </DivScrollElement>
                        </li>

                        {classes.map((item) => (
                            <li key={item.classId}>
                                <DivScrollElement bgcolor={selectedClass === item.classId} onClick={() => selectClass(item.classId)}>

                                    <h1>{item.className}</h1>

                                </DivScrollElement>
                            </li>
                        ))}

                    </ul>

                </DivScroll>

                <BlueContentContainer>
                    <H1TitleBody>Criar Matéria:</H1TitleBody>
                    <Input
                        type="text"
                        name="subjectName"
                        placeholder="Matéria"
                        value={newSubject.subjectName}
                        onChange={(e) => handleChangeNewSubject(e)}
                    />

                    <H1TitleBody>Customizar Precedência:</H1TitleBody>

                    {newSubject.arrayOfOrdersOfPrecedence.map((item, index) => {

                        var periods = allPeriods.filter(f => {
                            return f.classId === item.classId || f.classId === ""
                        })

                        return (
                            <DivWithBorder key={index}>

                                <H1TitleBody>Turmas / Períodos:</H1TitleBody>

                                <select value={item.classId} name="class" onChange={(e) => handleChangeNewSubject(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classes.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.periodId} name="period" onChange={(e) => handleChangeNewSubject(e, index)}>
                                    <option value="">Todos</option>
                                    {periods.map(periods => (
                                        <option key={periods.periodId} value={periods.periodId}>{periods.periodName}</option>
                                    ))}
                                </select>

                                <H1TitleBody>Ordem de Precedência:</H1TitleBody>

                                <Input
                                    type="text"
                                    name="order"
                                    placeholder="Ex.: ( teste + prova ) / 2"
                                    value={item.orderOfPrecedence}
                                    onChange={(e) => handleChangeNewSubject(e, index)}
                                />

                                <DivRemoveAbsolute onClick={() => removeOrdersInNewSubject(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd onClick={() => addOrdersInNewSubject()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    <DivError show={error.target === 'subject'}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>

                    {updating === 'subject' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase(newSubject)}>
                        <H1TitleBody>Criar</H1TitleBody>
                    </DivSave>
                </BlueContentContainer>

                {/* when change the student class */}
                <DivError show={error.target === 'newclass'}>
                    <FiAlertTriangle size={20} color="white"/>
                    <p>{error.message}</p>
                </DivError>

                {updating === 'newclass' &&
                    <DivSpinner className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </DivSpinner>
                }

                {/* display all subjects */}
                {subjects.map((item, index) => (
                    <BlueContentContainer key={item.subjectId}>
                        <H1TitleBody>Matéria:</H1TitleBody>
                        <Input
                            type="text"
                            name="subjectName"
                            placeholder="Turma"
                            value={item.subjectName}
                            onChange={(e) => handleChange(e, index)}
                        />

                        <H1TitleBody>Customizar Precedência:</H1TitleBody>

                        {subjects[index].arrayOfOrdersOfPrecedence.map((orderItem, subindex) => {

                            var periods = allPeriods.filter(f => {
                                return f.classId === orderItem.classId || f.classId === ""
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <H1TitleBody>Turmas / Períodos:</H1TitleBody>

                                    <select value={orderItem.classId} name="class" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value="">Todas</option>
                                        {classes.map(classes => (
                                            <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                        ))}
                                    </select>

                                    <select value={orderItem.periodId} name="period" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value="">Todos</option>
                                        {periods.map(periods => (
                                            <option key={periods.periodId} value={periods.periodId}>{periods.periodName}</option>
                                        ))}
                                    </select>

                                    <H1TitleBody>Ordem de Precedência:</H1TitleBody>

                                    <Input
                                        type="text"
                                        name="order"
                                        placeholder="Ex.: ( teste + prova ) / 2"
                                        value={orderItem.orderOfPrecedence}
                                        onChange={(e) => handleChange(e, index, subindex)}
                                    />

                                    <DivRemoveAbsolute onClick={() => removeOrders(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd onClick={() => addOrders(index)}>
                            <FiPlus size={22} color="white"/>
                        </DivAdd>

                        <DivError show={error.target === item.subjectId}>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>

                        {updating === item.subjectId &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => handleUpdate(item)}>
                            <H1TitleBody>Atualizar</H1TitleBody>
                        </DivSave>

                        <DivDelete onClick={() => deleteInDataBase(item.subjectId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>
                    </BlueContentContainer>
                ))}

            </Main>

        </DivContainer>
    )

}

