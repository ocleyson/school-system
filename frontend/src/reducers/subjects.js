const INITIAL_STATE = {
    subject: {}, 
    allSubjects: {},
}

/*
    allSubjects: {
        classId: {
            lastUpdate: {},
            data: []
        }
    }
*/

export default function subjects(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'CHOOSE_SUBJECT':
            return {...state, subject: action.subject}
        case 'GET_ALL_SUBJECTS':
            return {
                ...state,
                allSubjects: action.allSubjects, 
            }
        default:
            return state; 
    }
}