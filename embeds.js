/* eslint-disable no-shadow */

const helpers = require('./helpers.js');

const Discord = require('discord.js');

const moment = require('moment');

const api = require('mangadex-full-api');

module.exports = {
	groupEmbed(group, channel) {
		let desc = '';
		if (typeof group.description === 'string') {
			desc = helpers.decode(group.description);
		}
		const url = `https://mangadex.org/group/${group.id}`;
		const fields = [
			{ name: 'Followers', value: group.followers.toString(), inline: true },
			{ name: 'Uploads', value: group.uploads.toString(), inline: true },
			{ name: 'Views', value: group.views.toString(), inline: true },
			{ name: 'ID', value: group.id.toString(), inline: true },
			{ name: 'Language', value: group.language, inline: true },
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
	},

	chapterEmbed(chap, mangaName, channel, files = []) {
		const fields = [
			{ name: 'ID', value: chap.id.toString(), inline: true },
			{ name: 'Pages', value: chap.pages.length.toString(), inline: true },
			{ name: 'Language', value: chap.language, inline: true },
			{ name: 'Time', value: moment.unix(chap.timestamp).format('MM/DD/YYYY'), inline: true },
		];
		const chapterGroup = new api.Group();
		chapterGroup.fill(chap.groups[0].id).then((chapterGroup) => {
			fields.push({ name: 'Group', value: chapterGroup.title + ` (${chapterGroup.id})`, inline: true });
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${mangaName}: Chapter ${chap.chapter}`)
				.setURL(chap.url)
				.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', chap.url)
				.addFields(fields)
				.setTimestamp()
				.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
			channel.send(embed).then(() => {
				if (files.length > 0) {
					helpers.sendFiles(channel, files);
				}
			});
		});
	},

	mangaEmbed(manga, channel) {
		const chaps = manga.chapters;
		let highestChapNum = 0;
		for(const c of chaps) {
			if(c.chapter > highestChapNum) {
				highestChapNum = c.chapter;
			}
		}
		const desc = helpers.decode(manga.description);
		const fields = [];
		switch (manga.genreNames.length) {
		case 0:
			break;
		case 1:
			fields.push({ name: 'Genre', value: manga.genreNames.join(', '), inline: false });
			break;
		default:
			fields.push({ name: 'Genres', value: manga.genreNames.join(', '), inline: false });
		}
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
		fields.push({ name: 'ID', value: manga.id.toString(), inline: true });
		fields.push({ name: 'Chapters', value: highestChapNum.toString(), inline: true });

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
	},
};
