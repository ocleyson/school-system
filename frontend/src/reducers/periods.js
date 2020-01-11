const INITIAL_STATE = {
    period: {}, 
    allPeriods: {},
}

/*
    allPeriods: {
        classId: {
            lastUpdate: {},
            data: []
        }
    }
*/

export default function periods(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'CHOOSE_PERIOD':
            return {
                ...state,
                period: action.period,
            }
        case 'GET_ALL_PERIODS':
            return {
                ...state,
                allPeriods: action.allPeriods,
            }
        default:
            return state; 
    }
}