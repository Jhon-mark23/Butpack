const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "music",
    description: "Search music from YouTube",
    usage: "music [search]",
    cooldown: 9,
    accessableby: 0,
    category: "media",
    prefix: true,
  },

  start: async function ({ api, text, event, reply }) {
    try {
      const searchQuery = text.join(" ");
      if (!searchQuery) {
        return reply("Usage: music <search text>");
      }

      const ugh = await reply(`⏱️ | Searching for '${searchQuery}', please wait...`);
      api.setMessageReaction("🕥", event.messageID, () => {}, true);

      const response = await axios.get(`http://linda.hidencloud.com:25636/yta?url=&apikey=syugg${encodeURIComponent(searchQuery)}`);

      const { downloadUrl: musicUrl, title, thumbnail } = response.data;
      const musicPath = path.join(__dirname, "cache", "music.mp3");

      const musicResponse = await axios.get(musicUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(musicPath, Buffer.from(musicResponse.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          body: `Here's your music, enjoy!🥰\n\nTitle: ${title}\nImage: ${thumbnail}`,
          attachment: fs.createReadStream(musicPath),
        },
        event.threadID,
        event.messageID
      );

      fs.unlinkSync(musicPath);
      api.unsendMessage(ugh.messageID);
    } catch (error) {
      reply(`error: ${error.message}`);
      console.log(error);
    }
  },
};
