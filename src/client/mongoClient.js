const { MongoClient } = require('mongodb');
const { MONGO_URL } = require('../config');
const mongoClient = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect((err) => { if (err) throw err;});
const tickers = mongoClient.db('stockbot').collection('tickers');
const guilds = mongoClient.db('stockbot').collection('guilds');
const prefix = mongoClient.db('stockbot').collection('prefix');
const channels = mongoClient.db('stockbot').collection('channels');

module.exports = {
	tickers,
	guilds,
	prefix,
	channels,
};