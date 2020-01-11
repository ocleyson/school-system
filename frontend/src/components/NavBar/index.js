import React, { useEffect, useState } from 'react';
import { loadFirebase } from '../../services/db';
import api from '../../services/api';
import { DivBackNav, DivMainIcons, DivItem, H1Item, DivMenuIcon, DivItemContainer, DivSpinner, DivError } from './style';
import { FiHome, FiSettings, FiLogOut, FiArrowLeft, FiMenu, FiList, FiAlertTriangle } from 'react-icons/fi';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function NavBar(props) {
    const [showNav, setShowNav] = useState(null);
    const [showList, setShowList] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState('');

    const navigation = useSelector(state => state.navigation)
    const dispatch = useDispatch();

    useEffect(() => {
        getClasses()
    }, [])

    useEffect(() => {
        setShowNav(null)
    }, [props.location.pathname, navigation.oneclass.classId])

    async function getClasses() {
        var fetchData = true;

        if (props.idToken.claims.isStudent) {
            fetchData = false;
        }

        if (fetchData) {

            await api.get('/schoolclasses', {
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                dispatchAllClasses(res.data.schoolClassesData, {});
            }).catch(err => {
                setLoadingError(err.response.data.error)

                dispatchAllClasses([], {});
            })

        }

        setLoading(false);

    }

    function dispatchAllClasses(allClasses, classesLastUpdate) {
        dispatch({
            type: 'GET_ALL_CLASSES',
            allClasses,
            classesLastUpdate
        })
    }

    async function logout() {
        var db = loadFirebase();

        await db.auth().signOut();

        dispatch({ type: 'LOG_OUT' });

        props.history.push('/login');
    }

    return (
        <div>

            <DivMenuIcon onClick={() => setShowNav(true)}>
                <FiMenu size={30} color="white" />
            </DivMenuIcon>

            <DivBackNav show={showNav}>

                {/* list the icons of the nav bar */}
                <DivMainIcons>

                    <FiArrowLeft className="arrow" size={33} onClick={() => setShowNav(false)} />

                    {!props.idToken.claims.isStudent &&

                        <Link to="/authenticated/mainscreen">
                            <FiHome size={30} />
                        </Link>

                    }

                    {props.idToken.claims.isAdmin &&

                        <FiList size={30} onClick={() => setShowList(true)} />

                    }

                    {props.idToken.claims.isAdmin &&

                        <FiSettings size={30} onClick={() => setShowList(false)} />

                    }

                    <FiLogOut size={30} onClick={() => logout()} />

                </DivMainIcons>

                {/* list the classes to Teacher or Admin account */}
                <DivItemContainer show={!props.idToken.claims.isStudent && showList}>

                    {/*Resultado das turmas*/}

                    {loadingError !== '' 
                        ?
                            <DivError>
                                <FiAlertTriangle size={20} color="white" />
                                <p>{loadingError}</p>
                            </DivError>
                        :
                            null
                    }

                    {loading 
                        ?
                            <DivSpinner>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </DivSpinner>
                        :
                            navigation.allClasses.map((item) => (
                            <Link to={`/authenticated/subjects`} key={item.classId}>
                                <DivItem onClick={() => dispatch({ type: 'CHOOSE_ONECLASS', oneclass: item })}>
                                    <H1Item>
                                        {item.className}
                                    </H1Item>
                                </DivItem>
                            </Link>
                    ))}

                </DivItemContainer>

                {/* list the buttons to access students pages, if the user is a student */}
                <DivItemContainer show={props.idToken.claims.isStudent}>

                    <Link to="/authenticated/studentarea">
                        <DivItem>
                            <H1Item>Boletim</H1Item>
                        </DivItem>
                    </Link>

                    <Link to="/authenticated/changeemail">
                        <DivItem>
                            <H1Item>Alterar E-mail</H1Item>
                        </DivItem>
                    </Link>

                    <Link to="/authenticated/changepassword">
                        <DivItem>
                            <H1Item>Alterar Senha</H1Item>
                        </DivItem>
                    </Link>

                </DivItemContainer>

                {/*show config itens*/}
                <DivItemContainer show={!showList}>

                    {props.idToken.claims.isAdmin &&

                        <>
                            <Link to="/authenticated/settings/school">
                                <DivItem>
                                    <H1Item>Escola</H1Item>
                                </DivItem>
                            </Link>

                            <Link to="/authenticated/settings/classes">
                                <DivItem>
                                    <H1Item>Turmas</H1Item>
                                </DivItem>
                            </Link>

                            <Link to="/authenticated/settings/periods">
                                <DivItem>
                                    <H1Item>Períodos</H1Item>
                                </DivItem>
                            </Link>

                            <Link to="/authenticated/settings/subjects">
                                <DivItem>
                                    <H1Item>Matérias</H1Item>
                                </DivItem>
                            </Link>

                            <Link to="/authenticated/settings/students">
                                <DivItem>
                                    <H1Item>Alunos</H1Item>
                                </DivItem>
                            </Link>

                            <Link to="/authenticated/settings/studentsstate">
                                <DivItem>
                                    <H1Item>Estado dos Alunos</H1Item>
                                </DivItem>
                            </Link>
                        </>
                    }

                    <Link to="/authenticated/changeemail">
                        <DivItem>
                            <H1Item>Alterar E-mail</H1Item>
                        </DivItem>
                    </Link>

                    <Link to="/authenticated/changepassword">
                        <DivItem>
                            <H1Item>Alterar Senha</H1Item>
                        </DivItem>
                    </Link>

                    <Link to="/authenticated/settings/changecreditcard">
                        <DivItem>
                            <H1Item>Alterar Cartão</H1Item>
                        </DivItem>
                    </Link>

                </DivItemContainer>

            </DivBackNav>
        </div>
    );
}

export default withRouter(NavBar)