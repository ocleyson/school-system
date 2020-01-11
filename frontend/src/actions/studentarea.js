export function studentPeriods(periods, periodsLastUpdate) {
    return {
        type: 'STUDENT_PERIODS',
        periods,
        periodsLastUpdate
    }
}

export function studentSubjects(subjects, subjectsLastUpdate) {
    return {
        type: 'STUDENT_SUBJECTS',
        subjects,
        subjectsLastUpdate
    }
}

export function studentGrades(grades, gradesLastUpdate) {
    return {
        type: 'STUDENT_GRADES',
        grades,
        gradesLastUpdate
    }
}