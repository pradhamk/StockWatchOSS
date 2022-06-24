const { MessageEmbed } = require('discord.js');
const logger = require('npmlog');
const axios = require('axios');
const { DATA_API_KEY } = require('../config.json');

async function aggregate(client, tickers, channels) {
	const gids = client.guilds.cache.map(guild => guild.id);
	for (const gid in gids) {
		logger.info(`Trying ${client.guilds.cache.get(gids[gid])}`);
		const embed = new MessageEmbed()
			.setColor('#571dde')
			.setTitle('Watchlist Data')
			.setAuthor({ name: client.user.username })
			.setDescription('Data on all tickers in watchlist')
			.setThumbnail(client.user.avatarURL());
		const tickersList = await tickers.find({ guild: gids[gid] }).toArray();
		const channel = await channels.findOne({ guild: gids[gid] });
		if (channel == undefined) {
			embed.setTitle('No Channel Set for Watchlist Data')
				.setDescription('No channel has been set for the watchlist data. Please use `.channel` to set a channel');
			const defaultChannel = client.guilds.cache.get(gids[gid]).systemChannelId;
			try {
				client.guilds.cache.get(gids[gid]).channels.cache.get(defaultChannel).send({ embeds: [embed] });
			}
			catch (err) {
				logger.error(err);
			}
			continue;
		}
		if (tickersList.length === 0) { continue; }
		let response;
		for (const tickerDoc of tickersList) {
			const ticker = tickerDoc.ticker;
			const quoteUrl = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${DATA_API_KEY}`;
			const priceUrl = `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${DATA_API_KEY}`;
			response = await axios.get(quoteUrl);
			const price = await axios.get(priceUrl);
			try {
				embed.addField(`${ticker} - ${response.data.name}`, `Current Price: $${parseFloat(price.data.price).toFixed(2)}`);
				embed.addFields(
					{ name: 'Exchange', value: response.data.exchange.toUpperCase(), inline: true },
					{ name: 'Open Price', value: `$${parseFloat(response.data.open).toFixed(2)}`, inline: true },
					{ name: 'Volume', value: response.data.volume, inline: true },
					{ name: '52 Week Range', value: `$${parseFloat(response.data.fifty_two_week.low).toFixed(2)} - $${parseFloat(response.data.fifty_two_week.high).toFixed(2)}`, inline: true },
				);
			}
			catch (err) {
				logger.error(`API request doesn't work for ${ticker}`);
			}
		}
		if (!response.data.datetime === undefined) {
			embed.addField('Date', response.data.datetime);
		}
		try {
			client.guilds.cache.get(gids[gid]).channels.cache.get(channel.channel).send({ embeds: [embed] });
		}
		catch (err) {
			logger.error(err);
		}
	}
}

module.exports = {
	aggregate,
};
