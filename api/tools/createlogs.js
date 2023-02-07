const fs = require('fs-extra');
const { SentryErrorLogging } = require('../utils/exceptionHandler');

const write_log_file =  (file_name,error) => {
    try{
        fs.outputFile(`logs/${file_name}.txt`, JSON.stringify(error));
    }catch(err){
        SentryErrorLogging(err);
        return {
            message: err.message || "Unable to write log file"
        }
    }
};

module.exports = write_log_file;


