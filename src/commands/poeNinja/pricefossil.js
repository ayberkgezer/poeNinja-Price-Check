const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const fetchItemData = require("../../api/poeNinja/itemoverwiev");
const data = require("../../json/commands/fossil.json");
const dataChoices = data.fossil;

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pricefossil")
    .setDescription("poeNinja Oils Price")
    .addStringOption((option) =>
      option
        .setName("fossil")
        .setDescription("Fossil Name")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const filtered = dataChoices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    const oilName = interaction.options.getString("fossil");
    try {
      const data = await fetchItemData("Fossil");
      const desiredItem = data.find(
        (item) => item.name.toLowerCase() === oilName.toLowerCase()
      );

      if (desiredItem) {
        const chaosValue = desiredItem.chaosValue.toString();
        const name = desiredItem.name;
        const divineValue = desiredItem.divineValue.toString();
        const exaltedValue = desiredItem.exaltedValue.toString();
        const icon = desiredItem.icon;
        const urlName = desiredItem.name;
        const embed = new EmbedBuilder()
          .setTitle(name)
          .setThumbnail(icon)
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
            )}?q={"query":{"filters":{},"type":"${encodeURIComponent(
              urlName
            )}"}}`
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
