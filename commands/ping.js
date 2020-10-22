module.exports = {
	name: 'ping',
	aliases: ['bing'],
	description: 'ping command',
	args: false,
	usage: '',
	cooldown: 1,

	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send('pong!');
	},
};