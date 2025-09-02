import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { WhosThatPokemonGame } from "../../services/minigames/whosThatPokemon.js";

export default {
  data: new SlashCommandBuilder()
    .setName("whos-that-pokemon")
    .setDescription("Start a game of Who's That Pokémon!"),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    // Optional future improvments - Create different game difficulties
    // const gameOptions = {
    //   timeLimit: 30_000,
    //   difficulty: 'normal',
    //   showHints: true
    // };

    // Create and start the game
    const game = new WhosThatPokemonGame(interaction);
    await game.startGame();
  },
};
