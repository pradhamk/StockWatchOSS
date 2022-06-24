const { missingParamEmbed } = require('../utils/missingParamEmbed');
const { MessageEmbed } = require('discord.js');
const { DISCORD_OWNER_ID, NEWS_API_KEY } = require('../config.json');
const { checkTicker } = require('../utils/checkTicker');
const logger = require('npmlog');
const axios = require('axios');

async function news(ticker, gid, uid, client, guilds) {
	if (ticker == null) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	ticker = ticker.toUpperCase();
	const url = `https://api.marketaux.com/v1/news/all?symbols=${ticker}&filter_entities=true&language=en&api_token=${NEWS_API_KEY}`;
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle(`**${ticker}** News`)
		.setAuthor({ name: client.user.username })
		.setDescription('News on specified ticker')
		.setThumbnail(client.user.avatarURL());
	let newsData = '';
	const doc = await guilds.findOne({ guild: gid });
	if (doc != null && doc.ncount > 5) { await guilds.updateOne(doc, { $set: { limited: true } }); }
	// eslint-disable-next-line eqeqeq
	if (doc != null && doc.limited && uid != DISCORD_OWNER_ID) { embed.setTitle('This server has been rate-limited for news').setDescription('This server is currently rate-limited. Please try again later'); }
	else if (!await checkTicker(ticker)) { embed.setTitle(`**${ticker}** Does Not Exist`).setDescription('Ticker does not exist'); }
	else {
		try {
			// eslint-disable-next-line no-return-assign
			await axios.get(url).then(res => newsData = res.data.data);
			if (newsData.length === 0) {
				embed.setDescription(`No News could be found for **${ticker}**`);
				return embed;
			}
		}
		catch (err) {
			logger.error(err);
			embed.setTitle(`**${ticker}** News Could Not Be Retrieved`).setDescription('News could not be retrieved');
		}
		if (!doc) { await guilds.insertOne({ guild: gid, limited: false, icount: 0, ncount: 1 }); }
		else { await guilds.updateOne(doc, { $set: { limited: false, icount: doc.icount, ncount: doc.ncount + 1 } }); }
		for (const data in newsData) {
			embed.addField(`${parseInt(data) + 1}) ${newsData[data].title}`, `${newsData[data].description}\nSentiment Score: **${newsData[data].entities[0].sentiment_score}**\n${newsData[data].url}`);
			embed.setImage(newsData[data].image_url);
		}
	}
	return embed;
}

module.exports = {
	news,
};