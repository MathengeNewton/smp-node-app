
const { SentryErrorLogging } = require('../utils/exceptionHandler');

function check_version(running){
    try{
        const fs = require("fs")

        const nvmVersion = fs
            .readFileSync(".node-version")
            .toString()
            .trim();
            
        const desired = `v${nvmVersion}`;    
    
        if (!running.startsWith(desired)) {     
            return {
                status: false,
                message: 'Wrong version detected'
            };
        }else{        
            return {
                status: true,
                message: 'Correct version detected'
            };
        }
    }
    catch(error){
        SentryErrorLogging(error);
        return {
            status: 'error',
            error: error
        }
    }
};

module.exports = check_version