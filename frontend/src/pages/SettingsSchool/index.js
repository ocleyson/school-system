import React, { useState, useEffect } from 'react';
import {DivContainer, H1TitleBody, Input, DivSave, DivDropdown, Button, DivModal, H1Title, Main, DivError, DivCancel, DivSpinner, DivAdd, DivRemoveAbsolute, DivWithBorder} from './style';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';
import { FiAlertTriangle, FiX, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

export default function SettingsSchool(props) {
    const [schoolInfo, setSchoolInfo] = useState({});
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherUid, setTeacherUid] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [error, setError] = useState( { target: '', message: '' } );
    const [showTeacherPasswordField, setShowTeacherPasswordField] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showGradesModal, setShowGradesModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [updating, setUpdating] = useState(''); // the target

    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            var schoolData = await api.get('/schoolinfo', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                return res.data.schoolData
            })

            setSchoolInfo(schoolData);
            setTeacherUid(schoolData.schoolTeacher);
        
            if(schoolData.schoolTeacher) {
                await api.get('/schoolteacher', {
                    params: {teacherUid: schoolData.schoolTeacher},
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    setTeacherEmail(res.data.schoolTeacher);
                })
            }

        } catch (error) {
            setError({
                target: 'loading',
                message: error.response.data.error
            })
        }
    
        setIsLoading(false);
    }

    async function saveSchoolInfo(data) {
        setUpdating('school');

        delete data.creditCardInfo

        await api.post('/schoolinfo', {
            data
        }, {
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setError( { target: '', message: '' } )
        }).catch(err => {
            setError( { target: 'school', message: err.response.data.error } )
        })

        setUpdating('');
    }

    async function deleteAllGrades() {
        setUpdating('gradesmodal')

        await api.post('/deleteallgrades', {},
        {
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            dispatch({ type: 'GET_ALL_GRADES', allGrades: {} });
            setShowGradesModal(false);
        }).catch(err => {
            setError( { target: 'gradesmodal', message: err.response.data.error } )
        })

        setUpdating('');
    }

    async function createTeacherAccount() {
        setUpdating('teacher');

        await api.post('/schoolteacher', {
            data: {
                email: teacherEmail,
                password: teacherPassword
            }
        }, {
            headers: {
                authorization: props.idToken.token
            }
        }).then(res => {
            setTeacherUid(res.data.teacherUid);
            setTeacherPassword('');
            setError( { target: '', message: '' } );
        }).catch(err => {
    
            var teacherError = translateFirebaseErrorToPtBr(err.response.data.error)
    
            setError( { target: 'teacher', message: teacherError } );

        })

        setUpdating('')
    }

    async function updateTeacherAccount() {
        setUpdating('teacher');

        await api.put('/schoolteacher', {
            teacherUid: teacherUid,
            data: {
                email: teacherEmail,
                password: showTeacherPasswordField ? teacherPassword : undefined
            }
        }, {
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setShowTeacherPasswordField(false);
            setTeacherPassword('');
            setError( { target: '', message: '' } );
        }).catch(err => {
    
            var teacherError = translateFirebaseErrorToPtBr(err.response.data.error)
    
            setError( { target: 'teacher', message: teacherError } );
        })

        setUpdating('');
    }

    async function cancelSubscription() {
        setUpdating('cancelsubscription')

        await api.post('/cancelsubscription', {
            teacherUid: teacherUid,
            customerId: schoolInfo.customerId
        }, {
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
    
            loadFirebase().auth().signOut()
            .then(() => {
                props.history.push('/')
            });
    
        }).catch(err => {
            setError( { target: 'cancelsubscription', message: err.response.data.error } )
        })

        setUpdating('');
    }

    function changeSchoolInfo(e) {
        var value = e.target.value;
        var name = e.target.name;

        var newInfo = {...schoolInfo};

        newInfo[name] = value;

        setSchoolInfo(newInfo);
    }

    function addExtraInfo() {
        var newExtraInfo = {...schoolInfo};

        newExtraInfo.extraInfo.push({title: '', value: ''});

        setSchoolInfo(newExtraInfo);
    }

    function changeSchoolExtraInfo(e, index) {
        var value = e.target.value;
        var name = e.target.name;

        var newExtraInfo = {...schoolInfo};

        newExtraInfo.extraInfo[index][name] = value;

        setSchoolInfo(newExtraInfo);
    }

    function removeExtraInfo(index) {
        var newExtraInfo = {...schoolInfo};

        newExtraInfo.extraInfo.splice(index, 1);

        setSchoolInfo(newExtraInfo);
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

            <DivModal show={showGradesModal}>
                <div className="main">
                    <FiX size={30} onClick={() => setShowGradesModal(false)} />
                    <div className="title">
                        <h5>Deletar todas as notas.</h5>
                    </div>

                    <div className="body">
                        <h5>Essa ação é irreversível. Deseja continuar?</h5>
                    </div>

                    <div className="bottom">

                        {updating ===  'gradesmodal' &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => deleteAllGrades()}>
                            <H1TitleBody>Deletar</H1TitleBody>
                        </DivSave>

                        <DivCancel onClick={() => setShowGradesModal(false)}>
                            <H1TitleBody>Cancelar</H1TitleBody>
                        </DivCancel>
                    </div>
                </div>
            </DivModal>

            <DivModal show={showSubscriptionModal}>
                <div className="main">
                    <FiX size={30} onClick={() => setShowSubscriptionModal(false)} />
                    <div className="title">
                        <h5>Cancelar Assinatura.</h5>
                    </div>

                    <div className="body">
                        <h5>Essa ação é irreversível. Deseja continuar?</h5>
                    </div>

                    <div className="bottom">
                        {updating ===  'cancelsubscription' &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => cancelSubscription()}>
                            <H1TitleBody>Continuar</H1TitleBody>
                        </DivSave>

                        <DivCancel onClick={() => setShowSubscriptionModal(false)}>
                            <H1TitleBody>Cancelar</H1TitleBody>
                        </DivCancel>
                    </div>
                </div>
            </DivModal>

            <SubNavBar>
                <H1Title>Escola</H1Title>
            </SubNavBar>

            <Main>

                {/*its about school account*/}
                <BlueContentContainer>

                    <DivDropdown className="dropdown" style={{float: 'right'}}>
                        <Button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{padding: 0}}>
                            Mais
                        </Button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" onClick={() => setShowGradesModal(true)}>
                                Deletar todas as notas
                            </button>
                            <button className="dropdown-item" onClick={() => setShowSubscriptionModal(true)}>
                                Cancelar Assinatura
                            </button>
                        </div>
                    </DivDropdown>

                    <H1TitleBody>Nome da Escola:</H1TitleBody>
                    <Input
                        type="text"
                        name="schoolName"
                        placeholder="Digite o nome da escola"
                        value={schoolInfo.schoolName}
                        onChange={(e) => changeSchoolInfo(e)}
                    />

                    <H1TitleBody style={{marginBottom: 10}}>E-mail atual: {schoolInfo.email}</H1TitleBody>

                    <H1TitleBody style={{marginBottom: 10}}>Cartão atual: {schoolInfo.creditCardInfo.brand} **** {schoolInfo.creditCardInfo.last4}</H1TitleBody>

                    <H1TitleBody>Incluir informação da escola no Boletim:</H1TitleBody>

                    {schoolInfo.extraInfo.map((info, index) => (
                        <DivWithBorder key={index}>

                            <Input
                                type="text"
                                name="title"
                                placeholder="Título. Ex.: E-mail"
                                value={info.title}
                                onChange={(e) => changeSchoolExtraInfo(e, index)}
                            />

                            <Input
                                type="text"
                                name="value"
                                placeholder="Informação. Ex.: exemplo@email.com"
                                value={info.value}
                                onChange={(e) => changeSchoolExtraInfo(e, index)}
                            />

                            <DivRemoveAbsolute onClick={() => removeExtraInfo(index)}>
                                <FiX size={22} color="white"/>
                            </DivRemoveAbsolute>
                        </DivWithBorder>
                    ))}

                    <DivAdd onClick={() => addExtraInfo()}>
                        <FiPlus size={22} color="white"/>
                    </DivAdd>

                    {updating === 'school' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivError show={error.target === 'school'}>
                        <FiAlertTriangle size={20} color="white"/>
                        <p>{error.message}</p>
                    </DivError>

                    <DivSave onClick={() => saveSchoolInfo({...schoolInfo})}>
                        <H1TitleBody>Salvar</H1TitleBody>
                    </DivSave>

                </BlueContentContainer>

                {/*its about teacher account*/}
                <H1TitleBody style={{color: 'black'}}>
                    Conta dos Professores
                </H1TitleBody>

                {/*show different ui if the teacher account is already created*/}
                {
                
                    !teacherUid

                ?
                    <BlueContentContainer>

                        <H1TitleBody>E-mail dos Professores:</H1TitleBody>
                        <Input
                            type="text"
                            placeholder="Digite o email dos professores"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                        />

                        <H1TitleBody>Senha dos Professores:</H1TitleBody>
                        <Input
                            type="password"
                            placeholder="Digite a senha dos professores"
                            value={teacherPassword}
                            onChange={(e) => setTeacherPassword(e.target.value)}
                        />

                        {updating === 'teacher' &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivError show={error.target === 'teacher'}>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>

                        <DivSave onClick={() => createTeacherAccount()}>
                            <H1TitleBody>Criar</H1TitleBody>
                        </DivSave>

                    </BlueContentContainer>
                :
                    <BlueContentContainer>

                        <H1TitleBody>E-mail dos Professores:</H1TitleBody>
                        <Input
                            type="text"
                            placeholder="Digite o email dos professores"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                        />

                        <p className="changepassword" onClick={() => setShowTeacherPasswordField(!showTeacherPasswordField)}>
                            {showTeacherPasswordField ? 'Cancelar' : 'Alterar Senha'}
                        </p>

                        <div style={{display: showTeacherPasswordField ? 'block' : 'none'}}>
                            <H1TitleBody>Nova senha dos Professores:</H1TitleBody>
                            <Input
                                type="password"
                                placeholder="Digite uma nova senha"
                                value={teacherPassword}
                                onChange={(e) => setTeacherPassword(e.target.value)}
                            />
                        </div>

                        {updating === 'teacher' &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivError show={error.target === 'teacher'}>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>

                        <DivSave onClick={() => updateTeacherAccount()}>
                            <H1TitleBody>Salvar</H1TitleBody>
                        </DivSave>

                    </BlueContentContainer>
                }

            </Main>

        </DivContainer>
    )
}
