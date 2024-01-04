import { Collection, CommandInteraction } from 'discord.js';
import { SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';

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
    data: SlashCommandSubcommandsOnlyBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
};
