import React, { useEffect, useState } from 'react';
import { DivContainer, H1TitleClass, DivContainerSubject, ButtonSubject, H1NavButton, DivNavButton, DivError, DivTitleClass } from './style';
import api from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { FiUsers, FiAlertTriangle } from 'react-icons/fi';
import PeriodsModal from '../../components/PeriodsModal';
import StudentAreaModal from '../../components/StudentAreaModal';
import Loading from '../../components/Loading';
import SubNavBar from '../../components/SubNavBar';

export default function Subjects(props) {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showPeriodsModal, setShowPeriodsModal] = useState(false);

    const navigation = useSelector(state => state.navigation);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, [navigation.oneclass.classId])

    async function fetchData() {
        setIsLoading(true);

        try {

            var withoutClassIdData = await api.get('/schoolsubject', {
                params: {
                    classId: '',
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                return res.data.allSubjects
            })

            var withClassIdData = await api.get('/schoolsubject', {
                params: {
                    classId: navigation.oneclass.classId,
                },
                headers: {
                    authorization: props.idToken.token
                }
            }).then(res => {
                return res.data.allSubjects
            })

            setSubjects([...withoutClassIdData, ...withClassIdData]);

        } catch (err) {
            setError(err.response.data.error);
        }

        setIsLoading(false);

    }

    if (isLoading) {
        return <Loading />
    }

    if (error !== '') {
        return (
            <DivContainer>
                <DivError>
                    <FiAlertTriangle size={20} color="white" />
                    <p>{error}</p>
                </DivError>
            </DivContainer>
        )
    }

    return (
        <DivContainer>

            {/* The Periods Modal */}

            <PeriodsModal idToken={props.idToken} show={showPeriodsModal} exit={() => setShowPeriodsModal(false)} />

            {/*The Student Area Modal*/}

            <StudentAreaModal idToken={props.idToken} show={showStudentModal} exit={() => setShowStudentModal(false)} />

            {/*the 'navigation' of subjects screen*/}

            <SubNavBar>

                {/*the class name*/}

                <DivTitleClass>
                    <H1TitleClass>
                        {navigation.oneclass.className}
                    </H1TitleClass>
                </DivTitleClass>

                {/*link to student area*/}

                <DivNavButton onClick={() => setShowStudentModal(true)}>
                    <H1NavButton>Área do Aluno</H1NavButton>
                    <FiUsers size={20} />
                </DivNavButton>

            </SubNavBar>

            {/*the subjects*/}

            <div style={{ textAlign: 'center' }}>
                {subjects.map((item) => (
                    <DivContainerSubject key={item.subjectId} onClick={() => dispatch({ type: 'CHOOSE_SUBJECT', subject: item })}>
                        <ButtonSubject onClick={() => setShowPeriodsModal(true)}>
                            <p>{item.subjectName}</p>
                        </ButtonSubject>
                    </DivContainerSubject>
                ))}
            </div>


        </DivContainer>
    )

}