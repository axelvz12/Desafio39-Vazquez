// utils/errors/generateUserErrorInfo.js
function generateUserErrorInfo({ first_name, last_name, email }) {

    let errorInfo = 'Invalid data: ';

    if (!first_name) {
        errorInfo += 'first_name missing, ';
    }
    if (!last_name) {
        errorInfo += 'last_name missing, ';
    }
    if (!email) {
        errorInfo += 'email missing';
    }

    if (errorInfo.endsWith(', ')) {
        errorInfo = errorInfo.slice(0, -2);
    }

    return errorInfo;
}

module.exports = generateUserErrorInfo;
