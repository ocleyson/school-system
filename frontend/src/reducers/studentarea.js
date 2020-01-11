const INITIAL_STATE = {
    periods: [],
    subjects: [],
    grades: [],
    periodsLastUpdate: {},
    subjectsLastUpdate: {},
    gradesLastUpdate: {}
}

export default function studentarea(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'STUDENT_PERIODS':
            return {
                ...state,
                periods: action.periods,
                periodsLastUpdate: action.periodsLastUpdate
            }
        case 'STUDENT_SUBJECTS':
            return {
                ...state,
                subjects: action.subjects,
                subjectsLastUpdate: action.subjectsLastUpdate
            }
        case 'STUDENT_GRADES':
            return {
                ...state,
                grades: action.grades,
                gradesLastUpdate: action.gradesLastUpdate
            }
        default:
            return state;
    }
}