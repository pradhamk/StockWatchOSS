const { MessageEmbed } = require('discord.js');

async function about(client) {
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle(`About ${client.user.username}`)
		.setAuthor({ name: client.user.username })
		.setDescription(`${client.user.username} is a bot that can be used to retrieve stock data and news. As of now, ${client.user.username} is in ${client.guilds.cache.size} servers`)
		.setThumbnail(client.user.avatarURL());
	return embed;
}

module.exports = {
	about,
};