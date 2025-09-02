import { Collection, ChatInputCommandInteraction } from "discord.js";
interface Command {
    data: {
        name: string;
        toJSON(): any;
    };
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
    }
}
export {};
//# sourceMappingURL=index.d.ts.map