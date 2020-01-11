export function chooseSubject(subject) {
    return {
        type: 'CHOOSE_SUBJECT',
        subject
    }
}

export function getAllSubjects(allSubjects) {
    return {
        type: 'GET_ALL_SUBJECTS',
        allSubjects,
    }
}