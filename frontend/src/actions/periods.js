export function choosePeriod(period) {
    return {
        type: 'CHOOSE_PERIOD',
        period,
    }
}

export function getAllPeriods(allPeriods) {
    return {
        type: 'GET_ALL_PERIODS',
        allPeriods
    }
}