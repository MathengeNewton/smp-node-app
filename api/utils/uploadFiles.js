const { SentryErrorLogging } = require('./exceptionHandler')
const fs = require('fs').promises;

const upload_to_local = async (file) => {
    try{
        const localFilePath = `./uploads/${file.filename}`;
        await fs.writeFile(localFilePath, file.data);
        return localFilePath;        
    }catch(err){
        SentryErrorLogging(err);
        return false;
    }        
}

const upload_image_files = async (file) => {
    try{
        const local_url = await upload_to_local(file);
        if(typeof local_url === 'string'){
            return true;
        }else{
            return false;
        }
    }catch(error){
        SentryErrorLogging(error);
        return false;
    }
}

module.exports = { upload_image_files }