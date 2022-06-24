const { MessageEmbed } = require('discord.js');
const { missingParamEmbed } = require('../utils/missingParamEmbed');

async function remove(ticker, gid, tickers, client, channel) {
	if (ticker == null) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	ticker = ticker.map(x => x.toUpperCase());
	let t;
	for (t of ticker) {
		const embed = new MessageEmbed()
			.setColor('#571dde')
			.setTitle(`**${t}** Successfully Removed`)
			.setAuthor({ name: client.user.username })
			.setDescription('Stock Ticker Successfully Removed')
			.setThumbnail(client.user.avatarURL());
		const document = await tickers.findOne({ guild: gid, ticker: t });
		if (document) { tickers.deleteOne(document); }
		else {
			embed.setTitle(`**${t}** Is Not In The Watchlist`)
				.setDescription('Stock ticker could not be removed');
		}
		channel.send({ embeds: [embed] });
	}
}

module.exports = {
	remove,
};