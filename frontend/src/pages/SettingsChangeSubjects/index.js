import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {DivContainer, H1TitleBody, Input, DivSave, DivDelete, DivWithBorder, DivAdd, DivRemoveAbsolute, DivInterference, DivTitleSubNav, Main, H1Title, DivError, DivSpinner, DivScroll, DivScrollElement} from './style';
import {FiPlus, FiX, FiAlertTriangle} from 'react-icons/fi';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsChangeSubjects(props) {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [changeSubjects, setChangeSubjects] = useState([]);
    const [error, setError] = useState({ message: '', target: '' });
    const [newChangeSubject, setNewChangeSubject] = useState({
        subjectsToChange: [
            {classId: '', subjectId: '', conditional: ''}
        ],
        subjectsUsedToChange: [
            {classId: '', subjectId: '', letter: 'a'}
        ],
        subjectsUsedToChangeArrayToQuery: [],
        orderOfPrecedence: '',
        field: '',
    });
    const [updating, setUpdating] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');

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
    
            await api.get('/changesubject', {
                params: {
                    classId: selectedClass,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setChangeSubjects(res.data.schoolChangeSubjectsData);
            })
    
            await api.get('/schoolsubjects', {
                headers: {
                  authorization: props.idToken.token
                }
            }).then(res => {
                setSubjects(res.data.allSubjects);
            })

        } catch (err) {
            setError({ message: err.response.data.error, target: 'loading' });
        }

        setIsLoading(false);
    }

    function handleChange(e, index, subindex) {
        var changeSubjectCopy = [...changeSubjects];
        var name = e.target.name;

        if(name === 'subjectsToChangeClass') {
            changeSubjectCopy[index].subjectsToChange[subindex].classId = e.target.value;
        } else if(name === 'subjectsToChangeSubject') {
            changeSubjectCopy[index].subjectsToChange[subindex].subjectId = e.target.value;
        } else if(name === 'subjectsUsedToChangeClass') {
            changeSubjectCopy[index].subjectsUsedToChange[subindex].classId = e.target.value;
        } else if(name === 'subjectsUsedToChangeSubject') {
            changeSubjectCopy[index].subjectsUsedToChange[subindex].subjectId = e.target.value;
        } else if(name === 'conditional') {
            changeSubjectCopy[index].subjectsToChange[subindex].conditional = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            changeSubjectCopy[index][name] = e.target.value.toLowerCase();
        }  else if(name === 'field' && e.target.value.match(/^[A-Z]*$/i)) {
            changeSubjectCopy[index][name] = e.target.value.toLowerCase();
        }

        setChangeSubjects(changeSubjectCopy);
    }

    // add an element to subjectsToChange array in some element in changeSubjects state
    function addSubjectsToChange(index) {
        var changeSubjectCopy = [...changeSubjects];
        
        changeSubjectCopy[index].subjectsToChange.push(
            {classId: '', subjectId: '', conditional: ''}
        )

        setChangeSubjects(changeSubjectCopy);
    }

    // remove an element in subjectsToChange array in some element in changeSubjects state
    function removeSubjectsToChange(index, subindex) {
        var changeSubjectCopy = [...changeSubjects];
        
        changeSubjectCopy[index].subjectsToChange.splice(subindex, 1);
        
        setChangeSubjects(changeSubjectCopy);
    }

    // add an element to subjectsUsedToChange array in some element in changeSubjects state
    function addSubjectsUsedToChange(index) {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];
    
        var changeSubjectCopy = [...changeSubjects];

        var findLetter = (i) => {
            return changeSubjects[index].subjectsUsedToChange.find(f => {
                return f.letter === alphabet[i]
            })
        }
    
        for(var i in alphabet) {

            var find = findLetter(i)

            if(!find) {
                var numberOfElements = i
                break
            }

        }
    
        changeSubjectCopy[index].subjectsUsedToChange.push(
            {classId: '', subjectId: '', letter: `${alphabet[numberOfElements]}`}
        )
    
        setChangeSubjects(changeSubjectCopy);
    }

    // remove an element in subjectsUsedToChange array in some element in changeSubjects state
    function removeSubjectsUsedToChange(index, subindex) {
        var changeSubjectCopy = [...changeSubjects];

        changeSubjectCopy[index].subjectsUsedToChange.splice(subindex, 1);

        setChangeSubjects(changeSubjectCopy);
    }

    // handle change in newChangeSubject state
    function handleChangeNewChangeSubject(e, index) {
        var newChangeSubjectCopy = {...newChangeSubject};
        var name = e.target.name;

        if(name === 'subjectsToChangeClass') {
            newChangeSubjectCopy.subjectsToChange[index].classId = e.target.value;
        } else if(name === 'subjectsToChangeSubject') {
            newChangeSubjectCopy.subjectsToChange[index].subjectId = e.target.value;
        } else if(name === 'subjectsUsedToChangeClass') {
            newChangeSubjectCopy.subjectsUsedToChange[index].classId = e.target.value;
        } else if(name === 'subjectsUsedToChangeSubject') {
            newChangeSubjectCopy.subjectsUsedToChange[index].subjectId = e.target.value;
        } else if(name === 'conditional') {
            newChangeSubjectCopy.subjectsToChange[index].conditional = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            newChangeSubjectCopy[name] = e.target.value.toLowerCase();
        } else if(name === 'field' && e.target.value.match(/^[A-Z]*$/i)) {
            newChangeSubjectCopy[name] = e.target.value.toLowerCase();
        }

        setNewChangeSubject(newChangeSubjectCopy);
    }

    // add an element to subjectsToChange array in newChangeSubject state
    function addSubjectsToChangeInNewChangeSubject() {
        var newChangeSubjectCopy = {...newChangeSubject};

        newChangeSubjectCopy.subjectsToChange.push(
            {classId: '', subjectId: '', conditional: ''}
        )

        setNewChangeSubject(newChangeSubjectCopy);
    }

    // remove an element in subjectsToChange array in newChangeSubject state
    function removeSubjectsToChangeInNewChangeSubject(index) {
        var newChangeSubjectCopy = {...newChangeSubject};

        newChangeSubjectCopy.subjectsToChange.splice(index, 1);

        setNewChangeSubject(newChangeSubjectCopy);
    }

    // add an element to subjectsUsedToChange array in newChangeSubject state
    function addSubjectsUsedToChangeInNewChangeSubject() {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];

        var newChangeSubjectCopy = {...newChangeSubject};

        var findLetter = (i) => {
            return newChangeSubject.subjectsUsedToChange.find(f => {
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

        newChangeSubjectCopy.subjectsUsedToChange.push(
            {classId: '', subjectId: '', letter: `${alphabet[numberOfElements]}`}
        )

        setNewChangeSubject(newChangeSubjectCopy);
    }

    // remove an element in subjectsUsedToChange array in newChangeSubject state
    function removeSubjectsUsedToChangeInNewChangeSubject(index) {
        var newChangeSubjectCopy = {...newChangeSubject};

        newChangeSubjectCopy.subjectsUsedToChange.splice(index, 1);

        setNewChangeSubject(newChangeSubjectCopy);
    }

    async function saveInDataBase(data) {
        setUpdating(data.changeSubjectsId || 'newchangesubjects');

        data.subjectsUsedToChangeArrayToQuery = data.subjectsUsedToChange.map(item => {
            return item.subjectId
        });

        data.classId = selectedClass;

        try {
            data = await clean(data);
            verify(data);

            // if the data has an id, we update it
            if(data.changeSubjectsId) {

                await api.put('/changesubjects', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(() => {
                    setError({ message: '', target: '' });
                })

            } else { // if the data hasn't an id, we create it
 
                await api.post('/changesubjects', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    data.changeSubjectsId = res.data.changeSubjectsId
                    //add the new changeSubject element to the top of the changeSubjects state
                    setChangeSubjects([data, ...changeSubjects]);
                    // clean the newChangeSubject state
                    setNewChangeSubject({
                        subjectsToChange: [
                            {classId: '', subjectId: '', conditional: ''}
                        ],
                        subjectsUsedToChange: [
                            {classId: '', subjectId: '', letter: 'a'}
                        ],
                        subjectsUsedToChangeArrayToQuery: [],
                        orderOfPrecedence: '',
                        field: '',
                    });
                    setError({ message: '', target: '' });
                })

            }
        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError({ message, target: data.changeSubjectsId || 'newchangesubjects' });
        }

        setUpdating('');
    }

    async function deleteChangeSubjects(changeSubjectsId) {
        setUpdating(changeSubjectsId);
        
        await api.delete('/changesubjects', {
            data: {
                changeSubjectsId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setChangeSubjects(changeSubjects.filter(item => item.changeSubjectsId !== changeSubjectsId));
        }).catch(err => {
            setError({ message: err.response.data.error, target: changeSubjectsId })
        })

        setUpdating('');
    }

    function verify(changeSubjectsItem) {

        // the orderOfPrecedence of precedence is a string, we change it toa an array
        var splitOrder = changeSubjectsItem.orderOfPrecedence.split(' ');

        // check the array of the orderOfPrecedence to find a letter that is incorrect
        splitOrder.map(item => {
            if(item.match(/^[+-/* ()0-9]*$/)) {
                // return something just to avoid an error
                return '';
            } else {
                var someLetter = changeSubjectsItem.subjectsUsedToChange.some(s => {
                    return s.letter === item;
                })
    
                if(!someLetter) {
                    throw new Error(`A letra "${item}" não existe.`);
                } 
            }
            // return something just to avoid an error
            return '';
        })

        // get the array of the subjects used to change another subject(s) and check if there is a subject used to change useless
        changeSubjectsItem.subjectsUsedToChange.map(item => {

            var someLetter = splitOrder.some(s => {
                return s === item.letter;
            })

            if(changeSubjectsItem.subjectsUsedToChange.length > 1 && !someLetter) {
                throw new Error(`A letra "${item.letter}" não consta na Ordem de Precedência.`);
            }

            // return something just to avoid an error
            return '';
        })

        if(changeSubjectsItem.field === '') {
            throw new Error('O Nome do Campo não pode ser vazio!');
        } else if(changeSubjectsItem.subjectsToChange.length === 0) {
            throw new Error('Pelo menos uma matéria deve ser alterada!');
        } else if(changeSubjectsItem.subjectsUsedToChange.length === 0) {
            throw new Error('Pelo menos uma matéria deve ser usada para alteração!');
        }

        return;
    }

    function clean(data) {
        data.subjectsToChange = data.subjectsToChange.filter(f => {
            return f.subjectId !== ''
        });

        data.subjectsUsedToChange = data.subjectsUsedToChange.filter(f => {
            return f.subjectId !== ''
        });

        return data
    }

    async function selectClass(classId) {
        setSelectedClass(classId);
        setUpdating('newclass');

        await api.get('/changesubject', {
            params: {
              classId,
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setChangeSubjects(res.data.schoolChangeSubjectsData);
            // clean the newChangeSubject state
            setNewChangeSubject({
                subjectsToChange: [
                    {classId: '', subjectId: '', conditional: ''}
                ],
                subjectsUsedToChange: [
                    {classId: '', subjectId: '', letter: 'a'}
                ],
                subjectsUsedToChangeArrayToQuery: [],
                orderOfPrecedence: '',
                field: '',
            });
            setError({ message: '', target: '' });
        }).catch(err => {
            setError({ message: err.response.data.error, target: 'loading' });
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
                <H1Title>Interferência de Matérias</H1Title>
            </SubNavBar>

            <Main>

                {/*here we can access the subjects settings screen and vice versa*/}
                <DivInterference>

                    <Link to="/authenticated/settings/subjects">
                        <DivTitleSubNav>
                            <H1TitleBody>Geral</H1TitleBody>
                        </DivTitleSubNav>
                    </Link>

                    <DivTitleSubNav style={{borderLeft: '1px solid white'}}>
                        <H1TitleBody>Interferência</H1TitleBody>
                    </DivTitleSubNav>

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

                {updating ===  'newclass' &&
                    <DivSpinner className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </DivSpinner>
                }

                <BlueContentContainer>
                    <H1TitleBody>Criar Interferência de Matérias.</H1TitleBody>

                    {/*THE CLASS AND THE SUBJECT THAT WILL BE CHANGE*/}
                    <H1TitleBody>Turma, Condição e Matéria a ser alterada:</H1TitleBody>

                    {newChangeSubject.subjectsToChange.map((item, index) => {

                        var subjectsFiltered = subjects.filter(f => {
                            return f.classId === item.classId
                        })

                        var classesFiltered = classes.filter(f => {
                            return f.classId === selectedClass
                        })

                        return (
                            <DivWithBorder key={index}>

                                <select value={item.classId} name="subjectsToChangeClass" onChange={(e) => handleChangeNewChangeSubject(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classesFiltered.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.conditional} name="conditional" onChange={(e) => handleChangeNewChangeSubject(e, index)} style={{marginRight: 10}} >
                                    <option value=""></option>
                                    <option value=">">Maior</option>
                                    <option value="<">Menor</option>
                                    <option value=">=">Maior ou igual</option>
                                    <option value="<=">Menor ou igual</option>
                                    <option value="==">Igual</option>
                                </select>

                                <select value={item.subjectId} name="subjectsToChangeSubject" onChange={(e) => handleChangeNewChangeSubject(e, index)}>
                                    <option value=""></option>
                                    {subjectsFiltered.map(subjectsFiltered => (
                                        <option key={subjectsFiltered.subjectId} value={subjectsFiltered.subjectId}>{subjectsFiltered.subjectName}</option>
                                    ))}
                                </select>

                                <DivRemoveAbsolute onClick={() => removeSubjectsToChangeInNewChangeSubject(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd onClick={() => addSubjectsToChangeInNewChangeSubject()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    {/*THE CLASS AND THE SUBJECT THAT WILL BE USE TO CHANGE OTHERS SUBJECTS*/}
                    <H1TitleBody>Turma e Matéria que será usada para alteração:</H1TitleBody>

                    {newChangeSubject.subjectsUsedToChange.map((item, index) => {

                        var subjectsFiltered = subjects.filter(f => {
                            return f.classId === item.classId
                        })

                        var classesFiltered = classes.filter(f => {
                            return f.classId === selectedClass
                        })

                        return (
                            <DivWithBorder key={index}>

                                <h1 style={{textTransform: "capitalize"}}>{item.letter}</h1>

                                <select value={item.classId} name="subjectsUsedToChangeClass" onChange={(e) => handleChangeNewChangeSubject(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classesFiltered.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.subjectId} name="subjectsUsedToChangeSubject" onChange={(e) => handleChangeNewChangeSubject(e, index)}>
                                    <option value=""></option>
                                    {subjectsFiltered.map(subjectsFiltered => (
                                        <option key={subjectsFiltered.subjectId} value={subjectsFiltered.subjectId}>{subjectsFiltered.subjectName}</option>
                                    ))}
                                </select>

                                <DivRemoveAbsolute onClick={() => removeSubjectsUsedToChangeInNewChangeSubject(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd style={{display: newChangeSubject.subjectsUsedToChange.length === 26 ? 'none' : 'flex'}} onClick={() => addSubjectsUsedToChangeInNewChangeSubject()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    <H1TitleBody>Ordem de Precedência:</H1TitleBody>
                    <Input
                        type="text"
                        name="orderOfPrecedence"
                        placeholder="Ex.: ( a + b ) / 2"
                        value={newChangeSubject.orderOfPrecedence}
                        onChange={(e) => handleChangeNewChangeSubject(e)}
                    />

                    <p>* Coloque as letras separadas como no exemplo acima.</p>

                    <H1TitleBody>Nome do Campo:</H1TitleBody>
                    <Input
                        type="text"
                        name="field"
                        placeholder="Ex.: nota"
                        value={newChangeSubject.field}
                        onChange={(e) => handleChangeNewChangeSubject(e)}
                    />

                    <p>* O nome do Campo deve ser igual ao criado na configuração dos Períodos.</p>

                    {error.target === 'newchangesubjects' && 
                        <DivError>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>
                    }

                    {updating ===  'newchangesubjects' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase(newChangeSubject)}>
                        <H1TitleBody>Criar</H1TitleBody>
                    </DivSave>
                </BlueContentContainer>

                {/*All changeSubjects elements*/}
                {changeSubjects.map((item, index) => (
                    <BlueContentContainer key={index}>

                        {/*THE CLASS AND THE SUBJECT THAT WILL BE CHANGE*/}
                        <H1TitleBody>Turma, Condição e Matéria a ser alterada:</H1TitleBody>

                        {item.subjectsToChange.map((subitem, subindex) => {

                            var subjectsFiltered = subjects.filter(f => {
                                return f.classId === subitem.classId
                            })

                            var classesFiltered = classes.filter(f => {
                                return f.classId === selectedClass
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <select value={subitem.classId} name="subjectsToChangeClass" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value="">Todas</option>
                                        {classesFiltered.map(classes => (
                                            <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                        ))}
                                    </select>

                                    <select value={subitem.conditional} name="conditional" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}} >
                                        <option value=""></option>
                                        <option value=">">Maior</option>
                                        <option value="<">Menor</option>
                                        <option value=">=">Maior ou igual</option>
                                        <option value="<=">Menor ou igual</option>
                                        <option value="==">Igual</option>
                                    </select>

                                    <select value={subitem.subjectId} name="subjectsToChangeSubject" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value=""></option>
                                        {subjectsFiltered.map(subjectsFiltered => (
                                            <option key={subjectsFiltered.subjectId} value={subjectsFiltered.subjectId}>{subjectsFiltered.subjectName}</option>
                                        ))}
                                    </select>

                                    <DivRemoveAbsolute onClick={() => removeSubjectsToChange(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd onClick={() => addSubjectsToChange(index)}>
                            <FiPlus size={22} color="white"/>
                        </DivAdd>

                        {/*THE CLASS AND THE SUBJECT THAT WILL BE USE TO CHANGE OTHERS SUBJECTS*/}
                        <H1TitleBody>Turma e Matéria que será usada para alteração:</H1TitleBody>

                        {item.subjectsUsedToChange.map((subitem, subindex) => {

                            var subjectsFiltered = subjects.filter(f => {
                                return f.classId === subitem.classId
                            })

                            var classesFiltered = classes.filter(f => {
                                return f.classId === selectedClass
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <h1 style={{textTransform: "capitalize"}}>{subitem.letter}</h1>

                                    <select value={subitem.classId} name="subjectsUsedToChangeClass" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value="">Todas</option>
                                        {classesFiltered.map(classes => (
                                            <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                        ))}
                                    </select>

                                    <select value={subitem.subjectId} name="subjectsUsedToChangeSubject" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value=""></option>
                                        {subjectsFiltered.map(subjectsFiltered => (
                                            <option key={subjectsFiltered.subjectId} value={subjectsFiltered.subjectId}>{subjectsFiltered.subjectName}</option>
                                        ))}
                                    </select>

                                    <DivRemoveAbsolute onClick={() => removeSubjectsUsedToChange(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd  style={{display: item.subjectsUsedToChange.length === 26 ? 'none' : 'flex'}} onClick={() => addSubjectsUsedToChange(index)}>
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

                        <H1TitleBody>Nome do Campo:</H1TitleBody>
                        <Input
                            type="text"
                            name="field"
                            placeholder="Ex.: nota"
                            value={item.field}
                            onChange={(e) => handleChange(e, index)}
                        />

                        <p>* O nome do Campo deve ser igual ao criado na configuração dos Períodos.</p>

                        {error.target === item.changeSubjectsId && 
                            <DivError>
                                <FiAlertTriangle size={20} color="white"/>
                                <p>{error.message}</p>
                            </DivError>
                        }

                        {updating ===  item.changeSubjectsId &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => saveInDataBase(item)}>
                            <H1TitleBody>Atualizar</H1TitleBody>
                        </DivSave>

                        <DivDelete onClick={() => deleteChangeSubjects(item.changeSubjectsId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>
                    </BlueContentContainer>
                ))}
                
            </Main>

        </DivContainer>
    )

}
