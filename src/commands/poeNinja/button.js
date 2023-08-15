const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("set button"),

  async execute(interaction, client) {
    try {
      const button = new ButtonBuilder()
        .setLabel("discord.js")
        .setURL("https://www.instagram.com/")
        .setStyle(ButtonStyle.Link);

      const action = new ActionRowBuilder().addComponents(button);
      interaction.reply({ components: [action] });
    } catch (error) {
      console.error(error);
    }
  },
};
