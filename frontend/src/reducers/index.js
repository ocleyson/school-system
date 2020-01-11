import { combineReducers } from 'redux';
import subjects from './subjects';
import navigation from './navigation';
import periods from './periods';
import student from './student';
import grades from './grades';
import studentarea from './studentarea';

const appReducer = combineReducers({
    subjects,
    navigation,
    periods,
    student,
    grades,
    studentarea,
});

const rootReducer = (state, action) => {
    if(action.type === 'LOG_OUT') {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;