import { ChatInputCommandInteraction } from "discord.js";
export declare class WhosThatPokemonGame {
    private interaction;
    private pokemonData;
    private collector?;
    constructor(interaction: ChatInputCommandInteraction);
    startGame(): Promise<void>;
    private createGameEmbed;
    private setupMessageCollector;
    private handleCorrectAnswer;
    private handleGameEnd;
    private sendErrorEmbed;
    stopGame(): void;
}
//# sourceMappingURL=whosThatPokemon.d.ts.map