const loginSchema =  {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    summary: 'Application user login',
    body:{
        type:'object',
        properties : {
            email: {type: 'string', format: 'email'},
            password:{type:"string"},            
        }
    }
};

const adminLoginSchema =  {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    summary: 'Admin user login',
    body:{
        type:'object',
        properties : {
            email: {type: 'string'},
            password:{type:"string"}
        }
    }
};

const userResetPasswordSchema = {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    body:{
        type:'object',
        properties : {
            email: {type: 'string'}
        }
    }
};

const adminResetPasswordSchema = {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    body:{
        type:'object',
        properties : {
            email: {type: 'string'}
        }
    }
};

const resetPasswordSchema = {
    summary: 'Get Admin reset Password',
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    headers:{
        type:'object',
        properties:{
            'authorization': {type:'string'}
        },
        required: ['authorization']
    },
    body:{
        type:'object',
        properties : {
            previous: {type: 'string'},
            newPassword: {type: 'string'}
        },required: ['previous', 'newPassword']
    }
}

const confirmOTPSchema = {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    body:{
        type:'object',
        properties : {
            email: {type: 'string'},
            otp:{type:"string"},
            new_password:{type:"string"}
        }
    }
}

const adminConfirmOTPSchema = {
    tags: ['Authentication'],
    consumes: ['multipart/form-data'],
    body:{
        type:'object',
        properties : {
            email: {type: 'string'},
            otp:{type:"string"},
            new_password:{type:"string"}
        }
    }
}

module.exports = { 
    loginSchema, 
    userResetPasswordSchema, 
    confirmOTPSchema,
    adminConfirmOTPSchema,
    adminLoginSchema,
    adminResetPasswordSchema,
    resetPasswordSchema,
};
