const { UserHandler } = require("../../controllers/handler/auth");
const  { 
    loginSchema, 
    userResetPasswordSchema, 
    confirmOTPSchema,
    adminConfirmOTPSchema,
    adminLoginSchema,
    adminResetPasswordSchema,
    resetPasswordSchema,
} = require('../schema/auth');

const {  verify_admin_token } = require('../../utils/tokenAuthentication');


function authRoutes(fastify, options,done) {
    const userHandler = new UserHandler(fastify);   

    const userLogin = {
        schema:loginSchema,
        handler: userHandler.userLogin
    };   

    const userResetPassword = {
        schema:userResetPasswordSchema,
        handler: userHandler.requestOTP
    };

    const userCofirmOTP = {
        schema:confirmOTPSchema            
        ,handler: userHandler.confirmOtp
    };

    const dashboardLogin = {
        schema:adminLoginSchema,
        handler: userHandler.adminUserLogin
    };

   

    const dashboardResetPassword = {
        schema:adminResetPasswordSchema,
        handler: userHandler.adminRequestOTP
    };

    const dashboardCofirmOTP = {
        schema:adminConfirmOTPSchema            
        ,handler: userHandler.adminConfirmOtp
    };

    const resetPassword = {
        schema:resetPasswordSchema,
        handler: userHandler.resetAdminPassword
    } 

    fastify.post('/login', userLogin);

    fastify.post('/password-reset-request', userResetPassword);

    fastify.post('/confirm-otp', userCofirmOTP);

    fastify.post('/admin/login', dashboardLogin);

    fastify.post('/admin/password-reset-request', dashboardResetPassword);

    fastify.post('/admin/confirm-otp', dashboardCofirmOTP);

    done();
    
}

module.exports =  authRoutes ;