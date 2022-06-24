const { MessageEmbed } = require('discord.js');

async function help(client, PREFIX) {
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Help Menu')
		.setAuthor({ name: client.user.username })
		.setDescription(`The Help Menu for ${client.user.username}`)
		.setThumbnail(client.user.avatarURL());
	embed.addFields(
		{ name: `**${PREFIX}add [ticker] [ticker] [ticker] etc.**`, value: 'Adds a stock ticker to the watchlist' },
		{ name: `**${PREFIX}rm [ticker] [ticker] [ticker]  etc.**`, value: 'Removes a stock from the the watchlist' },
		{ name: `**${PREFIX}list**`, value: 'List all the tickers in the watchlist' },
		{ name: `**${PREFIX}news [ticker]**`, value: 'Returns 3 news articles about the specified company. A high sentiment score is given to the most positive article' },
		{ name: `**${PREFIX}data [ticker] [indicator]**`, value: 'Returns ticker indicator data' },
		{ name: `**${PREFIX}prefix [prefix]**`, value: 'Allows the user to set a custom prefix' },
		{ name: `**${PREFIX}setchannel [ChannelId]**`, value: 'Allows the user to set a custom channel for watchlist data' },
		{ name: `**${PREFIX}upcoming**`, value: 'Returns upcoming changes and features that will be added to the bot' },
		{ name: `**${PREFIX}about**`, value: 'Information about the bot' },
		{ name: `**${PREFIX}help**`, value: 'Displays this menu' },
		{ name: `**${PREFIX}getchannel**`, value: 'Returns the channel set for aggregation' },
		{ name: `**${PREFIX}eval**`, value: 'Evaluates js code' },
		{ name: `**${PREFIX}say**`, value: 'Makes the bot say something' },
		{ name: `**${PREFIX}status**`, value: 'Returns information such as when the next aggregation is' },
		{ name: 'Indicators:', value: `${client.user.username} supports a wide variety of indicators such as RSI, MA, EMA, etc.` },
		{ name: 'Note:', value: `Currently, **${PREFIX}news and ${PREFIX}data** can become rate-limited\n\nEvery hour, the bot will provide watchlist information`, inline: true },
	);
	return embed;
}

module.exports = {
	help,
};