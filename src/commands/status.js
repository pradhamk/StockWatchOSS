const { MessageEmbed } = require('discord.js');

async function status(time, client) {
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Status')
		.setAuthor({ name: client.user.username })
		.setDescription('Bot\'s status')
		.setThumbnail(client.user.avatarURL());
	const curr = new Date();
	const min = (time.getMinutes() + 60) - curr.getMinutes();
	const sec = (time.getSeconds() + 60) - curr.getSeconds();
	embed.addField('Time Left For Aggregation (Sometimes buggy)', `\`${min} min. and ${sec} sec.\``);
	return embed;
}

module.exports = {
	status,
};