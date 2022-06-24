const { MessageEmbed } = require('discord.js');
const axios = require('axios');

async function upcoming(client) {
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Upcoming Features')
		.setAuthor({ name: client.user.username })
		.setDescription(`Upcoming features for ${client.user.username}`)
		.setThumbnail(client.user.avatarURL());
	const url = 'https://raw.githubusercontent.com/pradhamk/StockWatchOSS/master/upcoming.txt';
	const upcomingStuff = await axios.get(url);
	let stuff = upcomingStuff.data.split('\n');
	stuff = stuff.filter(x => x !== '');
	for (const change in stuff) {
		embed.addField(`Change #${parseInt(change) + 1}`, stuff[change]);
	}
	return embed;
}

module.exports = {
	upcoming,
};
