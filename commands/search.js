/* eslint-disable no-shadow */
const Discord = require('discord.js');

const moment = require('moment');

const api = require('mangadex-full-api');

const he = require('he');

const config = require('../config.json');

function decode(text) {
	let output = he.decode(text);
	output = output.replace('[i]', '*').replace('[/i]', '*');
	output = output.replace('[b]', '**').replace('[/b]', '**');
	output = output.replace('[u]', '__').replace('[/u]', '__');
	output = output.replace('[spoiler]', '||').replace('[/spoiler]', '||');
	return output;
}

function groupEmbed(group, channel) {
	let desc = '';
	if (typeof group.description === 'string') {
		desc = decode(group.description);
	}
	const url = `https://mangadex.org/group/${group.id}`;
	const fields = [
		{ name: 'Followers', value: group.followers.toString(), inline: true },
		{ name: 'Uploads', value: group.uploads.toString(), inline: true },
		{ name: 'Views', value: group.views.toString(), inline: true },

		{ name: 'Language', value: group.language, inline: true },
		{ name: 'ID', value: group.id.toString(), inline: true },

	];

	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(group.title)
		.setURL(url)
		.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', url)
		.setDescription(desc)
		.addFields(fields)
		.setTimestamp()
		.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
	channel.send(embed);
}

function chapterEmbed(chap, mangaName, channel) {
	const fields = [
		{ name: 'Language', value: chap.language, inline: true },
		{ name: 'ID', value: chap.id.toString(), inline: true },
		{ name: 'Time', value: moment.unix(chap.timestamp).format('MM/DD/YYYY'), inline: true },
	];
	const group = new api.Group();
	group.fill(chap.groups[0].id).then((group) => {
		fields.push({ name: 'Group', value: group.title + ` (${group.id})`, inline: true });
		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${mangaName}: Chapter ${chap.chapter}`)
			.setURL(chap.url)
			.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', chap.url)
			.addFields(fields)
			.setTimestamp()
			.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
		channel.send(embed);
	});
}

function mangaEmbed(manga, channel) {
	const desc = decode(manga.description);
	const fields = [];

	switch (manga.authors.length) {
	case 0:
		break;
	case 1:
		fields.push({ name: 'Author', value: manga.authors.join(', '), inline: true });
		break;
	default:
		fields.push({ name: 'Authors', value: manga.authors.join(', '), inline: true });
	}

	switch (manga.artists.length) {
	case 0:
		break;
	case 1:
		fields.push({ name: 'Artist', value: manga.artists.join(', '), inline: true });
		break;
	default:
		fields.push({ name: 'Artists', value: manga.artists.join(', '), inline: true });
	}

	switch (manga.genreNames.length) {
	case 0:
		break;
	case 1:
		fields.push({ name: 'Genre', value: manga.genreNames.join(', '), inline: true });
		break;
	default:
		fields.push({ name: 'Genres', value: manga.genreNames.join(', '), inline: true });
	}
	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(manga.title)
		.setURL(manga.url)
		.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', manga.url)
		.setDescription(desc)
		.addFields(fields)
		.setImage(manga.getFullURL('cover'))
		.setTimestamp()
		.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg', 'https://github.com/chenmasterandrew/manga-mirror');
	channel.send(embed);
}

module.exports = {
	name: 'search',
	aliases: ['look', 'lookup', 'find', 'query'],
	description: 'returns a manga\'s or a chapter\'s information on MangaDex',
	args: true,
	usage: '<manga/chapter/group> <"manga name"/manga_name/manganame/manga name> [chapter #] [page #]',
	cooldown: 5,

	execute(message, args) {
		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].replace(/_/g, ' ');
		}
		console.log(args);

		if(!message.member.permissions.has('ATTATCH_FILES') && message.member.permissions.has('EMBED_LINKS')) {
			message.channel.send(`${message.member}, you don't have permission to attatch files and embed links.`);
		}
		else {
			message.channel.send('Searching...');
			api.agent.login(config.mduser, config.mdpass, false).then(() => {
				const type = args.shift().toLowerCase();
				if(type === 'manga') {
					const manga = new api.Manga();
					const mangaName = args.join(' ');
					console.log('Manga Name: ' + mangaName);
					manga.fillByQuery(mangaName).then((manga) => {
						message.channel.send(`Found manga: **${manga.title}**.`);
						mangaEmbed(manga, message.channel);
					});
				}
				else if(type === 'chapter' || type === 'chap') {
					const chapNumber = args.pop();
					console.log('Chapter: ' + chapNumber);
					const mangaName = args.join(' ');
					console.log('Manga Name: ' + mangaName);
					const manga = new api.Manga();

					manga.fillByQuery(mangaName).then((manga) => {
						const chap = new api.Chapter();
						const chaps = manga.chapters;
						for(const c of chaps) {
							if(c.chapter === parseFloat(chapNumber)) {
								chap.fill(c.id).then((chap) => {
									chapterEmbed(chap, manga.title, message.channel);

								});

							}
						}

					});
				}
				else if(type === 'group') {
					const groupName = args.join(' ');
					console.log(`Group Name: ${groupName}`);
					const group = new api.Group();
					group.fillByQuery(groupName).then((group) => {
						message.channel.send(`Found group: **${group.title}**.`);
						groupEmbed(group, message.channel);
					});


				}
				else {
					message.channel.send(`${type} is not a valid argument for the search command.`);
				}
			});


		}

	},
};