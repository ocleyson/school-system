module.exports = (seconds, nanoseconds) => {
    var milliseconds = seconds * 1000 + nanoseconds / 1000000;

    var date = new Date(milliseconds);

    return date
}