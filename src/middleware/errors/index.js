const errorsDictionary = require("../../utils/errors/errorsDictionary");

const handleErrors = (error, req, res, next) => {
    console.error(error); 

    switch (error.code) {
        case errorsDictionary.INVALID_TYPES_ERROR:
            res.status(400).json({ status: "error", error: error.message });
            break;
        default:
            res.status(500).json({ status: "error", error: "Unhandled error" });
            break;
    }
};

module.exports = handleErrors;

