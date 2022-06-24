const { MessageEmbed } = require('discord.js');

const missingParamEmbed = new MessageEmbed()
	.setColor('#fc0324')
	.setTitle('Missing Parameter[s]')
	.setDescription('The specified command is missing its parameter[s]. Please take a look at `.help` for more information');

module.exports = {
	missingParamEmbed,
};
