export function chooseOneclass(oneclass) {
    return {
        type: 'CHOOSE_ONECLASS',
        oneclass
    }
}

export function getAllClasses(allClasses, classesLastUpdate) {
    return {
        type: 'GET_ALL_CLASSES',
        allClasses,
        classesLastUpdate
    }
}