const api = require('mangadex-full-api');
const config = require('../config.json');
const helpers = require('../helpers.js');
const embeds = require('../embeds.js');

module.exports = {
	name: 'search',
	aliases: ['look', 'lookup', 'find', 'query'],
	description: 'returns a manga, chapter, or group\'s information on MangaDex based on its name',
	args: true,
	usage: '<manga/chapter/group> <manga name> [chapter #]',
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

		// getting type of object (manga, chapter, or group) to search for
		const type = args.shift().toLowerCase();

		// search for a manga
		if(type === 'manga') {

			// check if there is a manga name (remaining # args > 0)
			if (args.length === 0) {
				helpers.improperUsage(module.exports, message, 'You did not enter a manga name');
			}

			// do the search
			else {
				try {
					api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
						try {
							message.channel.send('Searching...');
							const mangaName = args.join(' ');
							const manga = await api.Manga.getByQuery(mangaName).catch(() => {
								message.channel.send(`Unable to find manga of name **${mangaName}**, ${message.author}.`);
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
		}

		// search for a chapter of a manga
		else if (type === 'chapter' || type === 'chap') {

			// get the chapter number (last remaining arg)
			const chapNumber = parseFloat(args.pop());

			// check if the chapter number was a valid number
			if (isNaN(chapNumber)) {
				helpers.improperUsage(module.exports, message, 'You did not enter a valid chapter number');
			}

			// check if the user specified a manga (remaning args > 0)
			else if (args.length === 0) {
				helpers.improperUsage(module.exports, message, 'You did not enter a manga name');
			}

			// do the search
			else {
				try {
					api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
						try {
							message.channel.send('Searching...');
							const mangaName = args.join(' ');
							const manga = await api.Manga.getByQuery(mangaName).catch(() => {
								message.channel.send(`Unable to find manga of name **${mangaName}**, ${message.author}.`);
							});
							if (manga != null) {
								const chaps = await manga.getFeed();
								const goodChaps = [];
								for (const chap of chaps) {
									if (chap.chapter == chapNumber) {
										goodChaps.push(chap);
									}
								}
								message.channel.send(`Found the following **${goodChaps.length}** versions of **${manga.title}**: chapter **${chapNumber}**, ${message.author}.`);
								for (const chap of goodChaps) {
									await embeds.chapterEmbed(chap, manga.title, message.channel);
								}
							}
						}
						catch {
							message.channel.send('Encountered an error while retrieving chapters.');
						}
					});
				}
				catch {
					message.channel.send('Encountered an error while logging into MangaDex');
				}
			}
		}

		// search for a scanlation group
		else if (type === 'group') {

			// check if there is a manga name (remaining # args > 0)
			if (args.length === 0) {
				helpers.improperUsage(module.exports, message, 'You did not enter a group name');
			}

			// do the search
			else {
				try {
					api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
						try {
							message.channel.send('Searching...');
							const groupName = args.join(' ');
							const group = await api.Group.getByQuery(groupName).catch(() => {
								message.channel.send(`Unable to find group of name **${groupName}**, ${message.author}.`);
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
		}


		// invalid type
		else {
			helpers.improperUsage(module.exports, message, `**${type}** is not a valid argument for the **search** command`);
		}
	},
};
