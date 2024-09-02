module.exports.config = {
	name: "shoti",
	version: "1.0.0",
	credits: "libyzxy0",
	description: "Generate random tiktok girl videos",
	hasPermssion: 0,
	commandCategory: "other",
	usage: "[shoti]",
	cooldowns: 5,
	dependencies: [],
};

module.exports.run = async function({ api, event }) {
	const axios = require("axios");
	const request = require('request');
	const fs = require("fs")
	let data = await axios.get('http://linda.hidencloud.com:25636/shoti');
	var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
	var rqs = request(encodeURI(data.data.data.url));
	console.log('Shoti Downloaded >>> ' + data.data.data.id)
	rqs.pipe(file);
	file.on('finish', () => {
		return api.sendMessage({
						body: `<shoti downloaded>`,
						attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
		}, event.threadID, event.messageID)
	})
};
