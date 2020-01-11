import React, { useEffect, useState } from "react";

import {DivStudent, H1Student, DivSearch, DivIcon, Input, DivError, DivModal, DivSpinner} from './style';
import {FiSearch, FiAlertTriangle, FiX} from 'react-icons/fi';
import {colors} from '../../styles';
import {Link} from 'react-router-dom';
import {loadFirebase} from '../../services/db';
import api from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';

export default function StudentAreaModal(props) {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigation = useSelector(state => state.navigation);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData()
    }, [props.show])

    useEffect(() => {
        setStudents([]);
        setSearch('');
    }, [navigation.oneclass.classId])

    async function fetchData() {
        setLoading(true);

        if(props.show && students.length === 0) {

            await api.get('/schoolstudents', {
                params: {
                    classId: navigation.oneclass.classId
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                setStudents(res.data.allStudents);
                setError('');
            }).catch(err => {
                setError(err.response.data.error);
            })

        }

        setLoading(false);

    }

    async function searchStudent(search) {
        setLoading(true);

        var uid;

        if(props.idToken.claims.isAdmin) {
          uid = `${loadFirebase().auth().currentUser.uid}`;
        } else if(props.idToken.claims.isTeacher) {
          uid = props.idToken.claims.schoolUid;
        }

        setSearch(search);

        search = search.toLowerCase();

        await loadFirebase().firestore().collection('schoolStudents')
        .where('schoolUid', '==', uid)
        .where('classId', '==', navigation.oneclass.classId)
        .orderBy('name')
        .startAt(search)
        .endAt(search+'\uf8ff')
        .get()
        .then(querySnapshot => {
            var arrayResult = []
            querySnapshot.forEach(doc => {
                var data = doc.data();
                data.studentId = doc.id;
                arrayResult.push(data)
            })
            setError('');
            setStudents(arrayResult)
        }).catch(err => {
            var translateError = translateFirebaseErrorToPtBr(err.code)

            setError(translateError);
        })

        setLoading(false);

    }

    return (
        <DivModal show={props.show}>
            <div className="main">
                <FiX size={30} className="exit" onClick={() => props.exit()} />
                <div className="title">
                    <h5>Área do Aluno</h5>
                </div>

                <div className="body">
                    <DivSearch>
                        <Input
                            type="text"
                            placeholder="Pesquisar aluno"
                            value={search}
                            onChange={(e) => searchStudent(e.target.value)}
                        />

                        <DivIcon>
                            <FiSearch size={27} color={colors.secondary}/>
                        </DivIcon>
                    </DivSearch>

                    {
                        
                        loading 
                    
                    ?

                        <DivSpinner>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </DivSpinner>

                    :

                        <div>
                            {
                                
                                error !== '' 
                            
                            ?

                                <DivError>
                                    <FiAlertTriangle size={20} color="white"/>
                                    <p>{error}</p>
                                </DivError>

                            :
                                students.map((item) => (
                                    <Link to="/authenticated/studentarea" key={item.studentId}>
                                        <DivStudent onClick={() => dispatch({type: 'GET_STUDENT', student: item})}>
                                            <H1Student>
                                                {item.name}
                                            </H1Student>
                                        </DivStudent>
                                    </Link>
                                ))
                        
                            }
                        </div>
                    
                    }

                </div>
            </div>
        </DivModal>
    )

}