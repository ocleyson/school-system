const INITIAL_STATE = { 
    oneclass: { classId: '' },
    allClasses: [],
    classesLastUpdate: {}
}

export default function navigation(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'CHOOSE_ONECLASS':
            return {
                ...state, 
                oneclass: action.oneclass
            }
        case 'GET_ALL_CLASSES':
            return {
                ...state, 
                allClasses: action.allClasses,
                classesLastUpdate: action.classesLastUpdate
            }
        default:
            return state; 
    }
}