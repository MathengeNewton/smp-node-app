const bcrypt = require("bcrypt");

const hashPassword = async (password)=> {
    const salt = await bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);

    return  { hash: hash };
}

async function verifyPassword(candidatepassword,hash){
    const candidateHash= await bcrypt.compare(candidatepassword, hash);

    return candidateHash;
}

module.exports = {
    hashPassword, verifyPassword
}