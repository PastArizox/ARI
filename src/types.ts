import {
    Collection,
    CommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
    }
}

export type EventType = {
    name: string | symbol;
    once: Boolean;
    execute(...args: any[]): void;
};

export type SlashCommand = {
    name: string;
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute(interaction: CommandInteraction): Promise<void>;
};
