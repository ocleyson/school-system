import React, { useEffect, useState } from 'react';
import { DivContainer, H1TitleBody, Input, DivSave, DivDelete, DivWithBorder, DivAdd, DivRemoveAbsolute, Main, H1Title, DivError, DivSpinner, DivScroll, DivScrollElement } from './style';
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsStudentsState(props) {
    const [classes, setClasses] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [studentsState, setStudentsState] = useState([]);
    const [error, setError] = useState({ target: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [newStudentState, setNewStudentState] = useState({
        periodsUsedToChangeState: [
            {classId: '', periodId: '', letter: 'a', gradeId: ''}
        ],
        periodsUsedToChangeStateArrayToQuery: [],
        orderOfPrecedence: '',
        state: '',
        conditional: '<',
        numberToCompare: '',
        priority: 0
    });

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {

        try {
            await api.get('/schoolclasses', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setClasses(res.data.schoolClassesData);
            })
    
            await api.get('/studentsstate', {
                params: {
                    classId: selectedClass
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setStudentsState(res.data.schoolStudentsStatesData);
            })
    
            await api.get('/schoolperiods', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setPeriods(res.data.allPeriods);
            })

        } catch (err) {
            setError({ target: 'loading', message: err.response.data.error });
        }

        setIsLoading(false);

    }

    function handleChange(e, index, subindex) {
        var studentsStateCopy = [...studentsState];
        var name = e.target.name;

        if(name === 'periodsUsedToChangeStateClass') {
            studentsStateCopy[index].periodsUsedToChangeState[subindex].classId = e.target.value;
        } else if(name === 'periodsUsedToChangeStatePeriod') {
            studentsStateCopy[index].periodsUsedToChangeState[subindex].periodId = e.target.value;
        } else if(name === 'periodsUsedToChangeStateGrade') {
            studentsStateCopy[index].periodsUsedToChangeState[subindex].gradeId = e.target.value;
        } else if(name === 'conditional') {
            studentsStateCopy[index][name] = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            studentsStateCopy[index][name] = e.target.value.toLowerCase();
        }  else if(name === 'state') {
            studentsStateCopy[index][name] = e.target.value.toLowerCase();
        } else if(name === 'numberToCompare' && e.target.value.match(/^[0-9]*$/i)) {
            studentsStateCopy[index][name] = e.target.value;
        } else if(name === 'priority' && e.target.value.match(/^[0-9]*$/i)) {
            studentsStateCopy[index][name] = Number(e.target.value);
        }

        setStudentsState(studentsStateCopy);

    }

    // add an element to periodsUsedToChangeState array in some element in studentsState state
    function addPeriodsUsedToChangeState(index) {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];
    
        var studentsStateCopy = [...studentsState];

        var findLetter = (i) => {
            return studentsStateCopy[index].periodsUsedToChangeState.find(f => {
                return f.letter === alphabet[i]
            })
        }
    
        for(var i in alphabet) {

            var find = findLetter(i);

            if(!find) {
                var numberOfElements = i
                break
            }

        }
    
        studentsStateCopy[index].periodsUsedToChangeState.push(
            {classId: '', periodId: '', letter: `${alphabet[numberOfElements]}`}
        )
    
        setStudentsState(studentsStateCopy);

    }

    // remove an element in periodsUsedToChangeState array in some element in studentsState state
    function removePeriodsUsedToChangeState(index, subindex) {
        var studentsStateCopy = [...studentsState];

        studentsStateCopy[index].periodsUsedToChangeState.splice(subindex, 1);

        setStudentsState(studentsStateCopy);

    }

    // handle change in newStudentState state
    function handleChangeNewStudentState(e, index) {
        var newStudentStateCopy = {...newStudentState};
        var name = e.target.name;

        if(name === 'periodsUsedToChangeStateClass') {
            newStudentStateCopy.periodsUsedToChangeState[index].classId = e.target.value;
        } else if(name === 'periodsUsedToChangeStatePeriod') {
            newStudentStateCopy.periodsUsedToChangeState[index].periodId = e.target.value;
        } else if(name === 'periodsUsedToChangeStateGrade') {
            newStudentStateCopy.periodsUsedToChangeState[index].gradeId = e.target.value;
        } else if(name === 'conditional') {
            newStudentStateCopy[name] = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            newStudentStateCopy[name] = e.target.value.toLowerCase();
        } else if(name === 'state') {
            newStudentStateCopy[name] = e.target.value.toLowerCase();
        } else if(name === 'numberToCompare' && e.target.value.match(/^[0-9]*$/i)) {
            newStudentStateCopy[name] = e.target.value;
        } else if(name === 'priority' && e.target.value.match(/^[0-9]*$/i)) {
            newStudentStateCopy[name] = Number(e.target.value);
        }

        setNewStudentState(newStudentStateCopy);

    }

    // add an element to periodsUsedToChangeState array in newStudentState state
    function addPeriodsUsedToChangeStateInNewStudentState() {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];

        var newStudentStateCopy = {...newStudentState};

        var findLetter = (i) => {
            return newStudentStateCopy.periodsUsedToChangeState.find(f => {
                return f.letter === alphabet[i]
            })
        }

        for(var i in alphabet) {

            var find = findLetter(i);

            if(!find) {
                var numberOfElements = i
                break
            }

        }

        newStudentStateCopy.periodsUsedToChangeState.push(
            {classId: '', periodId: '', letter: `${alphabet[numberOfElements]}`, gradeId: ''}
        )

        setNewStudentState(newStudentStateCopy);

    }

    // remove an element in periodsUsedToChangeState array in newStudentState state
    function removePeriodsUsedToChangeStateInNewStudentState(index) {
        var newStudentStateCopy = {...newStudentState};

        newStudentStateCopy.periodsUsedToChangeState.splice(index, 1);

        setNewStudentState(newStudentStateCopy);
    }

    async function saveInDataBase(data) {
        setUpdating(data.studentsStateId || 'newstudentsstate');

        data.periodsUsedToChangeStateArrayToQuery = data.periodsUsedToChangeState.map(item => {
            return item.periodId
        });

        data.classId = selectedClass;

        try {
            verify(data);

            if(data.studentsStateId) {

                await api.put('/studentsstates', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(() => {
                    setError({ target: '', message: '' });
                })

            } else {

                await api.post('/studentsstates', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    data.studentsStateId = res.data.studentsStateId

                    setStudentsState([data, ...studentsState]);

                    setNewStudentState({
                        periodsUsedToChangeState: [
                            {classId: '', periodId: '', letter: 'a', gradeId: ''}
                        ],
                        periodsUsedToChangeStateArrayToQuery: [],
                        orderOfPrecedence: '',
                        state: '',
                        conditional: '<',
                        numberToCompare: '',
                        priority: 0
                    });

                    setError({ target: '', message: '' });

                })

            }

        } catch (err) {
            var message = err.response ? err.response.data.error : err.message;

            setError({ target: data.studentsStateId || 'newstudentsstate', message });
        }

        setUpdating('');
    }

    async function deletestudentsState(studentsStateId) {
        setUpdating(studentsStateId);
        
        await api.delete('/studentsstates', {
            data: {
                studentsStateId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setStudentsState(studentsState.filter(item => item.studentsStateId !== studentsStateId))
        }).catch(err => {
            setError({ target: studentsStateId, message: err.response.data.error });
        })

        setUpdating('');
    }

    function verify(studentsStateItem) {

        var splitOrder = studentsStateItem.orderOfPrecedence.split(' ');

        splitOrder.map(item => {
            if(item.match(/^[+-/* ()0-9]*$/)) {
                // return something just to avoid an error
                return '';
            } else {
                var someLetter = studentsStateItem.periodsUsedToChangeState.some(s => {
                    return s.letter === item;
                })
    
                if(!someLetter) {
                    throw new Error(`A letra "${item}" não existe.`);
                } 
            }
            // return something just to avoid an error
            return '';
        })

        studentsStateItem.periodsUsedToChangeState.map(item => {

            var someLetter = splitOrder.some(s => {
                return s === item.letter;
            })

            if(studentsStateItem.periodsUsedToChangeState.length > 1 && !someLetter) {
                throw new Error(`A letra "${item.letter}" não consta na Ordem de Precedência.`);
            } else if(item.periodId === '') {
                throw new Error(`O período da letra "${item.letter}" deve ser selecionado!`);
            } else if(item.gradeId === '') {
                throw new Error(`Um campo para o período da letra "${item.letter}" deve ser selecionado!`);
            }

            // return something just to avoid an error
            return '';
        })

        if(studentsStateItem.state === '') {
            throw new Error('O Nome do Estado não pode ser vazio!');
        } else if(studentsStateItem.periodsUsedToChangeState.length === 0) {
            throw new Error('Pelo menos um período deve ser usado para alterar o estado!');
        } else if(studentsStateItem.numberToCompare === '') {
            throw new Error('Um número para comparação deve ser digitado!');
        }

        return;
    }

    async function selectClass(classId) {
        setSelectedClass(classId);
        setUpdating('newclass');

        await api.get('/studentsstate', {
            params: {
              classId,
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setStudentsState(res.data.schoolStudentsStatesData);
        }).catch(err => {
            setError( { target: 'loading', message: err.response.data.error } );
        })

        setUpdating('');
    }

    if(isLoading) {
        return (
            <Loading />
        )
    }

    if(error.target === 'loading') {
        return (
            <DivContainer>
                <Main>
                    <DivError>
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
                <H1Title>Estados dos Alunos</H1Title>
            </SubNavBar>

            <Main>

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

                {updating ===  'newclass' &&
                    <DivSpinner className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </DivSpinner>
                }

                <BlueContentContainer>
                    <H1TitleBody style={{marginBottom: 10}}>Criar Estado do Aluno.</H1TitleBody>

                    {/*THE CLASS AND THE PERIOD THAT WILL BE USE TO SET A STATE*/}
                    <H1TitleBody>Turma, Período e Campo:</H1TitleBody>

                    {newStudentState.periodsUsedToChangeState.map((item, index) => {

                        var periodsFiltered = periods.filter(f => {
                            return f.classId === item.classId
                        })

                        var grades = periods.find(f => {
                            return f.periodId === item.periodId
                        })

                        if(!grades) grades = {gradesSchema: []}

                        var classesFiltered = classes.filter(f => {
                            return f.classId === selectedClass
                        })

                        return (
                            <DivWithBorder key={index}>

                                <h1 style={{textTransform: "capitalize"}}>{item.letter}</h1>

                                <select value={item.classId} name="periodsUsedToChangeStateClass" onChange={(e) => handleChangeNewStudentState(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classesFiltered.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.periodId} name="periodsUsedToChangeStatePeriod" onChange={(e) => handleChangeNewStudentState(e, index)} style={{marginRight: 10}}>
                                    <option value=""></option>
                                    {periodsFiltered.map(period => (
                                        <option key={period.periodId} value={period.periodId}>{period.periodName}</option>
                                    ))}
                                </select>

                                <select value={item.gradeId} name="periodsUsedToChangeStateGrade" onChange={(e) => handleChangeNewStudentState(e, index)}>
                                    <option value=""></option>
                                    {grades["gradesSchema"].map(grade => (
                                        <option key={grade.schemaId} value={grade.schemaId}>{grade.name}</option>
                                    ))}
                                </select>

                                <DivRemoveAbsolute onClick={() => removePeriodsUsedToChangeStateInNewStudentState(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd style={{display: newStudentState.periodsUsedToChangeState.length === 26 ? 'none' : 'flex'}} onClick={() => addPeriodsUsedToChangeStateInNewStudentState()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    <H1TitleBody>Ordem de Precedência:</H1TitleBody>
                    <Input
                        type="text"
                        name="orderOfPrecedence"
                        placeholder="Ex.: ( a + b ) / 2"
                        value={newStudentState.orderOfPrecedence}
                        onChange={(e) => handleChangeNewStudentState(e)}
                    />

                    <p>* Coloque as letras separadas como no exemplo acima.</p>

                    <H1TitleBody>O resultado da Ordem de Precedência deverá ser:</H1TitleBody>
                    <select value={newStudentState.conditional} name="conditional" onChange={(e) => handleChangeNewStudentState(e)}>
                        <option value="<">Menor</option>
                        <option value=">">Maior</option>
                        <option value=">=">Maior ou igual</option>
                        <option value="<=">Menor ou igual</option>
                        <option value="==">Igual</option>
                    </select>
                    <H1TitleBody style={{display: 'inline-block', marginRight: 5, marginLeft: 5}}>que/a</H1TitleBody>
                    <Input
                        type="text"
                        name="numberToCompare"
                        placeholder="Ex.: 7"
                        value={newStudentState.numberToCompare}
                        onChange={(e) => handleChangeNewStudentState(e)}
                        style={{width: 70}}
                    />

                    <H1TitleBody>Nome do Estado:</H1TitleBody>
                    <Input
                        type="text"
                        name="state"
                        placeholder="Ex.: Aprovado, Reprovado, ..."
                        value={newStudentState.state}
                        onChange={(e) => handleChangeNewStudentState(e)}
                    />

                    <H1TitleBody>Prioridade do Estado:</H1TitleBody>
                    <Input
                        type="text"
                        name="priority"
                        placeholder="Ex.: 0, 1, ..."
                        value={newStudentState.priority}
                        onChange={(e) => handleChangeNewStudentState(e)}
                    />

                    <DivError style={{display: error.target === 'newstudentsstate' ? 'block' : 'none'}}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>

                    {updating ===  'newstudentsstate' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase(newStudentState)}>
                        <H1TitleBody>Criar</H1TitleBody>
                    </DivSave>
                </BlueContentContainer>

                {/*All studentsState elements*/}
                {studentsState.map((item, index) => (
                    <BlueContentContainer key={index}>

                        {/*THE CLASS AND THE period THAT WILL BE USE TO CHANGE OTHERS periods*/}
                        <H1TitleBody>Turma, Período e Campo:</H1TitleBody>

                        {item.periodsUsedToChangeState.map((subitem, subindex) => {

                            var periodsFiltered = periods.filter(f => {
                                return f.classId === subitem.classId
                            })

                            var grades = periods.find(f => {
                                return f.periodId === subitem.periodId
                            })
    
                            if(!grades) grades = {gradesSchema: []}

                            var classesFiltered = classes.filter(f => {
                                return f.classId === selectedClass
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <h1 style={{textTransform: "capitalize"}}>{subitem.letter}</h1>

                                    <select value={subitem.classId} name="periodsUsedToChangeStateClass" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value="">Todas</option>
                                        {classesFiltered.map(classes => (
                                            <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                        ))}
                                    </select>

                                    <select value={subitem.periodId} name="periodsUsedToChangeStatePeriod" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value=""></option>
                                        {periodsFiltered.map(period => (
                                            <option key={period.periodId} value={period.periodId}>{period.periodName}</option>
                                        ))}
                                    </select>

                                    <select value={subitem.gradeId} name="periodsUsedToChangeStateGrade" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value=""></option>
                                        {grades["gradesSchema"].map(grade => (
                                            <option key={grade.schemaId} value={grade.schemaId}>{grade.name}</option>
                                        ))}
                                    </select>

                                    <DivRemoveAbsolute onClick={() => removePeriodsUsedToChangeState(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd  style={{display: item.periodsUsedToChangeState.length === 26 ? 'none' : 'flex'}} onClick={() => addPeriodsUsedToChangeState(index)}>
                            <FiPlus size={22} color="white"/>
                        </DivAdd>

                        <H1TitleBody>Ordem de Precedência:</H1TitleBody>
                        <Input
                            type="text"
                            name="orderOfPrecedence"
                            placeholder="Ex.: ( a + b ) / 2"
                            value={item.orderOfPrecedence}
                            onChange={(e) => handleChange(e, index)}
                        />

                        <p>* Coloque as letras separadas como no exemplo acima.</p>

                        <H1TitleBody>O resultado da Ordem de Precedência deverá ser:</H1TitleBody>
                        <select value={item.conditional} name="conditional" onChange={(e) => handleChange(e, index)}>
                            <option value=">">Maior</option>
                            <option value="<">Menor</option>
                            <option value=">=">Maior ou igual</option>
                            <option value="<=">Menor ou igual</option>
                            <option value="==">Igual</option>
                        </select>
                        <H1TitleBody style={{display: 'inline-block', marginRight: 5, marginLeft: 5}}>que/a</H1TitleBody>
                        <Input
                            type="text"
                            name="numberToCompare"
                            placeholder="Ex.: 7"
                            value={item.numberToCompare}
                            onChange={(e) => handleChange(e, index)}
                            style={{width: 70}}
                        />

                        <H1TitleBody>Nome do Estado:</H1TitleBody>
                        <Input
                            type="text"
                            name="state"
                            placeholder="Ex.: Aprovado, Reprovado, ..."
                            value={item.state}
                            onChange={(e) => handleChange(e, index)}
                        />

                        <H1TitleBody>Prioridade do Estado:</H1TitleBody>
                        <Input
                            type="text"
                            name="priority"
                            placeholder="Ex.: 0, 1, ..."
                            value={item.priority}
                            onChange={(e) => handleChange(e, index)}
                        />

                        <DivError style={{display: error.target === item.studentsStateId ? 'block' : 'none'}}>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>

                        {updating ===  item.studentsStateId &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => saveInDataBase(item)}>
                            <H1TitleBody>Atualizar</H1TitleBody>
                        </DivSave>

                        <DivDelete onClick={() => deletestudentsState(item.studentsStateId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>

                    </BlueContentContainer>
                ))}

            </Main>

        </DivContainer>
    )

}
