module.exports = {
	name: 'ping',
	aliases: ['bing'],
	description: 'ping command',
	args: false,
	usage: '',
	cooldown: 1,

	execute(message, _args) {
		message.channel.send('pong!');
	},
};
