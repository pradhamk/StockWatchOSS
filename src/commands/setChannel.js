const { MessageEmbed } = require('discord.js');
const { missingParamEmbed } = require('../utils/missingParamEmbed');

async function setChannelId(channelId, gid, client, channels) {
	if (channelId == null) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Set Channel For Data Aggregation')
		.setAuthor({ name: client.user.username })
		.setDescription(`Set the channel for ${client.user.username}'s data aggregation`)
		.setThumbnail(client.user.avatarURL())
		.setFooter({ text: 'Please make sure the channel id specified is valid' });
	const document = await channels.findOne({ guild: gid });
	if (document) {
		await channels.updateOne(document, { $set: { guild: gid, channel: channelId } });
	}
	else {
		await channels.insertOne({ guild: gid, channel: channelId });
	}
	embed.addField('New Channel:', `**${channelId}**`);
	return embed;
}

module.exports = {
	setChannelId,
};