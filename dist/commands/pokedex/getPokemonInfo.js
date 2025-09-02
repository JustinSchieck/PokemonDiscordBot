import { SlashCommandBuilder, EmbedBuilder, } from "discord.js";
import { getPokemonByName } from "../../services/pokedex.js";
import { capitalizeFirstChar } from "../../services/utils/capitalize.js";
export default {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Get information about a Pokemon")
        .addStringOption((option) => option
        .setName("name")
        .setDescription("The name of the Pokemon")
        .setRequired(true)),
    async execute(interaction) {
        const pokemonName = interaction.options.getString("name", true);
        await interaction.deferReply();
        const pokemonData = await getPokemonByName(pokemonName);
        if ("error" in pokemonData) {
            await interaction.editReply(pokemonData.error);
            return;
        }
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${capitalizeFirstChar(pokemonData.name)} (#${pokemonData.id})`)
            .setThumbnail(pokemonData.sprite)
            .addFields({
            name: "Type(s)",
            value: pokemonData.types
                .map((type) => capitalizeFirstChar(type))
                .join(", "),
            inline: true,
        }, { name: "Height", value: `${pokemonData.height / 10} m`, inline: true }, {
            name: "Weight",
            value: `${pokemonData.weight / 10} kg`,
            inline: true,
        }, {
            name: "Abilities",
            value: pokemonData.abilities
                .map((ability) => capitalizeFirstChar(ability))
                .join(", "),
            inline: false,
        })
            .setTimestamp();
        const statsText = pokemonData.stats
            .map((stat) => `**${capitalizeFirstChar(stat.name.replace("-", " "))}**: ${stat.value}`)
            .join("\n");
        embed.addFields({ name: "Base Stats", value: statsText, inline: false });
        await interaction.editReply({ embeds: [embed] });
    },
};
//# sourceMappingURL=getPokemonInfo.js.map