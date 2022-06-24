const { DISCORD_OWNER_ID, DATA_API_KEY } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { missingParamEmbed } = require('../utils/missingParamEmbed');
const axios = require('axios');

async function getIndicator(ticker, indicator, gid, uid, client, guilds) {
	if (ticker == null || indicator == null) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	ticker = ticker.toUpperCase();
	indicator = indicator.toLowerCase();
	const url = `https://api.twelvedata.com/${indicator}?symbol=${ticker}&interval=5min&apikey=${DATA_API_KEY}`;
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle(`**${ticker}** Data`)
		.setAuthor({ name: client.user.username })
		.setDescription(`**${indicator.toUpperCase()}** for **${ticker}**`)
		.setThumbnail(client.user.avatarURL());
	const document = await guilds.findOne({ guild: gid });
	let icount;
	let limited;
	let ncount;
	try {
		icount = document.icount + 1;
	}
	catch (err) {
		icount = 1;
	}
	try {
		limited = document.limited;
	}
	catch (err) {
		limited = false;
	}
	try {
		ncount = document.ncount;
	}
	catch (err) {
		ncount = 0;
	}
	// eslint-disable-next-line eqeqeq
	if (icount > 10 && uid != DISCORD_OWNER_ID) {
		embed.setTitle('This server has been rate-limited for data')
			.setDescription('This server is currently rate-limited. Please try again later');
		return embed;
	}
	if (isNaN(icount)) { icount = 1; }
	if (isNaN(ncount)) { ncount = 0; }
	const other = { $set: { guild: gid, limited, icount, ncount } };
	if (document) {
		guilds.updateOne(document, other);
	}
	else {
		guilds.insertOne({ guild: gid, limited: false, icount: 1, ncount: 0 });
	}
	const vals = await axios.get(url);
	embed.addField(`Description of ${indicator.toUpperCase()}:`, vals.data.meta.indicator.name);
	const curr = vals.data.values[0];
	const prev = vals.data.values[1];
	for (const val in curr) {
		embed.addField(val.toUpperCase() + ':', curr[val]);
	}
	for (const val in prev) {
		embed.addField(val.toUpperCase() + ':', prev[val]);
	}
	return embed;
}

module.exports = {
	getIndicator,
};