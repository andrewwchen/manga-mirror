module.exports = {
	name: 'cred',
	aliases: ['credits', 'author'],
	description: 'shows the author\'s information',
	args: false,
	usage: '',
	cooldown: 1,

	execute(message, _args) {
		message.channel.send('"MangaMirror" by Darude#8096');
	},
};