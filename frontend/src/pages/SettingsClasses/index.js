import React, { useEffect, useState } from 'react';
import { DivContainer, H1TitleBody, Input, DivSave, DivDelete, Main, H1Title, DivError, DivSpinner } from './style';
import api from '../../services/api';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';
import { FiAlertTriangle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function SettingsClasses(props) {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({
        className: '',
        series: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({ message: '', target: '' });
    const [updating, setUpdating] = useState('');

    const navigation = useSelector(state => state.navigation);
    const dispatch = useDispatch();

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

        } catch (error) {
            setError({ message: error.response.data.error, target: 'loading' });
        }

        setIsLoading(false);

    }

    function handleChange(e, classId) {
        var updatedClass = [...classes];

        var index = updatedClass.findIndex(f => {
            return f.classId === classId
        });

        updatedClass[index][e.target.name] = e.target.value;

        setClasses(updatedClass);
    }

    function handleChangeNewClass(e) {
        var newClassCopy = { ...newClass };

        newClassCopy[e.target.name] = e.target.value;

        setNewClass(newClassCopy);
    }

    function verify(item) {
        if(item.className === '' || item.series === '') {
            throw new Error('Nenhum campo pode estar vazio!')
        }
    }

    async function saveInDataBase() {
        setUpdating('newclass');

        try {
            verify(newClass);

            await api.post('/schoolclasses', {
                data: newClass
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setNewClass({ className: '', series: '' });
                setClasses([{ classId: res.data.classId, ...newClass }, ...classes]);
                dispatchAllClasses([{ classId: res.data.classId, ...newClass }, ...classes]);
                setError({ message: '', target: '' });
            })

        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError({ message, target: 'newclass' });
        }

        setUpdating('');
    }

    function dispatchAllClasses(allClasses) {
        dispatch({
            type: 'GET_ALL_CLASSES',
            allClasses,
            classesLastUpdate: navigation.classesLastUpdate
        })
    }

    async function handleUpdate({ classId, ...data }) {
        setUpdating(classId);

        try {
            verify(data);

            await api.put('/schoolclasses', {
                classId,
                data
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(() => {

                var allClassesInReduxCopy = [...navigation.allClasses];
                var index = allClassesInReduxCopy.findIndex(f => f.classId === classId);
                allClassesInReduxCopy[index] = { classId, ...data };
                dispatchAllClasses(allClassesInReduxCopy);

                setError({ message: '', target: '' });
            })

        } catch (err) {

            var message = err.response ? err.response.data.error : err.message;

            setError({ message, target: classId });
        }

        setUpdating('');
    }

    async function deleteClassInDataBase(classId) {
        setUpdating(classId);

        await api.delete('/schoolclasses', {
            data: {
                classId
            },
            headers: {
                authorization: props.idToken.token
            }
        }).then(() => {
            setClasses(classes.filter(classes => classes.classId !== classId));
            dispatchAllClasses(classes.filter(classes => classes.classId !== classId));
        }).catch(error => {
            setError({ message: error.response.data.error, target: classId });
        })

        setUpdating('');
    }

    if (isLoading) {
        return <Loading />
    }

    if (error.target === 'loading') {
        return (
            <DivContainer>
                <Main>
                    <DivError>
                        <FiAlertTriangle size={20} color="white" />
                        <p>{error.message}</p>
                    </DivError>
                </Main>
            </DivContainer>
        )
    }

    return (
        <DivContainer>

            <SubNavBar>
                <H1Title>Turmas</H1Title>
            </SubNavBar>

            <Main>

                <BlueContentContainer>
                    <H1TitleBody>Criar Turma:</H1TitleBody>

                    <Input
                        type="text"
                        name="className"
                        placeholder="Turma"
                        value={newClass.className}
                        onChange={(e) => handleChangeNewClass(e)}
                    />

                    <Input
                        type="text"
                        name="series"
                        placeholder="Série"
                        value={newClass.series}
                        onChange={(e) => handleChangeNewClass(e)}
                    />

                    {error.target === 'newclass' && 
                        <DivError>
                            <FiAlertTriangle size={20} color="white"/>
                            <p>{error.message}</p>
                        </DivError>
                    }

                    {updating ===  'newclass' &&
                        <DivSpinner className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </DivSpinner>
                    }

                    <DivSave onClick={() => saveInDataBase()}>
                        <H1TitleBody>Criar</H1TitleBody>
                    </DivSave>
                </BlueContentContainer>

                {classes.map((item) => (
                    <BlueContentContainer key={item.classId}>
                        <H1TitleBody>Turma:</H1TitleBody>

                        <Input
                            type="text"
                            name="className"
                            placeholder="Turma"
                            value={item.className}
                            onChange={(e) => handleChange(e, item.classId)}
                        />

                        <Input
                            type="text"
                            name="series"
                            placeholder="Série"
                            value={item.series}
                            onChange={(e) => handleChange(e, item.classId)}
                        />

                        {error.target === item.classId && 
                            <DivError>
                                <FiAlertTriangle size={20} color="white"/>
                                <p>{error.message}</p>
                            </DivError>
                        }

                        {updating ===  item.classId &&
                            <DivSpinner className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </DivSpinner>
                        }

                        <DivSave onClick={() => handleUpdate(item)}>
                            <H1TitleBody>Salvar</H1TitleBody>
                        </DivSave>

                        <DivDelete onClick={() => deleteClassInDataBase(item.classId)}>
                            <H1TitleBody>Excluir</H1TitleBody>
                        </DivDelete>
                    </BlueContentContainer>
                ))}

            </Main>

        </DivContainer>
    )

}
