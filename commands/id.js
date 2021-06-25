const api = require('mangadex-full-api');
const config = require('../config.json');
const helpers = require('../helpers.js');
const embeds = require('../embeds.js');

module.exports = {
	name: 'id',
	aliases: ['ids', 'identify', 'searchid', 'lookid', 'lookupid', 'findid', 'queryid', 'idsearch', 'idlookup', 'idquery'],
	description: 'returns a manga, chapter, or group\'s information on MangaDex based on its MangaDex ID',
	args: true,
	usage: '<manga/chapter/group> <MD ID #>',
	cooldown: 5,

	execute(message, args) {

		// regex expression for replacing all '_' with ' '
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}

		// checking for enough arguments
		if (args.length < 1) {
			return;
		}
		if (args.length == 1) {
			helpers.improperUsage(module.exports, message, 'You did not enter enough arguments');
			return;
		}

		const searchId = args[1];

		// getting type of object (manga, chapter, or group) to search for
		const type = args[0].toLowerCase();

		// search for a manga by id
		if (type === 'manga') {
			try {
				api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
					try {
						message.channel.send('Searching...');
						const manga = await api.Manga.get(searchId).catch(() => {
							message.channel.send(`Unable to find manga with id **${searchId}**, ${message.author}.`);
						});
						if (manga != null) {
							message.channel.send(`Found manga: **${manga.title}**, ${message.author}.`);
							embeds.mangaEmbed(manga, message.channel);
						}
					}
					catch {
						message.channel.send('Encountered an error while retrieving manga');
					}
				});
			}
			catch {
				message.channel.send('Encountered an error while logging into MangaDex');
			}
		}

		// search for a chapter by id
		else if (type === 'chapter' || type === 'chap') {
			try {
				api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
					try {
						message.channel.send('Searching...');
						const chapter = await api.Chapter.get(searchId).catch(() => {
							message.channel.send(`Unable to find chapter with id **${searchId}**, ${message.author}.`);
						});
						if (chapter != null) {
							const manga = await chapter.manga.resolve();
							message.channel.send(`Found chapter **${chapter.chapter}** of **${manga.title}**, ${message.author}.`);
							embeds.chapterEmbed(chapter, manga.title, message.channel);
						}
					}
					catch (error) {
						message.channel.send('Encountered an error while retrieving chapter' + error);
					}
				});
			}
			catch {
				message.channel.send('Encountered an error while logging into MangaDex');
			}
		}
		// search for a scanlation group by id
		else if (type === 'group') {
			try {
				api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
					try {
						message.channel.send('Searching...');
						const group = await api.Group.get(searchId).catch(() => {
							message.channel.send(`Unable to find group with id **${searchId}**, ${message.author}.`);
						});
						if (group != null) {
							message.channel.send(`Found group: **${group.name}**, ${message.author}.`);
							embeds.groupEmbed(group, message.channel);
						}
					}
					catch {
						message.channel.send('Encountered an error while retrieving group');
					}
				});
			}
			catch {
				message.channel.send('Encountered an error while logging into MangaDex');
			}
		}

		// invalid type
		else {
			helpers.improperUsage(module.exports, message, `**${type}** is not a valid argument for the **id** command`);
		}
	},
};
