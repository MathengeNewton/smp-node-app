const joi  = require('./entry');

const adminPasswordResetSchema = joi.object({
    previous: joi.string().required(),
    newPassword: joi.string().required()    
}).with('previous','newPassword');

const otpGenerationSchema = joi.object({
    email: joi.string().email().min(6).max(320).lowercase().required()
})

const validateOTPSchema = joi.object({
    email: joi.string().email().min(6).max(320).lowercase().required(),
    otp: joi.string().min(5).max(5).required(),
    new_password: joi.string().required(),
}).with('otp','email')


const userLoginSchema = joi.object({
    email: joi.string().email().min(6).max(320).lowercase().required(),
    password: joi.string().min(6),
    channel: joi.string().required(),
})

const adminLoginSchema = joi.object({
    email: joi.string().email().min(6).max(320).lowercase().required(),
    password: joi.string().min(6),
})


module.exports = {
    userLoginSchema, 
    validateOTPSchema, 
    otpGenerationSchema, 
    adminPasswordResetSchema, 
    adminLoginSchema
}