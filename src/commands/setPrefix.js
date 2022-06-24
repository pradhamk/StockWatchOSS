const { missingParamEmbed } = require('../utils/missingParamEmbed');
const { MessageEmbed } = require('discord.js');

async function setPrefix(newPrefix, gid, client, prefix) {
	if (newPrefix == null || newPrefix.length > 10) { return missingParamEmbed.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Set Prefix')
		.setAuthor({ name: client.user.username })
		.setDescription(`Set the prefix for ${client.user.username}`)
		.setThumbnail(client.user.avatarURL());
	const document = await prefix.findOne({ guild: gid });
	await prefix.updateOne(document, { $set: { guild: gid, prefix: newPrefix } });
	embed.addField('New Prefix:', `**${newPrefix}**`);
	return embed;
}

module.exports = {
	setPrefix,
};