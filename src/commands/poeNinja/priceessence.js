const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const fetchItemData = require("../../api/poeNinja/itemoverwiev");
const data = require("../../json/commands/essence.json");
const dataChoices = data.essence;

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("priceessence")
    .setDescription("poeNinja Essence Price")
    .addStringOption((option) =>
      option
        .setName("essence")
        .setDescription("Essence Name")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const filtered = dataChoices.filter((choice) =>
      choice.startsWith(focusedValue)
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
    const oilName = interaction.options.getString("essence");
    try {
      const data = await fetchItemData("Essence");
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
