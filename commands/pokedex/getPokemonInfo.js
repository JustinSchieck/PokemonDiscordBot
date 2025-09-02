const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getPokemonByName } = require("../../services/pokemon.js");
const { capitalizeFirstChar } = require("../../services/utils/capitalize.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Get information about a Pokemon")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the Pokemon")
        .setRequired(true)
    ),
  async execute(interaction) {
    const pokemonName = interaction.options.getString("name");

    await interaction.deferReply();

    const pokemonData = await getPokemonByName(pokemonName);

    if (pokemonData.error) {
      await interaction.editReply(pokemonData.error);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(
        `${
          pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
        } (#${pokemonData.id})`
      )
      .setThumbnail(pokemonData.sprite)
      .addFields(
        {
          name: "Type(s)",
          value: pokemonData.types
            .map((type) => capitalizeFirstChar(type))
            .join(", "),
          inline: true,
        },
        { name: "Height", value: `${pokemonData.height / 10} m`, inline: true },
        {
          name: "Weight",
          value: `${pokemonData.weight / 10} kg`,
          inline: true,
        },
        {
          name: "Abilities",
          value: pokemonData.abilities
            .map((ability) => capitalizeFirstChar(ability))
            .join(", "),
          inline: false,
        }
      )
      .setTimestamp();

    // Add base stats
    const statsText = pokemonData.stats
      .map(
        (stat) =>
          `**${stat.name.replace("-", " ").toUpperCase()}**: ${stat.value}`
      )
      .join("\n");

    embed.addFields({ name: "Base Stats", value: statsText, inline: false });

    await interaction.editReply({ embeds: [embed] });
  },
};
