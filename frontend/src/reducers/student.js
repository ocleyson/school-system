export default function student(state = {}, action) {
    switch(action.type) {
        case 'GET_STUDENT':
            return {...state, studentObject: action.student}
        default:
            return state; 
    }
}