/* eslint-disable no-shadow */
const api = require('mangadex-full-api');

const helpers = require('../helpers.js');

const embeds = require('../embeds.js');

module.exports = {
	name: 'read',
	aliases: ['open'],
	description: 'displays a whole chapter or just a page of a manga based on its MangaDex ID and an optional page number',
	args: true,
	usage: '<chapter MD ID #> [page #]',
	cooldown: 15,
	execute(message, args) {
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}

		if (!(message.channel.type === 'dm') && (!message.member.permissions.has('ATTATCH_FILES') && message.member.permissions.has('EMBED_LINKS'))) {
			message.channel.send(`${message.member}, you don't have permission to attatch files and embed links.`);
		}
		else if (args.length === 0) {
			return;
		}
		else if (helpers.isNumeric(args[0])) {
			message.channel.send('Searching...');
			const chapID = parseInt(args[0]);
			let files = [];
			const chap = new api.Chapter();
			const manga = new api.Manga();
			chap.fill(chapID).then((chap) => {
				const mangaID = chap.parentMangaID;
				manga.fill(mangaID).then((manga) => {
					message.channel.send(`Found chapter **${chap.chapter}** of **${manga.title}**, ${message.author}.`);
					if (helpers.isNumeric(args[1]) && parseInt(args[1]) > 0 && parseInt(args[1]) <= chap.pages.length) {
						const pageNum = parseInt(args[1]);
						files = [chap.pages[pageNum - 1]];
						message.channel.send(`Retrieving page #${pageNum}...`);
					}
					else {
						files = chap.pages;
						message.channel.send('Retrieving all pages...');
					}
					embeds.chapterEmbed(chap, manga.title, message.channel, files);
				});
			});
		}
		else {
			helpers.improperUsage(module.exports, message, `**${args[0]}** is not a numeric MD ID`);
		}
	},
};