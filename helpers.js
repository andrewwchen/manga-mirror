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
		let output = he.decode(text);
		output = output.replace('[i]', '*').replace('[/i]', '*');
		output = output.replace('[b]', '**').replace('[/b]', '**');
		output = output.replace('[u]', '__').replace('[/u]', '__');
		output = output.replace('[spoiler]', '||').replace('[/spoiler]', '||');
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
