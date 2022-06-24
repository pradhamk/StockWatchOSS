const { missingParamEmbed } = require('../utils/missingParamEmbed');
const { MessageEmbed } = require('discord.js');
const { checkTicker } = require('../utils/checkTicker');

async function add(ticker, gid, tickers, client, channel) {
	if (ticker == null) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	ticker = ticker.map(x => x.toUpperCase());
	let t;
	for (t of ticker) {
		const embed = new MessageEmbed()
			.setColor('#571dde')
			.setTitle(`**${t}** Successfully Added`)
			.setAuthor({ name: client.user.username })
			.setDescription('Stock Ticker Successfully Added')
			.setThumbnail(client.user.avatarURL());
		if (!await checkTicker(t)) {
			embed.setTitle(`**${t}** Does Not Exist Or Couldn't Be Added`)
				.setDescription('Stock ticker could not be addded');
		}
		else if (await tickers.findOne({ guild: gid, ticker: t })) {
			embed.setTitle(`**${t}** Is Already In The Watchlist`)
				.setDescription('Stock ticker already exists');
		}
		else { await tickers.insertOne({ guild: gid, ticker: t }); }
		channel.send({ embeds: [embed] });
	}
}

module.exports = {
	add,
};
