/* eslint-disable no-shadow */
const Discord = require('discord.js');

const api = require('mangadex-full-api');

const he = require('he');

const config = require('../config.json');

module.exports = {
	name: 'search',
	aliases: ['look', 'lookup', 'find', 'query'],
	description: 'returns a manga\'s or a chapter\'s information on MangaDex',
	args: true,
	usage: '<"manga"/"chapter"/"page">, <manga name>, [chapter #], [page #]',
	cooldown: 5,

	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
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
					manga.fillByQuery(mangaName).then((manga) => {
						message.channel.send(`Found manga: **${manga.title}**.`);
						let desc = he.decode(manga.description);
						desc = desc.replace('[i]', '*').replace('[/i]', '*');
						desc = desc.replace('[b]', '**').replace('[/b]', '**');
						desc = desc.replace('[u]', '__').replace('[/u]', '__');
						desc = desc.replace('[spoiler]', '||').replace('[/spoiler]', '||');
						const fields = [ { name: '\u200B', value: '\u200B' } ];
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

						fields.push({ name: '\u200B', value: '\u200B' });
						const embed = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.setTitle(manga.title)
							.setURL(manga.url)
							.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', manga.url)
							.setDescription(desc)
							.addFields(fields)
							.setImage(manga.getFullURL('cover'))
							.setTimestamp()
							.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
						message.channel.send(embed);

					});
				}
				else if(type === 'chapter' || type === 'chap') {
					const chapNumber = args.pop();

					const mangaName = args.join(' ');

					const manga = new api.Manga();

					manga.fillByQuery(mangaName).then((manga) => {
						message.channel.send(`Found manga: **${manga.title}**.`);
						const chap = new api.Chapter();
						const chaps = manga.chapters;
						for(const c of chaps) {
							if(c.chapter === parseFloat(chapNumber)) {
								chap.fill(c.id).then((chap) => {
									message.channel.send(`Found chapter **${chap.chapter}** of manga: **${manga.title}**.`);
									const fields = [
										{ name: '\u200B', value: '\u200B' },
										{ name: 'Language', value: chap.language, inline: true },
										{ name: 'Time', value: 'chap.timestamp', inline: true },
									];
									switch (chap.groups.length) {
									case 0:
										break;
									case 1:
										fields.push({ name: 'Group', value: chap.groups[0].name.join(', '), inline: true });
										break;
									default:
										// eslint-disable-next-line no-case-declarations
										const groupNames = [];
										for(const g of chap.groups) {
											groupNames.push(g.name);
										}
										fields.push({ name: 'Groups', value: groupNames.join(', '), inline: true });
									}

									const embed = new Discord.MessageEmbed()
										.setColor('#0099ff')
										.setTitle(`${manga.title}: chapter ${chapNumber}`)
										.setURL(chap.url)
										.setAuthor('MangaDex', 'https://www.saashub.com/images/app/service_logos/86/ced2d3e2ea0d/large.png', chap.url)
										.addFields(fields)
										.setImage(manga.getFullURL('cover'))
										.setTimestamp()
										.setFooter('MangaMirror by Darude#8096', 'https://i.imgur.com/FXZSEhP.jpg');
									message.channel.send(embed);
								});

							}
						}

					});
				}
				else if(type === 'page') {
					const pageNumber = args.pop();
					const chapNumber = args.pop();
					const mangaName = args.join(' ');
					const manga = new api.Manga();
					const chap = new api.Chapter();
				}
			});


		}

	},
};