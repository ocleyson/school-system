import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {DivContainer, H1TitleBody, Input, DivSave, Label, DivAdd, DivRemove, DivInputFields, InputFromSchema, DivContainerField, DivError, DivScroll, DivScrollElement, DivDelete, DivInterference, DivTitleSubNav, Main, H1Title, DivSpinner} from './style';
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi';
import { FaGripVertical } from 'react-icons/fa';
import api from '../../services/api';
import { loadFirebase } from '../../services/db';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function SettingsPeriods(props) {
    const [error, setError] = useState({ message: '', target: null });
    const [selectedClass, setSelectedClass] = useState('');
    const [schemaIdOfResultField, setSchemaIdOfResultField] = useState('');
    const [classes, setClasses] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState({
        periodName: '',
        periodId: '',
        orderOfPrecedence: '',
        gradesSchema: [
            {name: '', showOnReport: false, schemaId: (Math.random()*1e25).toString(36)},
        ],
        index: 0,
        endDate: loadFirebase().firestore.Timestamp.fromDate(new Date(new Date().getFullYear(), 12, 0)),
        startDate: loadFirebase().firestore.Timestamp.fromDate(new Date(new Date().getFullYear(), 0, 1))
    });
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {

        try {

            await api.get('/schoolperiod', {
                params: {
                    classId: selectedClass,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                var allPeriods = res.data.allPeriods;
                allPeriods.sort((a, b) => a.index - b.index);
                setPeriods(res.data.allPeriods);
            })
        
            await api.get('/schoolclasses', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setClasses(res.data.schoolClassesData);
            })
    
        } catch (error) {
            setError({ message: error.response.data.error, target: 'loading' });
        }
    
        setIsLoading(false);
    }

    function clearPeriod() {
        var objectModelOfPeriod = {
            periodName: '',
            periodId: '',
            orderOfPrecedence: '',
            gradesSchema: [
                {name: '', showOnReport: false, schemaId: (Math.random()*1e25).toString(36)},
            ],
            index: 0,
            endDate: loadFirebase().firestore.Timestamp.fromDate(new Date(new Date().getFullYear(), 12, 0)),
            startDate: loadFirebase().firestore.Timestamp.fromDate(new Date(new Date().getFullYear(), 0, 1))
        }

        setSelectedPeriod(objectModelOfPeriod);
        setError({ message: '', target: null });
    }

    function changePeriodName(e) {
        var newPeriodName;
        newPeriodName = {...selectedPeriod};
        newPeriodName.periodName = e;
        setSelectedPeriod(newPeriodName);
    }

    function changeSchema(e, schemaId) {
        var newSchema;
        newSchema = {...selectedPeriod};
    
        var index = newSchema.gradesSchema.findIndex(f => {
            return f.schemaId === schemaId
        });
    
        if(e.match(/^[A-Z]*$/i)) {
            newSchema.gradesSchema[index].name = e.toLowerCase();
            setSelectedPeriod(newSchema);
        } else {
            return
        }
    }

    function changeInputCheck(e, schemaId) {
        var name = e.target.name;
        var newSchema;
        newSchema = {...selectedPeriod};

        var index = newSchema.gradesSchema.findIndex(f => {
            return f.schemaId === schemaId
        });
    
        newSchema.gradesSchema[index][name] = e.target.checked;
    
        setSelectedPeriod(newSchema);
    }

    function selectResultField(e) {
        var newSchema;
        newSchema = {...selectedPeriod};
    
        var index = newSchema.gradesSchema.findIndex(f => {
            return f.schemaId === e.target.value
        })
    
        var findResultField = newSchema.gradesSchema.findIndex(f => {
            return f.resultField === true
        })
    
        if(findResultField !== -1 && e.target.value !== "") {
            //newSchema.gradesSchema[findResultField].resultField = false
            delete newSchema.gradesSchema[findResultField].resultField
            newSchema.gradesSchema[index].resultField = true
        } else if(e.target.value === "") {
            try {
                //newSchema.gradesSchema[findResultField].resultField = false
                delete newSchema.gradesSchema[findResultField].resultField
            } catch {}
        } else {
            newSchema.gradesSchema[index].resultField = true
        }
    
        setSelectedPeriod(newSchema);
        setSchemaIdOfResultField(e.target.value);
    }

    function changeOrder(e) {
        if(e.match(/^[A-Z+-/* ()0-9]*$/i)){
            var newOrder;
            newOrder = {...selectedPeriod};
            newOrder.orderOfPrecedence = e.toLowerCase();
            setSelectedPeriod(newOrder);
        } else {
            return
        }
    }

    function changeIndex(e) {
        if(e.match(/^[0-9]*$/i)){
            var newIndex;
            newIndex = {...selectedPeriod};
            newIndex.index = Number(e);
            setSelectedPeriod(newIndex);
        } else {
            return
        }
    }

    function addInState(name) {
        var newSelectedPeriod;
        newSelectedPeriod = {...selectedPeriod};
        if(name === 'gradesSchema') {
            newSelectedPeriod.gradesSchema.push({
                name: '', showOnReport: false, schemaId: (Math.random()*1e25).toString(36)
            });
        }
        setSelectedPeriod(newSelectedPeriod);
    }

    function removeInState(index, name) {
        var newSelectedPeriod;
        newSelectedPeriod = {...selectedPeriod};
        if(name === 'gradesSchema') {
            newSelectedPeriod.gradesSchema.splice(index, 1);
        }
        setSelectedPeriod(newSelectedPeriod);
    }

    function verify() {

        var currentPeriod = {...selectedPeriod};
    
        var splitOrder = currentPeriod.orderOfPrecedence.split(' ');
    
        var eachOnReport = currentPeriod.gradesSchema.filter(f => {
            return f.showOnReport === true;
        });
    
        var someField = currentPeriod.gradesSchema.some(s => {
            return s.name !== ''
        });
    
        var someResultField = currentPeriod.gradesSchema.some(s => {
            return s.resultField === true
        });
    
        splitOrder.map(item => {
            if(item.match(/^[+-/* ()0-9]*$/)) {
                // return something just to avoid an error
                return '';
            } else {
                var someName = currentPeriod.gradesSchema.some(s => {
                    return s.name === item;
                })
    
                var someOrderAsResultField = currentPeriod.gradesSchema.some(s => {
                    return s.name === item && s.resultField === true
                })
    
                if(!someName) {
                    throw new Error(`O Campo "${item}" não existe.`);
                } else if(someOrderAsResultField) {
                    throw new Error(`O Campo de Resultado "${item}" não pode estar na Ordem de Precedência.`);
                }
            }
    
            // return something just to avoid an error
            return '';
        })
    
        if(currentPeriod.periodName === '') {
            throw new Error('Um nome para o Período precisa ser digitado.');
        } else if(!someField) {
            throw new Error('Pelo menos um Campo deve constar em um Período.');
        } else if(eachOnReport.length === 0) {
            throw new Error('Pelo menos um Campo deve constar no Boletim.');
        } else if(currentPeriod.orderOfPrecedence !== '' && !someResultField) {
            throw new Error('Um Campo de Resultado precisa ser selecionado.');
        } else if(currentPeriod.orderOfPrecedence === '' && someResultField) {
            throw new Error('Uma Ordem de Precedência precisa ser definida.');
        }

        return;
    }

    function clean() {
        var selectedPeriodSchemaCopy = {...selectedPeriod};

        selectedPeriodSchemaCopy.gradesSchema = selectedPeriodSchemaCopy.gradesSchema.filter(f => {
            return f.name !== ''
        })

        setSelectedPeriod(selectedPeriodSchemaCopy);
    }

    function selectPeriod(period) {
        var schemaIdWithResultField = period.gradesSchema.find(f => {
            return f.resultField === true
        })
    
        if(schemaIdWithResultField) {
            setSchemaIdOfResultField(schemaIdWithResultField.schemaId);
        }
    
        setError({ message: '', target: null });
        setSelectedPeriod(period);
    }

    async function selectClass(classId) {
        setUpdating('outside');

        await api.get('/schoolperiod', {
            params: {
                classId,
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setPeriods(res.data.allPeriods);
        }).catch(error => {
            setError({ message: error.response.data.error, target: 'loading' });
        })
        
        clearPeriod();
        setSelectedClass(classId);

        setUpdating(null);
    }

    async function saveInDataBase() {
        setUpdating(selectedPeriod.periodId);

        try {
            verify();
            clean();

            var selectedPeriodCopy = {...selectedPeriod};
            if(selectedPeriodCopy.periodId === "") {

                await api.post('/schoolperiods', {
                    data: {classId: selectedClass, ...selectedPeriodCopy}
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    var newPeriod = selectedPeriodCopy;
                    newPeriod.periodId = res.data.periodId;
                    setPeriods([...periods, newPeriod]);
                    setError({ message: '', target: null });
                })
    
                clearPeriod()
            } else {
    
                await api.put('/schoolperiods', {
                    periodId: selectedPeriodCopy.periodId,
                    data: selectedPeriodCopy
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(() => {
                    setError({ message: '', target: null });
                })
    
            }
        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError({ message, target: selectedPeriod.periodId });
        }

        setUpdating(null);
    }

    async function deletePeriodInDataBase(periodId) {
        setUpdating(periodId);

        await api.delete('/schoolperiods', {
            data: {
                periodId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setPeriods(periods.filter(periods => periods.periodId !== periodId));
        }).catch(error => {
            setError({ message: error.response.data.error, target: periodId });
        })
    
        clearPeriod();

        setUpdating(null);
    }

    function handleEndDate(date) {
        var newSelectedPeriod = {...selectedPeriod};

        newSelectedPeriod.endDate = loadFirebase().firestore.Timestamp.fromDate(date);

        setSelectedPeriod(newSelectedPeriod);
    }

    function handleStartDate(date) {
        var newSelectedPeriod = {...selectedPeriod};

        newSelectedPeriod.startDate = loadFirebase().firestore.Timestamp.fromDate(date);

        setSelectedPeriod(newSelectedPeriod);
    }

    function handleFieldsPosition(e) {

        if (!e.destination) {
            return;
        }

        var currentSchema = {...selectedPeriod};

        var newOrder = reorderArray(currentSchema.gradesSchema, e.source.index, e.destination.index);

        currentSchema.gradesSchema = newOrder;
    
        setSelectedPeriod(currentSchema);
    }

    function reorderArray(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };

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
                <H1Title>Períodos</H1Title>
            </SubNavBar>

            <Main>

                {/*here we can access the changePeriods screen and vice versa*/}
                <DivInterference>
                    <DivTitleSubNav style={{borderRight: '1px solid white'}}>
                        <H1TitleBody>Geral</H1TitleBody>
                    </DivTitleSubNav>

                    <Link to="/authenticated/settings/changeperiods">
                        <DivTitleSubNav>
                            <H1TitleBody>Interferência</H1TitleBody>
                        </DivTitleSubNav>
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

                {/*scroll of periods*/}
                <H1TitleBody style={{color: '#000'}}>Períodos</H1TitleBody>

                <DivScroll>

                    <ul>

                        <li>
                            <DivScrollElement bgcolor={selectedPeriod.periodId === ''} onClick={() => clearPeriod()}>
                                <h1>Criar</h1>
                            </DivScrollElement>
                        </li>

                        {periods.map((item) => (
                            <li key={item.periodId}>
                                <DivScrollElement bgcolor={selectedPeriod.periodId === item.periodId} onClick={() => selectPeriod(item)}>

                                    <h1>{item.periodName}</h1>

                                </DivScrollElement>
                            </li>
                        ))}

                    </ul>

                </DivScroll>

                {updating ===  'outside' &&
                    <DivSpinner className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </DivSpinner>
                }

                {/*div where you put or read all information about the period*/}
                <BlueContentContainer>

                    <DivContainerField>

                        {selectedPeriod.periodId === '' 
                            ? <H1TitleBody>Criar Período:</H1TitleBody>
                            : <H1TitleBody>Nome do Período:</H1TitleBody>
                        }

                        <Input
                            type="text"
                            placeholder="Nome do período"
                            value={selectedPeriod.periodName}
                            onChange={(e) => changePeriodName(e.target.value)}
                        />
                    </DivContainerField>

                    <DragDropContext
                        onDragEnd={e => handleFieldsPosition(e)}
                    >
                        <DivContainerField>
                            <H1TitleBody>Campos:</H1TitleBody>
                            {/*map to show all gradesSchema itens*/}
                            <Droppable droppableId="droppableId-1">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {selectedPeriod.gradesSchema.map((item, index) => (
                                        <Draggable draggableId={`draggable-${index}`} index={index} key={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <div {...provided.dragHandleProps}>
                                                    <FaGripVertical style={{float: 'left', margin: 5, marginRight: 10}} size={20} />
                                                </div>

                                                <DivInputFields>
                                                    <InputFromSchema
                                                        type="text"
                                                        placeholder="Ex.: Teste"
                                                        value={item.name}
                                                        onChange={(e) => changeSchema(e.target.value, item.schemaId)}
                                                    />

                                                    <DivRemove onClick={() => removeInState(index, 'gradesSchema')}>
                                                        <FiX size={22} color="white"/>
                                                    </DivRemove>
                                                </DivInputFields>
                                
                                                {/*checkbox to select a gradesSchema item and put it on the report*/}
                                                <Label>
                                                    <input
                                                        name="showOnReport"
                                                        type="checkbox"
                                                        checked={item.showOnReport}
                                                        onChange={(e) => changeInputCheck(e, item.schemaId)}
                                                    />
                                                    Colocar no Boletim
                                                </Label>
                                            </div>
                                        )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                            </Droppable>
                            
                            {/*button to addInState a new gradesSchema*/}
                            <DivAdd onClick={() => addInState('gradesSchema')}>
                                <FiPlus size={22} color="white"/>
                            </DivAdd>
                        </DivContainerField>
                    </DragDropContext>

                    <DivContainerField>
                        <H1TitleBody>Ordem de Precedência:</H1TitleBody>

                        <Input
                            type="text"
                            placeholder="Ex.: ( teste + prova ) / 2"
                            value={selectedPeriod.orderOfPrecedence}
                            onChange={(e) => changeOrder(e.target.value)}
                        />

                        <p>* Coloque as palavras separadas como no exemplo acima.</p>

                        <H1TitleBody>Campo de Resultado:</H1TitleBody>
                        <select value={schemaIdOfResultField} name="" onChange={(e) => selectResultField(e)}>
                            <option value=""></option>
                            {selectedPeriod.gradesSchema.map((item) => (
                                <option key={item.schemaId} value={item.schemaId}>{item.name}</option>
                            ))}
                        </select>
                    </DivContainerField>

                    <DivContainerField>
                        <H1TitleBody>Ordem do Período:</H1TitleBody>

                        <Input
                            type="text"
                            placeholder="Ex.: 0, 1, ..."
                            value={selectedPeriod.index}
                            onChange={(e) => changeIndex(e.target.value)}
                        />
                    </DivContainerField>

                    {/*date when the period starts*/}
                    <H1TitleBody>Data de início do Período:</H1TitleBody>
                    <div style={{width: '100%', marginBottom: 5}}>
                        <DatePicker 
                            selected={new Date(selectedPeriod.startDate.seconds * 1000 + selectedPeriod.startDate.nanoseconds / 1000000)}
                            onChange={date => handleStartDate(date)}
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                        />
                    </div>

                    {/*date to block the period*/}
                    <H1TitleBody>Data de fim do Período:</H1TitleBody>
                    <div style={{width: '100%', marginBottom: 5}}>
                        <DatePicker 
                            selected={new Date(selectedPeriod.endDate.seconds * 1000 + selectedPeriod.endDate.nanoseconds / 1000000)}
                            onChange={date => handleEndDate(date)}
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                        />
                    </div>

                    {error.target === selectedPeriod.periodId && 
                        <DivError>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>
                    }

                    {updating ===  selectedPeriod.periodId &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase()}>
                        <H1TitleBody>Salvar</H1TitleBody>
                    </DivSave>

                    {selectedPeriod.periodId !== '' && 
                        <DivDelete onClick={() => deletePeriodInDataBase(selectedPeriod.periodId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>
                    }
                    
                </BlueContentContainer>

            </Main>
        </DivContainer>
    )

}
