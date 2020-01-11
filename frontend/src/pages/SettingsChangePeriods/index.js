import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {DivContainer, H1TitleBody, Input, DivSave, DivDelete, DivWithBorder, DivAdd, DivRemoveAbsolute, DivInterference, DivTitleSubNav, Main, H1Title, DivError, DivSpinner, DivScroll, DivScrollElement} from './style';
import {FiPlus, FiX, FiAlertTriangle} from 'react-icons/fi';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsChangePeriods(props) {
    const [classes, setClasses] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [changePeriods, setChangePeriods] = useState([]);
    const [error, setError] = useState({ message: '', target: '' });
    const [newChangePeriod, setNewChangePeriod] = useState({
        periodsToChange: [
            {classId: '', periodId: '', conditional: ''}
        ],
        periodsUsedToChange: [
            {classId: '', periodId: '', letter: 'a'}
        ],
        periodsUsedToChangeArrayToQuery: [],
        orderOfPrecedence: '',
        field: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState('');
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
    
            await api.get('/changeperiod', {
                params: {
                    classId: selectedClass,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setChangePeriods(res.data.schoolChangePeriodsData);
            })
    
            await api.get('/schoolperiods', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setPeriods(res.data.allPeriods);
            })

        } catch (err) {
            setError({ message: err.response.data.error, target: 'loading' });
        }

        setIsLoading(false);
    }

    function handleChange(e, index, subindex) {
        var changePeriodsCopy = [...changePeriods];
        var name = e.target.name;

        if(name === 'periodsToChangeClass') {
            changePeriodsCopy[index].periodsToChange[subindex].classId = e.target.value;
        } else if(name === 'periodsToChangePeriod') {
            changePeriodsCopy[index].periodsToChange[subindex].periodId = e.target.value;
        } else if(name === 'periodsUsedToChangeClass') {
            changePeriodsCopy[index].periodsUsedToChange[subindex].classId = e.target.value;
        } else if(name === 'periodsUsedToChangePeriod') {
            changePeriodsCopy[index].periodsUsedToChange[subindex].periodId = e.target.value;
        } else if(name === 'conditional') {
            changePeriodsCopy[index].periodsToChange[subindex].conditional = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            changePeriodsCopy[index][name] = e.target.value.toLowerCase();
        }  else if(name === 'field' && e.target.value.match(/^[A-Z]*$/i)) {
            changePeriodsCopy[index][name] = e.target.value.toLowerCase();
        }

        setChangePeriods(changePeriodsCopy);
    }

    // add an element to periodsToChange array in some element in changePeriods state
    function addPeriodsToChange(index) {
        var changePeriodsCopy = [...changePeriods];
        
        changePeriodsCopy[index].periodsToChange.push(
            {classId: '', periodId: '', conditional: ''}
        )

        setChangePeriods(changePeriodsCopy);
    }

    // remove an element in periodsToChange array in some element in changePeriods state
    function removePeriodsToChange(index, subindex) {
        var changePeriodsCopy = [...changePeriods];
        
        changePeriodsCopy[index].periodsToChange.splice(subindex, 1);

        setChangePeriods(changePeriodsCopy);
    }

    // add an element to periodsUsedToChange array in some element in changePeriods state
    function addPeriodsUsedToChange(index) {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];
    
        var changePeriodsCopy = [...changePeriods];

        var findLetter = (i) => {
            return changePeriodsCopy[index].periodsUsedToChange.find(f => {
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
    
        changePeriodsCopy[index].periodsUsedToChange.push(
            {classId: '', periodId: '', letter: `${alphabet[numberOfElements]}`}
        )
    
        setChangePeriods(changePeriodsCopy);
    }

    // remove an element in periodsUsedToChange array in some element in changePeriods state
    function removePeriodsUsedToChange(index, subindex) {
        var changePeriodsCopy = [...changePeriods];

        changePeriodsCopy[index].periodsUsedToChange.splice(subindex, 1);

        setChangePeriods(changePeriodsCopy);
    }

    // handle change in newChangePeriod state
    function handleChangeNewChangePeriod(e, index) {
        var newChangePeriodCopy = {...newChangePeriod};
        var name = e.target.name;

        if(name === 'periodsToChangeClass') {
            newChangePeriodCopy.periodsToChange[index].classId = e.target.value;
        } else if(name === 'periodsToChangePeriod') {
            newChangePeriodCopy.periodsToChange[index].periodId = e.target.value;
        } else if(name === 'periodsUsedToChangeClass') {
            newChangePeriodCopy.periodsUsedToChange[index].classId = e.target.value;
        } else if(name === 'periodsUsedToChangePeriod') {
            newChangePeriodCopy.periodsUsedToChange[index].periodId = e.target.value;
        } else if(name === 'conditional') {
            newChangePeriodCopy.periodsToChange[index].conditional = e.target.value;
        } else if(name === 'orderOfPrecedence' && e.target.value.match(/^[A-Z+-/* ()0-9]*$/i)) {
            newChangePeriodCopy[name] = e.target.value.toLowerCase();
        } else if(name === 'field' && e.target.value.match(/^[A-Z]*$/i)) {
            newChangePeriodCopy[name] = e.target.value.toLowerCase();
        }

        setNewChangePeriod(newChangePeriodCopy);
    }

    // add an element to periodsToChange array in newChangePeriod state
    function addPeriodsToChangeInNewChangePeriod() {
        var newChangePeriodCopy = {...newChangePeriod};

        newChangePeriodCopy.periodsToChange.push(
            {classId: '', periodId: '', conditional: ''}
        )

        setNewChangePeriod(newChangePeriodCopy);
    }

    // remove an element in periodsToChange array in newChangePeriod state
    function removePeriodsToChangeInNewChangePeriod(index) {
        var newChangePeriodCopy = {...newChangePeriod};

        newChangePeriodCopy.periodsToChange.splice(index, 1);

        setNewChangePeriod(newChangePeriodCopy);
    }

    // add an element to periodsUsedToChange array in newChangePeriod state
    function addPeriodsUsedToChangeInNewChangePeriod() {
        var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];

        var newChangePeriodCopy = {...newChangePeriod};

        var findLetter = (i) => {
            return newChangePeriodCopy.periodsUsedToChange.find(f => {
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

        newChangePeriodCopy.periodsUsedToChange.push(
            {classId: '', periodId: '', letter: `${alphabet[numberOfElements]}`}
        )

        setNewChangePeriod(newChangePeriodCopy);
    }

    // remove an element in periodsUsedToChange array in newChangePeriod state
    function removePeriodsUsedToChangeInNewChangePeriod(index) {
        var newChangePeriodCopy = {...newChangePeriod};

        newChangePeriodCopy.periodsUsedToChange.splice(index, 1);

        setNewChangePeriod(newChangePeriodCopy);
    }

    async function saveInDataBase(data) {
        setUpdating(data.changePeriodsId || 'newchangeperiods');

        data.periodsUsedToChangeArrayToQuery = data.periodsUsedToChange.map(item => {
            return item.periodId
        });

        data.classId = selectedClass;

        try {
            data = await clean(data);
            verify(data);
            
            if(data.changePeriodsId) {

                await api.put('/changeperiods', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(() => {
                    setError({ message: '', target: '' });
                })

            } else {

                await api.post('/changeperiods', {
                    data
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    data.changePeriodsId = res.data.changePeriodsId
                    //add the new changeperiod element to the top of the changePeriods state
                    setChangePeriods([data, ...changePeriods]);
                    // clean the newChangePeriod state
                    setNewChangePeriod({
                        periodsToChange: [
                            {classId: '', periodId: '', conditional: ''}
                        ],
                        periodsUsedToChange: [
                            {classId: '', periodId: '', letter: 'a'}
                        ],
                        periodsUsedToChangeArrayToQuery: [],
                        orderOfPrecedence: '',
                        field: '',
                    });
                    setError({ message: '', target: '' });
                })

            }
        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError({ message, target: data.changePeriodsId || 'newchangeperiods' });
        }

        setUpdating('');

    }

    async function deleteChangePeriods(changePeriodsId) {
        setUpdating(changePeriodsId);

        await api.delete('/changeperiods', {
            data: {
                changePeriodsId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setChangePeriods(changePeriods.filter(item => item.changePeriodsId !== changePeriodsId));
        }).catch(error => {
            setError({ message: error.response.data.error, target: changePeriodsId});
        })

        setUpdating('');

    }

    function verify(changePeriodsItem) {

        var splitOrder = changePeriodsItem.orderOfPrecedence.split(' ');

        splitOrder.map(item => {
            if(item.match(/^[+-/* ()0-9]*$/)) {
                // return something just to avoid an error
                return '';
            } else {
                var someLetter = changePeriodsItem.periodsUsedToChange.some(s => {
                    return s.letter === item;
                })
    
                if(!someLetter) {
                    throw new Error(`A letra "${item}" não existe.`);
                } 
            }
            // return something just to avoid an error
            return '';
        })

        // get the array of the periods used to change another period(s) and check if there is a period used to change useless
        changePeriodsItem.periodsUsedToChange.map(item => {

            var someLetter = splitOrder.some(s => {
                return s === item.letter;
            })

            if(changePeriodsItem.periodsUsedToChange.length > 1 && !someLetter) {
                throw new Error(`A letra "${item.letter}" não consta na Ordem de Precedência.`);
            }

            // return something just to avoid an error
            return '';
        })

        if(changePeriodsItem.field === '') {
            throw new Error('O Nome do Campo não pode ser vazio!');
        } else if(changePeriodsItem.periodsToChange.length === 0) {
            throw new Error('Pelo menos um período deve ser alterado!');
        } else if(changePeriodsItem.periodsUsedToChange.length === 0) {
            throw new Error('Pelo menos um período deve ser usado para alteração!');
        }

        return;
    }

    function clean(data) {
        data.periodsToChange = data.periodsToChange.filter(f => {
            return f.periodId !== ''
        });

        data.periodsUsedToChange = data.periodsUsedToChange.filter(f => {
            return f.periodId !== ''
        });

        return data
    }

    async function selectClass(classId) {
        setSelectedClass(classId);
        setUpdating('newclass');

        await api.get('/changeperiod', {
            params: {
              classId,
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setChangePeriods(res.data.schoolChangePeriodsData);
            // clean the newChangePeriod state
            setNewChangePeriod({
                periodsToChange: [
                    {classId: '', periodId: '', conditional: ''}
                ],
                periodsUsedToChange: [
                    {classId: '', periodId: '', letter: 'a'}
                ],
                periodsUsedToChangeArrayToQuery: [],
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
                <H1Title>Interferência de Períodos</H1Title>
            </SubNavBar>

            <Main>

                {/*here we can access the periods settings screen and vice versa*/}
                <DivInterference>
                    
                    <Link to="/authenticated/settings/periods">
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
                    <H1TitleBody>Criar Interferência de Períodos.</H1TitleBody>

                    {/*THE CLASS AND THE PERIOD THAT WILL BE CHANGE*/}
                    <H1TitleBody>Turma, Condição e Período a ser alterado:</H1TitleBody>

                    {newChangePeriod.periodsToChange.map((item, index) => {

                        var periodsFiltered = periods.filter(f => {
                            return f.classId === item.classId
                        })

                        var classesFiltered = classes.filter(f => {
                            return f.classId === selectedClass
                        })

                        return (
                            <DivWithBorder key={index}>

                                <select value={item.classId} name="periodsToChangeClass" onChange={(e) => handleChangeNewChangePeriod(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classesFiltered.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.conditional} name="conditional" onChange={(e) => handleChangeNewChangePeriod(e, index)} style={{marginRight: 10}}>
                                    <option value=""></option>
                                    <option value=">">Maior</option>
                                    <option value="<">Menor</option>
                                    <option value=">=">Maior ou igual</option>
                                    <option value="<=">Menor ou igual</option>
                                    <option value="==">Igual</option>
                                </select>

                                <select value={item.periodId} name="periodsToChangePeriod" onChange={(e) => handleChangeNewChangePeriod(e, index)}>
                                    <option value=""></option>
                                    {periodsFiltered.map(periodsFiltered => (
                                        <option key={periodsFiltered.periodId} value={periodsFiltered.periodId}>{periodsFiltered.periodName}</option>
                                    ))}
                                </select>

                                <DivRemoveAbsolute onClick={() => removePeriodsToChangeInNewChangePeriod(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd onClick={() => addPeriodsToChangeInNewChangePeriod()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    {/*THE CLASS AND THE period THAT WILL BE USE TO CHANGE OTHERS periods*/}
                    <H1TitleBody>Turma e Período que será usado para alteração:</H1TitleBody>

                    {newChangePeriod.periodsUsedToChange.map((item, index) => {

                        var periodsFiltered = periods.filter(f => {
                            return f.classId === item.classId
                        })

                        var classesFiltered = classes.filter(f => {
                            return f.classId === selectedClass
                        })

                        return (
                            <DivWithBorder key={index}>

                                <h1 style={{textTransform: "capitalize"}}>{item.letter}</h1>

                                <select value={item.classId} name="periodsUsedToChangeClass" onChange={(e) => handleChangeNewChangePeriod(e, index)} style={{marginRight: 10}}>
                                    <option value="">Todas</option>
                                    {classesFiltered.map(classes => (
                                        <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                    ))}
                                </select>

                                <select value={item.periodId} name="periodsUsedToChangePeriod" onChange={(e) => handleChangeNewChangePeriod(e, index)}>
                                    <option value=""></option>
                                    {periodsFiltered.map(periodsFiltered => (
                                        <option key={periodsFiltered.periodId} value={periodsFiltered.periodId}>{periodsFiltered.periodName}</option>
                                    ))}
                                </select>

                                <DivRemoveAbsolute onClick={() => removePeriodsUsedToChangeInNewChangePeriod(index)}>
                                    <FiX size={22} color="white"/>
                                </DivRemoveAbsolute>

                            </DivWithBorder>
                        )
                    })}

                    <DivAdd style={{display: newChangePeriod.periodsUsedToChange.length === 26 ? 'none' : 'flex'}} onClick={() => addPeriodsUsedToChangeInNewChangePeriod()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    <H1TitleBody>Ordem de Precedência:</H1TitleBody>
                    <Input
                        type="text"
                        name="orderOfPrecedence"
                        placeholder="Ex.: ( a + b ) / 2"
                        value={newChangePeriod.orderOfPrecedence}
                        onChange={(e) => handleChangeNewChangePeriod(e)}
                    />

                    <p>* Coloque as letras separadas como no exemplo acima.</p>

                    <H1TitleBody>Nome do Campo:</H1TitleBody>
                    <Input
                        type="text"
                        name="field"
                        placeholder="Ex.: nota"
                        value={newChangePeriod.field}
                        onChange={(e) => handleChangeNewChangePeriod(e)}
                    />

                    <p>* O nome do Campo deve ser igual ao criado na configuração dos Períodos.</p>

                    {error.target === 'newchangeperiods' && 
                        <DivError>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>
                    }

                    {updating ===  'newchangeperiods' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase(newChangePeriod)}>
                        <H1TitleBody>Criar</H1TitleBody>
                    </DivSave>
                </BlueContentContainer>

                {/*All changePeriods elements*/}
                {changePeriods.map((item, index) => (
                    <BlueContentContainer key={index}>

                        {/*THE CLASS AND THE period THAT WILL BE CHANGE*/}
                        <H1TitleBody>Turma, Condição e Período a ser alterado:</H1TitleBody>

                        {item.periodsToChange.map((subitem, subindex) => {

                            var periodsFiltered = periods.filter(f => {
                                return f.classId === subitem.classId
                            })

                            var classesFiltered = classes.filter(f => {
                                return f.classId === selectedClass
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <select value={subitem.classId} name="periodsToChangeClass" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
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

                                    <select value={subitem.periodId} name="periodsToChangePeriod" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value=""></option>
                                        {periodsFiltered.map(periodsFiltered => (
                                            <option key={periodsFiltered.periodId} value={periodsFiltered.periodId}>{periodsFiltered.periodName}</option>
                                        ))}
                                    </select>

                                    <DivRemoveAbsolute onClick={() => removePeriodsToChange(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd onClick={() => addPeriodsToChange(index)}>
                            <FiPlus size={22} color="white"/>
                        </DivAdd>

                        {/*THE CLASS AND THE period THAT WILL BE USE TO CHANGE OTHERS periods*/}
                        <H1TitleBody>Turma e Período que será usado para alteração:</H1TitleBody>

                        {item.periodsUsedToChange.map((subitem, subindex) => {

                            var periodsFiltered = periods.filter(f => {
                                return f.classId === subitem.classId
                            })

                            var classesFiltered = classes.filter(f => {
                                return f.classId === selectedClass
                            })

                            return (
                                <DivWithBorder key={subindex}>

                                    <h1 style={{textTransform: "capitalize"}}>{subitem.letter}</h1>

                                    <select value={subitem.classId} name="periodsUsedToChangeClass" onChange={(e) => handleChange(e, index, subindex)} style={{marginRight: 10}}>
                                        <option value="">Todas</option>
                                        {classesFiltered.map(classes => (
                                            <option key={classes.classId} value={classes.classId}>{classes.className}</option>
                                        ))}
                                    </select>

                                    <select value={subitem.periodId} name="periodsUsedToChangePeriod" onChange={(e) => handleChange(e, index, subindex)}>
                                        <option value=""></option>
                                        {periodsFiltered.map(periodsFiltered => (
                                            <option key={periodsFiltered.periodId} value={periodsFiltered.periodId}>{periodsFiltered.periodName}</option>
                                        ))}
                                    </select>

                                    <DivRemoveAbsolute onClick={() => removePeriodsUsedToChange(index, subindex)}>
                                        <FiX size={22} color="white"/>
                                    </DivRemoveAbsolute>

                                </DivWithBorder>
                            )
                        })}

                        <DivAdd  style={{display: item.periodsUsedToChange.length === 26 ? 'none' : 'flex'}} onClick={() => addPeriodsUsedToChange(index)}>
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

                        {error.target === item.changePeriodsId && 
                            <DivError>
                                <FiAlertTriangle size={20} color="white"/>
                                <p>{error.message}</p>
                            </DivError>
                        }

                        {updating === item.changePeriodsId &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => saveInDataBase(item)}>
                            <H1TitleBody>Atualizar</H1TitleBody>
                        </DivSave>

                        <DivDelete onClick={() => deleteChangePeriods(item.changePeriodsId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>
                    </BlueContentContainer>
                ))}

            </Main>

        </DivContainer>
    )

}
