const env = require('dotenv').config({path: __dirname + '/../.env' })

const { hashPassword } = require('../utils/hash');

async function main(fastify){
    try{
        const password = await hashPassword(env.parsed.ADMIN_PASSWORD);
        const admin_user = {
            data: {
                email: env.parsed.ADMIN_USER_EMAIL,
                user_name: env.parsed.ADMIN_USER_NAME,
                password: password.hash,
            }
        }
        const get_admin_user = await fastify.prisma.AdminsModel.findMany({
            where:{
                email: env.parsed.ADMIN_USER_EMAIL
            }
        })
        if(!get_admin_user.length){
            await fastify.prisma.AdminsModel.create(admin_user);
            console.log(`Admin user ${env.parsed.ADMIN_USER_EMAIL} created successfully`);   
        }else{
            console.log(`Admin user ${env.parsed.ADMIN_USER_EMAIL} already exists.`);
        }
        console.log(`Seeding process complete. Application will now run`);
    }catch(error){
        console.log(`Error: ${error}`)
        await fastify.prisma.$disconnect()
        process.exit(1)
    }
}

module.exports = { main };