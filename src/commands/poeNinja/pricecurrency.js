const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const fetchCurrencyDetails = require("../../api/poeNinja/currencydetails");
const fetchItemData = require("../../api/poeNinja/currencyoverwiev");
const currencyData = require("../../json/commands/currency.json");
const currencyChoices = currencyData.currency;

const leagueData = require("../../json/utils/utils.json");
const league = leagueData.poeLeague;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pricecurrency")
    .setDescription("poeNinja Currency Price")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("Currency Name")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const filtered = currencyChoices.filter((choice) =>
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
    const currencyName = interaction.options.getString("currency");
    try {
      const data = await fetchItemData("Currency");
      const desiredData = data.find(
        (item) =>
          item.currencyTypeName.toLowerCase() === currencyName.toLowerCase()
      );
      const detailsData = await fetchCurrencyDetails("Currency");
      const desiredDetails = detailsData.find(
        (item) => item.name.toLowerCase() === currencyName.toLowerCase()
      );
      const divineData = data.find(
        (item) => item.currencyTypeName.toLowerCase() === "divine orb"
      );

      if (desiredData || desiredDetails || divineData) {
        const chaosValue = desiredData.chaosEquivalent;
        const name = desiredData.currencyTypeName;
        const currencyIcon = desiredDetails.icon;
        const divine = divineData.chaosEquivalent;
        const divineValue = chaosValue / divine;
        const embed = new EmbedBuilder()
          .setTitle(name)
          .setThumbnail(currencyIcon)
          .addFields({
            name: "Chaos Price",
            value: chaosValue.toString(),
            inline: true,
          })
          .addFields({
            name: "Divine Price",
            value: divineValue.toFixed(2).toString(),
            inline: true,
          });

        const sell = new ButtonBuilder()
          .setLabel("Sell")
          .setURL(
            `https://www.pathofexile.com/trade/search/${encodeURIComponent(
              league
            )}?q={"query":{"filters":{},"type":"${encodeURIComponent(name)}"}}`
          )
          .setStyle(ButtonStyle.Link);
        const buy = new ButtonBuilder()
          .setLabel("Buy")
          .setURL(
            `https://www.pathofexile.com/trade/search/${encodeURIComponent(
              league
            )}?q={"query":{"filters":{},"type":"${encodeURIComponent(name)}"}}`
          )
          .setStyle(ButtonStyle.Link);

        const action = new ActionRowBuilder().addComponents(sell, buy);

        interaction.reply({ embeds: [embed], components: [action] });
      } else {
        interaction.reply("Nothing Found Currency");
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("API Error");
    }
  },
};
