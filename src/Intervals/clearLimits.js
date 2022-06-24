const logger = require('npmlog');

async function clearLimits(client, guilds) {
	const gids = client.guilds.cache.map(guild => guild.id);
	for (const gid in gids) {
		try {
			await guilds.updateOne({ guild: gids[gid] }, { $set: { limited: false, icount: 0, ncount: 0 } });
		}
		catch (err) {
			logger.error(err);
		}
	}
}

module.exports = {
	clearLimits,
};