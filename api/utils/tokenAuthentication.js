const { SentryErrorLogging } = require('./exceptionHandler');
const jwt = require('jsonwebtoken');

function genRandonString(){
    var chars = 'ABCDEFGHJKMNPQRTUVWXYZ2346789';
    var charLength = chars.length;
    var result = '';
    var length = 12;
    for ( var i = 0; i < length; i++ ) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}

class TokenService {

    constructor(){
        this.key = function generateKeyToken(){
            return window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256
                },
                    true,
                    ["encrypt", "decrypt"]
                );
        } 
    }

    async generateToken( userId){
        try{
            return jwt.sign({ user: userId }, 'shhhhh', { expiresIn: 60 * 60 * 60 });
        }catch(error){
            SentryErrorLogging(error);
            return false;
        }
    }

    async generateConfirmationToken(user_id){
        try{
            return jwt.sign({ token: user_id }, 'shhhhh', { expiresIn: 60 * 60 * 60 * 24 });
        }catch(error){
            SentryErrorLogging(error)
            return false;
        }
    }

    async generateAdminToken( userId){
        try{
            return jwt.sign({ admin_user: userId }, 'shhhhh', { expiresIn: 60 * 60 * 60  });
        }catch(error){
            SentryErrorLogging(error);
            return false;
        }
    }

    async generatePartnerToken( userId, permission, partner_id){
        try{
            return jwt.sign({ partner_user: userId, permission:permission, partner_id:partner_id }, 'shhhhh', { expiresIn: 60 * 60 * 60  });
        }catch(error){
            SentryErrorLogging(error);
            return false;
        }
    }
    
}

const verify_user_token =  (req, res, done)=>{
    const {authorization}= req.headers;
    const authstring = authorization.replace("Bearer ","");
    try{
        
        jwt.verify(authstring,'shhhhh',async (error, decoded_token)=>{
            if(error){
                SentryErrorLogging(error);
                done(new Error('Unauthorized access'))
            }else{
                if(decoded_token.user){
                    req.user = {
                        id:decoded_token.user
                    }
                }else if(decoded_token.admin_user){
                    done(new Error('Account unauthorized to perform operation.'))
                }else{
                    done(new Error('Unauthorized access.'))
                }
            }           
        });
    }catch(error){
        SentryErrorLogging(error);
        done(new Error('Unauthorized access'))
    }   
    done();
}


const verify_admin_token = (req, res, done)=>{   
    const {authorization}= req.headers;
    const authstring = authorization.replace("Bearer ","");
    try{
        jwt.verify(authstring,'shhhhh',async (error, decoded_token)=>{
            if(error){
                SentryErrorLogging(error);
                done(new Error('Unauthorized access'))
            }else{
                if(decoded_token.admin_user){
                    req.user = {
                        id:decoded_token.admin_user
                    }
                }else if(decoded_token.user){
                    done(new Error('Account unauthorized to perform operation.'))
                }else{
                    done(new Error('Unauthorized access.'))
                }
            }           
        });
    }catch(error){
        SentryErrorLogging(error);
        done(new Error('Unauthorized access'))
    }   
    done();
}

const verify__token = (req, res, done)=>{  
    const {authorization}= req.headers;
    const authstring = authorization.replace("Bearer ","");
    try{
        jwt.verify(authstring,'shhhhh',async (error, decoded_token)=>{
            if(error){
                SentryErrorLogging(error);
                done(new Error('Unauthorized access'))
            }else{
                if(decoded_token.admin_user){
                    req.user = {
                        id:decoded_token.admin_user
                    }
                }else if(decoded_token.token){
                    req.user = {
                        id:decoded_token.token
                    }
                }else if(decoded_token.user){
                    const user_id =await req.session.get(`user_${decoded_token.user}_id`);
                    req.user = {
                        id:user_id
                    }
                }else if(decoded_token.partner_user && decoded_token.permission !== null && decoded_token.partner_id ){
                    req.user = {
                        id:decoded_token.partner_user,
                        permission:decoded_token.permission,
                        partner_id:decoded_token.partner_id
                    }
                }else{
                    done(new Error('Unauthorized access.'))
                }
            }           
        });
    }catch(error){
        SentryErrorLogging(error);
        done(new Error('Unauthorized access'))
    }   
    done();
}

module.exports = {
    TokenService,
    verify_user_token,
    verify_admin_token,
    verify__token
}