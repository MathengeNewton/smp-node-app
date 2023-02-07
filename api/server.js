function ajvPlugin(ajv, options) {
    ajv.addKeyword('isFileType', {
      compile: (schema, parent, it) => {
        parent.type = 'file'
        delete parent.isFileType
        return () => true
      },
    })
  
    return ajv
  }

const fastify = require('fastify')({logger:true,ajv: { plugins: [ajvPlugin] } });

const { allPlugins } = require('./utils/registerPlugins');

allPlugins(fastify);

const { main } = require('./prisma/seed')

fastify.addHook('onReady', async function () {
  await main(fastify);
})

async function start (){
    try { 
        await fastify.listen({ port: process.env.PORT })
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();