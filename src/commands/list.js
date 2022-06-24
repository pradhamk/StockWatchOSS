const { MessageEmbed } = require('discord.js');

async function list(tickers, gid, client, channel) {
	let embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Ticker Watchlist')
		.setAuthor({ name: client.user.username })
		.setDescription('Ticker Watchlist')
		.setThumbnail(client.user.avatarURL());
	const tickersList = await tickers.find({ guild: gid }).toArray();
	if (tickersList > 500) {
		embed.setDescription('There are too many tickers in the watchlist. Please remove some with `.rm`');
		return embed;
	}
	if (tickersList.length === 0) { embed.setDescription('No tickers have been added to the watchlist. Use `.add` to do so'); }
	let i = 0;
	for (const ticker of tickersList) {
		if (i >= 25) {
			channel.send({ embeds: [embed] });
			embed = new MessageEmbed()
				.setColor('#571dde')
				.setTitle('Ticker Watchlist')
				.setAuthor({ name: client.user.username })
				.setDescription('Ticker Watchlist')
				.setThumbnail(client.user.avatarURL());
			i = 0;
		}
		embed.addField(`Ticker #${parseInt(i) + 1}`, `**${ticker.ticker}**`);
		i++;
	}
	if (i < 25) {
		channel.send({ embeds: [embed] });
	}
}

module.exports = {
	list,
};