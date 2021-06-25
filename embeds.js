const helpers = require('./helpers.js');
const Discord = require('discord.js');
const api = require('mangadex-full-api');

module.exports = {

	// embed for a specific scanlation group
	groupEmbed(group, channel) {
		const title = group.name.substr(0, 256);
		const url = `https://mangadex.org/group/${group.id}`;
		const fields = [
			{ name: 'ID', value: group.id, inline: true },
		];
		if (group.createdAt != null) {
			fields.push({ name: 'Created', value: group.createdAt, inline: true });
		}
		if (group.leader != null) {
			fields.push({ name: 'Leader', value: group.leader.username.substr(0, 1024), inline: true });
		}
		if (group.members.length > 0) {
			fields.push({ name: 'Members', value: group.members.map(m => m.username).join(', ').substr(0, 1024), inline: true });
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setURL(url)
			.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', url)
			.addFields(fields)
			.setTimestamp()
			.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
		channel.send(embed);
	},

	// embed for a specific chapter
	async chapterEmbed(chap, mangaName, channel, files = []) {

		const title = `${mangaName}: Chapter ${chap.chapter}`.substr(0, 256);
		const url = `https://mangadex.org/chapter/${chap.id}`;

		// scanlation groups responsible for the chapter
		const groupObjs = await api.resolveArray(chap.groups);
		const groups = groupObjs.map(g => `${g.name} (${g.id})`).join(', ').substr(0, 1024);

		const fields = [
			{ name: 'ID', value: chap.id, inline: true },
			{ name: 'Pages', value: chap.pageNames.length, inline: true },
			{ name: 'Language', value: chap.translatedLanguage, inline: true },
			{ name: (groups.length == 1 ? 'Group' : 'Groups'), value: groups, inline: true },
			{ name: 'Date', value: chap.createdAt, inline: true },
		];
		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setURL(url)
			.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', url)
			.addFields(fields)
			.setTimestamp()
			.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
		channel.send(embed).then(() => {
			if (files.length > 0) {
				helpers.sendFiles(channel, files);
			}
		});
	},

	// embed for a manga object
	async mangaEmbed(manga, channel) {

		const title = manga.title.substr(0, 256);

		// url of the manga's page on MangaDex
		const url = `https://mangadex.org/title/${manga.id}`;

		// get and simplify the english description on MD
		const desc = helpers.decode(manga.localizedDescription.en).substr(0, 2048);

		// comma-separated list of the manga's genre tags
		const tags = manga.tags.map(t => t.name).join(', ').substr(0, 1024);

		// comma-separated list of the manga's authors
		const authorObjs = await api.resolveArray(manga.authors);
		const authors = authorObjs.map(a => a.name).join(', ').substr(0, 1024);

		// comma-separated list of the manga's artists
		const artistObjs = await api.resolveArray(manga.artists);
		const artists = artistObjs.map(a => a.name).join(', ').substr(0, 1024);

		// input embed content into multiple named fields
		const fields = [];
		switch (manga.tags.length) {
		case 0:
			break;
		default:
			fields.push({ name: 'Tags', value: tags, inline: false });
		}
		switch (manga.authors.length) {
		case 0:
			break;
		default:
			fields.push({ name: (manga.artists.length == 1 ? 'Author' : 'Authors'), value: authors, inline: true });
		}
		switch (manga.artists.length) {
		case 0:
			break;
		default:
			fields.push({ name: (manga.artists.length == 1 ? 'Artist' : 'Artists'), value: artists, inline: true });
		}

		fields.push({ name: 'Demographic', value: manga.publicationDemographic, inline: true });

		// loop through all chapters of the manga to get the latest chapter number
		// TODO: replace this workaround with manga.lastChapter once MD updates\
		const chapterObjs = await manga.getFeed({ order: { chapter: 'desc' } }, false);
		if (chapterObjs.length > 0) {
			fields.push({ name: 'Latest Chapter', value: chapterObjs[0].chapter, inline: true });
		}
		fields.push({ name: 'ID', value: manga.id, inline: true });

		// main cover art of the manga on MD
		const coverObj = await manga.mainCover.resolve();
		const coverUrl = coverObj.imageSource;

		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setURL(url)
			.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', manga.url)
			.setDescription(desc)
			.addFields(fields)
			.setImage(coverUrl)
			.setTimestamp()
			.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg', 'https://github.com/chenmasterandrew/manga-mirror');
		channel.send(embed);
	},
};
