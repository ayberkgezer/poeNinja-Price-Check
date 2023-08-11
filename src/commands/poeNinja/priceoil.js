const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const fetchItemData = require("../../api/poeNinja/itemoverwiev");
const oilsData = require("../../json/commands/oils.json");
const oilsChoices = oilsData.oils;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("priceoil")
    .setDescription("poeNinja Oils Price")
    .addStringOption((option) =>
      option
        .setName("oils")
        .setDescription("Oils Name")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const filtered = oilsChoices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    const oilName = interaction.options.getString("oils");
    try {
      const data = await fetchItemData("Oil");
      const desiredOil = data.find(
        (item) => item.name.toLowerCase() === oilName.toLowerCase()
      );

      if (desiredOil) {
        const chaosValue = desiredOil.chaosValue.toString();
        const oilName = desiredOil.name;
        const divineValue = desiredOil.divineValue.toString();
        const exaltedValue = desiredOil.exaltedValue.toString();
        const oilIcon = desiredOil.icon;
        const urlName = desiredOil.name;
        const embed = new EmbedBuilder()
          .setTitle(oilName)
          .setURL(
            `https://www.pathofexile.com/trade/search/Crucible?q={"query":{"filters":{},"type":"${encodeURIComponent(
              urlName
            )}"}}`
          )
          .setThumbnail(oilIcon)
          .addFields(
            { name: "Chaos Price", value: chaosValue, inline: true },
            { name: "Divine Price", value: divineValue, inline: true },
            { name: "Exalted Price", value: exaltedValue, inline: true }
          );

        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply("Nothing Found Oil");
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("API Error");
    }
  },
};
