const { MessageEmbed } = require('discord.js');

async function getChannelId(message, prefix, gid, client, channels) {
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Set Channel For Data Aggregation')
		.setAuthor({ name: client.user.username })
		.setDescription(`Set the channel for ${client.user.username}'s data aggregation`)
		.setThumbnail(client.user.avatarURL())
		.setFooter({ text: 'Please make sure the channel id specified is valid' });
	const channel = await channels.findOne({ guild: gid });
	if (!channel.channel) {
		embed.setDescription(`No channel has been set. Use \`${prefix}setChannel\` to set one`);
	}
	else {
		embed.setDescription(`The channel currently set is **<#${channel.channel}>**`);
	}
	return embed;
}

module.exports = {
	getChannelId,
};