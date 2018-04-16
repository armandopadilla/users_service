/****
 * User service
 *
 * Sign up - Example of Fire-and-Forget. Writes to DB, and in the
 * background the wallet is created.
 *
 * Get Wallets - Yes Yes I know this should live in the wallets service.
 * I just want to prove a point. GAWD!!!!  Using this to demostrate creating
 * and updating VIEWS.  Overall using CQRS Pattern
 ****/
const fastify = require('fastify')();
const Joi = require('joi');
const { User } = require('./db');
const DataStream = require('./utils/DataStream');

// Constants!
const { WALLET_CREATE_WALLET_STREAM } = require('./constants');

const opts = {
 schema: {
   body: Joi.object().keys({
     email: Joi.string().email().min(6).max(255).required(),
     firstName: Joi.string().min(1).max(255).required(),
     password: Joi.string().min(6).max(40).required(),
   }).required()
 },
 schemaCompiler: schema => data => Joi.validate(data, schema)
}

/**
 * Sign the user up.  Create their first wallet
 * Example of Fire-and-Forget.  The creation of the wallet
 * is handled by the wallet-service and triggered by event.
 **/
fastify.post('/signup', opts, async (request, reply) => {
  const { email, firstName, password } = request.body;

  // Save to the Db
  try {
    const userInfo = await User.query().insert({
      email, firstName, password
    });

    // Create the Wallet - Fire-and-Forget!
    const payload = { userId: userInfo.id, type: 'btc' };
    DataStream.write(WALLET_CREATE_WALLET_STREAM, payload);

    return reply.send({ id: userInfo.id, email, firstName, password });
  } catch (error) {
    // Log this correctly dude.
    // Use Boom...ish.
    console.error(error.message);
    return reply.code(500);
  }
});


/**
 * Get this specific user's wallets
 * Example of CQRS. I would actually make this into a
 * wallets service with an API endpoint of /user/:userId/wallets
 * to fetch the wallets for a specific user. This would remove the
 * need create the wallets VIEW in this service.
 @todo
 **/
fastify.get('/user/:userId/wallets', {
  schema: {
    params: {
      userId: Joi.number().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema)
}, async (request, reply) => {
  const { userId } = request.params || '';

  const wallets = [];
  return { data: wallets }
});


const start = async () => {
  try {
    await fastify.listen(3001);
    fastify.log.info('server listening on 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
