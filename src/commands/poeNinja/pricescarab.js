const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const fetchItemData = require("../../api/poeNinja/itemoverwiev");
const scarabsData = require("../../json/commands/scarabs.json");
const scarabsChoices = scarabsData.scarabs;

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pricescarab")
    .setDescription("poeNinja Scarabs Price")
    .addStringOption((option) =>
      option
        .setName("scarabs")
        .setDescription("Scarabs Name")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const filtered = scarabsChoices.filter((choice) =>
      choice.startsWith(focusedValue.toLowerCase())
    );

    let options;
    if (filtered.length > 25) {
      options = filtered.slice(0, 25);
    } else {
      options = filtered;
    }
    await interaction.respond(
      options.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    const scarabName = interaction.options.getString("scarabs");
    try {
      const data = await fetchItemData("Scarab");
      const desiredData = data.find(
        (item) => item.name.toLowerCase() === scarabName.toLowerCase()
      );

      if (desiredData) {
        const chaosValue = desiredData.chaosValue.toString();
        const name = desiredData.name;
        const divineValue = desiredData.divineValue.toString();
        const exaltedValue = desiredData.exaltedValue.toString();
        const oilIcon = desiredData.icon;
        const embed = new EmbedBuilder()
          .setTitle(name)
          .setThumbnail(oilIcon)
          .addFields(
            { name: "Chaos Price", value: chaosValue, inline: true },
            { name: "Divine Price", value: divineValue, inline: true },
            { name: "Exalted Price", value: exaltedValue, inline: true }
          );
        const trade = new ButtonBuilder()
          .setLabel("Trade")
          .setURL(
            `https://www.pathofexile.com/trade/search/${encodeURIComponent(
              league
            )}?q={"query":{"filters":{},"type":"${encodeURIComponent(name)}"}}`
          )
          .setStyle(ButtonStyle.Link);
        const action = new ActionRowBuilder().addComponents(trade);
        interaction.reply({ embeds: [embed], components: [action] });
      } else {
        interaction.reply("Nothing Found Oil");
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("API Error");
    }
  },
};
