
const fastifyPrismaClient = require("fastify-prisma-client");

const fastifysecuresession = require('@fastify/secure-session');

const fs = require('fs');

const path = require('path');

const authRoutes = require('../routes/auth/index');
const allPlugins = async (fastify) =>{   

    await  fastify.register(fastifysecuresession,{
        key: fs.readFileSync(path.join(__dirname, '../secret-key'))
    });

    await fastify.register(require('@fastify/cors'),{
        origin:true
    });        

    await fastify.register(require('fastify-bcrypt'), {
        saltWorkFactor: 12
    });    

    await  fastify.register(require('@fastify/multipart'), {
        addToBody: true
    });
    
    await fastify.register(require('@fastify/swagger'),{
        exposeRoute: true,
        routePrefix:'/api-docs',
        swagger:{
            info:{
                title:'Lifesten-services',
                description: 'Lifesten Backend services [Construction Underway]',
                version: '1.0.0'
            }
        },
        host: `localhost:${process.env.PORT}`,
        schemes: ['http'],
        uiHooks: {
            preHandler: function (request, reply, next) { next() }
        },
        securityDefinitions: {
            apiKey: {
                type: "apiKey",
                description:
                    'Standard Authorization header using the Bearer scheme. Example: "Bearer {TOKEN}"',
                name: "Authorization",
                in: "header",
                },
            },
            security: [{ apiKey: [] }],
        consumes: ['application/json','multipart/form-data'],
        produces: ['application/json'],
    });
    
    await fastify.register(authRoutes,{prefix : '/api/auth'})
    await fastify.register(fastifyPrismaClient,{});  
    await fastify.after();
    await fastify.ready();

}

module.exports = { allPlugins };