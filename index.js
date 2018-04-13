/****
 * Example is using AWS Kinesis
 *
 ****/
const fastify = require('fastify')();

fastify.get('/user/:username/wallet', async (request, reply) => {
  const username = request.params.username || '';

  // Get the currency rates from the coins service
  // Connect to Stream and wait for the response from producer in specific topic

  // Calculate the wallet

  // Get the user info
  const userInfo = {
    username,
    wallet: '100'
  }

  return { data: userInfo }

});

/**
 * Absraction layer to write to stream mechanism
 * Allows us to move away from Kinesis or Kafka when ready.
 **/
const AWS = require('aws-sdk');
const Kinesis = new AWS.Kinesis({
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: '',
});
const writeToStream = async (data, fromSer) => {

}

const readFromStream = async (topic) => {}


// I think there should be two pieces.  API for the public and a producer/consumer
// for services.
const getCurrentRates = async () => {
  return [{
    coin: 'BTC',
    rate: '5',
    currency: 'USD'
  }]
}

fastify.get('/coin/rates', async (request, reply) => {

  // Some dumb response for now.
  const rates = await getCurrentRates();
  return { data: rates }

});

// Something here that consumes requests from Stream
// and then produces a response.
const codeToRunInternalComm = () => {}


const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info('server listening on 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}


start();
