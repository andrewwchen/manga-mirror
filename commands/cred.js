module.exports = {
	name: 'cred',
	aliases: ['credits', 'author'],
	description: 'shows the author\'s information',
	args: false,
	usage: '',
	cooldown: 1,

	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send('"MangaMirror" made by Darude#8096');
	},
};