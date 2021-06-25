const api = require('mangadex-full-api');
const helpers = require('../helpers.js');
const embeds = require('../embeds.js');
const config = require('../config.json');

module.exports = {
	name: 'read',
	aliases: ['open'],
	description: 'displays a whole chapter or just a page of a manga based on its MangaDex ID and an optional page number',
	args: true,
	usage: '<chapter MD ID #> [page #]',
	cooldown: 15,
	execute(message, args) {

		// regex expression for replacing all '_' with ' '
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}

		// checking for enough arguments
		if (args.length === 0) {
			return;
		}

		message.channel.send('Searching...');
		const searchId = args[0];

		try {
			api.login(config.mdUser, config.mdPass, config.cacheLocation).then(async () => {
				try {
					const chapter = await api.Chapter.get(searchId).catch(() => {
						message.channel.send(`Unable to find chapter with id **${searchId}**, ${message.author}.`);
					});
					if (chapter != null) {
						const manga = await chapter.manga.resolve();
						message.channel.send(`Found chapter **${chapter.chapter}** of **${manga.title}**, ${message.author}.`);
						const pages = await chapter.getReadablePages();
						let files = [];
						if (helpers.isNumeric(args[1]) && parseInt(args[1]) > 0 && parseInt(args[1]) <= pages.length) {
							const pageNum = parseInt(args[1]);
							files = [pages[pageNum - 1]];
							message.channel.send(`Retrieving page #${pageNum}...`);
						}
						else {
							files = pages;
							message.channel.send('Retrieving all pages...');
						}
						embeds.chapterEmbed(chapter, manga.title, message.channel, files);
					}
				}
				catch (error) {
					message.channel.send('Encountered an error while retrieving pages' + error);
				}
			});
		}
		catch {
			message.channel.send('Encountered an error while logging into MangaDex');
		}
	},
};
