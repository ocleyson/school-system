var INITIAL_STATE = {
    allGrades: {}
}

/*
    allGrades: {
        studentId: {
            lastUpdate: {},
            data: []
        }
    }
*/

export default function grades(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'GET_ALL_GRADES':
            return {
                ...state,
                allGrades: action.allGrades
            }
        default:
            return state
    }
}