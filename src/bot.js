require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const PREFIX = "$";
client.on("ready", (c) => {
  console.log(`Ready logged in ${c.user.tag}`);
});

client.on("messageCreate", async function (message) {
  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const c = message.content;
  const user = message.author.tag;
  if (c.startsWith(PREFIX)) {
    const [cmdName, ...args] = c.trim().substring(PREFIX.length).split(/\s+/);
    if (cmdName == "kick") {
      if (
        !message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
      ) {
        return message.reply("You don't have the permission to kick anyone");
      }
      if (args.length === 0) return message.reply("No userID provided");
      try {
        const member = await guild.members.fetch(args[0]);
        if (member) {
          member
            .kick()
            .then((member) => message.channel.send(`${member} was kicked`))
            .catch((err) => message.channel.send("Something went wrong!"));
        } else {
          message.channel.send("No Member Found");
        }
      } catch (error) {
        message.reply("No User Found");
      }
    } else if (cmdName == "ban") {
      if (
        !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)
      ) {
        return message.reply("You don't have the permission to ban anyone");
      }
      if (args.length === 0) return message.reply("No userID provided");
      try {
        const member = await guild.members.fetch(args[0]);
        if (member) {
          member
            .ban()
            .then(message.reply("Done"))
            .catch((err) => message.channel.send("Something went wrong!"));
        } else {
          message.channel.send("No Member Found");
        }
      } catch (error) {
        message.reply("No User Found");
      }
    }
  }
  if (c === "ping") {
    message.reply("Pong");
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
