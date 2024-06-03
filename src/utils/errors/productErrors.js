// utils/errors/generateProdcutErrorInfo.js
function generateProductErrorInfo({ title, category, description, price, thumbnail, code, stock }) {

    let errorInfo = 'Invalid data: ';

    if (!title) {
        errorInfo += 'tittle missing, ';
    }
    if (!category) {
        errorInfo += 'category missing, ';
    }
    if (!description) {
        errorInfo += 'description missing, ';
    }
    if (!price) {
        errorInfo += 'price missing, ';
    }
    if (!thumbnail) {
        errorInfo += 'thumbnail missing, ';
    }
    if (!code) {
        errorInfo += 'code missing, ';
    }
    if (!stock) {
        errorInfo += 'stock missing, ';
    }

    if (errorInfo.endsWith(', ')) {
        errorInfo = errorInfo.slice(0, -2);
    }

    return errorInfo;
}

module.exports = generateProductErrorInfo;
