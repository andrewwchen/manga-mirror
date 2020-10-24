/* eslint-disable no-shadow */
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
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}
		if (args.length === 0) {
			return;
		}
		api.agent.login(config.mduser, config.mdpass, false).then(() => {
			const type = args.shift().toLowerCase();
			if(type === 'manga') {
				if (args.length === 0) {
					helpers.improperUsage(module.exports, message, 'You did not enter an MD ID');
				}
				else if (!(helpers.isNumeric(args[0]))) {
					helpers.improperUsage(module.exports, message, `**${args[0]}** is not a numeric MD ID`);
				}
				else {
					message.channel.send('Searching...');
					const manga = new api.Manga();
					const mangaID = parseInt(args[0]);
					manga.fill(mangaID).then((manga) => {
						message.channel.send(`Found manga: **${manga.title}**, ${message.author}.`);
						embeds.mangaEmbed(manga, message.channel);
					});
				}
			}
			else if(type === 'chapter' || type === 'chap') {
				if (args.length === 0) {
					helpers.improperUsage(module.exports, message, 'You did not enter an MD ID');
				}
				else if (!(helpers.isNumeric(args[0]))) {
					helpers.improperUsage(module.exports, message, `**${args[0]}** is not a numeric MD ID`);
				}
				else {
					message.channel.send('Searching...');
					const chapID = parseInt(args[0]);
					const chap = new api.Chapter();
					const manga = new api.Manga();
					chap.fill(chapID).then((chap) => {
						const mangaID = chap.parentMangaID;
						manga.fill(mangaID).then((manga) => {
							message.channel.send(`Found chapter **${chap.chapter}** of **${manga.title}**, ${message.author}.`);
							embeds.chapterEmbed(chap, manga.title, message.channel);
						});
					});
				}
			}
			else if(type === 'group') {
				if (args.length === 0) {
					helpers.improperUsage(module.exports, message, 'You did not enter an MD ID');
				}
				else if (!(helpers.isNumeric(args[0]))) {
					helpers.improperUsage(module.exports, message, `**${args[0]}** is not a numeric MD ID`);
				}
				else {
					message.channel.send('Searching...');
					const groupID = parseInt(args[0]);
					const group = new api.Group();
					group.fill(groupID).then((group) => {
						message.channel.send(`Found group: **${group.title}**, ${message.author}.`);
						embeds.groupEmbed(group, message.channel);
					});
				}
			}
			else {
				helpers.improperUsage(module.exports, message, `**${type}** is not a valid argument for the **id** command`);
			}
		});
	},
};