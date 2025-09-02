import { EmbedBuilder, AttachmentBuilder, MessageCollector, } from "discord.js";
import { capitalizeFirstChar } from "../utils/capitalize.js";
import { createPokemonSilhouette, getRandomPokemonId, } from "../utils/imageProcessor.js";
import { getPokemonByName } from "../pokedex.js";
export class WhosThatPokemonGame {
    interaction;
    pokemonData;
    collector;
    constructor(interaction) {
        this.interaction = interaction;
    }
    async startGame() {
        try {
            console.log("🎮 Starting Who's That Pokemon game...");
            // Validation checks
            if (!this.interaction.guild) {
                await this.interaction.editReply("❌ This command can only be used in a server!");
                return;
            }
            if (!this.interaction.channel) {
                await this.interaction.editReply("❌ Unable to access channel for game.");
                return;
            }
            // Get random Pokemon
            const randomPokemonId = getRandomPokemonId();
            console.log(`🎲 Selected Pokemon ID: ${randomPokemonId}`);
            this.pokemonData = await getPokemonByName(randomPokemonId);
            if ("error" in this.pokemonData) {
                await this.interaction.editReply("❌ Failed to load Pokemon for the game! Please try again.");
                return;
            }
            console.log(`✅ Loaded Pokemon: ${this.pokemonData.name}`);
            if (!this.pokemonData.sprite) {
                await this.interaction.editReply("❌ This Pokemon doesn't have a sprite available. Please try again.");
                return;
            }
            // Create and send game embed
            await this.createGameEmbed();
            // Start message collection
            this.setupMessageCollector();
        }
        catch (error) {
            console.error("💥 Error starting Pokemon game:", error);
            await this.sendErrorEmbed();
        }
    }
    async createGameEmbed() {
        console.log("🎨 Creating game embed with silhouette...");
        const silhouetteBuffer = await createPokemonSilhouette(this.pokemonData.sprite);
        const attachment = new AttachmentBuilder(silhouetteBuffer, {
            name: "pokemon-silhouette.png",
        });
        const gameEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle("🎮 Who's That Pokémon?")
            .setDescription("Can you guess this Pokémon? Type your answer in the chat!\n\n⏰ You have 30 seconds to guess!")
            .setImage("attachment://pokemon-silhouette.png")
            .addFields({
            name: "🔢 Pokemon #",
            value: `${this.pokemonData.id}`,
            inline: true,
        })
            .setFooter({
            text: `Game started by ${this.interaction.user.username}`,
        })
            .setTimestamp();
        await this.interaction.editReply({
            embeds: [gameEmbed],
            files: [attachment],
        });
        console.log(`🎉 Game embed sent! Answer is: ${this.pokemonData.name}`);
    }
    setupMessageCollector() {
        const collectorFilter = (message) => {
            return (!message.author.bot &&
                message.content.toLowerCase().trim() ===
                    this.pokemonData.name.toLowerCase());
        };
        console.log("🎮 Starting message collector...");
        this.collector = new MessageCollector(this.interaction.channel, {
            filter: collectorFilter,
            max: 1,
            time: 30_000,
        });
        this.collector.on("collect", (message) => this.handleCorrectAnswer(message));
        this.collector.on("end", (collected, reason) => this.handleGameEnd(collected, reason));
    }
    async handleCorrectAnswer(message) {
        console.log(`🏆 ${message.author.username} got the correct answer!`);
        const winnerEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("🎉 Correct Answer!")
            .setDescription(`**${capitalizeFirstChar(this.pokemonData.name)}** was the correct answer!`)
            .setImage(this.pokemonData.sprite)
            .addFields({
            name: "🏆 Winner",
            value: `<@${message.author.id}>`,
            inline: true,
        }, {
            name: "🎯 Pokemon #",
            value: `${this.pokemonData.id}`,
            inline: true,
        })
            .setTimestamp();
        await this.interaction.followUp({ embeds: [winnerEmbed] });
    }
    async handleGameEnd(collected, reason) {
        if (reason === "time" && collected.size === 0) {
            console.log("⏰ Game timed out - nobody got the answer");
            const timeoutEmbed = new EmbedBuilder()
                .setColor(0xff9900)
                .setTitle("⏰ Time's Up!")
                .setDescription(`Nobody guessed correctly in **${this.interaction.guild.name}**! The answer was **${capitalizeFirstChar(this.pokemonData.name)}**.`)
                .setImage(this.pokemonData.sprite)
                .addFields({
                name: "🔍 Correct Answer",
                value: capitalizeFirstChar(this.pokemonData.name),
            }, {
                name: "🎯 Pokemon #",
                value: `${this.pokemonData.id}`,
            })
                .setTimestamp();
            this.interaction
                .followUp({ embeds: [timeoutEmbed] })
                .catch(console.error);
        }
    }
    async sendErrorEmbed() {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("❌ Game Error")
            .setDescription("Something went wrong while setting up the game. Please try again!")
            .setTimestamp();
        await this.interaction.editReply({ embeds: [errorEmbed] });
    }
    // Clean up method if needed
    stopGame() {
        if (this.collector && !this.collector.ended) {
            this.collector.stop("force");
        }
    }
}
//# sourceMappingURL=whosThatPokemon.js.map