const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

require("dotenv").config();
const { CLIENT_ID } = process.env;
const { GUILD_ID } = process.env;

const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }

    const clientId = CLIENT_ID;
    const guildId = GUILD_ID;
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfuly reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };
};
