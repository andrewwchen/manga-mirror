const config = require('./config.json');

const he = require('he');

module.exports = {
	improperUsage(command, message, reason) {
		let reply = `${reason}, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	},
	decode(text) {
		let output = he.decode(text).toString();
		output = output.split('[i]').join('*');
		output = output.split('[/i]').join('*');
		output = output.split('[b]').join('**');
		output = output.split('[/b]').join('**');
		output = output.split('[u]').join('__');
		output = output.split('[/u]').join('__');
		output = output.split('[spoiler]').join('||');
		output = output.split('[/spoiler]').join('||');
		output = output.split('[url=').join('');
		output = output.split('[/url]').join('');
		output = output.split('[hr]').join('');
		output = output.split('[*]').join('* ');
		return output;
	},
	// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
	isNumeric(str) {
		if (typeof str != 'string') return false;
		return !isNaN(str) && !isNaN(parseFloat(str));
	},
	async sendFiles(channel, files) {
		for (const f of files) {
			await channel.send({ files: [f] });
		}
	},
};
