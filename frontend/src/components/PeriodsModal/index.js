import React, { useEffect, useState } from "react";

import {DivPeriod, H1Period, DivError, DivModal, DivSpinner} from './style';
import {Link} from 'react-router-dom';
import api from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function PeriodsModal(props) {
    const [periodsState, setPeriodsState] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigation = useSelector(state => state.navigation);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, [props.show])

    async function fetchData() {
        setLoading(true);

        if(props.show && periodsState.length === 0) {

            try {

                var withoutClassIdData = await api.get('/schoolperiod', {
                    params: {
                        classId: '',
                    },
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    return res.data.allPeriods
                })
        
                var withClassIdData = await api.get('/schoolperiod', {
                    params: {
                        classId: navigation.oneclass.classId,
                    },
                    headers: {
                        authorization: props.idToken.token
                    }
                }).then(res => {
                    return res.data.allPeriods
                })

                var periodsSorted = [...withoutClassIdData, ...withClassIdData];

                periodsSorted.sort((a, b) => a.index - b.index);

                setPeriodsState(periodsSorted);

            } catch (err) {
                setError(err.response.data.error);
            }

        }

        setLoading(false);

    }

    return (
        <DivModal show={props.show}>
            <div className="main">
                <FiX size={30} className="exit" onClick={() => props.exit()} />
                <div className="title">
                    <h5>Períodos</h5>
                </div>

                <div className="body">
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
                                periodsState.map((item) => (
                                    <Link to="/authenticated/setgrades" key={item.periodId} onClick={() => props.exit()}>
                                        <DivPeriod onClick={() => dispatch({type: 'CHOOSE_PERIOD', period: item})}>
                                            <H1Period>
                                                {item.periodName}
                                            </H1Period>
                                        </DivPeriod>
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