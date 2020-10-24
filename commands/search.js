/* eslint-disable no-shadow */
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
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}
		/*
		if (!(message.channel.type === 'dm') && (!message.member.permissions.has('ATTATCH_FILES') && message.member.permissions.has('EMBED_LINKS'))) {
			message.channel.send(`${message.member}, you don't have permission to attatch files and embed links.`);
		}
		*/
		if (args.length === 0) {
			return;
		}
		api.agent.login(config.mduser, config.mdpass, false).then(() => {
			const type = args.shift().toLowerCase();
			if(type === 'manga') {
				if (args.length === 0) {
					helpers.improperUsage(module.exports, message, 'You did not enter a manga name');
				}
				else {
					message.channel.send('Searching...');
					const manga = new api.Manga();
					const mangaName = args.join(' ');
					manga.fillByQuery(mangaName).then((manga) => {
						message.channel.send(`Found manga: **${manga.title}**, ${message.author}.`);
						embeds.mangaEmbed(manga, message.channel);
					});
				}
			}
			else if(type === 'chapter' || type === 'chap') {
				const chapNumber = args.pop();
				if (helpers.isNumeric(chapNumber)) {
					if (args.length === 0) {
						helpers.improperUsage(module.exports, message, 'You did not enter a manga name');
					}
					message.channel.send('Searching...');
					const mangaName = args.join(' ');
					const manga = new api.Manga();
					manga.fillByQuery(mangaName).then((manga) => {
						const chap = new api.Chapter();
						const chaps = manga.chapters;
						const goodChaps = [];
						for(const c of chaps) {
							if(c.chapter === parseFloat(chapNumber)) {
								goodChaps.push(c);
							}
						}
						message.channel.send(`Found the following **${goodChaps.length}** versions of **${manga.title}**: chapter **${chapNumber}**, ${message.author}.`);
						for(const gc of goodChaps) {
							chap.fill(gc.id).then((chap) => {
								embeds.chapterEmbed(chap, manga.title, message.channel);
							});
						}

					});
				}
				else {
					helpers.improperUsage(module.exports, message, 'You did not enter a chapter number');
				}
			}
			else if(type === 'group') {
				if (args.length === 0) {
					helpers.improperUsage(module.exports, message, 'You did not enter a group name');
				}
				else {
					message.channel.send('Searching...');
					const groupName = args.join(' ');
					const group = new api.Group();
					group.fillByQuery(groupName).then((group) => {
						message.channel.send(`Found group: **${group.title}**, ${message.author}.`);
						embeds.groupEmbed(group, message.channel);
					});
				}
			}
			else {
				helpers.improperUsage(module.exports, message, `**${type}** is not a valid argument for the **search** command`);
			}
		});
	},
};