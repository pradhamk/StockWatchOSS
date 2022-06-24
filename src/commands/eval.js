const { MessageEmbed } = require('discord.js');
const { missingPermissions } = require('../utils/missingPermEmbed');
const { missingParameters } = require('../utils/missingParamEmbed');
const logger = require('npmlog');
const { DISCORD_OWNER_ID } = require('../config.json');

async function doEval(command, uid, client) {
	logger.info(`${uid} is trying to eval ${command}`);
	if (uid != DISCORD_OWNER_ID) { return missingPermissions; }
	if (command == null) { return missingParameters.setAuthor({ name: client.user.username }).setThumbnail(client.user.avatarURL()); }
	const val = command.join(' ');
	const embed = new MessageEmbed()
		.setColor('#571dde')
		.setTitle('Eval')
		.setAuthor({ name: client.user.username })
		.setDescription('Evaluates code')
		.setThumbnail(client.user.avatarURL())
		.addField('Command', `${val}`);
	try {
		const output = eval(val);
		embed.addField('Result', output.toString());
	}
	catch (err) {
		logger.error(err);
		embed.addField('Error', `${err}`);
	}
	return embed;
}

module.exports = {
	doEval,
};