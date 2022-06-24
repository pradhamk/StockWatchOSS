const { Client, Intents, MessageEmbed } = require('discord.js');
const { missingParamEmbed } = require('../utils/missingParamEmbed');
const { missingPermissions } = require('../utils/missingPermEmbed');
const { prefix, tickers, guilds, channels } = require('./mongoClient');
const fs = require('fs');
const path = require('path');
const logger = require('npmlog');
const { TOKEN, DISCORD_OWNER_ID } = require('../config.json');

const commandsPath = __dirname + '/../';
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
	let filePath = path.join(commandsPath, file);
	if (fs.statSync(filePath).isDirectory()) {
		filePath += '/';
		const files = fs.readdirSync(filePath);
		for (const f of files) {
			module.exports[f.split('.')[0]] = require(filePath + f);
		}
	}
	else {
		module.exports[file.split('.')[0]] = require(filePath);
	}
}
logger.info('Modules are loaded');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
let PREFIX = '.';
let currTime;

client.on('ready', async () => {
	missingParamEmbed.setAuthor({ name: client.user.username });
	setInterval(async () => {await module.exports.aggregate.aggregate; currTime = new Date();}, 1000 * 60 * 60, client, tickers, channels);
	currTime = new Date();
	setInterval(await module.exports.clearLimits.clearLimits, 1000 * 60 * 60 * 24, client, guilds);
	logger.info(`${client.user.username} is running`);
});

client.on('messageCreate', async message => {
	if (message.author.bot) {
		return;
	}
	let content = message.content.split(' ').map(x => x.toLowerCase());
	const gid = message.guild.id;
	let temp;
	let embed;
	if (await prefix.findOne({ guild: gid }) == null) {
		await prefix.insertOne({ guild: gid, prefix: '.' });
		PREFIX = '.';
	}
	else {
		temp = await prefix.findOne({ guild: gid });
		PREFIX = temp.prefix;
	}
	try {
		switch (content[0]) {
		case `${PREFIX}add`:
			await module.exports.add.add(content.splice(1), gid, tickers, client, message.channel);
			break;
		case `${PREFIX}rm`:
			await module.exports.rm.remove(content.splice(1), gid, tickers, client, message.channel);
			break;
		case `${PREFIX}list`:
			await module.exports.list.list(tickers, gid, client, message.channel);
			break;
		case `${PREFIX}news`:
			embed = await module.exports.news.news(content[1], gid, message.author.id, client, guilds);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}data`:
			embed = await module.exports.getIndicator.getIndicator(content[1], content[2], gid, message.author.id, client, guilds);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}about`:
			embed = await module.exports.about.about(client);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}help`:
			embed = await module.exports.help.help(client, PREFIX);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}prefix`:
			embed = await module.exports.setPrefix.setPrefix(content[1], gid, client, prefix);
			temp = await prefix.findOne({ guild: gid });
			PREFIX = temp.prefix;
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}setchannel`:
			embed = await module.exports.setChannel.setChannelId(content[1], gid, client, channels);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}upcoming`:
			embed = await module.exports.upcoming.upcoming(client);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}eval`:
			embed = await module.exports.eval.doEval(content.slice(1), message.author.id, client);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}getchannel`:
			embed = await module.exports.getChannel.getChannelId(message, PREFIX, gid, client, channels);
			message.channel.send({ embeds: [embed] });
			break;
		case `${PREFIX}say`:
			if (message.author.id == DISCORD_OWNER_ID) {
				content = content.slice(1);
				message.channel.send(content.join(' '));
			}
			else {
				message.channel.send({ embeds: [missingPermissions] });
			}
			break;
		case `${PREFIX}status`:
			embed = await module.exports.status.status(currTime, client);
			message.channel.send({ embeds: [embed] });
			break;
		}
	}
	catch (err) {
		logger.error(err);
		const errEmbed = new MessageEmbed()
			.setColor('#fc0324')
			.setTitle('An Error Has Occured')
			.setAuthor({ name: client.user.username })
			.setDescription('An error has occured. Please try again or look at the help menu `.help`')
			.setThumbnail(client.user.avatarURL());
		message.channel.send({ embeds: [errEmbed] });
	}
});

client.login(TOKEN);
