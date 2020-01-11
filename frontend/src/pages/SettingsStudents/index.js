import React, { useEffect, useState } from 'react';
import {DivContainer, H1TitleBody, Input, DivSave, DivDelete, DivScroll, DivScrollElement, DivBlock, DivAdd, DivWithBorder, DivRemoveAbsolute, Label, DivRadius, Main, H1Title, DivError, DivModal, DivCancel, DivSpinner} from './style';
import {FiPlus, FiX, FiAlertTriangle} from 'react-icons/fi';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import {colors} from '../../styles';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsStudents(props) {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        name: '',
        registration: '',
        email: '',
        disabled: false,
        studentExtraInfo: []
    });
    const [selectedClass, setSelectedClass] = useState('');
    const [error, setError] = useState({message: '', target: ''});
    const [nextClassId, setNextClassId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState('');
    const [showClassModal, setShowClassModal] = useState(false);

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            var getClasses = await api.get('/schoolclasses', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                return res.data.schoolClassesData
            })
        
            var firstClass = getClasses[0];
            if(firstClass) {
                setSelectedClass(firstClass.classId);
            } else {
                setIsLoading(false);
                return
            }
        
            await api.get('/schoolstudents', {
                params: {
                    classId: getClasses[0].classId
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setStudents(res.data.allStudents);
            })

            setClasses(getClasses)
        } catch (error) {
            setError({message: error.response.data.error, target: 'loading'});
        }
    
        setIsLoading(false);
    }

    // IF THE USER ALREADY EXIST
    function handleChange(e, studentId) {
        var updatedStudent = [...students];
        var name = e.target.name;
        var content = e.target.value;

        var index = updatedStudent.findIndex(f => {
            return f.studentId === studentId
        });

        if(name === "name") {
            content = content.toLowerCase();
        } else if(e.target.type === 'checkbox') {
            content = e.target.checked;
        }

        updatedStudent[index][name] = content;

        setStudents(updatedStudent)
    }

    function addExtraInfo(studentId) {
        var updatedStudent = [...students];
    
        var index = updatedStudent.findIndex(f => {
            return f.studentId === studentId
        });
    
        updatedStudent[index].studentExtraInfo.push({
            title: '', value: ''
        });
    
        setStudents(updatedStudent)
    }

    function handleExtraInfo(e, index, studentId) {
        var updatedStudent = [...students];
    
        var studentIndex = updatedStudent.findIndex(f => {
            return f.studentId === studentId
        });
    
        updatedStudent[studentIndex].studentExtraInfo[index][e.target.name] = e.target.value;
    
        setStudents(updatedStudent);
    }

    function removeExtraInfo(index, studentId) {
        var updatedStudent = [...students];
    
        var studentIndex = updatedStudent.findIndex(f => {
            return f.studentId === studentId
        });
    
        updatedStudent[studentIndex].studentExtraInfo.splice(index, 1);
    
        setStudents(updatedStudent);
    }

    // IF ITS A NEW USER
    function handleChangeNewStudent(e) {
        var changeNewStudent = {...newStudent};
        var name = e.target.name
        var content = e.target.value;

        if(name === "name") {
            content = content.toLowerCase();
        }

        changeNewStudent[name] = content;

        setNewStudent(changeNewStudent)
    }

    function handleExtraInfoNewStudent(e, index) {
        var changeNewStudent = {...newStudent}
    
        changeNewStudent.studentExtraInfo[index][e.target.name] = e.target.value;
    
        setNewStudent(changeNewStudent);
    }

    function addExtraInfoNewStudent() {
        var changeNewStudent = {...newStudent};
    
        changeNewStudent.studentExtraInfo.push({
            title: '', value: ''
        });

        setNewStudent(changeNewStudent);
    }

    function removeExtraInfoNewStudent(index) {
        var changeNewStudent = {...newStudent}
    
        changeNewStudent.studentExtraInfo.splice(index, 1);
    
        setNewStudent(changeNewStudent);
    }

    // SAVE THE NEW STUDENT IN DATABASE (FIREBASE)
    async function saveInDataBase(student) {
        setUpdating('savenewstudent');

        try {
            verify(student);
            
            await api.post('/schoolstudents', {
                studentData: {classId: selectedClass, ...student}
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setStudents([{studentId: res.data.studentUid, classId: selectedClass, ...student}, ...students]);
                setNewStudent({name: '', registration: '', email: '', disabled: false, studentExtraInfo: []});
                setError({message: '', target: ''});
            })

        } catch (err) {

            var message = err.response ? translateFirebaseErrorToPtBr(err.response.data.error) : err.message;

            setError({message, target: 'savenewstudent'});
        }

        setUpdating('');
    }

    async function handleUpdate({studentId, ...data}) {
        setUpdating(studentId);

        try {
            verify(data);

            await api.put('/schoolstudents', {
                studentUid: studentId,
                studentData: data
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(() => {
                // when the admin change the class of the student
                if(selectedClass !== data.classId) {
                    setStudents(students.filter(student => student.studentId !== studentId))
                }
                setError({message: '', target: ''});
            })

        } catch (err) {

            var message = err.response ? translateFirebaseErrorToPtBr(err.response.data.error) : err.message;

            setError({ message, target: studentId });
        }

        setUpdating('');
    }

    async function deleteInDataBase(studentId) {
        setUpdating(studentId);

        await api.delete('/schoolstudents', {
            data: {
                studentUid: studentId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setStudents(students.filter(student => student.studentId !== studentId))
        }).catch(err => {
            var msg = translateFirebaseErrorToPtBr(err.response.data.error)
    
            setError({message: msg, target: studentId});
        })

        setUpdating('');
    }

    async function selectClass(classId) {
        setUpdating('newclass');

        setSelectedClass(classId)
        await api.get('/schoolstudents', {
            params: {
                classId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setStudents(res.data.allStudents);
        }).catch(err => {
            var msg = translateFirebaseErrorToPtBr(err.response.data.error)
    
            setError({message: msg, target: 'loading'});
        })

        setUpdating('');
    }

    function verify(student) {
        var error = Object.values(student).some(s => {
            return s === ''
        });
        
        if(error) throw new Error('Nenhum campo pode ficar em branco.');

        student.studentExtraInfo.map(item => {
            if(item.title === '' || item.value === '') throw new Error('Nenhum campo pode ficar em branco.');

            return ''
        })
    }

    async function changeStudentsClass() {
        setUpdating('changestudentsmodal');
        
        if((students.length > 0 && (selectedClass !== nextClassId) && nextClassId !== "")) {
            await api.post('/changestudentsclass', {
                currentClassId: selectedClass,
                nextClassId: nextClassId,
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(() => {
                setStudents([]);
                setNextClassId('');
                setShowClassModal(false);
            }).catch(err => {
                var msg = translateFirebaseErrorToPtBr(err.response.data.error)
    
                setError({message: msg, target: 'changestudentsmodal'});
            })
    
        } else {
            setError({message: 'Não foi possível fazer a tranferência dos alunos', target: 'changestudentsmodal'});
        }

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
            <H1Title>Alunos</H1Title>
        </SubNavBar>

        <DivModal show={showClassModal}>
            <div className="main">
                <FiX size={30} onClick={() => setShowClassModal(false)} />
                <div className="title">
                    <h5>Alterar Turma de Todos Alunos</h5>
                </div>

                <div className="body">
                    <h5>Nova Turma</h5>
                    <select value={nextClassId} name="classId" onChange={(e) => setNextClassId(e.target.value)}>
                        <option value=""></option>
                        {classes.map((item) => (
                            <option key={item.classId} value={item.classId}>{item.className}</option>
                        ))}
                    </select>

                    <DivError show={error.target === 'changestudentsmodal'}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>
                </div>

                <div className="bottom">
                    {updating ===  'changestudentsmodal' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => changeStudentsClass()}>
                        <h1>Salvar</h1>
                    </DivSave>

                    <DivCancel onClick={() => setShowClassModal(false)}>
                        <h1>Cancelar</h1>
                    </DivCancel>
                </div>
            </div>
        </DivModal>

        <Main>

            {/*the user cant do nothing if he didnt add classes*/}
            <DivBlock show={classes.length === 0}>
                <H1TitleBody>Primeiro você precisa adicionar turmas.</H1TitleBody>
            </DivBlock>

            {/*scroll of students*/}
            <H1TitleBody style={{color: '#000', display: classes.length === 0 ? 'none' : 'block'}}>Turmas</H1TitleBody>

            <DivScroll>

                <ul>

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
                <H1TitleBody>Criar Aluno:</H1TitleBody>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nome do aluno"
                    value={newStudent.name}
                    onChange={(e) => handleChangeNewStudent(e)}
                />

                <Input
                    type="text"
                    name="registration"
                    placeholder="Matrícula do aluno"
                    value={newStudent.registration}
                    onChange={(e) => handleChangeNewStudent(e)}
                />

                <Input
                    type="text"
                    name="email"
                    placeholder="E-mail do aluno"
                    value={newStudent.email}
                    onChange={(e) => handleChangeNewStudent(e)}
                />

                <p style={{margin: 0}}>* Inicialmente, a matrícula também será usada como a senha do aluno.</p>

                {/*ADD EXTRA INFO*/}
                <H1TitleBody>Mais Informações para o Boletim:</H1TitleBody>

                {newStudent.studentExtraInfo.map((item, index) => (
                    <DivWithBorder key={index}>

                        <Input
                            type="text"
                            name="title"
                            placeholder="Título. Ex.: Responsável"
                            value={item.title}
                            onChange={(e) => handleExtraInfoNewStudent(e, index)}
                        />
                        <Input
                            type="text"
                            name="value"
                            placeholder="Informação. Ex.: Fulano"
                            value={item.value}
                            onChange={(e) => handleExtraInfoNewStudent(e, index)}
                        />

                        <DivRemoveAbsolute onClick={() => removeExtraInfoNewStudent(index)}>
                            <FiX size={22} color="white"/>
                        </DivRemoveAbsolute>
                    </DivWithBorder>
                ))}

                <DivAdd onClick={() => addExtraInfoNewStudent()}>
                    <FiPlus size={22} color="white"/>
                </DivAdd>

                <DivError show={error.target === 'savenewstudent'}>
                    <FiAlertTriangle size={20} color="white"/>
                    <p>{error.message}</p>
                </DivError>

                {updating ===  'savenewstudent' &&
                    <DivSpinner className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </DivSpinner>
                }

                <DivSave onClick={() => saveInDataBase(newStudent)}>
                    <H1TitleBody>Criar</H1TitleBody>
                </DivSave>
            </BlueContentContainer>

            <DivRadius onClick={() => setShowClassModal(true)} >
                <H1TitleBody>Alterar Turma de Todos Alunos</H1TitleBody>
            </DivRadius>

            {updating ===  'newclass' &&
                <DivSpinner className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </DivSpinner>
            }

            {students.map((item) => (
                <BlueContentContainer key={item.studentId}>

                    <H1TitleBody>Aluno:</H1TitleBody>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Nome do aluno"
                        value={item.name}
                        onChange={(e) => handleChange(e, item.studentId)}
                        style={{borderColor: item.name === '' ? colors.red : '#FFF'}}
                    />

                    <H1TitleBody>Matrícula:</H1TitleBody>
                    <Input
                        type="text"
                        name="registration"
                        placeholder="Matrícula do aluno"
                        value={item.registration}
                        onChange={(e) => handleChange(e, item.studentId)}
                        style={{borderColor: item.registration === '' ? colors.red : '#FFF'}}
                    />

                    <H1TitleBody>E-mail:</H1TitleBody>
                    <Input
                        type="text"
                        name="email"
                        placeholder="E-mail do aluno"
                        value={item.email}
                        onChange={(e) => handleChange(e, item.studentId)}
                        style={{borderColor: item.email === '' ? colors.red : '#FFF'}}
                    />
                    <H1TitleBody>Turma:</H1TitleBody>
                    <select value={item.classId} name="classId" onChange={(e) => handleChange(e, item.studentId)}>
                        {classes.map((item) => (
                            <option key={item.classId} value={item.classId}>{item.className}</option>
                        ))}
                    </select>

                    <Label>
                        <input
                            type="checkbox"
                            name="disabled"
                            checked={item.disabled}
                            onChange={(e) => handleChange(e, item.studentId)}
                        />
                        Desabilitar conta do aluno
                    </Label>

                    <H1TitleBody>Mais Informações para o Boletim:</H1TitleBody>

                    {item.studentExtraInfo.map((info, index) => (
                        <DivWithBorder key={index}>

                            <Input
                                type="text"
                                name="title"
                                placeholder="Título. Ex.: Responsável"
                                value={info.title}
                                onChange={(e) => handleExtraInfo(e, index, item.studentId)}
                            />
                            <Input
                                type="text"
                                name="value"
                                placeholder="Informação. Ex.: Fulano"
                                value={info.value}
                                onChange={(e) => handleExtraInfo(e, index, item.studentId)}
                            />

                            <DivRemoveAbsolute onClick={() => removeExtraInfo(index, item.studentId)}>
                                <FiX size={22} color="white"/>
                            </DivRemoveAbsolute>
                        </DivWithBorder>
                    ))}

                    <DivAdd onClick={() => addExtraInfo(item.studentId)}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    <DivError show={error.target === item.studentId}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>

                    {updating ===  item.studentId &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => handleUpdate(item)}>
                        <H1TitleBody>Atualizar</H1TitleBody>
                    </DivSave>

                    <DivDelete onClick={() => deleteInDataBase(item.studentId)}>
                        <H1TitleBody>Excluir</H1TitleBody>
                    </DivDelete>
                </BlueContentContainer>
            ))}

        </Main>

      </DivContainer>  
    )
}
