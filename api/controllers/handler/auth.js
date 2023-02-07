const { TokenService } = require('../../utils/tokenAuthentication');
const { 
        userLoginSchema, 
        validateOTPSchema, 
        otpGenerationSchema, 
        adminPasswordResetSchema, 
        adminLoginSchema
    } = require('../schema/auth');
const { hashPassword, verifyPassword } = require('../../utils/hash.js');
const { SentryErrorLogging } = require('../../utils/exceptionHandler');
const { nodeMailer } = require('../../utils/nodeMailer');
const { resetMail } = require('../../mails/reset-password')

const tokenService = new TokenService();

class UserHandler {

    async userLogin(req,res){
        try{
            const request_object = req.body;
            const value = userLoginSchema.validate(request_object);         
            if (!value.error){   
                const user = await req.prisma.UserModel.findUnique({
                    where:{
                        email : request_object.email
                    }
                });
                if(user){
                    if(request_object.channel === "email-password" && user.channel === "email-password"){
                        const verifyPass = await verifyPassword(request_object.password, user.password);
                        if(verifyPass){                        
                            const token =  await tokenService.generateToken(user.id);
                            await req.prisma.UserLogs.create({
                                data:{
                                    user_id: user.id,
                                    action: 'login'
                                }
                            });                        
                            res.status(201).send({bearer_token :token});
                        }else{
                            res.status(400).send({
                                    details:'Incorrect password'
                                });
                        }                  
                    }else if(request_object.channel === "socials"){                        
                            const user = await req.prisma.UserModel.findMany({
                                where:{ AND:[
                                    { email : request_object.email },
                                    { channel : 'social' },
                                ]
                                }
                            });
                            if(user.length){
                                const token =  await tokenService.generateToken(user[0].id);
                                await req.prisma.UserLogs.create({
                                    data:{
                                        user_id: user[0].id,
                                        action: 'login'
                                    }
                                });                        
                                res.status(201).send({bearer_token :token});
                            }else{
                                res.status(400).send({ details:'incorrect email address or login channel'});
                            }
                        
                    }else{
                        res.status(400).send({ details:'incorrect email address'});
                    }
                }else{
                    res.status(400).send({ details:'incorrect email address'});
                }
            }else{  
                res.status(403).send({
                        details: 'Check email or password and try again'
                    });
            }   
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }

    async adminUserLogin(req,res){
        try{
            const request_object = req.body;
            const value = adminLoginSchema.validate(request_object);
            if (!value.error){         
                const user = await req.prisma.AdminUserModel.findUnique({
                    where:{
                        email : request_object.email
                    }
                });
                if(user){
                    const verifyPass = await verifyPassword(request_object.password, user.password);
                    if(verifyPass){                        
                        const token =  await tokenService.generateAdminToken(user.id); 
                        await req.prisma.UserLogs.create({
                            data:{
                                admin_user_id: user.id,
                                action: 'login'
                            }
                        }); 
                        res.status(201).send({bearer_token :token});
                    }else{
                        res.status(400).send({
                                details:'Incorrect password'
                            });
                    }
                }else{
                    res.status(400).send({
                            details:'incorrect email address'
                        });
                }
            }else{  
                res.status(403).send({
                        details: 'Check email or password and try again'
                    });
            }   
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }

    async adminPartnerLogin(req,res){
        try{
            const request_object = req.body;
            const value = userLoginSchema.validate(request_object);
            if (!value.error){         
                const user = await req.prisma.PartnerUsers.findUnique({
                    where:{
                        email : request_object.email
                    }
                });
                if(user){
                    const verifyPass = await verifyPassword(request_object.password, user.password);
                    if(verifyPass){                        
                        const token =  await tokenService.generatePartnerToken(user.id, user.permission); 
                        await req.prisma.UserLogs.create({
                            data:{
                                admin_user_id: user.id,
                                action: 'login'
                            }
                        }); 
                        res.status(201).send({bearer_token :token});
                    }else{
                        res.status(400).send({
                                details:'Incorrect password'
                            });
                    }
                }else{
                    res.status(400).send({
                            details:'incorrect email address'
                        });
                }
            }else{  
                res.status(403).send({
                        details: 'Check email or password and try again'
                    });
            }   
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }

    async resetAdminPassword(req, res){
        try{
            const request_object = req.body;
            const value = adminPasswordResetSchema.validate(request_object);
            if (!value.error){       
                const user = await req.prisma.AdminUserModel.findUnique({
                    where:{
                        id : req.user.id
                    }
                });
                const verifyPass = await verifyPassword(request_object.previous, user.password);
                if(verifyPass){                        
                    const hashed_password = await hashPassword(request_object.newPassword);
                    const reset_ = await req.prisma.AdminUserModel.update({
                        where:{
                            id: req.user.id
                        },
                        data: {
                                password: hashed_password.hash
                            }
                        });                            
                    if(reset_){
                        await req.prisma.UserLogs.create({
                            data:{
                                admin_user_id: req.user.id,
                                action: `Reset password`
                            }
                        }); 
                        res.status(201).send({details:'User password updated successfully '});
                    }else{
                        res.status(400).send({details:'Failed to update user password'})
                    }
                }else{
                    res.status(400).send({
                            details:'Incorrect password passed'
                        });
                }                
            }else{         
                res.status(403).send({details: 'Check payload data and try again'});
            }   
        }
        catch(error){
            SentryErrorLogging(error);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }  
    
    async requestOTP (req, res){
        try{
            const request_object = req.body;
            const validate_input = otpGenerationSchema.validate(request_object);
            if (!validate_input.error){  
                const user = await req.prisma.UserModel.findUnique({
                    where:{
                        email : request_object.email
                    }
                });
                if(user){
                    this.otp = function genRandonString(){
                        var chars = 'ABCDEFGHJKMNPQRTUVWXYZ2346789';
                        var charLength = chars.length;
                        var result = '';
                        var length = 5;
                        for ( var i = 0; i < length; i++ ) {
                        result += chars.charAt(Math.floor(Math.random() * charLength));
                        }
                        return result;
                    }
                    const otpString = this.otp();
                    const mailHtml = resetMail(otpString);
                    req.session.set(`user_${request_object.email}_otp`,otpString)
                    const send_mail = await nodeMailer(request_object.email,'Password Reset Code', mailHtml)
                    if (send_mail){  
                        console.log(otpString)                     
                        res.status(201)
                        return { details: `Email to ${request_object.email} with OTP sent successfully` };  
                    }else{
                        res.status(500)
                        return { details: 'Email not sent.' };
                    };                    
                }else{
                    res.status(400).send({details: 'Email not found'});
                }
            }else{
                res.status(403).send({details: 'Check payload data and try again'});
            }
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: e.message});      
        }
    };

    async adminRequestOTP (req, res){
        try{
            const request_object = req.body;
            const validate_input = otpGenerationSchema.validate(request_object);
            if (!validate_input.error){  
                const user = await req.prisma.AdminUserModel.findUnique({
                    where:{
                        email : request_object.email
                    }
                });
                if(user){
                    this.otp = function genRandonString(){
                        var chars = 'ABCDEFGHJKMNPQRTUVWXYZ2346789';
                        var charLength = chars.length;
                        var result = '';
                        var length = 5;
                        for ( var i = 0; i < length; i++ ) {
                        result += chars.charAt(Math.floor(Math.random() * charLength));
                        }
                        return result;
                    }
                    const otpString = this.otp();
                    const mailHtml = resetMail(otpString);
                    req.session.set(`admin_user_${request_object.email}_otp`,otpString)
                    const send_mail = await nodeMailer(request_object.email,'Password Reset Code', mailHtml)
                    if (send_mail){  
                        return {
                            details: `Email to ${request_object.email} with OTP sent successfully`
                        };
                    }else{
                        SentryErrorLogging(send_mail.details);
                        res.status(500)
                        return {
                            details: 'Email not sent successfully'
                        };
                    };
                }else{
                    res.status(400).send({details: 'Email not found'});
                }
            }else{
                res.status(403).send({details: 'Check payload data and try again'});
            }
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: e.message});      
        }
    }

    async confirmOtp(req, res){
        try{
            const request_object = req.body;
            const validate_input = validateOTPSchema.validate(request_object);
            if (!validate_input.error){  
                const sess_otp = req.session.get(`user_${request_object.email}_otp`)
                
                if(sess_otp && sess_otp === request_object.otp){
                    const user = await req.prisma.UserModel.findUnique({
                        where:{
                            email : request_object.email
                        }
                    });
                    if(user){
                        req.session.delete(`user_${request_object.email}_otp`);
                        const hashed_password = await hashPassword(request_object.new_password);
                        await req.prisma.UserModel.update({
                            where:{
                                email : request_object.email
                            },
                            data:{
                                password:hashed_password.hash,
                                token:"",
                                channel:"email-password"
                            }
                        });
                        res.status(200).send({details:'Password reset successful'});
                    }else{
                        res.status(400).send({details:'Check email and try again'});
                    }
                }else{
                    res.status(403).send({details:'Incorrect OTP sent'});
                }
            }else{
                res.status(403).send({details: 'Check payload data and try again'});
            }
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }
    async adminConfirmOtp(req, res){
        try{
            const request_object = req.body;
            const validate_input = validateOTPSchema.validate(request_object);
            if (!validate_input.error){  
                const sess_otp = req.session.get(`user_${request_object.email}_otp`)
                
                if(sess_otp && sess_otp === request_object.otp){
                    req.session.delete(`admin_user_${request_object.email}_otp`);
                    const admin_user = await req.prisma.AdminUserModel.findUnique({
                        where:{
                            email : request_object.email
                        }
                    });
                    if(admin_user.length){
                        const hashed_password = await hashPassword(request_object.new_password);

                        const admin_user = await req.prisma.AdminUserModel.update({
                            where:{
                                email : request_object.email
                            },
                            data:{
                                password:hashed_password.hash
                            }
                        });
                        res.status(200).send({details:'Password reset successful'});
                    }else{
                        res.status(400).send({details:'Check email and try again'});
                    }
                }else{
                    res.status(403).send({details:'Incorrect OTP sent'});
                }
            }else{
                res.status(403).send({details: 'Check payload data and try again'});
            }
        }catch(e){
            SentryErrorLogging(e);
            res.status(500).send({details: 'service currently unavailable'});
        }
    }
}

module.exports = {
    UserHandler    
};