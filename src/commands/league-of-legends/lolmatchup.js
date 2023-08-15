const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const championsData = require("../../json/commands/lol-champions.json");
const championsChoices = championsData.champions;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lolmatchup")
    .setDescription("League of Legends Matchup")
    .addStringOption((option) =>
      option
        .setName("champions-you")
        .setDescription("Champion Name")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("champions-enemy")
        .setDescription("Champion Name")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Role Position Name")
        .setRequired(true)
        .setChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Adc", value: "adc" },
          { name: "Support", value: "support" }
        )
    ),
  async autocomplate(interaction, client) {
    const focusedValue = interaction.options.getFocused();

    /* let chocies;
    if (focusedValue.name == "champions-you") {
      chocies = championsChoices;
    }
    if (focusedValue.name == "champions-enemy") {
      chocies = championsChoices;
    } */
    const filtered = championsChoices.filter((choice) =>
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
    const championsName1 = interaction.options.getString("champions-you");
    const championsName2 = interaction.options.getString("champions-enemy");
    const roleName = interaction.options.getString("role");
    try {
      if (championsName1 && championsName2 && roleName) {
        const embed = new EmbedBuilder()
          .setTitle("Matchup Champions")
          .addFields(
            { name: championsName1, value: "Your Champion", inline: true },
            { name: "----------->", value: "----------->", inline: true },
            { name: championsName2, value: "Enemy Champion", inline: true }
          );
        const trade = new ButtonBuilder()
          .setLabel("u.gg Matchup")
          .setURL(
            `https://u.gg/lol/champions/${championsName1}/build/${roleName}?opp=${championsName2}`
          )
          .setStyle(ButtonStyle.Link);
        const action = new ActionRowBuilder().addComponents(trade);

        interaction.reply({ embeds: [embed], components: [action] });
      } else {
        interaction.reply("Nothing Error");
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("API Error");
    }
  },
};
