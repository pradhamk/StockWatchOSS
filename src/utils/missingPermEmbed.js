const { MessageEmbed } = require('discord.js');

const missingPermissions = new MessageEmbed()
	.setColor('#fc0324')
	.setTitle('Missing Permissions')
	.setDescription('This command is only available to the owner');

module.exports = {
	missingPermissions,
};
